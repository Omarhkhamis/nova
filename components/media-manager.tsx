"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Trash2, Upload } from "lucide-react";
import Swal from "sweetalert2";
import { showDashboardToast } from "@/components/dashboard-enhancer";

export function MediaManager({ initialMedia }: { initialMedia: string[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadImage() {
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
      const data = (await response.json()) as { media?: string[]; error?: string };

      if (!response.ok) {
        void Swal.fire("Upload failed", data.error ?? "Could not upload image.", "error");
        return;
      }

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

      setMedia(data.media ?? []);
      showDashboardToast("Image deleted successfully");
    });
  }

  return (
    <section className="dashboard-panel" id="media">
      <h2>Media</h2>
      <p>All images found inside the public folder.</p>
      <div className="media-manager__upload">
        <input ref={fileRef} type="file" accept="image/*" />
        <button type="button" className="dashboard-button" onClick={uploadImage} disabled={isPending}>
          <Upload size={16} /> Upload image
        </button>
      </div>
      <div className="media-manager__grid">
        {media.map((src) => (
          <article className="media-manager__card" key={src}>
            <Image src={src} alt="" width={260} height={170} />
            <div className="media-manager__overlay">
              <span>{src.split("/").at(-1)}</span>
            </div>
            <button type="button" className="icon-button" onClick={() => deleteImage(src)} aria-label="Delete image">
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
