import { createContext, useContext, ReactNode } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

type AudioContextType = ReturnType<typeof useAudioPlayer>;

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();
  return <AudioContext.Provider value={player}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
