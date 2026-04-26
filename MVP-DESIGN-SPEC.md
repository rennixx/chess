# MVP Design Spec — chess.krd Phase 1

## 1. Approach

Expo managed workflow + `chess.js` for rules/move validation. No Stockfish in MVP — AI opponent uses tiered logic (random, material eval, minimax). NativeWind (Tailwind) for styling. Zustand for state. SQLite for offline persistence.

Stockfish WASM deferred to Phase 3. Server-side engine deferred to Phase 2.

---

## 2. Screen Map & Navigation

**4 bottom tabs on mobile, sidebar on >= 768px:**

| Tab | Screens |
|-----|---------|
| Home | HomeScreen — greeting, quick actions (New Game, Continue, Daily Puzzle), recent games, rating card |
| Play | GameSetupScreen — choose color, difficulty, time control |
|     | GameScreen — chess board + controls, used for AI and async games |
| Puzzles | PuzzleScreen — puzzle board, attempt tracking, solution reveal |
| Profile | ProfileScreen — rating, stats, game history, settings link |
|        | SettingsScreen — language toggle, board theme preferences |

Auth flow (modal, pre-tabs): LoginScreen, RegisterScreen. "Play Offline" skips auth.

Navigation: React Navigation bottom tabs + stack navigators per tab. Responsive layout switches tabs to sidebar at 768px breakpoint.

---

## 3. Chess Board Component

**Rendering:**
- 8x8 grid, flat solid-color squares
- Light squares: `#b7c0d8`, Dark squares: `#779556`
- Coordinates (a-h, 1-8) along edges, `#b3b3b3`, 10px

**Pieces:**
- Existing SVGs from `/icons/` directory (cburnett-style, 45x45 viewBox)
- Rendered via `react-native-svg`
- Dark pieces: `#000000` fill with white detail lines
- Light pieces: `#ffffff` fill with black stroke

**Interactions:**
- Tap to select piece, tap destination to move
- Legal moves: green dots (`#1ed760` 40% opacity) on empty squares, green rings on capturable squares
- Last move highlight: source + destination squares tinted `#1ed760` at 15% opacity
- Check indicator: king square gets red glow (`#f3727f` at 30% opacity)
- Drag-to-move: post-MVP

**Controls bar (below board):**
- Pill buttons: New Game, Undo, Flip Board
- Move history: horizontal scrollable PGN notation above controls
- Player info bars (above/below board): avatar circle, username, captured pieces, timer

**State:**
- `chess.js` instance in Zustand store
- Each move updates store → board re-renders
- State serialized as FEN for SQLite persistence

---

## 4. Data Models & State

**gameStore:**
- chessInstance, fen, moveHistory[], gameStatus, playerColor, gameMode
- Actions: makeMove, undoMove, newGame, resignGame, flipBoard

**puzzleStore:**
- currentPuzzle, attempts, solved
- Actions: loadPuzzle, attemptMove, showSolution, nextPuzzle

**userStore:**
- user (id, username, rating, preferences), token, isAuthenticated
- Actions: login, register, logout, updateRating

**settingsStore:**
- language ('en' | 'sorani' | 'kurmanji'), boardTheme
- Actions: setLanguage, setBoardTheme

**SQLite tables:**
- games: id, fen, pgn, moves_json, mode, status, created_at, updated_at
- puzzles: id, fen, solution_json, theme, difficulty, attempts, solved

---

## 5. AI Opponent (MVP)

Three difficulty levels:

| Level | Strategy | Target Player |
|-------|----------|---------------|
| Easy | Random legal move | Complete beginners |
| Medium | 1-ply material evaluation (captures > checks > random) | Casual players |
| Hard | Minimax + alpha-beta pruning (depth 2-3) with piece-square tables | Intermediate players |

AI runs in setTimeout to keep UI responsive. Artificial 300-500ms "thinking" delay. Difficulty set at game setup, stored in gameStore.

---

## 6. API & Async Gameplay

**Go backend (Chi router):**

Auth:
- POST /auth/register → { user, token, refreshToken }
- POST /auth/login → { user, token, refreshToken }
- POST /auth/refresh → { token, refreshToken }

Games:
- POST /games → create async game
- GET /games → list user's games
- GET /games/:id → full game state
- POST /games/:id/move → submit move (server validates with chess.js)

Puzzles:
- GET /puzzles/daily → today's puzzle
- GET /puzzles?theme=&difficulty= → browse
- POST /puzzles/:id/attempt → submit attempt

Profile:
- GET /users/me → profile + rating
- PATCH /users/me → update preferences

**Async game flow:** Player opens game from home → board loads with opponent's last move highlighted → player makes move (POST) → server validates + persists → returns updated FEN. If vs async AI, server responds with AI move immediately.

**Offline handling:** Moves queue in SQLite, sync on reconnect with retry + idempotency keys. Server is source of truth.

**Auth:** Optional on first launch. "Play Offline" skips auth. JWT in AsyncStorage, auto-refreshed.

---

## 7. Localization

**Languages:**
- English — primary, default
- Sorani — secondary, RTL
- Kurmanji — tertiary, Latin script

Device locale detection on first launch (expo-localization). User can override in Settings.

RTL: layout mirrors for Sorani except board coordinates (a-h stays LTR). React Native I18nManager handles RTL.

Translation scope: UI labels, game status (check/checkmate/stalemate), settings, auth, piece names for accessibility. PGN notation stays universal.

```
/i18n
  /locales
    sorani.json
    kurmanji.json
    en.json
```

---

## 8. Project Structure

```
/app
  /src
    /core
      /api          # Axios instance, endpoints, interceptors
      /storage      # SQLite helpers, AsyncStorage wrappers
      /i18n         # i18n-js setup, locale JSONs
      /engine       # AI logic (random, material, minimax)

    /features
      /auth         # LoginScreen, RegisterScreen
      /game         # GameScreen, GameSetupScreen, board components
      /puzzles      # PuzzleScreen, puzzle logic
      /profile      # ProfileScreen, SettingsScreen

    /components     # Shared UI (Board, Piece, Button, Card)
    /navigation     # Tab/stack navigators, responsive layout
    /state          # Zustand stores
    /hooks          # useGame, usePuzzle, useBoard
    /utils          # helpers, constants

  App.tsx
  app.json

/icons             # Existing SVG chess pieces
```

**Build order:**
1. App.tsx — navigation shell with responsive layout
2. /components/Board.tsx — chess board rendering
3. /state/gameStore.ts — chess.js + Zustand
4. /engine/ai.ts — AI move selection
5. /features/game/GameScreen.tsx — integration
6. /features/auth — login/register flow
7. /features/puzzles — puzzle system
8. /features/profile — profile + settings
9. /core/api — backend integration
10. /core/i18n — localization
