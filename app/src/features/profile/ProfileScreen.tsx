import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, Spacing } from "../../utils/constants";

export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={[Typography.title, { color: Colors.textPrimary }]}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", padding: Spacing.lg },
});
