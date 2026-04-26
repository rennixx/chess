import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Colors, Radius, Typography } from "../../utils/constants";

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function PillButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
}: PillButtonProps) {
  const bg =
    variant === "primary"
      ? Colors.accent
      : variant === "secondary"
        ? Colors.surfaceMid
        : "transparent";
  const textColor = variant === "primary" ? "#000" : Colors.textPrimary;
  const border =
    variant === "outline"
      ? { borderWidth: 1, borderColor: Colors.borderLight }
      : {};
  const padding =
    size === "sm"
      ? { paddingVertical: 6, paddingHorizontal: 14 }
      : size === "lg"
        ? { paddingVertical: 12, paddingHorizontal: 43 }
        : { paddingVertical: 8, paddingHorizontal: 16 };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        { backgroundColor: bg },
        border,
        padding,
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={[Typography.button, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
