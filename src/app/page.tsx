"use client";

import * as Tone from "tone";
import { useState, useEffect, useRef } from "react";
import { MAX_BPM, MIN_BPM, DEFAULT_BPM, TIME_SIGNATURES } from "@/constants";


export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(DEFAULT_BPM); // Default tempo: 60 BPM
  const [isActive, setIsActive] = useState(false); // For visual feedback
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(tempo.toString());
  const [timeSignature, setTimeSignature] = useState(TIME_SIGNATURES[0]); // Default: 4/4
  const [currentBeat, setCurrentBeat] = useState(-1);

  // Old System

  // const handlePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  // };

  
  // useEffect(() => {
  //   if (isPlaying) {
  //     const interval = (60 / tempo) * 1000; // Convert BPM to milliseconds
  //     intervalRef.current = setInterval(() => {
  //       setCurrentBeat((prev) => (prev + 1) % timeSignature.beats); // Cycle through beats
  //       setIsActive(() => true); // Toggle visual feedback
  //     }, interval);
  //   } else {
  //     if (intervalRef.current) clearInterval(intervalRef.current);
  //     setCurrentBeat(-1); // Reset to the first beat
  //     setIsActive(false); // Reset visual feedback
  //   }

  //   return () => {
  //     if (intervalRef.current) clearInterval(intervalRef.current);
  //   };
  // }, [isPlaying, tempo, timeSignature.beats]);

  // Load Click Sound
  const click = useRef<Tone.Player | null>(null);

  const handlePlayPause = async () => {
    
    // Explicitly start the AudioContext on user interaction
    if (Tone.getContext().state !== "running") {
      // Start the AudioContext on the first user interaction
      
      await Tone.start();
      click.current = new Tone.Player("/click.flac").toDestination();
      await click.current.loaded; // Ensure sound is ready
    }

    if (!click.current) {
      return
    }

    if (isPlaying) {
      await Tone.getTransport().stop();
      await Tone.getTransport().cancel();
      setCurrentBeat(-1);
      setIsActive(false);
    } else {
      Tone.getTransport().bpm.value = tempo;
      Tone.getTransport().scheduleRepeat((time) => {
        setCurrentBeat((prev) => (prev + 1) % timeSignature.beats);
        setIsActive(true);
        click.current?.start(time); // Play sound at scheduled time
      }, "4n"); // Play on quarter notes
  
      Tone.getTransport().start();
    }
  
    setIsPlaying(!isPlaying);
  };

  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const value = Number(event.currentTarget.value)
    const clampedValue = Math.max(MIN_BPM, Math.min(MAX_BPM, value));
    // Update both tempo and tempValue
    setTempo(clampedValue);
    setTempValue(clampedValue.toString());

      // Update Tone.js BPM
    Tone.getTransport().bpm.value = clampedValue;

    setIsActive(false);
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white select-none">
      {/* <h1 className="text-8xl font-bold rainbow-text absolute top-8" >ELTON LIM GAY</h1> */}

      {/* Visual Indicator */}
      <div 
        className={`m-8 w-16 h-16 
        bg-gray-700 rounded-full`}
        style={{
          animation: isActive ? `pulse ${60 / tempo}s ease-in-out infinite` : "" ,
        }}
       ></div>
      
      <div className="flex justify-center space-x-4 m-8 mb-24">
        {Array.from({ length: timeSignature.beats }).map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full ${
              isActive && currentBeat === index ? "bg-red-500" : "bg-gray-700"
            } transition-colors duration-20`}
          ></div>
        ))}
      </div>

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

    <div className="flex justify-between items-center space-x-5">
      {/* Play/Pause Button */}
      <button
          onClick={handlePlayPause}
          className="px-6 py-2 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? "Pause" : "Play"}
      </button>
        
      {/* Time Signature Control */}

        <select
          id="timeSignature"
          value={timeSignature.name}
          onChange={(e) => {
            const selected = TIME_SIGNATURES.find((ts) => ts.name === e.target.value);
            if (selected) setTimeSignature(selected);
          }}
          className="bg-gray-700 text-white p-2 rounded-lg"
        >
          {TIME_SIGNATURES.map((ts) => (
            <option key={ts.name} value={ts.name}>
              {ts.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}