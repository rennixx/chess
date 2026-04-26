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
  const { currentPuzzle, attempts, solved, chess } = usePuzzleStore();
  const loadPuzzle = usePuzzleStore((s) => s.loadPuzzle);
  const showSolution = usePuzzleStore((s) => s.showSolution);
  const nextPuzzle = usePuzzleStore((s) => s.nextPuzzle);

  useEffect(() => { if (!currentPuzzle) loadPuzzle(SAMPLE_PUZZLE); }, []);

  const puzzleBoardStore = () => {
    const state = usePuzzleStore.getState();
    return {
      chess: state.chess!,
      selectedSquare: state.selectedSquare,
      legalMoves: state.legalMoves,
      lastMove: state.lastMove,
      isBoardFlipped: false,
      selectSquare: (sq: string | null) => {
        if (!sq || !state.chess) return;
        const moves = state.chess.moves({ square: sq as any, verbose: true });
        usePuzzleStore.setState({ selectedSquare: moves.length > 0 ? sq : null, legalMoves: moves.map((m: any) => m.to) });
      },
      makeMove: (m: { from: string; to: string }) => usePuzzleStore.getState().attemptMove(m.from, m.to),
    };
  };

  if (!chess) return <View style={styles.container}><Text style={[Typography.body, { color: Colors.textSecondary }]}>Loading puzzle...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={[Typography.heading, { color: Colors.textPrimary }]}>{solved ? "Solved!" : "Find the best move"}</Text>
      <Board useStore={puzzleBoardStore} />
      <View style={styles.info}>
        <Text style={[Typography.small, { color: Colors.textSecondary }]}>Attempts: {attempts}</Text>
        {currentPuzzle && <Text style={[Typography.small, { color: Colors.textSecondary }]}>{currentPuzzle.theme} - {currentPuzzle.difficulty}</Text>}
      </View>
      <View style={styles.actions}>
        <PillButton label="Hint" onPress={() => { const hint = showSolution(); if (hint) alert(`Try: ${hint}`); }} variant="outline" size="sm" />
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
