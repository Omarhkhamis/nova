"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import Swal from "sweetalert2";
import { showDashboardToast } from "@/components/dashboard-enhancer";

export function MediaPicker({
  name,
  label,
  defaultValue = "",
  initialMedia,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  initialMedia: string[];
}) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState(initialMedia);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function refreshMedia() {
    const response = await fetch("/api/dashboard/media", { cache: "no-store" });
    const data = (await response.json()) as { media: string[] };
    setMedia(data.media);
  }

  async function uploadSelectedFile() {
    const file = fileRef.current?.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const response = await fetch("/api/dashboard/media", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { src?: string; media?: string[]; error?: string };

      if (!response.ok || !data.src) {
        void Swal.fire("Upload failed", data.error ?? "Could not upload image.", "error");
        return;
      }

      setValue(data.src);
      setMedia(data.media ?? []);
      showDashboardToast("Image uploaded successfully");
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    });
  }

  async function deleteImage(src: string) {
    const result = await Swal.fire({
      title: "Delete image?",
      text: "The file will be removed from public.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/dashboard/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src }),
      });
      const data = (await response.json()) as { media?: string[]; error?: string };

      if (!response.ok) {
        void Swal.fire("Delete failed", data.error ?? "Could not delete image.", "error");
        return;
      }

      if (value === src) {
        setValue("");
      }

      setMedia(data.media ?? []);
      showDashboardToast("Image deleted successfully");
    });
  }

  return (
    <div className="dashboard-field">
      <span>{label}</span>
      <div className="media-picker">
        <input name={name} value={value} onChange={(event) => setValue(event.target.value)} placeholder="/media/image.png" />
        <button type="button" className="media-picker__button" onClick={() => {
          void refreshMedia();
          setIsOpen(true);
        }} aria-label="Open media gallery">
          <ImageIcon size={17} />
        </button>
      </div>

      {value ? (
        <div className="media-picker__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" />
          <small>{value}</small>
        </div>
      ) : null}

      {isOpen ? (
        <div className="media-modal" role="dialog" aria-modal="true">
          <div className="media-modal__panel">
            <div className="media-modal__header">
              <div>
                <strong>Media library</strong>
                <span>Choose or upload an image from public.</span>
              </div>
              <button type="button" onClick={() => setIsOpen(false)}>Close</button>
            </div>

            <div className="media-modal__upload">
              <input ref={fileRef} type="file" accept="image/*" />
              <button type="button" className="dashboard-button" onClick={uploadSelectedFile} disabled={isPending}>
                <Upload size={16} /> Upload
              </button>
            </div>

            <div className="media-modal__grid">
              {media.map((src) => (
                <div className={`media-tile ${value === src ? "media-tile--selected" : ""}`} key={src}>
                  <button type="button" onClick={() => {
                    setValue(src);
                    setIsOpen(false);
                  }}>
                    <Image src={src} alt="" width={220} height={150} />
                    <span>{src}</span>
                  </button>
                  <button type="button" className="media-tile__delete" onClick={() => deleteImage(src)} aria-label="Delete image">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
