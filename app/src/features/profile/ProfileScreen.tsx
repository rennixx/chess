import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "../../components/ui/Card";
import { PillButton } from "../../components/ui/PillButton";
import { useUserStore } from "../../state/userStore";
import { Colors, Typography, Spacing } from "../../utils/constants";

export function ProfileScreen({ navigation }: any) {
  const { user, isAuthenticated } = useUserStore();
  const logout = useUserStore((s) => s.logout);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.avatar}>
          <Text style={[Typography.title, { color: Colors.accent }]}>{user?.username?.charAt(0)?.toUpperCase() ?? "?"}</Text>
        </View>
        <Text style={[Typography.heading, { color: Colors.textPrimary, textAlign: "center" }]}>{isAuthenticated ? user?.username : "Guest"}</Text>
        {isAuthenticated && <Text style={[Typography.caption, { color: Colors.accent, textAlign: "center" }]}>Rating: {user?.rating}</Text>}
      </Card>
      <Card>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={[Typography.bodyBold, { color: Colors.textPrimary }]}>0</Text><Text style={[Typography.small, { color: Colors.textSecondary }]}>Games</Text></View>
          <View style={styles.stat}><Text style={[Typography.bodyBold, { color: Colors.accent }]}>0</Text><Text style={[Typography.small, { color: Colors.textSecondary }]}>Wins</Text></View>
          <View style={styles.stat}><Text style={[Typography.bodyBold, { color: Colors.negative }]}>0</Text><Text style={[Typography.small, { color: Colors.textSecondary }]}>Losses</Text></View>
        </View>
      </Card>
      <PillButton label="Settings" onPress={() => navigation?.navigate("Settings")} variant="secondary" />
      {isAuthenticated && <PillButton label="Sign Out" onPress={logout} variant="outline" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, gap: Spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surfaceMid, justifyContent: "center", alignItems: "center", alignSelf: "center" },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 4 },
});
