import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { PillButton } from "../../components/ui/PillButton";
import { Card } from "../../components/ui/Card";
import { useUserStore } from "../../state/userStore";
import { Colors, Typography, Spacing } from "../../utils/constants";

export function HomeScreen({ navigation }: any) {
  const { user, isAuthenticated } = useUserStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[Typography.title, { color: Colors.textPrimary }]}>Welcome back</Text>

      <View style={styles.quickActions}>
        <PillButton label="New Game" onPress={() => navigation?.navigate("PlayTab", { screen: "GameSetup" })} size="lg" />
        <PillButton label="Daily Puzzle" onPress={() => navigation?.navigate("Puzzles")} variant="outline" size="lg" />
      </View>

      <Card>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary, marginBottom: Spacing.sm }]}>Rating</Text>
        <Text style={[Typography.title, { color: Colors.accent }]}>{isAuthenticated ? user?.rating ?? 1200 : "---"}</Text>
        <Text style={[Typography.small, { color: Colors.textSecondary }]}>Glicko-2</Text>
      </Card>

      <View style={styles.section}>
        <Text style={[Typography.heading, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>Recent Games</Text>
        <Card>
          <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: "center" }]}>No games yet. Start playing!</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, gap: Spacing.xl },
  quickActions: { gap: Spacing.md },
  section: { gap: Spacing.sm },
});
