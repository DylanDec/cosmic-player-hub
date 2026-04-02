import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Loader2, Users, Mic2 } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { useSchedule, ScheduleItem } from "@/hooks/useSchedule";
import { NowPlayingSkeleton } from "@/components/Skeletons";
import ErrorFallback from "@/components/ErrorFallback";
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 w-full max-w-lg"
      >
        {/* Show banner when live */}
        <AnimatePresence>
          {currentShow && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full rounded-2xl overflow-hidden"
            >
              <div className="glow-line" />
              <div
                className="px-5 py-4 flex items-center gap-4"
                style={{
                  background: "hsla(var(--card), 0.5)",
                  backdropFilter: "blur(24px)",
                  borderLeft: "1px solid hsla(var(--primary), 0.1)",
                  borderRight: "1px solid hsla(var(--primary), 0.1)",
                  borderBottom: "1px solid hsla(var(--primary), 0.1)",
                  borderRadius: "0 0 1rem 1rem",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "hsla(var(--primary), 0.08)",
                    border: "1px solid hsla(var(--primary), 0.12)",
                  }}
                >
                  <Mic2 className="w-5 h-5 text-primary/70" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary/40">
                    Nu live
                  </p>
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
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="text-[10px] font-mono font-medium text-primary uppercase tracking-[0.25em]">
            {data?.live?.is_live ? `Live — ${data.live.streamer_name}` : "On Air"}
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
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-6 rounded-3xl blur-[60px] opacity-30"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
                  animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.08, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <img
                  src={song?.art || "/placeholder.svg"}
                  alt={song?.title || "Album art"}
                  className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl object-cover shadow-2xl"
                  style={{
                    border: "1px solid hsla(var(--primary), 0.15)",
                    boxShadow: "0 16px 64px hsla(var(--background), 0.6), 0 0 80px hsla(var(--primary), 0.06)",
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Track info */}
            <div className="text-center space-y-0.5 mt-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {song?.title || "Onbekend"}
              </h1>
              <p className="text-base text-primary/60 font-medium">{song?.artist || "—"}</p>
            </div>

            {/* Progress */}
            <div className="w-full max-w-xs space-y-1.5">
              <div
                className="h-[3px] rounded-full overflow-hidden"
                style={{ background: "hsla(var(--foreground), 0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
                    transition: "width 0.8s linear",
                    boxShadow: "0 0 6px hsla(var(--primary), 0.2)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono tabular-nums text-muted-foreground/50">
                <span>{formatTime(localElapsed)}</span>
                <span>{formatTime(np?.duration || 0)}</span>
              </div>
            </div>

            {/* Play button */}
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
              style={{
                boxShadow: "0 0 30px hsla(var(--primary), 0.3), 0 0 80px hsla(var(--primary), 0.1)",
              }}
            >
              {isBuffering ? (
                <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground ml-0.5" />
              )}
            </motion.button>

            {/* Listeners */}
            {data?.listeners && (
              <div className="flex items-center gap-1.5 text-muted-foreground/40 text-xs font-mono">
                <Users className="w-3.5 h-3.5" />
                <span>{data.listeners.current} luisteraars</span>
              </div>
            )}
          </>
        )}

        <p className="text-[10px] text-muted-foreground/30 font-mono tracking-[0.2em] uppercase">
          {radioConfig.stationTagline}
        </p>
      </motion.div>
    </div>
  );
}
