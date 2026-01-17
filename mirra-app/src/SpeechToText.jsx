import React, { useState, useEffect, useRef } from 'react';

const SpeechToText = () => {
  const [text, setText] = useState('Click start to speak...');
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setText("❌ Browser not supported. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;      
    recognition.interimResults = true;  
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const latestResult = results[results.length - 1];
      const transcript = latestResult[0].transcript;
      
      setText(transcript);
      
      console.log("Heard:", transcript); 
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setText("Listening...");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎤 Speech to Text Test</h1>
      
      <div style={{ 
        fontSize: '24px', 
        padding: '20px', 
        border: '1px solid #ccc', 
        margin: '20px auto',
        maxWidth: '600px',
        minHeight: '100px'
      }}>
        {text}
      </div>

      <button 
        onClick={toggleListening}
        style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}
      >
        {isListening ? '🛑 Stop Listening' : '🟢 Start Listening'}
      </button>
    </div>
  );
};

export default SpeechToText;