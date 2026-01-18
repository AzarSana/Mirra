import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# --- 🏆 NEW KEY HERE ---
# Make sure this is the key from your Paid/Trial project
GOOGLE_API_KEY = "AIzaSyAfFQUPZH1HD3sLbYoyG1yWmKdC3W8aoGM"

genai.configure(api_key=GOOGLE_API_KEY)

# Use the powerful Standard Flash model (Best for Audio)
MODEL_NAME = 'gemini-2.5-flash' 
model = genai.GenerativeModel(MODEL_NAME)

app = Flask(__name__)
CORS(app)

@app.route('/process-audio', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    audio_bytes = file.read()

    if len(audio_bytes) < 1000: # Ignore silence
        return jsonify({"text": "", "emotion": "Neutral"})

    try:
        # No more "Retry Loop" needed! We just fire the request.
        print(f"🚀 Sending Audio to {MODEL_NAME}...")

        prompt = """
        Listen to this audio.
        1. Transcribe exactly what was said.
        2. Analyze the speaker's tone/emotion.
        
        CRITICAL: The "emotion" field MUST be one of:
        Anger, Calm, Disgust, Fear, Happy, Neutral, Sad, Surprised, Sarcastic.
        
        Return ONLY a JSON object:
        {
            "text": "The words spoken",
            "emotion": "The Detected Emotion"
        }
        """

        response = model.generate_content([
            prompt,
            {
                "mime_type": "audio/webm",
                "data": audio_bytes
            }
        ])
        
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        print(f"🤖 Gemini Says: {clean_json}")
        
        return clean_json, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print(f"❌ Error: {e}")
        # If you still get 429, it means the key isn't actually linked to billing yet.
        return jsonify({"text": "", "emotion": "Neutral"})

if __name__ == '__main__':
    print(f"✅ UNLIMITED POWER MODE: {MODEL_NAME}")
    app.run(port=5000, debug=True)