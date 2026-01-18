import { useEffect, useState } from "react";
import lightLogo from "../assets/lightLogo.png";
import darkLogo from "../assets/darkLogo.png";
import { EMOTION_STYLES } from "../styles/emotionStyles";

export default function Listen({ theme = "light", setTheme }) {
  const isDark = theme === "dark";

  // UI state
  const [listening, setListening] = useState(false);
  const [emoticons, setEmoticons] = useState(true);
  const [colours, setColours] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Demo transcript representing every emotion
  const demoTranscript = [
    { emotion: "Anger", text: "I AM SO MAD!" },
    { emotion: "Happy", text: "Life is wonderful." },
    { emotion: "Sad", text: "I'm feeling a bit down." },
    { emotion: "Calm", text: "Everything is peaceful." },
    { emotion: "Fear", text: "What was that noise?" },
    { emotion: "Surprised", text: "I can't believe it!" },
    { emotion: "Disgust", text: "That is quite unpleasant." },
    { emotion: "Neutral", text: "It is what it is." },
    { emotion: "Sarcasm", text: "Oh, that's just GREAT." },
  ];

  const getEmotionStyle = (emotionName) => {
    // 1. Fix Font Names: Wrap fonts with spaces/numbers in quotes
    const fontFix = {
      "Source Serif 4": "'Source Serif 4', serif",
      "Slackside One": "'Slackside One', cursive",
      "Jersey 10": "'Jersey 10', cursive",
      "Red Hat Mono": "'Red Hat Mono', monospace",
      "Asap Condensed": "'Asap Condensed', sans-serif",
      "Baloo Bhai 2": "'Baloo Bhai 2', cursive"
    };

    const config = EMOTION_STYLES[emotionName];
    if (!config) return {};

    const rawFont = config.fontFamily;
    const styledFont = fontFix[rawFont] || rawFont;

    return {
      fontFamily: styledFont,
      // 2. Fix Text Color: Use white/black theme colors when 'colours' is OFF
      color: colours 
        ? (isDark ? config.darkColor : config.lightColor) 
        : (isDark ? "#FFFFFF" : "#000000"), 
      transition: "color 0.3s ease",
    };
  };

  return (
    <div className={["relative min-h-screen w-full overflow-hidden transition-colors duration-300", isDark ? "bg-[#0B0E17]" : "bg-white"].join(" ")}>
      {/* Blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="blob absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl bg-[#7A86D6]/35" style={{ animation: "blob-float-1 16s ease-in-out infinite" }} />
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
          <div className="blob h-[520px] w-[520px] rounded-full blur-3xl bg-[#9CA6EE]/25" style={{ animation: "blob-float-2 18s ease-in-out infinite" }} />
        </div>
        <div className="blob absolute -right-40 -top-5 h-[520px] w-[520px] rounded-full blur-3xl bg-[#7A86D6]/30" style={{ animation: "blob-float-3 14s ease-in-out infinite" }} />
      </div>

      <header className="relative z-10 px-8 pt-8 max-md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={isDark ? darkLogo : lightLogo} alt="Sono" className="h-7 w-auto" />
            <p className={isDark ? "text-white" : "text-black"}>Sono</p>
          </div>
          <button onClick={() => setTheme?.(isDark ? "light" : "dark")} className={["inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition", isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/70"].join(" ")}>
            <span>{isDark ? "☾" : "☀︎"}</span>
            <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
          </button>
        </div>
      </header>

      <div className="relative z-10 mt-14 flex flex-col items-center gap-3 px-6 text-center">
        {listening ? (
          <div className="lumo-wave">
            {[0, 120, 240, 360].map((d) => (
              <span key={d} className={["lumo-bar", isDark ? "bg-white/90" : "bg-black/80"].join(" ")} style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        ) : (
          <h2 className={["text-2xl font-medium sm:text-3xl", isDark ? "text-white/90" : "text-black/90"].join(" ")}>
            We’ll listen when you’re ready.
          </h2>
        )}
      </div>

      <main className="relative z-10 flex items-center justify-center px-6 pb-10">
        <div className={["mt-10 w-full max-w-4xl rounded-3xl border p-10 sm:p-14", isDark ? "border-white/10 bg-white/5" : "border-[#B0BCF8]/35 bg-white/70"].join(" ")}>
          
          <div className={["mx-auto w-full max-w-2xl rounded-2xl border min-h-[220px] max-h-[300px] overflow-y-auto p-7", isDark ? "border-white/10 bg-white/10" : "border-[#6A76AE]/35 bg-white/80"].join(" ")}>
            {!listening ? (
              <p className="text-[#B0BCF8]">Press start to begin live transcription...</p>
            ) : (
              <div className="leading-relaxed">
                {demoTranscript.map((item, idx) => (
                  <span key={idx} className="inline-block mr-3 mb-2">
                    <span style={getEmotionStyle(item.emotion)} className="text-xl sm:text-2xl font-medium">
                      {item.text}
                    </span>
                    {emoticons && (
                      <span className="ml-1 text-xl">
                        {EMOTION_STYLES[item.emotion]?.emoji}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col items-center">
            <button
              onClick={() => setListening(!listening)}
              className={["w-full max-w-2xl rounded-2xl px-8 py-3 text-lg font-bold transition active:scale-[0.99]", listening ? "bg-[#B0BCF8] text-black/85" : "bg-[#6A76AE] text-white"].join(" ")}
            >
              {listening ? "Stop Listening" : "Start Listening"}
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-auto max-w-2xl ">
            <Toggle label="Emojis" value={emoticons} onChange={setEmoticons} isDark={isDark} />
            <Toggle label="Colours" value={colours} onChange={setColours} isDark={isDark} alignRight />
          </div>
        </div>
      </main>
    </div>
  );
}

function Toggle({ label, value, onChange, isDark, alignRight = false }) {
  return (
    <div className={["flex flex-col gap-2", alignRight ? "items-end" : "items-start", "max-sm:items-center"].join(" ")}>
      <div className={["text-lg font-medium", isDark ? "text-white/90" : "text-black/85"].join(" ")}>{label}</div>
      <button
        onClick={() => onChange(!value)}
        className={["relative h-6 w-12 rounded-full transition", value ? "bg-[#7A86D6]/90" : isDark ? "bg-white/10" : "bg-black/10"].join(" ")}
      >
        <span className={["absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition", value ? "left-7 bg-white" : "left-1 bg-white/90"].join(" ")} />
      </button>
    </div>
  );
}