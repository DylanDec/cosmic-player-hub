export const radioConfig = {
  stationName: "NeonWave Radio",
  stationTagline: "Streaming the Future",
  stationDescription:
    "NeonWave Radio is een online radiostation gewijd aan de beste muziek, 24/7 live voor jou.",

  // AzuraCast API endpoints
  azuracastApiUrl: "http://192.168.50.25/api/nowplaying/test",
  azuracastScheduleUrl: "http://192.168.50.25/api/station/test/schedule",

  // Direct stream URL (Icecast/Shoutcast)
  streamUrl: "http://192.168.50.25/listen/test/radio.mp3",

  // Alternative streams (different qualities)
  streams: [
    { label: "MP3 128kbps", url: "http://192.168.50.25/listen/test/radio.mp3", format: "mp3" },
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
export function nowPlayingUrl() {
  return radioConfig.azuracastApiUrl;
}

export function stationScheduleUrl() {
  return radioConfig.azuracastScheduleUrl;
}
