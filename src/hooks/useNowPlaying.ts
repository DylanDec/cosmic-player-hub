import { useQuery } from "@tanstack/react-query";
import { nowPlayingUrl, radioConfig } from "@/config/radio";

export interface NowPlayingSong {
  title: string;
  artist: string;
  album: string;
  art: string;
  elapsed: number;
  duration: number;
}

export interface NowPlayingData {
  station: { name: string };
  live: { is_live: boolean; streamer_name: string };
  now_playing: {
    played_at: number;
    duration: number;
    elapsed: number;
    remaining: number;
    song: {
      title: string;
      artist: string;
      album: string;
      art: string;
    };
  };
  listeners: { current: number };
  song_history: Array<{
    played_at: number;
    duration: number;
    song: {
      title: string;
      artist: string;
      album: string;
      art: string;
    };
  }>;
}

export function useNowPlaying() {
  return useQuery<NowPlayingData>({
    queryKey: ["nowPlaying"],
    queryFn: async () => {
      const res = await fetch(nowPlayingUrl());
      if (!res.ok) throw new Error("Failed to fetch now playing");
      return res.json();
    },
    refetchInterval: radioConfig.nowPlayingPollInterval,
    retry: 3,
  });
}
