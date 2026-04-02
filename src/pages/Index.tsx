import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Loader2, Users, Mic2 } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import ErrorFallback from "@/components/ErrorFallback";
import { useSchedule, ScheduleItem } from "@/hooks/useSchedule";
import { NowPlayingSkeleton } from "@/components/Skeletons";
import { radioConfig } from "@/config/radio";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatScheduleTime(isoString: string) {
  try {
    return new Date(isoString).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function useLocalElapsed(apiElapsed?: number, apiDuration?: number) {
  const [localElapsed, setLocalElapsed] = useState(0);
  useEffect(() => {
    if (apiElapsed === undefined) return;
    setLocalElapsed(apiElapsed);
    const interval = setInterval(() => {
      setLocalElapsed((prev) => {
        const next = prev + 1;
        return apiDuration && apiDuration > 0 ? Math.min(next, apiDuration) : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [apiElapsed, apiDuration]);
  return localElapsed;
}

export default function HomePage() {
  const { isPlaying, isBuffering, togglePlay } = useAudio();
  const { data, isLoading, isError } = useNowPlaying();
  const { data: schedule } = useSchedule();

  const np = data?.now_playing;
  const song = np?.song;
  const localElapsed = useLocalElapsed(np?.elapsed, np?.duration);
  const progress = np && np.duration > 0 ? (localElapsed / np.duration) * 100 : 0;
  const currentShow: ScheduleItem | undefined = schedule?.find((s) => s.is_now);

  // Show content even on error — just with fallback values
  const hasData = !!song;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 w-full max-w-md"
      >
        {/* Show banner when live */}
        <AnimatePresence>
          {currentShow && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full rounded-xl overflow-hidden glass"
            >
              <div className="glow-line" />
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/15 shrink-0">
                  <Mic2 className="w-4 h-4 text-primary/70" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary/50">Nu live</p>
                  <p className="text-sm font-bold text-foreground truncate">{currentShow.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/40">
                    {formatScheduleTime(currentShow.start)} — {formatScheduleTime(currentShow.end)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
          <span className="text-sm font-medium text-primary text-glow-cyan uppercase tracking-widest">
            {data?.live?.is_live ? `Live — ${data.live.streamer_name}` : "On Air"}
          </span>
        </div>

        {isLoading ? (
          <NowPlayingSkeleton />
        ) : isError ? (
          <>
            <ErrorFallback />
            {/* Still show play button on error */}
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
          </>
        ) : (
          <>
            {/* Artwork */}
            <AnimatePresence mode="wait">
              <motion.div
                key={song?.art || "placeholder"}
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
            {hasData && np!.duration > 0 && (
              <div className="w-full space-y-1">
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{
                      width: `${progress}%`,
                      transition: "width 0.8s linear",
                      boxShadow: "0 0 6px hsla(185, 100%, 50%, 0.2)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-mono tabular-nums">
                  <span>{formatTime(localElapsed)}</span>
                  <span>{formatTime(np!.duration)}</span>
                </div>
              </div>
            )}

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
