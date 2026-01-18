import { EMOTION_STYLES } from "../styles/emotionStyles";

function TranscriptLine({
  text,
  emotion,
  theme = "light", // "light" or "dark"
  showEmoji = true,
}) {
  const style = EMOTION_STYLES[emotion] ?? EMOTION_STYLES.Neutral;

  const color =
    theme === "dark" ? style.darkColor : style.lightColor;

  return (
    <p
      style={{
        fontFamily: style.fontFamily,
        color,
      }}
    >
      {text} {showEmoji && <span>{style.emoji}</span>}
    </p>
  );
}

export default TranscriptLine;
