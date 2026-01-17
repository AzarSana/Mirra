from transformers import pipeline
import gradio as gr
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor
import torch
import librosa

# Files: 
audio_file_path = "speech-vite/src/assets/new_recording.m4a"
dip_file = "speech-vite/src/assets/dip.wav"
angry_file = "speech-vite/src/assets/1090_WSI_ANG_XX.wav"
neutral_file = "speech-vite/src/assets/1090_IWL_NEU_XX.wav"
fear_file = "speech-vite/src/assets/1090_IWL_FEA_XX.wav"
disgust_file = "speech-vite/src/assets/1089_TAI_DIS_XX.wav"

pipe = pipeline("audio-classification", model="prithivMLmods/Speech-Emotion-Classification")   
# Initialize processor and model for manual inference
model_name = "prithivMLmods/Speech-Emotion-Classification"
processor = Wav2Vec2FeatureExtractor.from_pretrained("prithivMLmods/Speech-Emotion-Classification")
model = Wav2Vec2ForSequenceClassification.from_pretrained("prithivMLmods/Speech-Emotion-Classification")


id2label = {
    "0": "Anger",
    "1": "Calm",
    "2": "Disgust",
    "3": "Fear",
    "4": "Happy",
    "5": "Neutral",
    "6": "Sad",
    "7": "Surprised"
}

# maybe the idea here is to split up the audio we're receiving into chunks
# and then classify each chunk seprately -- maybe by the recognized words?

def classify_emotion(audio_file):
    results = pipe(audio_file)
    if results:
        top_result = results[0]
        label_id = top_result['label']
        score = top_result['score']
        label = id2label.get(label_id, "Unknown")
        return label, score
    return None, None


def classify_audio(audio_path):
    # Load and resample audio to 16kHz
    speech, sample_rate = librosa.load(audio_path, sr=16000)

    # Process audio
    inputs = processor(
        speech,
        sampling_rate=sample_rate,
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.nn.functional.softmax(logits, dim=1).squeeze().tolist()

    prediction = {
        id2label[str(i)]: round(probs[i], 3) for i in range(len(probs))
    }

    return prediction

# Example usage:
# label, score = classify_emotion(audio_file_path)
# print(f"Predicted Emotion: {label}, Confidence Score: {score}")
fPrediction = classify_audio(audio_path=fear_file)
nPrediction = classify_audio(audio_path=neutral_file)
dPrediction = classify_audio(audio_path=disgust_file)
print("Neutral Prediction:", nPrediction)
print("Fearful Prediction:", fPrediction)
print("Disgust Prediction:", dPrediction)