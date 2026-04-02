import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Loader2, Users, Radio } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { NowPlayingSkeleton } from "@/components/Skeletons";
import ErrorFallback from "@/components/ErrorFallback";
import { radioConfig } from "@/config/radio";

export default function HomePage() {
  const { isPlaying, isBuffering, togglePlay } = useAudio();
  const { data, isLoading, isError } = useNowPlaying();

  const np = data?.now_playing;
  const song = np?.song;
  const progress = np && np.duration > 0 ? (np.elapsed / np.duration) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8 w-full max-w-md"
      >
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
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
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
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(np?.elapsed || 0)}</span>
                <span>{formatTime(np?.duration || 0)}</span>
              </div>
            </div>

            {/* Play button */}
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan transition-all hover:scale-110 active:scale-95"
            >
              {isBuffering ? (
                <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-10 h-10 text-primary-foreground" />
              ) : (
                <Play className="w-10 h-10 text-primary-foreground ml-1" />
              )}
            </button>

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
