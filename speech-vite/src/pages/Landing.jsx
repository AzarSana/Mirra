import { useEffect, useState } from "react";
import lightLogo from "../assets/lightLogo.png";
import darkLogo from "../assets/darkLogo.png";
import { useNavigate } from "react-router-dom";


export default function Landing() {
  const navigate = useNavigate();

  // Start from system preference, then allow user toggle
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div
      className={[
        "relative min-h-screen w-full overflow-hidden transition-colors duration-300",
        isDark ? "bg-[#0B0E17]" : "bg-white",
      ].join(" ")}
    >
      {/* Soft gradient glow background (blobs) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="blob absolute -left-40 -top-40 h-[520px] w-[520px] max-md:h-[420px] max-md:w-[420px] max-sm:h-[320px] max-sm:w-[320px] rounded-full blur-3xl bg-[#7A86D6]/35"
          style={{
            animation: "blob-float-1 16s ease-in-out infinite",
            willChange: "transform",
          }}
        />

        <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
          <div
            className="blob h-[520px] w-[520px] max-md:h-[420px] max-md:w-[420px] max-sm:h-[320px] max-sm:w-[320px] rounded-full blur-3xl bg-[#9CA6EE]/25"
            style={{
              animation: "blob-float-2 18s ease-in-out infinite",
              willChange: "transform",
            }}
          />
        </div>

        <div
          className="blob absolute -right-40 -top-5 h-[520px] w-[520px] max-md:h-[420px] max-md:w-[420px] max-sm:h-[320px] max-sm:w-[320px] rounded-full blur-3xl bg-[#7A86D6]/30"
          style={{
            animation: "blob-float-3 14s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* Header (unchanged) */}
      <header className="relative z-10 px-8 pt-8">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src={isDark ? darkLogo : lightLogo}
              alt="Sono"
              className="h-7 w-auto"
            />
            <p className={isDark ? "text-white" : "text-black"}>Sono</p>
          </div>

          {/* Theme toggle (top right) */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition",
              isDark
                ? "bg-white/10 text-white/80 hover:bg-white/15"
                : "bg-black/5 text-black/70 hover:bg-black/10",
            ].join(" ")}
            aria-label="Toggle light/dark mode"
            title="Toggle theme"
          >
            <span className="text-base leading-none">{isDark ? "☾" : "☀︎"}</span>
            <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
          </button>
        </div>
      </header>

      {/* Main
          Desktop stays EXACTLY centered (your current behavior).
          On iPad/Phone (<= md): hero goes to top, CTA sits at bottom. */}
      <main className="relative z-10 px-6">
        <div
          className={[
            "w-full max-w-4xl mx-auto text-center",
            // Desktop: keep your original centered layout
            "min-h-[calc(100vh-96px)] flex flex-col items-center justify-center",
            // iPad/Phone: top + bottom layout
            "max-md:justify-start max-md:pt-16 max-md:pb-10",
          ].join(" ")}
        >
          {/* HERO (top on iPad/Phone) */}
          <div className="w-full">
            <h1
  className={[
    "text-[76px] font-semibold leading-[1.05] tracking-tight",
    "max-md:text-[56px] max-sm:text-[44px]",
    isDark ? "text-white/90" : "text-black/90",
  ].join(" ")}
>
  See{" "}
  <span
    className="
      font-bold
      bg-gradient-to-r
      from-[#6A76AE]
      to-[#B0BCF8]
      bg-clip-text
      text-transparent
    "
  >
    Emotion
  </span>{" "}
  in
  <br />
  <span
    className="
      font-bold
      bg-gradient-to-r
      from-[#6A76AE]
      to-[#B0BCF8]
      bg-clip-text
      text-transparent
    "
  >
    Every Word
  </span>
  .
</h1>


            <p
              className={[
                "mx-auto mt-8 max-w-xl text-lg leading-relaxed sm:text-xl italic",
                isDark ? "text-white/70" : "text-black/70",
              ].join(" ")}
            >
              Real-time captions that let words
              <br className="hidden sm:block" />
              carry tone, feeling, and identity.
            </p>
          </div>

          {/* CTA (bottom on iPad/Phone, unchanged on desktop) */}
          <div className="mt-32 flex flex-col items-center gap-6 max-md:mt-auto">
            <button
            onClick={() => navigate("/mic")}
              className={[
                // Layout
                "w-full max-w-2xl max-md:max-w-full",
                // Padding
                "px-40 py-5 max-md:px-28 max-sm:px-20",
                // Typography
                "text-lg font-bold text-white",
                // Shape & interaction
                "rounded-2xl transition hover:opacity-95 active:scale-[0.99]",
                // Color
                "bg-[#7A86D6]",
                // Shadow
                isDark
                  ? "shadow-[0_14px_50px_rgba(122,134,214,0.20)]"
                  : "shadow-[0_14px_40px_rgba(122,134,214,0.25)]",
              ].join(" ")}
            >
              Try Sono Now
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
