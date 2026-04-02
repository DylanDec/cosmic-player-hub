import { motion } from "framer-motion";
import { Play, Pause, Loader2, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { radioConfig } from "@/config/radio";

export default function ListenPage() {
  const { isPlaying, isBuffering, togglePlay, volume, setVolume, currentStreamIndex, switchStream, streams } = useAudio();
  const { data } = useNowPlaying();
  const song = data?.now_playing?.song;

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm glass p-8 rounded-2xl neon-border space-y-8"
      >
        {/* Artwork */}
        <div className="relative mx-auto w-48 h-48">
          <div className="absolute -inset-3 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-xl" />
          <img
            src={song?.art || "/placeholder.svg"}
            alt={song?.title || "Album art"}
            className="relative w-full h-full rounded-2xl object-cover"
          />
        </div>

        {/* Info */}
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-foreground truncate">{song?.title || "Offline"}</h2>
          <p className="text-muted-foreground truncate">{song?.artist || "—"}</p>
        </div>

        {/* Big play button */}
        <div className="flex justify-center">
          <button
            onClick={togglePlay}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan transition-all hover:scale-110 active:scale-95"
          >
            {isBuffering ? (
              <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-12 h-12 text-primary-foreground" />
            ) : (
              <Play className="w-12 h-12 text-primary-foreground ml-1" />
            )}
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <button onClick={() => setVolume(volume > 0 ? 0 : 0.75)} className="text-muted-foreground hover:text-foreground transition-colors">
            {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-primary"
          />
        </div>

        {/* Stream selector */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Kwaliteit</p>
          <div className="grid gap-2">
            {streams.map((s, i) => (
              <button
                key={i}
                onClick={() => switchStream(i)}
                className={`text-sm px-3 py-2 rounded-lg transition-all ${
                  currentStreamIndex === i
                    ? "bg-primary/20 text-primary neon-border"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
