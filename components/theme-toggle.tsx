"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useState } from "react";

type ThemeToggleProps = {
  initialTheme: "light" | "dark";
};

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return initialTheme;
    }

    const savedTheme = window.localStorage.getItem("nova-theme");
    const currentTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : initialTheme;
    document.documentElement.dataset.theme = currentTheme;

    return currentTheme;
  });

  function applyTheme(nextTheme: "light" | "dark") {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("nova-theme", nextTheme);
  }

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => applyTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {theme === "dark" ? <SunMedium size={20} /> : <MoonStar size={20} />}
      </span>
    </button>
  );
}
