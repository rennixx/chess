# chess.krd MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Phase 1 MVP of chess.krd — a mobile-first chess app with Spotify-inspired dark UI, offline AI play, puzzles, async multiplayer, and Kurdish localization.

**Architecture:** Expo managed workflow with chess.js for game logic, Zustand for state, NativeWind (Tailwind) for styling. Responsive navigation (bottom tabs mobile, sidebar on wide). Go/Chi backend for auth, async games, and puzzle delivery. SQLite for offline persistence.

**Tech Stack:** Expo SDK 52, TypeScript, chess.js, Zustand, NativeWind, react-native-svg, react-native-svg-transformer, expo-sqlite, React Navigation, i18n-js, Go 1.22, Chi router, PostgreSQL, Redis

---

## File Structure

```
/mnt/c/projects/chess.krd/
├── icons/                          # Existing SVG chess pieces
├── app/
│   ├── App.tsx                     # Entry point, imports global.css
│   ├── app.json                    # Expo config
│   ├── package.json
│   ├── tsconfig.json
│   ├── metro.config.js             # NativeWind + SVG transformer
│   ├── postcss.config.mjs          # PostCSS for Tailwind v4
│   ├── global.css                  # Tailwind imports
│   ├── jest.config.js
│   ├── babel.config.js
│   ├── nativewind-env.d.ts         # Auto-generated NativeWind types
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.tsx           # Chess board grid
│   │   │   ├── Square.tsx          # Individual square
│   │   │   ├── Piece.tsx           # SVG piece renderer
│   │   │   └── ui/
│   │   │       ├── PillButton.tsx  # Spotify-style pill button
│   │   │       └── Card.tsx        # Dark card container
│   │   ├── state/
│   │   │   ├── gameStore.ts        # chess.js + Zustand
│   │   │   ├── puzzleStore.ts      # Puzzle state
│   │   │   ├── userStore.ts        # Auth state
│   │   │   └── settingsStore.ts    # Preferences
│   │   ├── engine/
│   │   │   ├── ai.ts               # AI move selection (3 tiers)
│   │   │   └── evaluation.ts       # Board evaluation helpers
│   │   ├── features/
│   │   │   ├── game/
│   │   │   │   ├── GameScreen.tsx
│   │   │   │   └── GameSetupScreen.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   ├── puzzles/
│   │   │   │   └── PuzzleScreen.tsx
│   │   │   ├── profile/
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   └── SettingsScreen.tsx
│   │   │   └── home/
│   │   │       └── HomeScreen.tsx
│   │   ├── navigation/
│   │   │   ├── AppNavigator.tsx     # Tab + stack setup
│   │   │   └── Sidebar.tsx          # Wide-screen sidebar
│   │   ├── core/
│   │   │   ├── api/
│   │   │   │   ├── client.ts        # Axios instance
│   │   │   │   └── endpoints.ts     # API route definitions
│   │   │   ├── storage/
│   │   │   │   └── database.ts      # SQLite setup + queries
│   │   │   └── i18n/
│   │   │       ├── index.ts         # i18n-js config
│   │   │       └── locales/
│   │   │           ├── en.json
│   │   │           ├── sorani.json
│   │   │           └── kurmanji.json
│   │   ├── hooks/
│   │   │   ├── useGame.ts
│   │   │   └── useResponsive.ts     # Breakpoint hook
│   │   └── utils/
│   │       └── constants.ts         # Colors, sizes, design tokens
│   └── __tests__/
│       ├── engine/
│       │   └── ai.test.ts
│       └── state/
│           └── gameStore.test.ts
├── cmd/
│   └── api/
│       └── main.go                  # Go server entry point
├── internal/
│   ├── auth/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── middleware.go
│   ├── game/
│   │   ├── handler.go
│   │   └── service.go
│   └── puzzle/
│       ├── handler.go
│       └── service.go
├── pkg/
│   ├── models/
│   │   ├── user.go
│   │   ├── game.go
│   │   └── puzzle.go
│   └── chess/
│       └── validator.go             # Server-side chess.js equivalent (go-chess)
├── config/
│   └── config.go
└── db/
    └── migrations/
        └── 001_init.sql
```

---

## Task 1: Git Init + Expo Project Scaffold

**Files:**
- Create: `app/package.json`, `app/tsconfig.json`, `app/app.json`, `app/App.tsx`, `app/babel.config.js`

- [ ] **Step 1: Initialize git repo and connect remote**

```bash
cd /mnt/c/projects/chess.krd
git init
git remote add origin https://github.com/rennixx/chess.git
```

- [ ] **Step 2: Create Expo project in /app directory**

```bash
mkdir -p app/src && cd app
npx create-expo-app@latest . --template blank-typescript
```

If prompted to overwrite, accept. This creates `package.json`, `tsconfig.json`, `app.json`, `App.tsx`, `babel.config.js`.

- [ ] **Step 3: Install core dependencies**

```bash
cd /mnt/c/projects/chess.krd/app
npm install chess.js zustand @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-svg expo-sqlite expo-localization i18n-js axios react-native-safe-area-context react-native-screens
```

- [ ] **Step 4: Install dev dependencies**

```bash
npm install --save-dev nativewind @tailwindcss/postcss tailwindcss react-native-svg-transformer @testing-library/react-native @testing-library/jest-dom jest @types/jest ts-jest
```

- [ ] **Step 5: Create directory structure**

```bash
cd /mnt/c/projects/chess.krd/app
mkdir -p src/{components/ui,state,engine,features/{game,auth,puzzles,profile,home},navigation,core/{api,storage,i18n/locales},hooks,utils,__tests__/{engine,state}}
```

- [ ] **Step 6: Verify setup**

```bash
npx expo start --web
```

Expected: Expo dev server starts, blank app loads in browser. Stop after confirming.

- [ ] **Step 7: Commit**

```bash
cd /mnt/c/projects/chess.krd
echo -e "node_modules/\n.expo/\n.env" > .gitignore
git add .
git commit -m "chore: initialize Expo project with core dependencies"
```

---

## Task 2: NativeWind + SVG Configuration

**Files:**
- Create: `app/metro.config.js`, `app/postcss.config.mjs`, `app/global.css`, `app/nativewind-env.d.ts`, `app/custom.d.ts`

- [ ] **Step 1: Create metro.config.js (NativeWind + SVG transformer)**

```js
// app/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

module.exports = withNativewind(config, { input: "./global.css" });
```

- [ ] **Step 2: Create postcss.config.mjs**

```js
// app/postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 3: Create global.css**

```css
/* app/global.css */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";
```

- [ ] **Step 4: Create custom.d.ts for SVG imports**

```ts
// app/custom.d.ts
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
```

- [ ] **Step 5: Create nativewind-env.d.ts**

```ts
// app/nativewind-env.d.ts
/// <reference types="nativewind/types" />
```

- [ ] **Step 6: Update App.tsx to import global.css and verify NativeWind**

```tsx
// app/App.tsx
import { Text, View } from "react-native";
import "./global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <Text className="text-white text-xl font-bold">
        chess.krd
      </Text>
    </View>
  );
}
```

- [ ] **Step 7: Verify NativeWind + SVG work**

```bash
cd /mnt/c/projects/chess.krd/app
npx expo start --web
```

Expected: Dark background (#121212) with white "chess.krd" text. Stop after confirming.

- [ ] **Step 8: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "chore: configure NativeWind, PostCSS, and SVG transformer"
```

---

## Task 3: Design Tokens + Constants

**Files:**
- Create: `app/src/utils/constants.ts`

- [ ] **Step 1: Create constants.ts with all design system tokens**

```ts
// app/src/utils/constants.ts
export const Colors = {
  accent: "#1ed760",
  accentDark: "#1db954",
  background: "#121212",
  surface: "#181818",
  surfaceMid: "#1f1f1f",
  cardElevated: "#252525",
  textPrimary: "#ffffff",
  textSecondary: "#b3b3b3",
  textMuted: "#cbcbcb",
  negative: "#f3727f",
  warning: "#ffa42b",
  info: "#539df5",
  boardLight: "#b7c0d8",
  boardDark: "#779556",
  lastMove: "rgba(30, 215, 96, 0.15)",
  legalMove: "rgba(30, 215, 96, 0.4)",
  check: "rgba(243, 114, 127, 0.3)",
  border: "#4d4d4d",
  borderLight: "#7c7c7c",
} as const;

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, "2xl": 24, "3xl": 32,
} as const;

export const Radius = {
  sm: 4, md: 6, lg: 8, xl: 12, pill: 9999, circle: 9999 / 2,
} as const;

export const Typography = {
  title: { fontSize: 24, fontWeight: "700" as const },
  heading: { fontSize: 18, fontWeight: "600" as const },
  bodyBold: { fontSize: 16, fontWeight: "700" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  button: { fontSize: 14, fontWeight: "700" as const, textTransform: "uppercase" as const, letterSpacing: 1.4 },
  nav: { fontSize: 14, fontWeight: "700" as const },
  caption: { fontSize: 14, fontWeight: "400" as const },
  small: { fontSize: 12, fontWeight: "400" as const },
} as const;

export const Shadows = {
  heavy: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 16 },
  medium: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
} as const;

export const BREAKPOINT_TABLET = 768;
export const AI_THINK_DELAY = 400;
```

- [ ] **Step 2: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add design system tokens and constants"
```

---

## Task 4: Zustand Stores

**Files:**
- Create: `app/src/state/gameStore.ts`, `app/src/state/puzzleStore.ts`, `app/src/state/userStore.ts`, `app/src/state/settingsStore.ts`
- Test: `app/src/__tests__/state/gameStore.test.ts`

- [ ] **Step 1: Write failing test for gameStore**

```ts
// app/src/__tests__/state/gameStore.test.ts
import { useGameStore } from "../../state/gameStore";

describe("gameStore", () => {
  beforeEach(() => {
    useGameStore.getState().newGame("w", "ai", "medium");
  });

  it("starts with default FEN", () => {
    const { fen } = useGameStore.getState();
    expect(fen).toContain("rnbqkbnr/pppppppp");
  });

  it("makes a legal move and updates FEN", () => {
    const store = useGameStore.getState();
    const result = store.makeMove({ from: "e2", to: "e4" });
    expect(result).toBe(true);
    expect(useGameStore.getState().moveHistory).toContain("e4");
  });

  it("rejects an illegal move", () => {
    const store = useGameStore.getState();
    const result = store.makeMove({ from: "e2", to: "e5" });
    expect(result).toBe(false);
  });

  it("undoes last move", () => {
    useGameStore.getState().makeMove({ from: "e2", to: "e4" });
    useGameStore.getState().undoMove();
    const { moveHistory, fen } = useGameStore.getState();
    expect(moveHistory).toHaveLength(0);
    expect(fen).toContain("rnbqkbnr/pppppppp");
  });

  it("detects checkmate", () => {
    // Scholar's mate
    const moves = [
      { from: "e2", to: "e4" },
      { from: "e7", to: "e5" },
      { from: "d1", to: "h5" },
      { from: "b8", to: "c6" },
      { from: "f1", to: "c4" },
      { from: "g8", to: "f6" },
      { from: "h5", to: "f7" },
    ];
    moves.forEach((m) => useGameStore.getState().makeMove(m));
    expect(useGameStore.getState().gameStatus).toBe("checkmate");
  });

  it("resigns the game", () => {
    useGameStore.getState().resignGame();
    expect(useGameStore.getState().gameStatus).toBe("resigned");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /mnt/c/projects/chess.krd/app && npx jest __tests__/state/gameStore.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create gameStore.ts**

```ts
// app/src/state/gameStore.ts
import { create } from "zustand";
import { Chess, Square } from "chess.js";

export type GameStatus = "playing" | "checkmate" | "stalemate" | "draw" | "resigned";
export type GameMode = "ai" | "async" | "local";
export type Difficulty = "easy" | "medium" | "hard";

interface MoveInput {
  from: string;
  to: string;
  promotion?: string;
}

interface GameState {
  chess: Chess;
  fen: string;
  moveHistory: string[];
  gameStatus: GameStatus;
  playerColor: "w" | "b";
  gameMode: GameMode;
  difficulty: Difficulty;
  isBoardFlipped: boolean;
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
}

interface GameActions {
  newGame: (color: "w" | "b", mode: GameMode, difficulty: Difficulty) => void;
  makeMove: (move: MoveInput) => boolean;
  undoMove: () => void;
  resignGame: () => void;
  flipBoard: () => void;
  selectSquare: (square: string | null) => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  chess: new Chess(),
  fen: new Chess().fen(),
  moveHistory: [],
  gameStatus: "playing",
  playerColor: "w",
  gameMode: "ai",
  difficulty: "medium",
  isBoardFlipped: false,
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,

  newGame: (color, mode, difficulty) => {
    const chess = new Chess();
    set({
      chess,
      fen: chess.fen(),
      moveHistory: [],
      gameStatus: "playing",
      playerColor: color,
      gameMode: mode,
      difficulty,
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
    });
  },

  makeMove: ({ from, to, promotion }) => {
    const state = get();
    if (state.gameStatus !== "playing") return false;
    try {
      const move = state.chess.move({ from, to, promotion });
      const newStatus = deriveStatus(state.chess);
      set({
        fen: state.chess.fen(),
        moveHistory: [...state.moveHistory, move.san],
        gameStatus: newStatus,
        selectedSquare: null,
        legalMoves: [],
        lastMove: { from, to },
      });
      return true;
    } catch {
      return false;
    }
  },

  undoMove: () => {
    const state = get();
    if (state.moveHistory.length === 0) return;
    state.chess.undo();
    const history = state.chess.history();
    const lastMove = history.length > 0
      ? getLastMove(state.chess)
      : null;
    set({
      fen: state.chess.fen(),
      moveHistory: history,
      gameStatus: deriveStatus(state.chess),
      selectedSquare: null,
      legalMoves: [],
      lastMove,
    });
  },

  resignGame: () => set({ gameStatus: "resigned" }),

  flipBoard: () => set((s) => ({ isBoardFlipped: !s.isBoardFlipped })),

  selectSquare: (square) => {
    const state = get();
    if (!square) {
      set({ selectedSquare: null, legalMoves: [] });
      return;
    }
    const moves = state.chess.moves({ square, verbose: true });
    if (moves.length > 0) {
      set({ selectedSquare: square, legalMoves: moves.map((m) => m.to) });
    } else {
      set({ selectedSquare: null, legalMoves: [] });
    }
  },
}));

function deriveStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return "checkmate";
  if (chess.isStalemate()) return "stalemate";
  if (chess.isDraw()) return "draw";
  return "playing";
}

function getLastMove(chess: Chess): { from: string; to: string } | null {
  const history = chess.history({ verbose: true });
  if (history.length === 0) return null;
  const last = history[history.length - 1];
  return { from: last.from, to: last.to };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /mnt/c/projects/chess.krd/app && npx jest __tests__/state/gameStore.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Create puzzleStore.ts**

```ts
// app/src/state/puzzleStore.ts
import { create } from "zustand";
import { Chess } from "chess.js";

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  theme: string;
  difficulty: "easy" | "medium" | "hard";
}

interface PuzzleState {
  currentPuzzle: Puzzle | null;
  chess: Chess | null;
  attempts: number;
  solved: boolean;
  solutionIndex: number;
}

interface PuzzleActions {
  loadPuzzle: (puzzle: Puzzle) => void;
  attemptMove: (from: string, to: string) => boolean;
  showSolution: () => string | null;
  nextPuzzle: () => void;
}

export const usePuzzleStore = create<PuzzleState & PuzzleActions>((set, get) => ({
  currentPuzzle: null,
  chess: null,
  attempts: 0,
  solved: false,
  solutionIndex: 0,

  loadPuzzle: (puzzle) => {
    const chess = new Chess(puzzle.fen);
    set({
      currentPuzzle: puzzle,
      chess,
      attempts: 0,
      solved: false,
      solutionIndex: 0,
    });
  },

  attemptMove: (from, to) => {
    const state = get();
    if (!state.currentPuzzle || !state.chess) return false;
    const expectedMove = state.currentPuzzle.solution[state.solutionIndex];
    try {
      const move = state.chess.move({ from, to });
      if (move.san === expectedMove) {
        const nextIndex = state.solutionIndex + 1;
        const isSolved = nextIndex >= state.currentPuzzle.solution.length;
        // If not fully solved, play the response move
        if (!isSolved) {
          const responseMove = state.currentPuzzle.solution[nextIndex];
          state.chess.move(responseMove);
        }
        set({
          chess: state.chess,
          attempts: state.attempts + 1,
          solved: isSolved,
          solutionIndex: isSolved ? nextIndex : nextIndex + 1,
        });
        return true;
      } else {
        state.chess.undo();
        set({ attempts: state.attempts + 1 });
        return false;
      }
    } catch {
      set({ attempts: state.attempts + 1 });
      return false;
    }
  },

  showSolution: () => {
    const state = get();
    if (!state.currentPuzzle) return null;
    return state.currentPuzzle.solution[state.solutionIndex] ?? null;
  },

  nextPuzzle: () => set({ currentPuzzle: null, chess: null, attempts: 0, solved: false, solutionIndex: 0 }),
}));
```

- [ ] **Step 6: Create userStore.ts**

```ts
// app/src/state/userStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  username: string;
  rating: number;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface UserActions {
  login: (user: User, token: string) => Promise<void>;
  register: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateRating: (rating: number) => void;
  loadSession: () => Promise<void>;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (user, token) => {
    await AsyncStorage.multiSet([
      ["user", JSON.stringify(user)],
      ["token", token],
    ]);
    set({ user, token, isAuthenticated: true });
  },

  register: async (user, token) => {
    await AsyncStorage.multiSet([
      ["user", JSON.stringify(user)],
      ["token", token],
    ]);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(["user", "token"]);
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateRating: (rating) => set((s) => ({
    user: s.user ? { ...s.user, rating } : null,
  })),

  loadSession: async () => {
    const [userJson, token] = await AsyncStorage.multiGet(["user", "token"]);
    if (userJson[1] && token[1]) {
      set({ user: JSON.parse(userJson[1]), token: token[1], isAuthenticated: true });
    }
  },
}));
```

- [ ] **Step 7: Create settingsStore.ts**

```ts
// app/src/state/settingsStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";

type Language = "en" | "sorani" | "kurmanji";

function detectLanguage(): Language {
  const locale = getLocales()[0]?.languageCode ?? "en";
  if (locale === "ckb" || locale === "ku") return "sorani";
  if (locale === "kmr") return "kurmanji";
  return "en";
}

interface SettingsState {
  language: Language;
  boardTheme: string;
}

interface SettingsActions {
  setLanguage: (lang: Language) => Promise<void>;
  setBoardTheme: (theme: string) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
  language: "en",
  boardTheme: "default",

  setLanguage: async (lang) => {
    await AsyncStorage.setItem("language", lang);
    set({ language: lang });
  },

  setBoardTheme: (theme) => set({ boardTheme: theme }),

  loadSettings: async () => {
    const saved = await AsyncStorage.getItem("language");
    set({ language: saved ? (saved as Language) : detectLanguage() });
  },
}));
```

- [ ] **Step 8: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add Zustand stores for game, puzzle, user, and settings"
```

---

## Task 5: AI Engine

**Files:**
- Create: `app/src/engine/evaluation.ts`, `app/src/engine/ai.ts`
- Test: `app/src/__tests__/engine/ai.test.ts`

- [ ] **Step 1: Write failing tests for AI engine**

```ts
// app/src/__tests__/engine/ai.test.ts
import { Chess } from "chess.js";
import { getAIMove } from "../../engine/ai";

describe("AI Engine", () => {
  it("easy difficulty returns a legal move", () => {
    const chess = new Chess();
    const move = getAIMove(chess, "easy");
    expect(move).not.toBeNull();
    expect(move!.san).toBeTruthy();
  });

  it("medium difficulty returns a legal move", () => {
    const chess = new Chess();
    const move = getAIMove(chess, "medium");
    expect(move).not.toBeNull();
  });

  it("hard difficulty returns a legal move", () => {
    const chess = new Chess();
    const move = getAIMove(chess, "hard");
    expect(move).not.toBeNull();
  });

  it("medium captures when available", () => {
    // Position where black can capture white queen
    const chess = new Chess("rnb1kbnr/pppppppp/8/8/4q3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const move = getAIMove(chess, "medium");
    expect(move).not.toBeNull();
  });

  it("hard returns a move in under 1 second", () => {
    const chess = new Chess();
    const start = Date.now();
    getAIMove(chess, "hard");
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(1000);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /mnt/c/projects/chess.krd/app && npx jest __tests__/engine/ai.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create evaluation.ts (board evaluation helpers)**

```ts
// app/src/engine/evaluation.ts
import { Chess, Square } from "chess.js";

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
};

// Simplified piece-square tables (from white's perspective, index 0 = a8)
const PST_PAWN = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
];

const PST_KNIGHT = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];

const PST: Record<string, number[]> = {
  p: PST_PAWN,
  n: PST_KNIGHT,
};

export function evaluateBoard(chess: Chess): number {
  const board = chess.board();
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const idx = piece.color === "w" ? row * 8 + col : (7 - row) * 8 + col;
      const value = PIECE_VALUES[piece.type] || 0;
      const pst = PST[piece.type];
      const positional = pst ? pst[idx] : 0;

      if (piece.color === "w") {
        score += value + positional;
      } else {
        score -= value + positional;
      }
    }
  }

  return score;
}
```

- [ ] **Step 4: Create ai.ts (3-tier AI)**

```ts
// app/src/engine/ai.ts
import { Chess, Move } from "chess.js";
import { evaluateBoard } from "./evaluation";
import { Difficulty } from "../state/gameStore";

export function getAIMove(chess: Chess, difficulty: Difficulty): Move | null {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  switch (difficulty) {
    case "easy":
      return getEasyMove(moves);
    case "medium":
      return getMediumMove(chess, moves);
    case "hard":
      return getHardMove(chess, 3);
  }
}

function getEasyMove(moves: Move[]): Move {
  return moves[Math.floor(Math.random() * moves.length)];
}

function getMediumMove(chess: Chess, moves: Move[]): Move {
  // Prioritize: checkmate > capture with highest value > check > random
  const scored = moves.map((move) => {
    let score = 0;
    if (move.captured) score += { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }[move.captured] ?? 0;
    chess.move(move.san);
    if (chess.isCheckmate()) score += 100;
    if (chess.isCheck()) score += 5;
    chess.undo();
    return { move, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].score > 0 ? scored[0] : scored[Math.floor(Math.random() * scored.length)];
  return best.move;
}

function getHardMove(chess: Chess, depth: number): Move {
  const moves = chess.moves({ verbose: true });
  let bestMove = moves[0];
  let bestScore = -Infinity;
  const isMaximizing = chess.turn() === "w";

  for (const move of moves) {
    chess.move(move.san);
    const score = minimax(chess, depth - 1, -Infinity, Infinity, !isMaximizing);
    chess.undo();

    const adjusted = isMaximizing ? score : -score;
    if (adjusted > bestScore) {
      bestScore = adjusted;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(chess: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0 || chess.isGameOver()) return evaluateBoard(chess);

  const moves = chess.moves({ verbose: true });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move.san);
      const eval_ = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move.san);
      const eval_ = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd /mnt/c/projects/chess.krd/app && npx jest __tests__/engine/ai.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 6: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add AI engine with easy/medium/hard difficulties"
```

---

## Task 6: Shared UI Components

**Files:**
- Create: `app/src/components/Piece.tsx`, `app/src/components/Square.tsx`, `app/src/components/Board.tsx`, `app/src/components/ui/PillButton.tsx`, `app/src/components/ui/Card.tsx`

- [ ] **Step 1: Create Piece.tsx (SVG piece renderer)**

```tsx
// app/src/components/Piece.tsx
import React from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import DarkBishop from "../../../icons/dark_bishop.svg";
import DarkKing from "../../../icons/dark_king.svg";
import DarkKnight from "../../../icons/dark_knight.svg";
import DarkPawn from "../../../icons/dark_pawn.svg";
import DarkQueen from "../../../icons/dark_queen.svg";
import DarkRook from "../../../icons/dark_rook.svg";
import LightBishop from "../../../icons/light_bishop.svg";
import LightKing from "../../../icons/light_king.svg";
import LightKnight from "../../../icons/light_knight.svg";
import LightPawn from "../../../icons/light_pawn.svg";
import LightQueen from "../../../icons/light_queen.svg";
import LightRook from "../../../icons/light_rook.svg";

const PIECE_MAP: Record<string, React.FC<{ width?: number; height?: number }>> = {
  pb: DarkPawn, nb: DarkKnight, bb: DarkBishop, rb: DarkRook, qb: DarkQueen, kb: DarkKing,
  pw: LightPawn, nw: LightKnight, bw: LightBishop, rw: LightRook, qw: LightQueen, kw: LightKing,
};

interface PieceProps {
  piece: { type: string; color: string } | null;
  size: number;
}

export function Piece({ piece, size }: PieceProps) {
  if (!piece) return null;
  const key = `${piece.type}${piece.color}`;
  const SvgComponent = PIECE_MAP[key];
  if (!SvgComponent) return null;
  return <SvgComponent width={size} height={size} />;
}
```

- [ ] **Step 2: Create Square.tsx (individual board square)**

```tsx
// app/src/components/Square.tsx
import React from "react";
import { Pressable, View } from "react-native";
import { Piece } from "./Piece";
import { Colors } from "../utils/constants";

interface SquareProps {
  row: number;
  col: number;
  piece: { type: string; color: string } | null;
  isLegalMove: boolean;
  isCapture: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  isSelected: boolean;
  onPress: (row: number, col: number) => void;
  pieceSize: number;
  isFlipped: boolean;
}

export function Square({
  row, col, piece, isLegalMove, isCapture, isLastMove, isCheck, isSelected, onPress, pieceSize, isFlipped,
}: SquareProps) {
  const displayRow = isFlipped ? 7 - row : row;
  const displayCol = isFlipped ? 7 - col : col;
  const isLight = (displayRow + displayCol) % 2 === 0;
  const backgroundColor = isSelected
    ? Colors.accent
    : isLight
      ? Colors.boardLight
      : Colors.boardDark;

  return (
    <Pressable
      onPress={() => onPress(row, col)}
      style={{
        width: "12.5%",
        aspectRatio: 1,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {isLastMove && (
        <View style={{ position: "absolute", inset: 0, backgroundColor: Colors.lastMove }} />
      )}
      {isCheck && piece?.type === "k" && (
        <View style={{ position: "absolute", inset: 0, backgroundColor: Colors.check }} />
      )}
      <Piece piece={piece} size={pieceSize * 0.8} />
      {isLegalMove && !isCapture && (
        <View style={{
          position: "absolute", width: pieceSize * 0.25, height: pieceSize * 0.25,
          borderRadius: pieceSize * 0.125, backgroundColor: Colors.legalMove,
        }} />
      )}
      {isLegalMove && isCapture && (
        <View style={{
          position: "absolute", inset: 2, borderRadius: pieceSize * 0.5,
          borderWidth: 3, borderColor: Colors.legalMove,
        }} />
      )}
    </Pressable>
  );
}
```

- [ ] **Step 3: Create Board.tsx (chess board grid)**

The Board component accepts a `useStore` hook so it works with both `gameStore` and `puzzleStore`.

```tsx
// app/src/components/Board.tsx
import React, { useCallback } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Square } from "./Square";
import { Colors, Typography } from "../utils/constants";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface BoardStore {
  chess: { board: () => (any | null)[][]; inCheck: () => boolean; turn: () => string; fen: () => string };
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  isBoardFlipped: boolean;
  selectSquare: (sq: string | null) => void;
  makeMove: (m: { from: string; to: string; promotion?: string }) => boolean;
}

interface BoardProps {
  useStore: () => BoardStore;
}

export function Board({ useStore }: BoardProps) {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 32, 560);
  const pieceSize = boardSize / 8;

  const { chess, selectedSquare, legalMoves, lastMove, isBoardFlipped, selectSquare, makeMove } = useStore();

  const board = chess.board();

  const handlePress = useCallback((row: number, col: number) => {
    const file = FILES[col];
    const rank = String(8 - row);
    const square = `${file}${rank}`;

    if (selectedSquare && legalMoves.includes(square)) {
      makeMove({ from: selectedSquare, to: square });
    } else {
      selectSquare(square);
    }
  }, [selectedSquare, legalMoves, makeMove, selectSquare]);

  const isInCheck = chess.inCheck();
  const turn = chess.turn();
  const kingSquare = findKing(board, turn);

  return (
    <View>
      {/* Coordinate labels */}
      <View style={{ flexDirection: "row", paddingLeft: 0 }}>
        {(isBoardFlipped ? [...FILES].reverse() : FILES).map((f) => (
          <View key={f} style={{ width: boardSize / 8, alignItems: "center" }}>
            <Text style={[{ fontSize: 10, color: Colors.textSecondary }]}>{f}</Text>
          </View>
        ))}
      </View>
      <View style={{ width: boardSize, height: boardSize, flexDirection: "row", flexWrap: "wrap" }}>
        {board.map((rowArr, row) =>
          rowArr.map((piece, col) => {
            const file = FILES[col];
            const rank = String(8 - row);
            const sq = `${file}${rank}`;
            return (
              <Square
                key={sq}
                row={row}
                col={col}
                piece={piece}
                isLegalMove={legalMoves.includes(sq)}
                isCapture={!!piece && legalMoves.includes(sq) && sq !== selectedSquare}
                isLastMove={!!lastMove && (lastMove.from === sq || lastMove.to === sq)}
                isCheck={isInCheck && kingSquare === sq}
                isSelected={selectedSquare === sq}
                onPress={handlePress}
                pieceSize={pieceSize}
                isFlipped={isBoardFlipped}
              />
            );
          })
        )}
      </View>
    </View>
  );
}

function findKing(board: (any | null)[][], color: string): string | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "k" && p.color === color) return `${FILES[c]}${8 - r}`;
    }
  }
  return null;
}
```

**Usage in GameScreen:** `<Board useStore={useGameStore} />`
**Usage in PuzzleScreen:** `<Board useStore={usePuzzleStore} />` (puzzleStore must expose same interface)

- [ ] **Step 4: Create PillButton.tsx**

```tsx
// app/src/components/ui/PillButton.tsx
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Colors, Radius, Typography } from "../../utils/constants";

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function PillButton({ label, onPress, variant = "primary", size = "md" }: PillButtonProps) {
  const bg = variant === "primary" ? Colors.accent
    : variant === "secondary" ? Colors.surfaceMid
    : "transparent";
  const textColor = variant === "primary" ? "#000" : variant === "secondary" ? Colors.textPrimary : Colors.textPrimary;
  const border = variant === "outline" ? { borderWidth: 1, borderColor: Colors.borderLight } : {};

  const padding = size === "sm" ? { paddingVertical: 6, paddingHorizontal: 14 }
    : size === "lg" ? { paddingVertical: 12, paddingHorizontal: 43 }
    : { paddingVertical: 8, paddingHorizontal: 16 };

  return (
    <Pressable onPress={onPress} style={[styles.base, { backgroundColor: bg }, border, padding]}>
      <Text style={[Typography.button, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: Radius.pill, alignItems: "center", justifyContent: "center" },
});
```

- [ ] **Step 5: Create Card.tsx**

```tsx
// app/src/components/ui/Card.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors, Radius, Shadows } from "../../utils/constants";

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, elevated }: CardProps) {
  return (
    <View style={[styles.card, elevated && Shadows.medium]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
  },
});
```

- [ ] **Step 6: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add Board, Square, Piece components and shared UI (PillButton, Card)"
```

---

## Task 7: Game Screens

**Files:**
- Create: `app/src/features/game/GameSetupScreen.tsx`, `app/src/features/game/GameScreen.tsx`, `app/src/hooks/useGame.ts`

- [ ] **Step 1: Create useGame hook (AI move trigger)**

```ts
// app/src/hooks/useGame.ts
import { useEffect, useRef } from "react";
import { useGameStore } from "../state/gameStore";
import { getAIMove } from "../engine/ai";
import { AI_THINK_DELAY } from "../utils/constants";

export function useGame() {
  const { gameStatus, gameMode, playerColor, chess, difficulty } = useGameStore();
  const makeMove = useGameStore((s) => s.makeMove);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (gameStatus !== "playing") return;
    if (gameMode !== "ai") return;
    const isPlayerTurn = chess.turn() === playerColor;
    if (isPlayerTurn) return;

    timerRef.current = setTimeout(() => {
      const aiMove = getAIMove(chess, difficulty);
      if (aiMove) {
        makeMove({ from: aiMove.from, to: aiMove.to, promotion: aiMove.promotion });
      }
    }, AI_THINK_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [chess.fen(), gameStatus, gameMode, playerColor, difficulty]);
}
```

- [ ] **Step 2: Create GameSetupScreen.tsx**

```tsx
// app/src/features/game/GameSetupScreen.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, Typography, Radius, Spacing } from "../../utils/constants";
import { PillButton } from "../../components/ui/PillButton";
import { useGameStore, Difficulty } from "../../state/gameStore";

interface GameSetupScreenProps {
  onStart: () => void;
}

export function GameSetupScreen({ onStart }: GameSetupScreenProps) {
  const [color, setColor] = useState<"w" | "b">("w");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  return (
    <View style={styles.container}>
      <Text style={[Typography.title, { color: Colors.textPrimary }]}>New Game</Text>

      <View style={styles.section}>
        <Text style={[Typography.bodyBold, { color: Colors.textSecondary }]}>Play as</Text>
        <View style={styles.row}>
          {(["w", "b"] as const).map((c) => (
            <Pressable key={c} onPress={() => setColor(c)} style={[styles.option, color === c && styles.optionActive]}>
              <Text style={[Typography.body, { color: color === c ? Colors.textPrimary : Colors.textSecondary }]}>
                {c === "w" ? "White" : "Black"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[Typography.bodyBold, { color: Colors.textSecondary }]}>Difficulty</Text>
        <View style={styles.row}>
          {(["easy", "medium", "hard"] as const).map((d) => (
            <Pressable key={d} onPress={() => setDifficulty(d)} style={[styles.option, difficulty === d && styles.optionActive]}>
              <Text style={[Typography.body, { color: difficulty === d ? Colors.textPrimary : Colors.textSecondary }]}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <PillButton label="Start Game" onPress={() => {
        useGameStore.getState().newGame(color, "ai", difficulty);
        onStart();
      }} size="lg" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.xl, justifyContent: "center", gap: Spacing.xl },
  section: { gap: Spacing.sm },
  row: { flexDirection: "row", gap: Spacing.sm },
  option: { flex: 1, padding: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: "center" },
  optionActive: { backgroundColor: Colors.surfaceMid, borderWidth: 1, borderColor: Colors.accent },
});
```

- [ ] **Step 3: Create GameScreen.tsx**

```tsx
// app/src/features/game/GameScreen.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Board } from "../../components/Board";
import { PillButton } from "../../components/ui/PillButton";
import { useGameStore } from "../../state/gameStore";
import { useGame } from "../../hooks/useGame";
import { Colors, Typography, Spacing } from "../../utils/constants";

export function GameScreen() {
  useGame();

  const { moveHistory, gameStatus, playerColor, chess } = useGameStore();

  return (
    <View style={styles.container}>
      <View style={styles.playerBar}>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary }]}>
          {playerColor === "w" ? "Black" : "White"} (AI)
        </Text>
      </View>

      <Board useStore={useGameStore} />
  const newGame = useGameStore((s) => s.newGame);
  const undoMove = useGameStore((s) => s.undoMove);
  const flipBoard = useGameStore((s) => s.flipBoard);

  const statusText = gameStatus === "playing"
    ? chess.turn() === playerColor ? "Your turn" : "Thinking..."
    : gameStatus === "checkmate" ? (chess.turn() === playerColor ? "You lost" : "You won!")
    : gameStatus === "stalemate" ? "Stalemate"
    : gameStatus === "draw" ? "Draw"
    : gameStatus === "resigned" ? "You resigned"
    : "";

  return (
    <View style={styles.container}>
      <View style={styles.playerBar}>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary }]}>
          {playerColor === "w" ? "Black" : "White"} (AI)
        </Text>
      </View>

      <Board />

      <View style={styles.playerBar}>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary }]}>
          {playerColor === "w" ? "White" : "Black"} (You)
        </Text>
      </View>

      <Text style={[Typography.caption, { color: Colors.accent, textAlign: "center", paddingVertical: Spacing.sm }]}>
        {statusText}
      </Text>

      <ScrollView horizontal style={styles.moveHistory}>
        <Text style={[Typography.small, { color: Colors.textSecondary }]}>
          {moveHistory.map((m, i) => `${i % 2 === 0 ? Math.floor(i / 2) + 1 + ". " : ""}${m} `).join("")}
        </Text>
      </ScrollView>

      <View style={styles.controls}>
        <PillButton label="New" onPress={() => newGame(playerColor, "ai", useGameStore.getState().difficulty)} variant="secondary" size="sm" />
        <PillButton label="Undo" onPress={undoMove} variant="secondary" size="sm" />
        <PillButton label="Flip" onPress={flipBoard} variant="secondary" size="sm" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", padding: Spacing.md, gap: Spacing.xs },
  playerBar: { width: "100%", maxWidth: 560, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  moveHistory: { width: "100%", maxWidth: 560, paddingHorizontal: Spacing.sm },
  controls: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.sm },
});
```

- [ ] **Step 4: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add GameSetupScreen, GameScreen, and useGame hook"
```

---

## Task 8: Navigation Shell

**Files:**
- Create: `app/src/hooks/useResponsive.ts`, `app/src/navigation/AppNavigator.tsx`, `app/src/navigation/Sidebar.tsx`
- Modify: `app/App.tsx`

- [ ] **Step 1: Create useResponsive hook**

```ts
// app/src/hooks/useResponsive.ts
import { useWindowDimensions } from "react-native";
import { BREAKPOINT_TABLET } from "../utils/constants";

export function useResponsive() {
  const { width } = useWindowDimensions();
  return { isTablet: width >= BREAKPOINT_TABLET, width };
}
```

- [ ] **Step 2: Create AppNavigator.tsx**

```tsx
// app/src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { Colors, Typography } from "../utils/constants";
import { useResponsive } from "../hooks/useResponsive";
import { Sidebar } from "./Sidebar";
import { HomeScreen } from "../features/home/HomeScreen";
import { GameScreen } from "../features/game/GameScreen";
import { GameSetupScreen } from "../features/game/GameSetupScreen";
import { PuzzleScreen } from "../features/puzzles/PuzzleScreen";
import { ProfileScreen } from "../features/profile/ProfileScreen";
import { SettingsScreen } from "../features/profile/SettingsScreen";

const Tab = createBottomTabNavigator();
const PlayStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function PlayStackNavigator() {
  return (
    <PlayStack.Navigator screenOptions={{ headerShown: false }}>
      <PlayStack.Screen name="GameSetup" component={GameSetupScreenWrapper} />
      <PlayStack.Screen name="Game" component={GameScreen} />
    </PlayStack.Navigator>
  );
}

function GameSetupScreenWrapper({ navigation }: any) {
  return <GameSetupScreen onStart={(color, difficulty) => {
    navigation.navigate("Game");
  }} />;
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: Typography.small,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="PlayTab" component={PlayStackNavigator} options={{ tabBarLabel: "Play" }} />
      <Tab.Screen name="Puzzles" component={PuzzleScreen} options={{ tabBarLabel: "Puzzles" }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ tabBarLabel: "Profile" }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isTablet } = useResponsive();

  if (isTablet) {
    return (
      <NavigationContainer>
        <Sidebar />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
```

- [ ] **Step 3: Create Sidebar.tsx (tablet/desktop navigation)**

```tsx
// app/src/navigation/Sidebar.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, Radius } from "../utils/constants";

const NAV_ITEMS = ["Home", "Play", "Puzzles", "Profile"] as const;

export function Sidebar() {
  const [active, setActive] = useState<string>("Home");

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={[Typography.title, { color: Colors.accent, padding: Spacing.lg }]}>chess.krd</Text>
        {NAV_ITEMS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setActive(item)}
            style={[styles.navItem, active === item && styles.navItemActive]}
          >
            <Text style={[Typography.nav, { color: active === item ? Colors.textPrimary : Colors.textSecondary }]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.content}>
        <Text style={[Typography.body, { color: Colors.textSecondary }]}>{active} content here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: Colors.background },
  sidebar: { width: 240, backgroundColor: Colors.surface, paddingVertical: Spacing.md, gap: 2 },
  navItem: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.md },
  navItemActive: { backgroundColor: Colors.surfaceMid },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
});
```

- [ ] **Step 4: Update App.tsx**

```tsx
// app/App.tsx
import { AppNavigator } from "./src/navigation/AppNavigator";
import "./global.css";

export default function App() {
  return <AppNavigator />;
}
```

- [ ] **Step 5: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add navigation shell with responsive tabs/sidebar"
```

---

## Task 9: Home Screen

**Files:**
- Create: `app/src/features/home/HomeScreen.tsx`

- [ ] **Step 1: Create HomeScreen.tsx**

```tsx
// app/src/features/home/HomeScreen.tsx
import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { PillButton } from "../../components/ui/PillButton";
import { Card } from "../../components/ui/Card";
import { Colors, Typography, Spacing, Radius } from "../../utils/constants";

export function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[Typography.title, { color: Colors.textPrimary }]}>
        Welcome back
      </Text>

      <View style={styles.quickActions}>
        <PillButton label="New Game" onPress={() => navigation?.navigate("PlayTab", { screen: "GameSetup" })} size="lg" />
        <PillButton label="Daily Puzzle" onPress={() => navigation?.navigate("Puzzles")} variant="outline" size="lg" />
      </View>

      <Card>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary, marginBottom: Spacing.sm }]}>
          Rating
        </Text>
        <Text style={[Typography.title, { color: Colors.accent }]}>1200</Text>
        <Text style={[Typography.small, { color: Colors.textSecondary }]}>Glicko-2</Text>
      </Card>

      <View style={styles.section}>
        <Text style={[Typography.heading, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>
          Recent Games
        </Text>
        <Card>
          <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: "center" }]}>
            No games yet. Start playing!
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, gap: Spacing.xl },
  quickActions: { gap: Spacing.md },
  section: { gap: Spacing.sm },
});
```

- [ ] **Step 2: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add HomeScreen with quick actions and rating card"
```

---

## Task 10: Auth Screens

**Files:**
- Create: `app/src/features/auth/LoginScreen.tsx`, `app/src/features/auth/RegisterScreen.tsx`

- [ ] **Step 1: Create LoginScreen.tsx**

```tsx
// app/src/features/auth/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { PillButton } from "../../components/ui/PillButton";
import { Colors, Typography, Spacing, Radius } from "../../utils/constants";

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSkip: () => void;
  onGoToRegister: () => void;
}

export function LoginScreen({ onLogin, onSkip, onGoToRegister }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[Typography.title, { color: Colors.accent }]}>chess.krd</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>Sign in to your account</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={Colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <PillButton label={loading ? "Signing in..." : "Sign In"} onPress={handleLogin} disabled={loading} />
      </View>

      <Pressable onPress={onGoToRegister}>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
          Don't have an account? <Text style={{ color: Colors.accent }}>Register</Text>
        </Text>
      </Pressable>

      <Pressable onPress={onSkip}>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
          Play Offline
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center", padding: Spacing.xl, gap: Spacing.lg },
  form: { width: "100%", maxWidth: 400, gap: Spacing.md },
  input: {
    backgroundColor: Colors.surfaceMid, borderRadius: Radius.pill, paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl, color: Colors.textPrimary, fontSize: 16,
  },
});
```

- [ ] **Step 2: Create RegisterScreen.tsx**

```tsx
// app/src/features/auth/RegisterScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { PillButton } from "../../components/ui/PillButton";
import { Colors, Typography, Spacing, Radius } from "../../utils/constants";

interface RegisterScreenProps {
  onRegister: (username: string, password: string) => Promise<void>;
  onGoToLogin: () => void;
}

export function RegisterScreen({ onRegister, onGoToLogin }: RegisterScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    await onRegister(username, password);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[Typography.title, { color: Colors.accent }]}>chess.krd</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>Create an account</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={Colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <PillButton label={loading ? "Creating..." : "Register"} onPress={handleRegister} disabled={loading} />
      </View>

      <Pressable onPress={onGoToLogin}>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
          Already have an account? <Text style={{ color: Colors.accent }}>Sign In</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center", padding: Spacing.xl, gap: Spacing.lg },
  form: { width: "100%", maxWidth: 400, gap: Spacing.md },
  input: {
    backgroundColor: Colors.surfaceMid, borderRadius: Radius.pill, paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl, color: Colors.textPrimary, fontSize: 16,
  },
});
```

- [ ] **Step 3: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add LoginScreen and RegisterScreen"
```

---

## Task 11: Puzzle Screen

**Files:**
- Create: `app/src/features/puzzles/PuzzleScreen.tsx`

- [ ] **Step 1: Create PuzzleScreen.tsx**

```tsx
// app/src/features/puzzles/PuzzleScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Board } from "../../components/Board";
import { PillButton } from "../../components/ui/PillButton";
import { usePuzzleStore, Puzzle } from "../../state/puzzleStore";
import { Colors, Typography, Spacing } from "../../utils/constants";

const SAMPLE_PUZZLE: Puzzle = {
  id: "1",
  fen: "r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2",
  solution: ["Nf3", "d5", "exd5"],
  theme: "development",
  difficulty: "easy",
};

export function PuzzleScreen() {
  const { currentPuzzle, attempts, solved, chess, selectedSquare, legalMoves, lastMove } = usePuzzleStore();
  const loadPuzzle = usePuzzleStore((s) => s.loadPuzzle);
  const showSolution = usePuzzleStore((s) => s.showSolution);
  const nextPuzzle = usePuzzleStore((s) => s.nextPuzzle);

  const puzzleBoardStore = () => ({
    chess: chess!,
    selectedSquare,
    legalMoves,
    lastMove,
    isBoardFlipped: false,
    selectSquare: (sq: string | null) => {
      if (!sq || !chess) return;
      const moves = chess.moves({ square: sq, verbose: true });
      usePuzzleStore.setState({ selectedSquare: moves.length > 0 ? sq : null, legalMoves: moves.map((m: any) => m.to) });
    },
    makeMove: (m: { from: string; to: string }) => {
      return usePuzzleStore.getState().attemptMove(m.from, m.to);
    },
  });

  useEffect(() => {
    if (!currentPuzzle) loadPuzzle(SAMPLE_PUZZLE);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[Typography.heading, { color: Colors.textPrimary }]}>
        {solved ? "Solved!" : "Find the best move"}
      </Text>

      <Board useStore={puzzleBoardStore} />

      <View style={styles.info}>
        <Text style={[Typography.small, { color: Colors.textSecondary }]}>
          Attempts: {attempts}
        </Text>
        {currentPuzzle && (
          <Text style={[Typography.small, { color: Colors.textSecondary }]}>
            {currentPuzzle.theme} - {currentPuzzle.difficulty}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <PillButton label="Hint" onPress={() => {
          const hint = showSolution();
          if (hint) alert(`Try: ${hint}`);
        }} variant="outline" size="sm" />
        <PillButton label="Next" onPress={nextPuzzle} variant="secondary" size="sm" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", padding: Spacing.md, gap: Spacing.md },
  info: { flexDirection: "row", justifyContent: "space-between", width: "100%", maxWidth: 560, paddingHorizontal: Spacing.sm },
  actions: { flexDirection: "row", gap: Spacing.sm },
});
```

- [ ] **Step 2: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add PuzzleScreen with sample puzzle"
```

---

## Task 12: Profile & Settings Screens

**Files:**
- Create: `app/src/features/profile/ProfileScreen.tsx`, `app/src/features/profile/SettingsScreen.tsx`

- [ ] **Step 1: Create ProfileScreen.tsx**

```tsx
// app/src/features/profile/ProfileScreen.tsx
import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Card } from "../../components/ui/Card";
import { PillButton } from "../../components/ui/PillButton";
import { useUserStore } from "../../state/userStore";
import { Colors, Typography, Spacing } from "../../utils/constants";

export function ProfileScreen({ navigation }: any) {
  const { user, isAuthenticated } = useUserStore();
  const logout = useUserStore((s) => s.logout);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.avatar}>
          <Text style={[Typography.title, { color: Colors.accent }]}>
            {user?.username?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text style={[Typography.heading, { color: Colors.textPrimary, textAlign: "center" }]}>
          {isAuthenticated ? user?.username : "Guest"}
        </Text>
        {isAuthenticated && (
          <Text style={[Typography.caption, { color: Colors.accent, textAlign: "center" }]}>
            Rating: {user?.rating}
          </Text>
        )}
      </Card>

      <Card>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[Typography.bodyBold, { color: Colors.textPrimary }]}>0</Text>
            <Text style={[Typography.small, { color: Colors.textSecondary }]}>Games</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[Typography.bodyBold, { color: Colors.accent }]}>0</Text>
            <Text style={[Typography.small, { color: Colors.textSecondary }]}>Wins</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[Typography.bodyBold, { color: Colors.negative }]}>0</Text>
            <Text style={[Typography.small, { color: Colors.textSecondary }]}>Losses</Text>
          </View>
        </View>
      </Card>

      <PillButton label="Settings" onPress={() => navigation?.navigate("Settings")} variant="secondary" />
      {isAuthenticated && <PillButton label="Sign Out" onPress={logout} variant="outline" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, gap: Spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surfaceMid, justifyContent: "center", alignItems: "center", alignSelf: "center" },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 4 },
});
```

- [ ] **Step 2: Create SettingsScreen.tsx**

```tsx
// app/src/features/profile/SettingsScreen.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Card } from "../../components/ui/Card";
import { useSettingsStore } from "../../state/settingsStore";
import { Colors, Typography, Spacing, Radius } from "../../utils/constants";

const LANGUAGES = [
  { key: "en", label: "English" },
  { key: "sorani", label: "سۆرانی" },
  { key: "kurmanji", label: "Kurmancî" },
] as const;

export function SettingsScreen() {
  const { language } = useSettingsStore();
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <View style={styles.container}>
      <Text style={[Typography.heading, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
        Settings
      </Text>

      <Card>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>
          Language
        </Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.key}
              onPress={() => setLanguage(lang.key)}
              style={[styles.langOption, language === lang.key && styles.langActive]}
            >
              <Text style={[Typography.body, { color: language === lang.key ? Colors.accent : Colors.textSecondary }]}>
                {lang.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.xl },
  langRow: { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
  langOption: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.pill, backgroundColor: Colors.surfaceMid },
  langActive: { borderWidth: 1, borderColor: Colors.accent },
});
```

- [ ] **Step 3: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add ProfileScreen and SettingsScreen"
```

---

## Task 13: SQLite Persistence

**Files:**
- Create: `app/src/core/storage/database.ts`

- [ ] **Step 1: Create database.ts**

```ts
// app/src/core/storage/database.ts
import * as SQLite from "expo-sqlite";

const DB_NAME = "chesskrd.db";

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await initTables(db);
  }
  return db;
}

async function initTables(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      fen TEXT NOT NULL,
      pgn TEXT,
      moves_json TEXT,
      mode TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'playing',
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
    CREATE TABLE IF NOT EXISTS puzzles (
      id TEXT PRIMARY KEY,
      fen TEXT NOT NULL,
      solution_json TEXT NOT NULL,
      theme TEXT,
      difficulty TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      solved INTEGER NOT NULL DEFAULT 0
    );
  `);
}

export async function saveGame(game: {
  id: string;
  fen: string;
  pgn?: string;
  movesJson?: string;
  mode: string;
  status: string;
}): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO games (id, fen, pgn, moves_json, mode, status, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, strftime('%s','now'))`,
    [game.id, game.fen, game.pgn ?? "", game.movesJson ?? "[]", game.mode, game.status]
  );
}

export async function loadGame(id: string): Promise<any | null> {
  const database = await getDb();
  return database.getFirstAsync("SELECT * FROM games WHERE id = ?", [id]);
}

export async function loadAllGames(): Promise<any[]> {
  const database = await getDb();
  return database.getAllAsync("SELECT * FROM games ORDER BY updated_at DESC");
}

export async function deleteGame(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync("DELETE FROM games WHERE id = ?", [id]);
}

export async function savePuzzleAttempt(puzzle: {
  id: string;
  fen: string;
  solutionJson: string;
  theme: string;
  difficulty: string;
  attempts: number;
  solved: boolean;
}): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO puzzles (id, fen, solution_json, theme, difficulty, attempts, solved)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [puzzle.id, puzzle.fen, puzzle.solutionJson, puzzle.theme, puzzle.difficulty, puzzle.attempts, puzzle.solved ? 1 : 0]
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add SQLite persistence layer for games and puzzles"
```

---

## Task 14: i18n Localization

**Files:**
- Create: `app/src/core/i18n/index.ts`, `app/src/core/i18n/locales/en.json`, `app/src/core/i18n/locales/sorani.json`, `app/src/core/i18n/locales/kurmanji.json`

- [ ] **Step 1: Create en.json**

```json
{
  "home": { "welcome": "Welcome back", "new_game": "New Game", "daily_puzzle": "Daily Puzzle", "rating": "Rating", "recent_games": "Recent Games", "no_games": "No games yet. Start playing!" },
  "game": { "your_turn": "Your turn", "thinking": "Thinking...", "you_won": "You won!", "you_lost": "You lost", "stalemate": "Stalemate", "draw": "Draw", "resigned": "You resigned", "new_game": "New Game", "undo": "Undo", "flip": "Flip Board", "start_game": "Start Game", "play_as": "Play as", "white": "White", "black": "Black", "difficulty": "Difficulty" },
  "puzzle": { "find_best": "Find the best move", "solved": "Solved!", "attempts": "Attempts", "hint": "Hint", "next": "Next" },
  "auth": { "sign_in": "Sign In", "register": "Register", "username": "Username", "password": "Password", "signing_in": "Signing in...", "creating": "Creating...", "no_account": "Don't have an account?", "have_account": "Already have an account?", "play_offline": "Play Offline" },
  "profile": { "guest": "Guest", "stats": "Stats", "games": "Games", "wins": "Wins", "losses": "Losses", "settings": "Settings", "sign_out": "Sign Out" },
  "settings": { "title": "Settings", "language": "Language" },
  "nav": { "home": "Home", "play": "Play", "puzzles": "Puzzles", "profile": "Profile" }
}
```

- [ ] **Step 2: Create sorani.json**

```json
{
  "home": { "welcome": "بەخێربێیتەوە", "new_game": "یاری نوێ", "daily_puzzle": "مەتەڵی ڕۆژ", "rating": "ڕیزبەندی", "recent_games": "یاریەکانی پێشوو", "no_games": "هێشتا یاری نییە. دەست پێ بکە!" },
  "game": { "your_turn": "نۆرەی تۆیە", "thinking": "بیرکردنەوە...", "you_won": "تۆ بردوویەتی!", "you_lost": "تۆ دۆڕا", "stalemate": "یەکسانبوون", "draw": "یەکسانبوون", "resigned": "تۆ دەستگەیشت", "new_game": "یاری نوێ", "undo": "گەڕانەوە", "flip": "پێچانەوە", "start_game": "دەستپێکردن", "play_as": "یاری بکە وەک", "white": "سپی", "black": "ڕەش", "difficulty": "ئاستی سەختی" },
  "puzzle": { "find_best": "باشترین جوڵە بدۆزەرەوە", "solved": "چارەسەرکرا!", "attempts": "هەوڵەکان", "hint": "ئامۆژگاری", "next": "دواتر" },
  "auth": { "sign_in": "چوونەژوورەوە", "register": "تۆمارکردن", "username": "ناوی بەکارهێنەر", "password": "وشەی نهێنی", "signing_in": "چوونەژوورەوە...", "creating": "دروستکردن...", "no_account": "هەژمارێکت نییە؟", "have_account": "هەژمارێکت هەیە؟", "play_offline": "یاری ئۆفلاین" },
  "profile": { "guest": "میوان", "stats": "ئامارەکان", "games": "یاریەکان", "wins": "سەرکەوتنەکان", "losses": "دۆڕانەکان", "settings": "ڕێکخستنەکان", "sign_out": "چوونەدەرەوە" },
  "settings": { "title": "ڕێکخستنەکان", "language": "زمان" },
  "nav": { "home": "سەرەتا", "play": "یاری", "puzzles": "مەتەڵ", "profile": "پرۆفایل" }
}
```

- [ ] **Step 3: Create kurmanji.json**

```json
{
  "home": { "welcome": "Bixêr hatî", "new_game": "Lîstika nû", "daily_puzzle": "Puzzla rojê", "rating": "Xal", "recent_games": "Lîstikên berê", "no_games": "Hîn lîstik tune. Bide dest pê kirin!" },
  "game": { "your_turn": "Dora te ye", "thinking": "Tê fikirîn...", "you_won": "Te qezenc kir!", "you_lost": "Te winda kir", "stalemate": "Patiyabûn", "draw": "Patiyabûn", "resigned": "Te dev jê berda", "new_game": "Lîstika nû", "undo": "Vegerîne", "flip": "Bizivirîne", "start_game": "Bide dest pê kirin", "play_as": "Wekî bilîze", "white": "Spî", "black": "Reş", "difficulty": "Asta dijwarî" },
  "puzzle": { "find_best": "Tevgera çêtirîn bibîne", "solved": "Çareser bû!", "attempts": "Hewldan", "hint": "Îkaz", "next": "Paşê" },
  "auth": { "sign_in": "Têkevê", "register": "Qeyd bibe", "username": "Navê bikarhêner", "password": "Şîfre", "signing_in": "Têketin...", "creating": "Afirandin...", "no_account": "Hesabê te tune ye?", "have_account": "Hesabê te heye?", "play_offline": "Offline bilîze" },
  "profile": { "guest": "Mêvan", "stats": "Statîstîk", "games": "Lîstik", "wins": "Serkeftin", "losses": "Têkçûn", "settings": "Mîheng", "sign_out": "Derkeve" },
  "settings": { "title": "Mîheng", "language": "Ziman" },
  "nav": { "home": "Mal", "play": "Lîstik", "puzzles": "Puzzle", "profile": "Profîl" }
}
```

- [ ] **Step 4: Create i18n index.ts**

```ts
// app/src/core/i18n/index.ts
import i18n from "i18n-js";
import en from "./locales/en.json";
import sorani from "./locales/sorani.json";
import kurmanji from "./locales/kurmanji.json";

i18n.fallbacks = true;
i18n.translations = { en, sorani, kurmanji };
i18n.defaultLocale = "en";
i18n.locale = "en";

export function setLocale(locale: string) {
  i18n.locale = locale;
}

export function t(key: string, params?: object): string {
  return i18n.t(key, params);
}

export { i18n };
```

- [ ] **Step 5: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add i18n with English, Sorani, and Kurmanji locales"
```

---

## Task 15: Go Backend — Setup + Auth

**Files:**
- Create: `cmd/api/main.go`, `config/config.go`, `pkg/models/user.go`, `internal/auth/handler.go`, `internal/auth/service.go`, `internal/auth/middleware.go`, `db/migrations/001_init.sql`

- [ ] **Step 1: Create db/migrations/001_init.sql**

```sql
-- db/migrations/001_init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 1200,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  white_id UUID REFERENCES users(id),
  black_id UUID REFERENCES users(id),
  fen TEXT NOT NULL,
  pgn TEXT,
  moves_json JSONB DEFAULT '[]',
  mode TEXT NOT NULL DEFAULT 'async',
  status TEXT NOT NULL DEFAULT 'playing',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fen TEXT NOT NULL,
  solution_json JSONB NOT NULL,
  theme TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_games_white ON games(white_id);
CREATE INDEX idx_games_black ON games(black_id);
CREATE INDEX idx_puzzles_difficulty ON puzzles(difficulty);
```

- [ ] **Step 2: Create config/config.go**

```go
// config/config.go
package config

import "os"

type Config struct {
    Port        string
    DatabaseURL string
    JWTSecret   string
}

func Load() *Config {
    return &Config{
        Port:        getEnv("PORT", "8080"),
        DatabaseURL: getEnv("DATABASE_URL", "postgres://localhost/chesskrd?sslmode=disable"),
        JWTSecret:   getEnv("JWT_SECRET", "dev-secret-change-in-production"),
    }
}

func getEnv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
```

- [ ] **Step 3: Create pkg/models/user.go**

```go
// pkg/models/user.go
package models

import "time"

type User struct {
    ID           string    `json:"id"`
    Username     string    `json:"username"`
    PasswordHash string    `json:"-"`
    Rating       int       `json:"rating"`
    CreatedAt    time.Time `json:"created_at"`
}

type Game struct {
    ID        string    `json:"id"`
    WhiteID   *string   `json:"white_id"`
    BlackID   *string   `json:"black_id"`
    FEN       string    `json:"fen"`
    PGN       string    `json:"pgn"`
    MovesJSON string    `json:"moves_json"`
    Mode      string    `json:"mode"`
    Status    string    `json:"status"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type Puzzle struct {
    ID           string `json:"id"`
    FEN          string `json:"fen"`
    SolutionJSON string `json:"solution_json"`
    Theme        string `json:"theme"`
    Difficulty   string `json:"difficulty"`
}
```

- [ ] **Step 4: Create internal/auth/service.go**

```go
// internal/auth/service.go
package auth

import (
    "database/sql"
    "errors"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
)

type Service struct {
    db       *sql.DB
    secret   string
}

func NewService(db *sql.DB, secret string) *Service {
    return &Service{db: db, secret: secret}
}

type Claims struct {
    UserID   string `json:"user_id"`
    Username string `json:"username"`
    jwt.RegisteredClaims
}

func (s *Service) Register(username, password string) (string, string, error) {
    hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return "", "", err
    }

    var id string
    err = s.db.QueryRow(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
        username, string(hash),
    ).Scan(&id)
    if err != nil {
        return "", "", errors.New("username taken")
    }

    return s.generateTokens(id, username)
}

func (s *Service) Login(username, password string) (string, string, error) {
    var id, hash string
    err := s.db.QueryRow(
        "SELECT id, password_hash FROM users WHERE username = $1", username,
    ).Scan(&id, &hash)
    if err != nil {
        return "", "", errors.New("invalid credentials")
    }

    if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
        return "", "", errors.New("invalid credentials")
    }

    return s.generateTokens(id, username)
}

func (s *Service) ValidateToken(tokenStr string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
        return []byte(s.secret), nil
    })
    if err != nil {
        return nil, err
    }
    claims, ok := token.Claims.(*Claims)
    if !ok || !token.Valid {
        return nil, errors.New("invalid token")
    }
    return claims, nil
}

func (s *Service) generateTokens(userID, username string) (string, string, error) {
    now := time.Now()
    claims := &Claims{
        UserID:   userID,
        Username: username,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(now),
        },
    }
    token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.secret))
    if err != nil {
        return "", "", err
    }

    refreshClaims := &Claims{
        UserID:   userID,
        Username: username,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(now.Add(7 * 24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(now),
        },
    }
    refresh, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(s.secret))
    return token, refresh, err
}
```

- [ ] **Step 5: Create internal/auth/handler.go**

```go
// internal/auth/handler.go
package auth

import (
    "encoding/json"
    "net/http"
)

type Handler struct {
    service *Service
}

func NewHandler(service *Service) *Handler {
    return &Handler{service: service}
}

type registerRequest struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

type authResponse struct {
    Token        string `json:"token"`
    RefreshToken string `json:"refreshToken"`
    Username     string `json:"username"`
    UserID       string `json:"user_id"`
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
    var req registerRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid body", http.StatusBadRequest)
        return
    }
    if req.Username == "" || req.Password == "" {
        http.Error(w, "username and password required", http.StatusBadRequest)
        return
    }

    token, refresh, err := h.service.Register(req.Username, req.Password)
    if err != nil {
        http.Error(w, err.Error(), http.StatusConflict)
        return
    }

    writeJSON(w, authResponse{Token: token, RefreshToken: refresh})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
    var req registerRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid body", http.StatusBadRequest)
        return
    }

    token, refresh, err := h.service.Login(req.Username, req.Password)
    if err != nil {
        http.Error(w, err.Error(), http.StatusUnauthorized)
        return
    }

    writeJSON(w, authResponse{Token: token, RefreshToken: refresh})
}

func writeJSON(w http.ResponseWriter, v interface{}) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(v)
}
```

- [ ] **Step 6: Create internal/auth/middleware.go**

```go
// internal/auth/middleware.go
package auth

import (
    "context"
    "net/http"
    "strings"
)

type contextKey string
const UserIDKey contextKey = "user_id"

func (h *Handler) AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        header := r.Header.Get("Authorization")
        if header == "" {
            http.Error(w, "unauthorized", http.StatusUnauthorized)
            return
        }

        tokenStr := strings.TrimPrefix(header, "Bearer ")
        claims, err := h.service.ValidateToken(tokenStr)
        if err != nil {
            http.Error(w, "invalid token", http.StatusUnauthorized)
            return
        }

        ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

- [ ] **Step 7: Create cmd/api/main.go**

```go
// cmd/api/main.go
package main

import (
    "database/sql"
    "log"
    "net/http"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
    _ "github.com/lib/pq"

    "chesskrd/config"
    "chesskrd/internal/auth"
)

func main() {
    cfg := config.Load()

    db, err := sql.Open("postgres", cfg.DatabaseURL)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    authService := auth.NewService(db, cfg.JWTSecret)
    authHandler := auth.NewHandler(authService)

    r := chi.NewRouter()
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(middleware.RequestID)

    r.Route("/auth", func(r chi.Router) {
        r.Post("/register", authHandler.Register)
        r.Post("/login", authHandler.Login)
    })

    r.Route("/api", func(r chi.Router) {
        r.Use(authHandler.AuthMiddleware)
        // Game and puzzle routes will be added in Task 16
    })

    log.Printf("Server starting on :%s", cfg.Port)
    log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
```

- [ ] **Step 8: Initialize Go module**

```bash
cd /mnt/c/projects/chess.krd
go mod init chesskrd
go mod tidy
```

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add Go backend with auth service, JWT, and DB migrations"
```

---

## Task 16: Go Backend — Games + Puzzles API

**Files:**
- Create: `internal/game/handler.go`, `internal/game/service.go`, `internal/puzzle/handler.go`

- [ ] **Step 1: Create internal/game/service.go**

```go
// internal/game/service.go
package game

import (
    "database/sql"
    "encoding/json"
    "time"

    "chesskrd/pkg/models"
)

type Service struct {
    db *sql.DB
}

func NewService(db *sql.DB) *Service {
    return &Service{db: db}
}

func (s *Service) Create(userID, mode string) (*models.Game, error) {
    g := &models.Game{FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", Mode: mode, Status: "playing"}
    err := s.db.QueryRow(
        "INSERT INTO games (white_id, fen, mode, status) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at",
        userID, g.FEN, g.Mode, g.Status,
    ).Scan(&g.ID, &g.CreatedAt, &g.UpdatedAt)
    return g, err
}

func (s *Service) GetByID(id string) (*models.Game, error) {
    g := &models.Game{}
    err := s.db.QueryRow(
        "SELECT id, COALESCE(white_id::text,''), COALESCE(black_id::text,''), fen, COALESCE(pgn,''), COALESCE(moves_json::text,'[]'), mode, status, created_at, updated_at FROM games WHERE id = $1", id,
    ).Scan(&g.ID, &g.WhiteID, &g.BlackID, &g.FEN, &g.PGN, &g.MovesJSON, &g.Mode, &g.Status, &g.CreatedAt, &g.UpdatedAt)
    return g, err
}

func (s *Service) ListByUser(userID string) ([]models.Game, error) {
    rows, err := s.db.Query(
        "SELECT id, COALESCE(white_id::text,''), COALESCE(black_id::text,''), fen, COALESCE(pgn,''), COALESCE(moves_json::text,'[]'), mode, status, created_at, updated_at FROM games WHERE white_id = $1 OR black_id = $1 ORDER BY updated_at DESC", userID,
    )
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var games []models.Game
    for rows.Next() {
        var g models.Game
        rows.Scan(&g.ID, &g.WhiteID, &g.BlackID, &g.FEN, &g.PGN, &g.MovesJSON, &g.Mode, &g.Status, &g.CreatedAt, &g.UpdatedAt)
        games = append(games, g)
    }
    return games, nil
}

func (s *Service) MakeMove(gameID, moveSAN string) (*models.Game, error) {
    g, err := s.GetByID(gameID)
    if err != nil {
        return nil, err
    }

    var moves []string
    json.Unmarshal([]byte(g.MovesJSON), &moves)
    moves = append(moves, moveSAN)
    movesJSON, _ := json.Marshal(moves)

    _, err = s.db.Exec(
        "UPDATE games SET moves_json = $1, updated_at = $2 WHERE id = $3",
        movesJSON, time.Now(), gameID,
    )
    if err != nil {
        return nil, err
    }
    return s.GetByID(gameID)
}
```

- [ ] **Step 2: Create internal/game/handler.go**

```go
// internal/game/handler.go
package game

import (
    "encoding/json"
    "net/http"

    "chesskrd/internal/auth"
)

type Handler struct {
    service *Service
}

func NewHandler(service *Service) *Handler {
    return &Handler{service: service}
}

type createRequest struct {
    Mode string `json:"mode"`
}

type moveRequest struct {
    SAN string `json:"san"`
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
    userID := r.Context().Value(auth.UserIDKey).(string)
    var req createRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        req.Mode = "async"
    }

    g, err := h.service.Create(userID, req.Mode)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(g)
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
    userID := r.Context().Value(auth.UserIDKey).(string)
    games, err := h.service.ListByUser(userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(games)
}

func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Path[len("/api/games/"):]
    g, err := h.service.GetByID(id)
    if err != nil {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(g)
}

func (h *Handler) Move(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Path[len("/api/games/") : len(r.URL.Path)-len("/move")]
    var req moveRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid body", http.StatusBadRequest)
        return
    }

    g, err := h.service.MakeMove(id, req.SAN)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(g)
}
```

- [ ] **Step 3: Create internal/puzzle/handler.go**

```go
// internal/puzzle/handler.go
package puzzle

import (
    "database/sql"
    "encoding/json"
    "net/http"

    "chesskrd/pkg/models"
)

type Handler struct {
    db *sql.DB
}

func NewHandler(db *sql.DB) *Handler {
    return &Handler{db: db}
}

func (h *Handler) Daily(w http.ResponseWriter, r *http.Request) {
    var p models.Puzzle
    err := h.db.QueryRow(
        "SELECT id, fen, solution_json, theme, difficulty FROM puzzles ORDER BY created_at DESC LIMIT 1",
    ).Scan(&p.ID, &p.FEN, &p.SolutionJSON, &p.Theme, &p.Difficulty)
    if err != nil {
        http.Error(w, "no puzzles", http.StatusNotFound)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(p)
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
    difficulty := r.URL.Query().Get("difficulty")
    query := "SELECT id, fen, solution_json, theme, difficulty FROM puzzles"
    args := []interface{}{}

    if difficulty != "" {
        query += " WHERE difficulty = $1"
        args = append(args, difficulty)
    }
    query += " ORDER BY created_at DESC LIMIT 50"

    rows, err := h.db.Query(query, args...)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var puzzles []models.Puzzle
    for rows.Next() {
        var p models.Puzzle
        rows.Scan(&p.ID, &p.FEN, &p.SolutionJSON, &p.Theme, &p.Difficulty)
        puzzles = append(puzzles, p)
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(puzzles)
}
```

- [ ] **Step 4: Update cmd/api/main.go to wire game + puzzle routes**

Add imports and route registrations in `main()`:

```go
// Add imports:
"chesskrd/internal/game"
"chesskrd/internal/puzzle"

// Add in main() after authService/authHandler setup:
gameService := game.NewService(db)
gameHandler := game.NewHandler(gameService)
puzzleHandler := puzzle.NewHandler(db)

// Replace the /api route block with:
r.Route("/api", func(r chi.Router) {
    r.Use(authHandler.AuthMiddleware)
    r.Post("/games", gameHandler.Create)
    r.Get("/games", gameHandler.List)
    r.Get("/games/{id}", gameHandler.Get)
    r.Post("/games/{id}/move", gameHandler.Move)
    r.Get("/puzzles/daily", puzzleHandler.Daily)
    r.Get("/puzzles", puzzleHandler.List)
})
```

- [ ] **Step 5: Run go mod tidy and verify build**

```bash
cd /mnt/c/projects/chess.krd
go mod tidy
go build ./cmd/api/
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add Go game and puzzle API handlers"
```

---

## Task 17: Frontend API Client

**Files:**
- Create: `app/src/core/api/client.ts`, `app/src/core/api/endpoints.ts`

- [ ] **Step 1: Create client.ts (Axios instance)**

```ts
// app/src/core/api/client.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);
```

- [ ] **Step 2: Create endpoints.ts**

```ts
// app/src/core/api/endpoints.ts
import { api } from "./client";

export const authApi = {
  register: (username: string, password: string) =>
    api.post("/auth/register", { username, password }),
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }),
};

export const gamesApi = {
  create: (mode: string) => api.post("/api/games", { mode }),
  list: () => api.get("/api/games"),
  get: (id: string) => api.get(`/api/games/${id}`),
  move: (id: string, san: string) => api.post(`/api/games/${id}/move`, { san }),
};

export const puzzlesApi = {
  daily: () => api.get("/api/puzzles/daily"),
  list: (difficulty?: string) => api.get("/api/puzzles", { params: { difficulty } }),
};
```

- [ ] **Step 3: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: add frontend API client with auth, games, and puzzles endpoints"
```

---

## Task 18: Integration & App Wiring

**Files:**
- Modify: `app/src/navigation/AppNavigator.tsx`, `app/src/state/gameStore.ts`, `app/src/features/game/GameSetupScreen.tsx`

- [ ] **Step 1: Wire GameSetupScreen to gameStore**

Update `GameSetupScreen.tsx` to call `newGame` from the store:

```tsx
// In GameSetupScreen.tsx, update onStart handler:
import { useGameStore } from "../../state/gameStore";

// Replace the component's onStart prop with direct store usage:
interface GameSetupScreenProps {
  onStart: () => void;
}

export function GameSetupScreen({ onStart }: GameSetupScreenProps) {
  const [color, setColor] = useState<"w" | "b">("w");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const handleStart = () => {
    useGameStore.getState().newGame(color, "ai", difficulty);
    onStart();
  };

  // ... rest remains the same, but use handleStart instead of onStart(color, difficulty)
  // Update PillButton: <PillButton label="Start Game" onPress={handleStart} size="lg" />
}
```

- [ ] **Step 2: Wire AppNavigator to use GameSetup properly**

Update `AppNavigator.tsx` `GameSetupScreenWrapper`:

```tsx
function GameSetupScreenWrapper({ navigation }: any) {
  return <GameSetupScreen onStart={() => navigation.navigate("Game")} />;
}
```

- [ ] **Step 3: Wire SQLite persistence into gameStore**

Add auto-save to `gameStore.ts`:

```ts
// Add import at top of gameStore.ts:
import { saveGame } from "../core/storage/database";

// Add module-level variable:
let currentGameId = "";

// In newGame action, add after set():
currentGameId = `local_${Date.now()}`;
saveGame({ id: currentGameId, fen: chess.fen(), mode, status: "playing" });

// In makeMove, after the set() call:
saveGame({
  id: currentGameId,
  fen: state.chess.fen(),
  pgn: state.chess.pgn(),
  movesJson: JSON.stringify([...state.moveHistory, move.san]),
  mode: state.gameMode,
  status: newStatus,
});
```

- [ ] **Step 4: Wire i18n into settings**

Update `SettingsScreen.tsx` to call the i18n `setLocale` function:

```tsx
// Add import:
import { setLocale } from "../../core/i18n";

// In the language Pressable onPress:
onPress={() => {
  setLanguage(lang.key);
  setLocale(lang.key);
}}
```

- [ ] **Step 5: Run the full app and verify all screens load**

```bash
cd /mnt/c/projects/chess.krd/app
npx expo start --web
```

Expected: All 4 tabs load (Home, Play with setup + board, Puzzles, Profile with settings). Board renders, pieces display, moves work.

- [ ] **Step 6: Commit**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "feat: wire all screens, stores, and persistence together"
```

---

## Task 19: Final Polish + README

**Files:**
- Create: `README.md`
- Modify: `app/app.json` (app name, slug)

- [ ] **Step 1: Update app.json**

```json
{
  "expo": {
    "name": "chess.krd",
    "slug": "chess-krd",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "scheme": "chesskrd",
    "platforms": ["ios", "android", "web"],
    "assetBundlePatterns": ["**/*"]
  }
}
```

- [ ] **Step 2: Create README.md**

```markdown
# chess.krd

A mobile-first chess platform built with Expo, targeting Kurdish-speaking users.

## Getting Started

### Frontend (Expo)
```bash
cd app
npm install
npx expo start
```

### Backend (Go)
```bash
go mod tidy
go run cmd/api/main.go
```

## Tech Stack
- **Frontend:** Expo SDK 52, TypeScript, chess.js, Zustand, NativeWind
- **Backend:** Go, Chi router, PostgreSQL, JWT auth
- **Engine:** Client-side AI (random/material/minimax)

## Languages
- English (primary)
- Sorani (کوردی)
- Kurmanji (Kurmancî)
```

- [ ] **Step 3: Push to GitHub**

```bash
cd /mnt/c/projects/chess.krd
git add .
git commit -m "chore: add README and configure app.json"
git branch -M main
git push -u origin main
```

---

