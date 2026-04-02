import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Loader2, Users } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { NowPlayingSkeleton } from "@/components/Skeletons";
import ErrorFallback from "@/components/ErrorFallback";
import { radioConfig } from "@/config/radio";
import Clock from "@/components/Clock";

export default function HomePage() {
  const { isPlaying, isBuffering, togglePlay } = useAudio();
  const { data, isLoading, isError } = useNowPlaying();

  const np = data?.now_playing;
  const song = np?.song;

  // Live-updating elapsed time between API polls
  const [localElapsed, setLocalElapsed] = useState(0);

  useEffect(() => {
    if (!np) return;
    setLocalElapsed(np.elapsed);
    const interval = setInterval(() => {
      setLocalElapsed((prev) => {
        const next = prev + 1;
        return np.duration > 0 ? Math.min(next, np.duration) : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [np?.elapsed, np?.duration]);

  const progress = np && np.duration > 0 ? (localElapsed / np.duration) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8 w-full max-w-md"
      >
        {/* Clock */}
        <Clock />

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
          <span className="text-sm font-medium text-primary text-glow-cyan uppercase tracking-widest">
            {data?.live?.is_live ? `Live — ${data.live.streamer_name}` : "Nu Live"}
          </span>
        </div>

        {isLoading ? (
          <NowPlayingSkeleton />
        ) : isError ? (
          <ErrorFallback />
        ) : (
          <>
            {/* Artwork */}
            <AnimatePresence mode="wait">
              <motion.div
                key={song?.art}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl"
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <img
                  src={song?.art || "/placeholder.svg"}
                  alt={song?.title || "Album art"}
                  className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl object-cover neon-border shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>

            {/* Track info */}
            <div className="text-center space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {song?.title || "Onbekend"}
              </h1>
              <p className="text-muted-foreground text-lg">{song?.artist || "—"}</p>
            </div>

            {/* Progress */}
            <div className="w-full space-y-1">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "linear" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(localElapsed)}</span>
                <span>{formatTime(np?.duration || 0)}</span>
              </div>
            </div>

            {/* Play button */}
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan"
            >
              {isBuffering ? (
                <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-10 h-10 text-primary-foreground" />
              ) : (
                <Play className="w-10 h-10 text-primary-foreground ml-1" />
              )}
            </motion.button>

            {/* Listeners */}
            {data?.listeners && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="w-4 h-4" />
                <span>{data.listeners.current} luisteraars</span>
              </div>
            )}
          </>
        )}

        <p className="text-xs text-muted-foreground/50 font-display tracking-wider uppercase">
          {radioConfig.stationTagline}
        </p>
      </motion.div>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
