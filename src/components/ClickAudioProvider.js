import React, { useEffect, useState, useRef } from 'react';
import clickSoundFile from '../sounds/click-sound.mp3';

const ClickAudioProvider = ({ children }) => {
  const [audioContext, setAudioContext] = useState(null);
  const clickBufferRef = useRef(null);

  useEffect(() => {
    // Create or store the AudioContext (still suspended until user gesture).
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(ctx);

    // Pre-fetch and decode the click sound once on mount
    fetch(clickSoundFile)
      .then(res => res.arrayBuffer())
      .then(data => ctx.decodeAudioData(data))
      .then(decodedData => {
        clickBufferRef.current = decodedData;
      })
      .catch(err => console.error('Error loading click sound:', err));
  }, []);

  // Handler for playing the click sound
  const handleGlobalClick = () => {
    if (!audioContext) return;

    // If the context is still suspended, resume it on the first user click
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log('Audio context resumed on first click!');
        playClickSound();
      });
    } else {
      playClickSound();
    }
  };

  const playClickSound = () => {
    if (!clickBufferRef.current) return; // sound not loaded yet
    const source = audioContext.createBufferSource();
    source.buffer = clickBufferRef.current;
    source.connect(audioContext.destination);
    source.start(0);
  };

  useEffect(() => {
    // Attach global click listener
    window.addEventListener('click', handleGlobalClick, true);
    // Cleanup
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, [audioContext]);

  return <>{children}</>;
};

export default ClickAudioProvider;
