import { useState, useEffect } from "react";
import { Play, Pause, Loader2, Volume2, VolumeX, Clock } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { motion, AnimatePresence } from "framer-motion";

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function MiniPlayer() {
  const { isPlaying, isBuffering, togglePlay, volume, setVolume } = useAudio();
  const { data } = useNowPlaying();
  const time = useClock();

  const song = data?.now_playing?.song;
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glow line */}
      <div className="glow-line" />

      <div
        style={{
          background: "hsla(var(--card), 0.7)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid hsla(var(--primary), 0.08)",
        }}
      >
        <div className="container flex items-center gap-3 h-16 px-4">
          {/* Clock */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2 shrink-0">
            <Clock className="w-3.5 h-3.5 text-primary/40" />
            <span className="text-sm font-mono tabular-nums text-foreground/60 tracking-wide">
              {hours}
              <span className="text-primary/50 animate-pulse">:</span>
              {minutes}
            </span>
          </div>

          {/* Artwork */}
          <AnimatePresence mode="wait">
            {song?.art && (
              <motion.img
                key={song.art}
                src={song.art}
                alt={song.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-10 h-10 rounded-md object-cover shrink-0"
                style={{ border: "1px solid hsla(var(--primary), 0.12)" }}
              />
            )}
          </AnimatePresence>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">
              {song?.title || "Offline"}
            </p>
            <p className="text-xs text-muted-foreground/50 truncate">
              {song?.artist || "—"}
            </p>
          </div>

          {/* Volume (desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.75)}
              className="text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-primary"
            />
          </div>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{
              boxShadow: "0 0 20px hsla(var(--primary), 0.25)",
            }}
          >
            {isBuffering ? (
              <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
