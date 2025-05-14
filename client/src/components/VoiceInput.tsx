import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import microphoneIcon from '../assets/microphone-icon.webp';

const VoiceInput: React.FC = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [fullTranscript, setFullTranscript] = useState<string>('');

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }
  };

  const handleClear = () => {
    resetTranscript();
    setFullTranscript('');
  };

  // Append new transcript segments
  useEffect(() => {
    console.log(transcript);
    if (transcript && transcript.trim()) {
      setFullTranscript((prev: string) => {
        if (prev.endsWith(transcript)) return prev; // Avoid duplication
        return prev + ' ' + transcript;
      });
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <div onClick={handleMicClick} style={{ cursor: 'pointer', marginBottom: '1rem' }}>
        <img
          src={microphoneIcon}
          alt="Mic"
          style={{
            width: '100px',
            height: '100px',
            filter: listening ? 'drop-shadow(0 0 10px red)' : 'none',
          }}
        />
        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
          {listening ? 'Listening...' : 'Click to speak'}
        </div>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '1rem',
          minHeight: '80px',
          backgroundColor: '#f9f9f9',
          textAlign: 'left',
        }}
      >
        {fullTranscript.trim() ? (
          fullTranscript
        ) : (
          <span style={{ color: '#888' }}>Start speaking to see text here</span>
        )}
      </div>

      <button
        onClick={handleClear}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1.5rem',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default VoiceInput;
