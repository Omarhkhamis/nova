"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function toast(message: string) {
  void Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
}

export function showDashboardToast(message = "Saved successfully") {
  toast(message);
}

export function DashboardEnhancer() {
  useEffect(() => {
    const pendingToast = sessionStorage.getItem("dashboard:toast");

    if (pendingToast) {
      sessionStorage.removeItem("dashboard:toast");
      toast(pendingToast);
    }

    const confirmedForms = new WeakSet<HTMLFormElement>();
    const shell = document.querySelector<HTMLElement>(".dashboard-shell");
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".dashboard-panel"));
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".dashboard-sidebar nav a[href^='#']"));

    function setActivePanel(hash = window.location.hash || "#content", shouldPush = false) {
      const target = hash.replace("#", "") || "content";
      const activePanel = panels.find((panel) => panel.id === target) ?? panels[0];

      panels.forEach((panel) => {
        panel.classList.toggle("dashboard-panel--active", panel === activePanel);
      });

      links.forEach((link) => {
        link.classList.toggle("dashboard-sidebar__link--active", link.hash === `#${activePanel.id}`);
      });

      shell?.setAttribute("data-dashboard-ready", "true");

      if (shouldPush) {
        history.pushState(null, "", `#${activePanel.id}`);
      }
    }

    function handleNavClick(event: MouseEvent) {
      const target = event.target;
      const link = target instanceof Element ? target.closest<HTMLAnchorElement>(".dashboard-sidebar nav a[href^='#']") : null;

      if (!link) {
        return;
      }

      event.preventDefault();
      setActivePanel(link.hash, true);
    }

    function handleSubmit(event: SubmitEvent) {
      const form = event.target;

      if (!(form instanceof HTMLFormElement) || !form.matches("[data-dashboard-form]")) {
        return;
      }

      if (form.dataset.confirmDelete === "true" && !confirmedForms.has(form)) {
        event.preventDefault();

        void Swal.fire({
          title: "Confirm delete?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            confirmedForms.add(form);
            sessionStorage.setItem("dashboard:toast", "Deleted successfully");
            form.requestSubmit(event.submitter instanceof HTMLElement ? event.submitter : undefined);
          }
        });

        return;
      }

      sessionStorage.setItem("dashboard:toast", form.dataset.toastMessage ?? "Saved successfully");
    }

    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("click", handleNavClick);
    window.addEventListener("hashchange", () => setActivePanel(window.location.hash));
    setActivePanel();

    return () => {
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("click", handleNavClick);
    };
  }, []);

  return null;
}
