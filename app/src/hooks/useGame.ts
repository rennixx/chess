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

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [chess.fen(), gameStatus, gameMode, playerColor, difficulty]);
}
