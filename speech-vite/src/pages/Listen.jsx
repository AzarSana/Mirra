import { useEffect, useRef, useState } from "react";
import lightLogo from "../assets/lightLogo.png";
import darkLogo from "../assets/darkLogo.png";
import { EMOTION_STYLES } from "../styles/emotionStyles";

export default function Listen({ theme = "light", setTheme }) {
  const isDark = theme === "dark";
  const [listening, setListening] = useState(false);
  const [emoticons, setEmoticons] = useState(true);
  const [colours, setColours] = useState(true);
  const [finalizedText, setFinalizedText] = useState(""); // <-- NEW

  // Finalized subtitles: [{text, emotion}]
  const [subtitles, setSubtitles] = useState([]);
  // Interim text (not yet finalized)
  const [currentText, setCurrentText] = useState("");
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const capturedStreamRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleListenToggle = () => {
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      setListening(false);
      stopRecording();
      setCurrentText("");
      setFinalizedText(""); // Optionally clear on stop
    } else {
      setSubtitles([]);
      setCurrentText("");
      setFinalizedText(""); // Clear on new session
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("❌ Browser not supported. Please use Google Chrome.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setFinalizedText(final);      // All finalized so far
        setCurrentText(interim);      // The full interim segment
      };

      recognition.onerror = (event) => {
        console.error("Speech Error:", event.error);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
      startRecording();
    }
  };

  // Audio recording helpers
  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        sampleRate: 16000,
      }
    }).then(stream => {
      capturedStreamRef.current = stream;
      audioChunksRef.current = [];
      const mediaRecorder = new window.MediaRecorder(stream, { mimeType: 'audio/wav' });
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    }).catch((e) => {
      console.error('Error accessing microphone', e);
    });
  };

  const stopRecording = () => {
    return new Promise(resolve => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        resolve(null);
        return;
      }
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (capturedStreamRef.current) {
          capturedStreamRef.current.getTracks().forEach(track => track.stop());
        }
        resolve(audioBlob);
      };
      mediaRecorder.stop();
    });
  };

  // Send audio to backend for sentiment analysis
  const sendAudioToBackend = (audioBlob, transcript) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'segment.wav');
    fetch('http://localhost:5000/classify', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        // Update the last subtitle with emotion
        setSubtitles(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              emotion: data.label ? data.label : 'Unknown'
            };
          }
          return updated;
        });
      })
      .catch(() => {
        setSubtitles(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              emotion: 'Error'
            };
          }
          return updated;
        });
      });
  };

  const getEmotionStyle = (emotionName) => {
    const config = EMOTION_STYLES[emotionName];
    if (!config) return {};
    return {
      fontFamily: config.fontFamily,
      color: colours 
        ? (isDark ? config.darkColor : config.lightColor) 
        : "inherit",
      transition: "all 0.3s ease",
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
          <div className={["mx-auto w-full max-w-2xl rounded-2xl border min-h-[220px] max-h-[300px] overflow-y-auto p-7", isDark ? "border-white/10 bg-white/5" : "border-[#6A76AE]/35 bg-white/80"].join(" ")}>
            {!listening && subtitles.length === 0 ? (
              <p className="text-[#B0BCF8]">Press start to begin live transcription...</p>
            ) : (
              <div
                className="w-full text-xl sm:text-2xl leading-relaxed break-words"
                style={{
                  color: isDark ? "#fff" : "#111",
                  minHeight: "2.5em",
                  wordBreak: "break-word",
                  transition: "color 0.2s",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  textShadow: isDark ? "0 2px 8px #0008" : "0 2px 8px #fff8",
                  padding: "0.5em 0"
                }}
              >
                {finalizedText}
                {listening && currentText && (
                  <span style={{ color: "#bbb" }}>{currentText}</span>
                )}
              </div>
            )}
          </div>
          <div className="mt-10 flex flex-col items-center">
            <button
              onClick={handleListenToggle}
              className={["w-full max-w-2xl rounded-2xl px-8 py-3 text-lg font-bold transition active:scale-[0.99]", listening ? "bg-[#B0BCF8] text-black/85" : "bg-[#6A76AE] text-white"].join(" ")}
            >
              {listening ? "Stop Listening" : "Start Listening"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}