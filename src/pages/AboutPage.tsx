import { motion } from "framer-motion";
import { Radio, Heart } from "lucide-react";
import { radioConfig } from "@/config/radio";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h1 className="font-display text-3xl font-bold gradient-text mb-2">Over Ons</h1>
            <p className="text-muted-foreground">{radioConfig.stationTagline}</p>
          </div>

          <div className="glass p-8 rounded-2xl neon-border space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan mx-auto">
              <Radio className="w-8 h-8 text-primary-foreground" />
            </div>

            <div className="text-center space-y-4">
              <h2 className="font-display text-2xl font-bold text-foreground">{radioConfig.stationName}</h2>
              <p className="text-muted-foreground leading-relaxed">{radioConfig.stationDescription}</p>
              <p className="text-muted-foreground leading-relaxed">
                Ons station draait 24 uur per dag, 7 dagen per week de beste muziek. Of je nu aan het werk bent,
                studeert, of gewoon wilt ontspannen — wij hebben de perfecte soundtrack voor elk moment.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border/30">
              <span>Gemaakt met</span>
              <Heart className="w-4 h-4 text-secondary fill-secondary" />
              <span>voor muziekliefhebbers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
