import { motion } from "framer-motion";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { TrackListSkeleton } from "@/components/Skeletons";
import ErrorFallback from "@/components/ErrorFallback";

export default function RecentPage() {
  const { data, isLoading, isError } = useNowPlaying();
  const history = data?.song_history || [];

  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">Recent Gespeeld</h1>
          <p className="text-muted-foreground mb-8">De laatste nummers op de radio.</p>
        </motion.div>

        {isLoading ? (
          <TrackListSkeleton count={10} />
        ) : isError ? (
          <ErrorFallback />
        ) : history.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Geen geschiedenis beschikbaar.</p>
        ) : (
          <div className="space-y-2">
            {history.map((item, i) => (
              <motion.div
                key={`${item.played_at}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 glass rounded-xl hover:bg-muted/30 transition-colors"
              >
                <img
                  src={item.song.art || "/placeholder.svg"}
                  alt={item.song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{item.song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.song.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(item.played_at * 1000).toLocaleTimeString("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
