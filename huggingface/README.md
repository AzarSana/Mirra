
## Create a Virtual Environment

``` bash 
python3 -m venv venv
```

```
source venv/bin/activate   # macOS / Linux
```

```
venv\Scripts\activate # Windows
```

## Install dependencies

```
pip install sounddevice numpy transformers torch
```

### PortAudio (Required for sounddevice)

If you get errors installing or running sounddevice, install PortAudio first:

macOS:
```
brew install portaudio
pip install sounddevice
```

Ubuntu / Debian: 
```
sudo apt install portaudio19-dev
pip install sounddevice
```

Windows:
```
pip install sounddevice
```


## Run the Script

Make sure that the file is named `live_emotion_precise.py`

``` 
python live_emotion_precise.py
```


## Usage

1. When you see:

```
🎙️ Precise live emotion started
```

2. Start speaking into your microphone

3. The terminal will update when your emotion changes, for example:

```
🎭 Emotion → HAP
🎭 Emotion → ANG
🎭 Emotion → NEU
```