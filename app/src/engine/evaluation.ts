import { Chess } from "chess.js";

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
};

const PST_PAWN = [
  0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10,
  5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5,
  5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0,
];

const PST_KNIGHT = [
  -50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40,
  -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30,
  -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30,
  -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50,
];

const PST: Record<string, number[]> = { p: PST_PAWN, n: PST_KNIGHT };

export function evaluateBoard(chess: Chess): number {
  const board = chess.board();
  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      const idx = piece.color === "w" ? row * 8 + col : (7 - row) * 8 + col;
      const value = PIECE_VALUES[piece.type] || 0;
      const positional = PST[piece.type] ? PST[piece.type][idx] : 0;
      if (piece.color === "w") { score += value + positional; }
      else { score -= value + positional; }
    }
  }
  return score;
}
