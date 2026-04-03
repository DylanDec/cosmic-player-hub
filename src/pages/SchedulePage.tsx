import { motion } from "framer-motion";
import { Calendar, Radio } from "lucide-react";
import { useSchedule } from "@/hooks/useSchedule";
import { TrackListSkeleton } from "@/components/Skeletons";
import ErrorFallback from "@/components/ErrorFallback";

export default function SchedulePage() {
  const { data: schedule, isLoading, isError } = useSchedule();

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 relative z-10">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">Programma</h1>
          <p className="text-muted-foreground mb-8">Bekijk het schema van onze shows.</p>
        </motion.div>

        {isLoading ? (
          <TrackListSkeleton count={5} />
        ) : isError ? (
          <ErrorFallback message="Kan het programma niet laden." />
        ) : !schedule || schedule.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Geen geplande shows gevonden.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.map((item, i) => {
              const start = new Date(item.start);
              const end = new Date(item.end);
              return (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 glass rounded-xl transition-all ${
                    item.is_now ? "neon-border glow-cyan" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-foreground truncate">
                          {item.name || item.title}
                        </h3>
                        {item.is_now && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                            NU
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {start.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                        {" — "}
                        {end.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
