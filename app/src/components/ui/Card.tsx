import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors, Radius, Shadows } from "../../utils/constants";

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, elevated }: CardProps) {
  return (
    <View style={[styles.card, elevated && Shadows.medium]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
  },
});
