import { Chess } from "chess.js";
import { getAIMove } from "../../engine/ai";
import { evaluateBoard } from "../../engine/evaluation";

describe("AI Engine", () => {
  describe("getAIMove", () => {
    it("easy returns a legal move", () => {
      const chess = new Chess();
      const move = getAIMove(chess, "easy");
      expect(move).not.toBeNull();
      expect(move!.san).toBeTruthy();
    });

    it("medium returns a legal move", () => {
      const chess = new Chess();
      const move = getAIMove(chess, "medium");
      expect(move).not.toBeNull();
    });

    it("hard returns a legal move", () => {
      const chess = new Chess();
      const move = getAIMove(chess, "hard");
      expect(move).not.toBeNull();
    });

    it("returns null when no moves available (checkmate)", () => {
      const chess = new Chess(
        "rnb1kbnr/pppp1ppp/4p3/8/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3"
      );
      const move = getAIMove(chess, "easy");
      expect(move).toBeNull();
    });

    it("hard returns a move in under 1 second", () => {
      const chess = new Chess();
      const start = Date.now();
      getAIMove(chess, "hard");
      expect(Date.now() - start).toBeLessThan(1000);
    });

    it("easy does not modify the chess state", () => {
      const chess = new Chess();
      const fenBefore = chess.fen();
      getAIMove(chess, "easy");
      expect(chess.fen()).toBe(fenBefore);
    });

    it("medium does not modify the chess state", () => {
      const chess = new Chess();
      const fenBefore = chess.fen();
      getAIMove(chess, "medium");
      expect(chess.fen()).toBe(fenBefore);
    });

    it("hard does not modify the chess state", () => {
      const chess = new Chess();
      const fenBefore = chess.fen();
      getAIMove(chess, "hard");
      expect(chess.fen()).toBe(fenBefore);
    });
  });

  describe("evaluateBoard", () => {
    it("returns 0 for starting position (symmetric)", () => {
      const chess = new Chess();
      const score = evaluateBoard(chess);
      // The starting position is symmetric but PST values may not be perfectly symmetric
      // so we allow a small tolerance
      expect(Math.abs(score)).toBeLessThan(1);
    });

    it("returns positive score when white has more material", () => {
      // White has queen + king, black has only king
      const chess = new Chess("4k3/8/8/8/8/8/8/4K2Q w - - 0 1");
      const score = evaluateBoard(chess);
      expect(score).toBeGreaterThan(0);
    });

    it("returns negative score when black has more material", () => {
      // Black has queen + king, white has only king
      const chess = new Chess("4k2q/8/8/8/8/8/8/4K3 w - - 0 1");
      const score = evaluateBoard(chess);
      expect(score).toBeLessThan(0);
    });
  });
});
