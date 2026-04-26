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
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
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
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,

  loadPuzzle: (puzzle) => {
    const chess = new Chess(puzzle.fen);
    set({
      currentPuzzle: puzzle,
      chess,
      attempts: 0,
      solved: false,
      solutionIndex: 0,
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
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

  nextPuzzle: () =>
    set({
      currentPuzzle: null,
      chess: null,
      attempts: 0,
      solved: false,
      solutionIndex: 0,
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
    }),
}));
