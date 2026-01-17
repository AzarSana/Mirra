import sounddevice as sd
import numpy as np
import time
from transformers import pipeline
from collections import deque, Counter

# ------------------
# Config
# ------------------
SR = 16000
EMO_CHUNK = 1.2      # sweet spot for emotion models
SMOOTHING = 3
ENERGY_THRESHOLD = 0.01  # ignore silence

# ------------------
# Model
# ------------------
print("Loading emotion model...")
emotion_model = pipeline(
    "audio-classification",
    model="prithivMLmods/Speech-Emotion-Classification",
    device=-1
)
print("🎙️ Precise live emotion started\n")

history = deque(maxlen=SMOOTHING)
last_emotion = None

# ------------------
# Helpers
# ------------------
def normalize(x):
    peak = np.max(np.abs(x))
    return x / peak if peak > 0 else x

def energy(x):
    return np.mean(np.abs(x))

# ------------------
# Loop
# ------------------
while True:
    # Record fresh emotion chunk
    audio = sd.rec(int(SR * EMO_CHUNK), samplerate=SR, channels=1, dtype="float32")
    sd.wait()
    audio = normalize(audio.flatten())

    # Skip silence
    if energy(audio) < ENERGY_THRESHOLD:
        continue

    # Predict
    result = emotion_model(audio, top_k=1)[0]
    history.append(result["label"])

    smoothed = Counter(history).most_common(1)[0][0]

    if smoothed != last_emotion:
        print(f"🎭 Emotion → {smoothed.upper()}")
        last_emotion = smoothed
