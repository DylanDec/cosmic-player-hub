import { Link, useLocation } from "react-router-dom";
import { Radio, Clock, Calendar, Headphones, Info, Menu, X } from "lucide-react";
import { useState } from "react";
import { radioConfig } from "@/config/radio";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home", icon: Radio },
  { to: "/recent", label: "Recent", icon: Clock },
  { to: "/schedule", label: "Schedule", icon: Calendar },
  { to: "/listen", label: "Listen", icon: Headphones },
  { to: "/about", label: "About", icon: Info },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
            <Radio className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg gradient-text hidden sm:inline">
            {radioConfig.stationName}
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "text-primary bg-primary/10 glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/30 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((l) => {
                const active = pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <l.icon className="w-4 h-4" />
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
