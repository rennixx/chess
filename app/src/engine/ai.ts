import { Chess, Move } from "chess.js";
import { evaluateBoard } from "./evaluation";

export type Difficulty = "easy" | "medium" | "hard";

export function getAIMove(chess: Chess, difficulty: Difficulty): Move | null {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;
  switch (difficulty) {
    case "easy": return getEasyMove(moves);
    case "medium": return getMediumMove(chess, moves);
    case "hard": return getHardMove(chess, 3);
  }
}

function getEasyMove(moves: Move[]): Move {
  return moves[Math.floor(Math.random() * moves.length)];
}

function getMediumMove(chess: Chess, moves: Move[]): Move {
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
    if (adjusted > bestScore) { bestScore = adjusted; bestMove = move; }
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
