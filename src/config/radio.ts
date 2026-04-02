export const radioConfig = {
  stationName: "NeonWave Radio",
  stationTagline: "Streaming the Future",
  stationDescription:
    "NeonWave Radio is een online radiostation gewijd aan de beste muziek, 24/7 live voor jou.",

  // AzuraCast API
  azuracastBaseUrl: "https://demo.azuracast.com",
  azuracastStationId: "1",

  // Direct stream URL (Icecast/Shoutcast)
  streamUrl: "https://demo.azuracast.com/radio/8000/radio.mp3",

  // Alternative streams (different qualities)
  streams: [
    { label: "MP3 320kbps", url: "https://demo.azuracast.com/radio/8000/radio.mp3", format: "mp3" },
    { label: "MP3 128kbps", url: "https://demo.azuracast.com/radio/8010/radio.mp3", format: "mp3" },
    { label: "AAC 64kbps", url: "https://demo.azuracast.com/radio/8020/radio.aac", format: "aac" },
  ],

  // Polling intervals (ms)
  nowPlayingPollInterval: 10_000,
  recentlyPlayedPollInterval: 30_000,

  // Social links
  social: {
    discord: "#",
    instagram: "#",
    twitter: "#",
  },
};

// API helpers
export function apiUrl(path: string) {
  return `${radioConfig.azuracastBaseUrl}/api${path}`;
}

export function nowPlayingUrl() {
  return apiUrl(`/nowplaying/${radioConfig.azuracastStationId}`);
}

export function stationHistoryUrl() {
  return apiUrl(`/station/${radioConfig.azuracastStationId}/history`);
}

export function stationScheduleUrl() {
  return apiUrl(`/station/${radioConfig.azuracastStationId}/schedule`);
}
