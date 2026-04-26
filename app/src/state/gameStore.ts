import { create } from "zustand";
import { Chess, type Square } from "chess.js";

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
    const lastMove = history.length > 0 ? getLastMove(state.chess) : null;
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
    const moves = state.chess.moves({ square: square as Square, verbose: true });
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
