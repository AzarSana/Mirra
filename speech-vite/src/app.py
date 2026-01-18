
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)

MODEL_NAME = 'gemini-2.5-flash-lite' 
model = genai.GenerativeModel(MODEL_NAME)

app = Flask(__name__)
CORS(app)

@app.route('/process-audio', methods=['POST'])
def process_text():
    # Receive Text (Not Audio)
    data = request.json
    user_text = data.get('text', '')

    if not user_text or len(user_text) < 2:
        return jsonify({"text": "", "emotion": "Neutral"})

    try:
        prompt = f"""
        Analyze the emotion and tone of this spoken sentence: "{user_text}"
        
        CRITICAL: The "emotion" field MUST be one of:
        Anger, Calm, Disgust, Fear, Happy, Neutral, Sad, Surprised, Sarcastic.
        
        Note: If the text is ironic (e.g. "Oh great, another error"), mark it as Sarcastic.
        
        Return ONLY a JSON object:
        {{
            "emotion": "The Detected Emotion"
        }}
        """

        response = model.generate_content(prompt)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        
        # We return the original text + the new emotion
        return jsonify({
            "text": user_text, 
            "emotion": clean_json.replace('"', '').replace('{', '').replace('}', '').split(':')[-1].strip() 
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"text": user_text, "emotion": "Neutral"})

if __name__ == '__main__':
    print(f"TEXT-MODE Server Running: {MODEL_NAME}")
    app.run(port=5000, debug=True)