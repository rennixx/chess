import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, Radius } from "../../utils/constants";
import { PillButton } from "../../components/ui/PillButton";
import { useGameStore, type Difficulty } from "../../state/gameStore";

interface GameSetupScreenProps { onStart: () => void; }

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
