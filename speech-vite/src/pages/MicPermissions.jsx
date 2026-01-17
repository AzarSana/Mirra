import { useEffect, useState } from "react";
import micIcon from "../assets/mic.png"; // <-- rename to your actual file name
import lightLogo from "../assets/lightLogo.png";
import darkLogo from "../assets/darkLogo.png";
import { useNavigate } from "react-router-dom";

export default function MicPermission() {
  const navigate = useNavigate();
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const isDark = theme === "dark";

  const [status, setStatus] = useState("idle"); 
  // idle | requesting | granted | denied | unsupported

  useEffect(() => {
    if (!navigator?.mediaDevices?.getUserMedia) setStatus("unsupported");
  }, []);

  const requestMic = async () => {
    try {
      setStatus("requesting");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus("granted");
    } catch (e) {
      setStatus("denied");
    }
  };

  return (
    <div
      className={[
        "relative min-h-screen w-full overflow-hidden transition-colors duration-300",
        isDark ? "bg-[#0B0E17]" : "bg-white",
      ].join(" ")}
    >
      {/* Background blobs (reuse your same blob block) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="blob absolute -left-40 -top-40 h-[520px] w-[520px] max-md:h-[420px] max-md:w-[420px] max-sm:h-[320px] max-sm:w-[320px] rounded-full blur-3xl bg-[#7A86D6]/35"
          style={{ animation: "blob-float-1 16s ease-in-out infinite", willChange: "transform" }}
        />
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
          <div
            className="blob h-[520px] w-[520px] max-md:h-[420px] max-md:w-[420px] max-sm:h-[320px] max-sm:w-[320px] rounded-full blur-3xl bg-[#9CA6EE]/25"
            style={{ animation: "blob-float-2 18s ease-in-out infinite", willChange: "transform" }}
          />
        </div>
        <div
          className="blob absolute -right-40 -top-5 h-[520px] w-[520px] max-md:h-[420px] max-md:w-[420px] max-sm:h-[320px] max-sm:w-[320px] rounded-full blur-3xl bg-[#7A86D6]/30"
          style={{ animation: "blob-float-3 14s ease-in-out infinite", willChange: "transform" }}
        />
      </div>

      {/* Header (same vibe as landing) */}
      {/* Header */}
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

    {/* Theme toggle (TOP RIGHT – restored) */}
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
      <span className="text-base leading-none">
        {isDark ? "☾" : "☀︎"}
      </span>
      <span className="hidden sm:inline">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  </div>
</header>


      {/* Center card */}
      <main className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-6">
        <div
          className={[
            "w-full max-w-3xl rounded-3xl border p-10 sm:p-14 text-center",
            isDark
              ? "border-white/10 bg-white/5"
              : "border-[#8D9AD8]/35 bg-white/70",
          ].join(" ")}
        >
          {/* Icon */}
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#8D9AD8] to-[#6A76AE]">
            <img src={micIcon} alt="" className="h-7 w-auto" />
          </div>

          {/* Title */}
          <h1
            className={[
              "mt-8 text-3xl sm:text-4xl font-semibold tracking-tight",
              isDark ? "text-white/90" : "text-black/90",
            ].join(" ")}
          >
            Allow <span className="text-[#7A86D6] font-bold">Sono</span> to access your Microphone
          </h1>

          {/* Subtitle */}
          <p
            className={[
              "mx-auto mt-4 max-w-xl text-sm sm:text-base italic",
              isDark ? "text-white/65" : "text-black/60",
            ].join(" ")}
          >
            Sono needs the microphone to listen and identify speech.
          </p>

          {/* Action area */}
          <div className="mt-10">
            {status === "idle" && (
              <button
                onClick={requestMic}
                className="w-full max-w-lg rounded-2xl bg-[#7A86D6] px-8 py-4 text-base font-bold text-white transition hover:opacity-95 active:scale-[0.99] shadow-[0_14px_40px_rgba(122,134,214,0.25)]"
              >
                Allow Microphone
              </button>
            )}

            {status === "requesting" && (
              <div className={isDark ? "text-white/70" : "text-black/70"}>
                Requesting permission…
              </div>
            )}

            {status === "granted" && (
              <div className="space-y-3">
                <p className={isDark ? "text-white/80" : "text-black/80"}>
                  Microphone access granted!
                </p>
                <button onClick={() => navigate("/listen")} className="w-full max-w-lg rounded-2xl bg-[#7A86D6] px-8 py-4 text-base font-bold text-white transition hover:opacity-95 active:scale-[0.99]">
                  Continue
                </button>
              </div>
            )}

            {status === "denied" && (
              <div className="space-y-3">
                <p className={isDark ? "text-white/80" : "text-black/80"}>
                  Microphone access was denied.
                </p>
                <p className={isDark ? "text-white/60" : "text-black/60"}>
                  You can enable it in your browser settings, then try again.
                </p>
                <button
                  onClick={requestMic}
                  className="w-full max-w-lg rounded-2xl bg-[#7A86D6] px-8 py-4 text-base font-bold text-white transition hover:opacity-95 active:scale-[0.99]"
                >
                  Try Again
                </button>
              </div>
            )}

            {status === "unsupported" && (
              <p className={isDark ? "text-white/70" : "text-black/70"}>
                Your browser doesn’t support microphone access.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
