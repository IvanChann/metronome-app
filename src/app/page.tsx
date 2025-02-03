"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(60); // Default tempo: 60 BPM
  const [isActive, setIsActive] = useState(false); // For visual feedback
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(event.target.value));
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / tempo) * 1000; // Convert BPM to milliseconds
      intervalRef.current = setInterval(() => {
        setIsActive((prev) => !prev); // Toggle visual feedback
        playClickSound(); // Play a sound
      }, interval);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false); // Reset visual feedback
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, tempo]);

  const playClickSound = () => {
    const audio = new Audio("/click.flac"); // Add a click sound file to your public folder
    audio.play();
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white select-none">
      <h1 className="text-8xl font-bold rainbow-text absolute top-8" >ELTON LIM GAY</h1>

      {/* Visual Indicator */}
      <div className={`m-16 w-24 h-24 ${isActive ? "bg-red-500" : "bg-gray-700"} rounded-full`}></div>
            
      {/* Tempo Control */}
      <div className="mb-7">
        <label htmlFor="tempo" className="block text-center text-4xl mb-2">
          {tempo}
        </label>
        <input
          type="range"
          id="tempo"
          min="40"
          max="200"
          value={tempo}
          onChange={handleTempoChange}
          className="w-64"
        />
      </div>  
    
    {/* Play/Pause Button */}
    <button
        onClick={handlePlayPause}
        className="px-6 py-2 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>


      
    </div>
  );
}