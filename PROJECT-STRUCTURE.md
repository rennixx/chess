# PROJECT-STRUCTURE.md — Project Structure

## 1. Overview

Structure optimized for Expo (React Native) frontend and Go backend, emphasizing modularity and scalability.

---

## 2. Frontend Structure (Expo / React Native)

```id="expostruct"
/app
  /src
    /core
      /api        // networking layer
      /storage    // AsyncStorage + SQLite
      /engine     // Stockfish WASM integration
      /i18n       // localization

    /features
      /auth
      /game
      /puzzles
      /profile
      /leaderboard

    /components
    /screens
    /navigation

    /state       // Zustand stores
    /hooks
    /utils

  App.tsx
  app.json
```

---

## 3. Backend Structure (Go)

```id="gostruct"
/cmd
  /api
    main.go

/internal
  /auth
  /game
  /matchmaking
  /rating
  /anticheat

/pkg
  /models
  /engine
  /utils

/api
  /handlers
  /middleware

/config
/db
  /migrations
```

---

## 4. Infrastructure

```id="infra2"
/infra
  /docker
  /k8s
  /terraform
```

---

## 5. Key Principles

* Feature-based frontend architecture
* Clean separation (client vs server authority)
* Reusable logic modules
* Offline-first design
