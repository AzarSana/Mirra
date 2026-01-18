import { useEffect, useState, useRef } from "react";
// 1. Import the Logic Libraries
import { useReactMediaRecorder } from "react-media-recorder";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from "axios";

import lightLogo from "../assets/lightLogo.png";
import darkLogo from "../assets/darkLogo.png";
import { EMOTION_STYLES } from "../styles/emotionStyles";

export default function Listen({ theme = "light", setTheme }) {
  const isDark = theme === "dark";

  // UI state
  const [listening, setListening] = useState(false); // Controls the loop
  const [emoticons, setEmoticons] = useState(true);
  const [colours, setColours] = useState(true);

  // 2. REAL DATA STATE (Instead of demoTranscript)
  const [messages, setMessages] = useState([]); 

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // --- LOGIC START ---

  // A. Fast Brain (Browser Text) - Shows gray text instantly
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // B. Smart Brain (Gemini Audio) - Captures Tone
  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl, blob) => sendToGemini(blob),
  });

  // C. The Loop (Every 4 Seconds)
  useEffect(() => {
    let intervalId;

    if (listening) {
      SpeechRecognition.startListening({ continuous: true });
      startRecording();

      intervalId = setInterval(() => {
        stopRecording();
        // Tiny pause to ensure file saves, then restart
        setTimeout(() => {
            if (listening) {
                resetTranscript(); 
                startRecording();
            }
        }, 200);
      }, 4000); 

    } else {
      SpeechRecognition.stopListening();
      stopRecording();
      resetTranscript();
    }

    return () => clearInterval(intervalId);
  }, [listening]);

  // D. Send to Backend
  const sendToGemini = async (blob) => {
    if (!blob || blob.size < 1000) return; // Ignore silence

    const formData = new FormData();
    formData.append("file", blob, "chunk.webm");

    try {
      const response = await axios.post("http://localhost:5000/process-audio", formData);
      const { text, emotion } = response.data; 

      if (text && text.trim().length > 0) {
          setMessages((prev) => [...prev, { text, emotion }]);
          // Auto-scroll
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Gemini Error:", error);
    }
  };
  // --- LOGIC END ---


  // Your Original Style Logic (Unchanged)
  const getEmotionStyle = (emotionName) => {
    const fontFix = {
      "Source Serif 4": "'Source Serif 4', serif",
      "Slackside One": "'Slackside One', cursive",
      "Jersey 10": "'Jersey 10', cursive",
      "Red Hat Mono": "'Red Hat Mono', monospace",
      "Asap Condensed": "'Asap Condensed', sans-serif",
      "Baloo Bhai 2": "'Baloo Bhai 2', cursive"
    };

    // Fallback to Neutral if emotion is new/unknown
    const safeEmotion = EMOTION_STYLES[emotionName] ? emotionName : "Neutral";
    const config = EMOTION_STYLES[safeEmotion];
    
    if (!config) return {};

    const rawFont = config.fontFamily;
    const styledFont = fontFix[rawFont] || rawFont;

    return {
      fontFamily: styledFont,
      color: colours 
        ? (isDark ? config.darkColor : config.lightColor) 
        : (isDark ? "#FFFFFF" : "#000000"), 
      transition: "color 0.3s ease",
    };
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition. Use Chrome.</span>;
  }

  return (
    <div className={["relative min-h-screen w-full overflow-hidden transition-colors duration-300", isDark ? "bg-[#0B0E17]" : "bg-white"].join(" ")}>
      {/* Blobs (Unchanged) */}
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
          
          <div className={["mx-auto w-full max-w-2xl rounded-2xl border min-h-[220px] max-h-[500px] overflow-y-auto p-7", isDark ? "border-white/10 bg-white/10" : "border-[#6A76AE]/35 bg-white/80"].join(" ")}>
            
            {/* LOGIC: Render Messages or Placeholder */}
            {!listening && messages.length === 0 ? (
              <p className="text-[#B0BCF8]">Press start to begin live transcription...</p>
            ) : (
              <div className="leading-relaxed">
                
                {/* 1. Finalized Messages from Gemini */}
                {messages.map((item, idx) => (
                  <span key={idx} className="inline-block mr-3 mb-2 animate-in fade-in duration-300">
                    <span style={getEmotionStyle(item.emotion)} className="text-xl sm:text-2xl font-medium">
                      {item.text}
                    </span>
                    {emoticons && EMOTION_STYLES[item.emotion] && (
                      <span className="ml-1 text-xl">
                        {EMOTION_STYLES[item.emotion]?.emoji}
                      </span>
                    )}
                  </span>
                ))}

                {/* 2. Live Ghost Text (Browser) */}
                {listening && transcript && (
                     <span className="inline-block mr-3 mb-2 opacity-50 italic text-xl sm:text-2xl" style={{color: isDark ? '#fff' : '#000'}}>
                        {transcript} ...
                     </span>
                )}

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

          <div className="mt-10 grid grid-cols-2 gap-auto max-w-2xl mx-auto">
            <Toggle label="Emojis" value={emoticons} onChange={setEmoticons} isDark={isDark} />
            <Toggle label="Colours" value={colours} onChange={setColours} isDark={isDark} alignRight />
          </div>
        </div>
      </main>
    </div>
  );
}

// Toggle Component (Unchanged)
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