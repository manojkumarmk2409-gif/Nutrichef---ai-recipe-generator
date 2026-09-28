import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock, Volume2, X } from "lucide-react";

export default function CookingTimer({ initialMinutes = 15, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasFinished(true);
            try {
              // Beep notification using Web Audio API
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.8);
            } catch (e) {
              // audio context fallback
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const toggleRun = () => setIsRunning(!isRunning);
  const resetTimer = (mins = initialMinutes) => {
    setIsRunning(false);
    setHasFinished(false);
    setSecondsLeft(mins * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = Math.max(0, 100 - (secondsLeft / (initialMinutes * 60)) * 100);

  return (
    <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 relative overflow-hidden bg-slate-900/90 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
          <Clock className="w-4 h-4 animate-spin-slow" />
          <span>Active Kitchen Timer</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center py-2">
        <div
          className={`font-mono text-4xl font-extrabold tracking-wider ${
            hasFinished ? "text-amber-400 animate-pulse" : "text-white"
          }`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        {hasFinished && (
          <p className="text-xs text-amber-400 font-bold mt-1 animate-bounce flex items-center space-x-1">
            <Volume2 className="w-3.5 h-3.5 mr-1" /> Cooking Time Complete!
          </p>
        )}

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={toggleRun}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              isRunning
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> <span>{secondsLeft === 0 ? "Restart" : "Start"}</span>
              </>
            )}
          </button>

          <button
            onClick={() => resetTimer(initialMinutes)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-1 mt-3">
          {[5, 10, 15, 25, 40].map((mins) => (
            <button
              key={mins}
              onClick={() => resetTimer(mins)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition ${
                initialMinutes === mins
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200"
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
