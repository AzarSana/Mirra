from transformers import pipeline
import librosa
import numpy as np
import torch
torch.set_num_threads(1)
torch.use_deterministic_algorithms(True)

AUDIO_FILE = "dataset/neutral/voice_preview_joe - neutral, considered and mature.mp3"

print("Loading emotion model on CPU...")
emotion = pipeline(
    "audio-classification",
    model="prithivMLmods/Speech-Emotion-Classification",
    device=-1  # CPU only
)
print("Model loaded!\n")

def preprocess_audio(path, target_sr=16000, window_seconds=3.0):
    audio, sr = librosa.load(path, sr=target_sr, mono=True)
    peak = np.max(np.abs(audio))
    if peak > 0:
        audio /= peak
    window_len = int(target_sr * window_seconds)
    if len(audio) < window_len:
        audio = np.pad(audio, (0, window_len - len(audio)))
    else:
        start = (len(audio) - window_len) // 2
        audio = audio[start:start + window_len]
    return audio

audio = preprocess_audio(AUDIO_FILE)
results = emotion(audio)

print("Detected emotions:")
for r in results:
    print(f"{r['label']:>10}: {round(r['score'] * 100, 2)}%")

print("\nTop emotion:", results[0]["label"])
