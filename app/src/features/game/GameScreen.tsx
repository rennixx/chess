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
  const newGame = useGameStore((s) => s.newGame);
  const undoMove = useGameStore((s) => s.undoMove);
  const flipBoard = useGameStore((s) => s.flipBoard);

  const statusText = gameStatus === "playing"
    ? chess.turn() === playerColor ? "Your turn" : "Thinking..."
    : gameStatus === "checkmate" ? (chess.turn() === playerColor ? "You lost" : "You won!")
    : gameStatus === "stalemate" ? "Stalemate"
    : gameStatus === "draw" ? "Draw"
    : gameStatus === "resigned" ? "You resigned" : "";

  return (
    <View style={styles.container}>
      <View style={styles.playerBar}>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary }]}>
          {playerColor === "w" ? "Black" : "White"} (AI)
        </Text>
      </View>

      <Board useStore={useGameStore} />

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
