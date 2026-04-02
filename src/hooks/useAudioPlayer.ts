import { useState, useRef, useEffect, useCallback } from "react";
import { radioConfig } from "@/config/radio";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("radio-volume");
    return saved ? parseFloat(saved) : 0.75;
  });
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    audio.addEventListener("waiting", () => setIsBuffering(true));
    audio.addEventListener("playing", () => setIsBuffering(false));
    audio.addEventListener("error", () => {
      setIsBuffering(false);
      // Auto-reconnect after 3s
      setTimeout(() => {
        if (isPlaying && audioRef.current) {
          audioRef.current.src = radioConfig.streams[currentStreamIndex].url;
          audioRef.current.play().catch(() => {});
        }
      }, 3000);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    localStorage.setItem("radio-volume", String(volume));
  }, [volume]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.src = radioConfig.streams[currentStreamIndex].url;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [currentStreamIndex]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = "";
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const switchStream = useCallback((index: number) => {
    setCurrentStreamIndex(index);
    if (isPlaying && audioRef.current) {
      audioRef.current.src = radioConfig.streams[index].url;
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  return {
    isPlaying,
    isBuffering,
    volume,
    setVolume,
    togglePlay,
    play,
    pause,
    currentStreamIndex,
    switchStream,
    streams: radioConfig.streams,
  };
}
