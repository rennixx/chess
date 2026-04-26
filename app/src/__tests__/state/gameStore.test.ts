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
    const result = useGameStore.getState().makeMove({ from: "e2", to: "e4" });
    expect(result).toBe(true);
    expect(useGameStore.getState().moveHistory).toContain("e4");
  });

  it("rejects an illegal move", () => {
    const result = useGameStore.getState().makeMove({ from: "e2", to: "e5" });
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
