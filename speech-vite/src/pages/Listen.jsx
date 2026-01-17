import { useEffect, useState } from "react";
import lightLogo from "../assets/lightLogo.png";
import darkLogo from "../assets/darkLogo.png";

export default function Listen({ theme = "light", setTheme }) {
  const isDark = theme === "dark";

  // UI state
  const [listening, setListening] = useState(false);
  const [emoticons, setEmoticons] = useState(true);
  const [colours, setColours] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Demo transcript
  const demoAngry = "I’M SO MAD RIGHT NOW!";
  const demoHappy = "Just kidding I’m happy.";

  return (
    <div
      className={[
        "relative min-h-screen w-full overflow-hidden transition-colors duration-300",
        isDark ? "bg-[#0B0E17]" : "bg-white",
      ].join(" ")}
    >
      {/* Blobs */}
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

      {/* Header */}
      <header className="relative z-10 px-8 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={isDark ? darkLogo : lightLogo}
              alt="LuMo"
              className="h-7 w-auto"
            />
            <p className={isDark ? "text-white" : "text-black"}>LuMo</p>
          </div>

          <button
            type="button"
            onClick={() => setTheme?.(isDark ? "light" : "dark")}
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

      {/* Top status */}
      <div className="relative z-10 mt-14 flex flex-col items-center gap-3 px-6 text-center max-md:mt-10">
        {listening ? (
          <>
            <div className="lumo-wave" aria-hidden="true">
            {[0, 120, 240, 360].map((delay) => (
                <span
                key={delay}
                className={[
                    "lumo-bar",
                    isDark ? "bg-white/90" : "bg-black/80",
                ].join(" ")}
                style={{ animationDelay: `${delay}ms` }}
                />
            ))}
            </div>



            <h2
              className={[
                "text-3xl font-medium",
                isDark ? "text-white/90" : "text-black/90",
              ].join(" ")}
            >
              Listening…
            </h2>
          </>
        ) : (
          <h2
            className={[
              "text-3xl font-medium",
              isDark ? "text-white/90" : "text-black/90",
            ].join(" ")}
          >
            We’re listening when you’re ready.
          </h2>
        )}
      </div>

      {/* Main card */}
      <main className="relative z-10 flex items-center justify-center px-6 pb-10">
        <div
          className={[
            "mt-10 w-full max-w-4xl rounded-3xl border p-10 sm:p-14",
            isDark
              ? "border-white/10 bg-white/5"
              : "border-[#7A86D6]/35 bg-white/70",
          ].join(" ")}
        >
          {/* Transcript area */}
          <div
            className={[
              "mx-auto w-full max-w-2xl rounded-2xl border p-6 sm:p-7",
              isDark
                ? "border-white/10 bg-white/5"
                : "border-[#7A86D6]/35 bg-white/80",
            ].join(" ")}
          >
            {!listening ? (
              <p className="text-[#7A86D6] text-base sm:text-lg">
                Press start to begin live transcription...
              </p>
            ) : (
              <p className={isDark ? "text-white/90" : "text-black/90"}>
                {/* MAD -> red when colours ON */}
                <span
                  className={[
                    "font-black tracking-[-0.04em]",
                    colours
                      ? "text-red-600 dark:text-red-400"
                      : isDark
                      ? "text-white/90"
                      : "text-black/90",
                  ].join(" ")}
                  style={{ fontSize: "18px", lineHeight: "1.1" }}
                >
                  {demoAngry}
                </span>
                {emoticons ? " 😡 " : " "}

                {/* HAPPY -> green when colours ON */}
                <span
                  className={[
                    "font-semibold tracking-[0.03em]",
                    colours
                      ? "text-green-600 dark:text-green-400"
                      : isDark
                      ? "text-white/90"
                      : "text-black/90",
                  ].join(" ")}
                  style={{ fontSize: "16px", lineHeight: "1.5" }}
                >
                  {demoHappy}
                </span>
                {emoticons ? " 😊" : ""}
              </p>
            )}
          </div>

          {/* Start/Stop button */}
          <div className="mt-10 flex flex-col items-center">
            <button
              onClick={() => setListening((v) => !v)}
              className={[
                "w-full max-w-2xl max-md:max-w-full",
                "rounded-2xl px-8 py-5 text-lg font-bold transition active:scale-[0.99]",
                listening ? "bg-[#AEBBFF] text-black/85" : "bg-[#7A86D6] text-white",
                "hover:opacity-95",
                isDark
                  ? "shadow-[0_14px_50px_rgba(122,134,214,0.18)]"
                  : "shadow-[0_14px_40px_rgba(122,134,214,0.22)]",
              ].join(" ")}
            >
              {listening ? "Stop Listening" : "Start Listening"}
            </button>
          </div>

          {/* Toggles row */}
          <div className="mt-10 grid grid-cols-2 gap-10 max-w-2xl mx-auto">
            <Toggle
              label="Emojis"
              value={emoticons}
              onChange={setEmoticons}
              isDark={isDark}
            />
            <Toggle
              label="Colours"
              value={colours}
              onChange={setColours}
              isDark={isDark}
              alignRight
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Toggle({ label, value, onChange, isDark, alignRight = false }) {
  return (
    <div
      className={[
        "flex flex-col gap-2",
        alignRight ? "items-end" : "items-start",
      ].join(" ")}
    >
      <div
        className={[
          "text-lg font-medium",
          isDark ? "text-white/90" : "text-black/85",
        ].join(" ")}
      >
        {label}
      </div>

      <div className="flex items-center gap-3">
        <span className={["text-sm", isDark ? "text-white/50" : "text-black/45"].join(" ")}>
          Off
        </span>

        <button
          type="button"
          onClick={() => onChange(!value)}
          className={[
            "relative h-6 w-12 rounded-full border transition",
            value ? "bg-[#7A86D6]/90" : isDark ? "bg-white/10" : "bg-black/10",
            isDark ? "border-white/15" : "border-black/10",
          ].join(" ")}
          aria-pressed={value}
          aria-label={`${label} toggle`}
        >
          <span
            className={[
              "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition",
              value ? "left-7 bg-white" : "left-1 bg-white/90",
            ].join(" ")}
          />
        </button>

        <span className={["text-sm", isDark ? "text-white/60" : "text-black/60"].join(" ")}>
          On
        </span>
      </div>
    </div>
  );
}
