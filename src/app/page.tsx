"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(60); // Default tempo: 60 BPM
  const [isActive, setIsActive] = useState(false); // For visual feedback
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(tempo.toString());
  const MIN_BPM = 40;
  const MAX_BPM = 300; 

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const value = Number(event.currentTarget.value)
    const clampedValue = Math.max(MIN_BPM, Math.min(MAX_BPM, value));
    // Update both tempo and tempValue
    setTempo(clampedValue);
    setTempValue(clampedValue.toString());

    setIsActive(false);
    setEditing(false);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / tempo) * 1000; // Convert BPM to milliseconds
      intervalRef.current = setInterval(() => {
        setIsActive(() => true); // Toggle visual feedback
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
      <div 
        // key={isPlaying ? Date.now() : "inactive"} 
        className={`m-16 w-16 h-16 
        bg-gray-300 rounded-full`}
        style={{
          animation: isActive ? `pulse ${60 / tempo}s ease-in-out infinite` : "" ,
          // transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out", // Smooth reset
        }}
       ></div>
      
      {/* Tempo Display */}
      <div className="mb-8 text-center">
        {editing ? (
          <input
            type="number"
            value={tempValue}
            min= {MIN_BPM}
            max= {MAX_BPM}
            onBlur={handleTempoChange} // Exit edit mode when losing focus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTempoChange(e); // Call handleTempoChange on Enter key press
              }
            }}
            onChange={(e) => setTempValue(e.target.value)}
            autoFocus
            className="text-8xl font-bold bg-transparent text-center outline-none border-none h-24 " // Ensure border consistency
          />
        ) : (
          <div
            className="text-8xl font-bold cursor-pointer h-24"
            onClick={() => setEditing(true)}
          >
            {tempo}
          </div>
        )}
        <div className="text-lg text-gray-400">BPM</div>
      </div>

      {/* Tempo Control */}
      <div className="mb-7">
        <input
          type="range"
          id="tempo"
          min={MIN_BPM}
          max={MAX_BPM}
          value={tempo}
          onChange={handleTempoChange}
          className="w-96 appearance-none bg-gray-700 rounded-full h-2 outline-none"
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