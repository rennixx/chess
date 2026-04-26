<div align="center">

# ♟ chess.krd

**The chess app built for Kurdistan.**

A dark, immersive, Spotify-inspired mobile chess platform with offline-first architecture,
3-tier AI, and full Kurdish localization (Sorani + Kurmanji).

[![Built with Expo](https://img.shields.io/badge/Expo-SDK%2054-black?style=flat-square&logo=expo)](https://expo.dev)
[![Go Backend](https://img.shields.io/badge/Go-1.22-00ADD8?style=flat-square&logo=go)](https://go.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Why chess.krd?

Chess is universal. Language shouldn't be a barrier. chess.krd brings a premium chess experience
to Kurdish-speaking players — built from the ground up with **offline-first** architecture for
regions with unstable connectivity, and optimized for the **low-end Android devices** most common
in the region.

No "Kurdish? sorry, not supported." No constant internet requirement. No bloated UI.
Just chess, in your language, on your phone.

---

## Features

**Offline-first**
- Play against AI without internet — the engine runs entirely on-device
- Games auto-save to SQLite and sync when you reconnect
- Puzzle packs available offline

**3-Tier AI Opponent**
- **Easy** — random legal moves (learn the basics)
- **Medium** — material evaluation with capture/check priority
- **Hard** — minimax with alpha-beta pruning (depth 3 + piece-square tables)

**Spotify-Inspired Dark UI**
- Near-black immersive theme (`#121212`)
- Pill buttons, rounded cards, heavy shadows
- Your games glow against the darkness — content-first design

**Kurdish Localization**
- English (default)
- سۆرانی (Sorani — Central Kurdish, RTL)
- Kurmancî (Kurmanji — Northern Kurdish)
- Instant language switching in settings

**Responsive Design**
- Bottom tabs on mobile, sidebar on tablet/desktop
- Board scales to any screen size
- 60fps target on low-end devices

**Async Multiplayer**
- Turn-based HTTP gameplay — no need to be online simultaneously
- Server-authoritative move validation
- Play at your own pace

---

## Screenshots

> *Coming soon — the app is in active development.*

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | Expo SDK 54 · React Native · TypeScript |
| **State** | Zustand · SQLite (expo-sqlite) |
| **Styling** | NativeWind (Tailwind CSS) |
| **Chess Logic** | chess.js (validation) · Custom AI engine |
| **Backend** | Go 1.22 · Chi router · PostgreSQL · Redis |
| **Auth** | JWT (access + refresh tokens) |
| **Real-time** | WebSockets (post-MVP) |
| **i18n** | i18n-js · expo-localization |

---

## Getting Started

### Prerequisites
- Node.js 22+
- Go 1.22+ (for backend)
- PostgreSQL (for backend)
- Expo Go app on your phone (for development)

### Frontend

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone, or press `w` to open in browser.

### Backend

```bash
# Set up PostgreSQL
createdb chesskrd

# Run migrations
psql chesskrd < db/migrations/001_init.sql

# Start the server
go mod tidy
go run cmd/api/main.go
```

---

## Project Structure

```
app/src/
├── components/       Board, Square, Piece, PillButton, Card
├── state/            gameStore, puzzleStore, userStore, settingsStore
├── engine/           AI engine (easy/medium/hard)
├── features/         Screens organized by feature
│   ├── auth/         Login, Register
│   ├── game/         GameScreen, GameSetup
│   ├── puzzles/      PuzzleScreen
│   ├── profile/      Profile, Settings
│   └── home/         HomeScreen
├── navigation/       Responsive tabs + sidebar
├── core/             API client, SQLite, i18n
├── hooks/            useGame, useResponsive
└── utils/            Design tokens, constants

cmd/api/              Go server entry point
internal/             Auth, game, puzzle services
pkg/models/           Shared data models
db/migrations/        SQL migrations
```

---

## Roadmap

- [x] **Phase 1 — MVP** · Board UI + AI + puzzles + auth + async play
- [ ] **Phase 2 — Beta** · Backend deployment + leaderboards + onboarding
- [ ] **Phase 3 — Real-Time** · WebSocket multiplayer + matchmaking
- [ ] **Phase 4 — Community** · Tournaments + clubs + social features
- [ ] **Phase 5 — Anti-Cheat** · Engine correlation + behavior analysis

---

## Contributing

This project welcomes contributions. Whether it's a bug fix, a new feature, or
improving Kurdish translations — all contributions matter.

1. Fork the repo
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ♟ for Kurdistan**

[Report a Bug](https://github.com/rennixx/chess/issues) · [Request a Feature](https://github.com/rennixx/chess/issues) · [Contribute](https://github.com/rennixx/chess/pulls)

</div>
