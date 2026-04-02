# NeonWave Radio

Een moderne webradio applicatie met real-time AzuraCast API integratie, gebouwd met React, TypeScript en TailwindCSS.

![Dark Theme](https://img.shields.io/badge/theme-dark-black) ![React](https://img.shields.io/badge/React-18-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## ✨ Features

- **Live player** met now playing info, artwork en progress bar
- **Recently Played** overzicht met auto-refresh
- **Schedule** pagina met live show indicator
- **Dedicated luisterpagina** met stream quality selector
- **Persistent audio** — muziek speelt door tijdens navigatie
- **Glassmorphism UI** met neon accenten en sterren-animatie
- **Responsive** mobile-first design
- **Volume opslag** in localStorage
- **Auto-reconnect** bij stream drops

## 📄 Pagina's

| Route | Beschrijving |
|-------|-------------|
| `/` | Homepage met live player en now playing |
| `/recent` | Laatst gespeelde nummers |
| `/schedule` | Geplande shows |
| `/listen` | Dedicated player met quality selector |
| `/about` | Over het radiostation |

## 🚀 Snel starten

### Development

```bash
npm install
npm run dev
```

De app draait op `http://localhost:8080`.

### Docker Compose

```bash
docker compose up -d
```

De app draait op `http://localhost:3000`.

## ⚙️ Configuratie

Alle instellingen staan in `src/config/radio.ts`:

```ts
export const radioConfig = {
  stationName: "NeonWave Radio",
  azuracastBaseUrl: "https://demo.azuracast.com",
  azuracastStationId: "1",
  streamUrl: "https://demo.azuracast.com/radio/8000/radio.mp3",
  streams: [
    { label: "MP3 320kbps", url: "...", format: "mp3" },
    { label: "MP3 128kbps", url: "...", format: "mp3" },
  ],
  nowPlayingPollInterval: 10_000,
  // ...
};
```

Pas de `azuracastBaseUrl`, `azuracastStationId` en `streams` aan naar jouw AzuraCast instance.

## 📁 Projectstructuur

```
src/
├── components/       # UI componenten (Navbar, MiniPlayer, StarField, etc.)
├── config/           # Radio configuratie
├── context/          # AudioContext provider
├── hooks/            # Custom hooks (useAudioPlayer, useNowPlaying, useSchedule)
├── pages/            # Pagina componenten
└── lib/              # Utilities
```

## 🛠 Tech Stack

- **React 18** + **TypeScript**
- **Vite** als bundler
- **TailwindCSS** voor styling
- **TanStack Query** voor data fetching & polling
- **Framer Motion** voor animaties
- **Radix UI** + **shadcn/ui** voor componenten
- **Lucide React** voor iconen
