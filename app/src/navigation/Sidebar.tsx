import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, Radius } from "../utils/constants";

const NAV_ITEMS = ["Home", "Play", "Puzzles", "Profile"] as const;

export function Sidebar() {
  const [active, setActive] = useState<string>("Home");
  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={[Typography.title, { color: Colors.accent, padding: Spacing.lg }]}>chess.krd</Text>
        {NAV_ITEMS.map((item) => (
          <Pressable key={item} onPress={() => setActive(item)} style={[styles.navItem, active === item && styles.navItemActive]}>
            <Text style={[Typography.nav, { color: active === item ? Colors.textPrimary : Colors.textSecondary }]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.content}>
        <Text style={[Typography.body, { color: Colors.textSecondary }]}>{active} content</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: Colors.background },
  sidebar: { width: 240, backgroundColor: Colors.surface, paddingVertical: Spacing.md, gap: 2 },
  navItem: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.md },
  navItemActive: { backgroundColor: Colors.surfaceMid },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
});
