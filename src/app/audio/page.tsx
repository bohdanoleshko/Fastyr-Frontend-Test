"use client"
import React, { useState, useRef } from 'react';
import Recorder from 'recorder-js';

const AudioPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<string[]>([]);
  const recorderRef = useRef<Recorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.AudioContext)();
      const recorder = new Recorder(audioContext);

      recorder.init(stream);
      recorderRef.current = recorder;
      await recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing audio devices:', error);
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      const { blob } = await recorderRef.current.stop();
      const url = URL.createObjectURL(blob);
      setRecordings((prev) => [...prev, url]);
    }
    setIsRecording(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Audio Recorder</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Saved Recordings</h2>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {recordings.map((url, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <a href={url} download={`recording-${index + 1}.wav`}>
              <button style={{ padding: '10px 15px', fontSize: '1rem', cursor: 'pointer' }}>
                Download Recording {index + 1}
              </button>
            </a>
            <audio controls src={url} style={{ marginTop: '10px', display: 'block' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioPage;
