import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Card } from "../../components/ui/Card";
import { useSettingsStore } from "../../state/settingsStore";
import { setLocale } from "../../core/i18n";
import { Colors, Typography, Spacing, Radius } from "../../utils/constants";

const LANGUAGES = [
  { key: "en", label: "English" },
  { key: "sorani", label: "سۆرانی" },
  { key: "kurmanji", label: "Kurmancî" },
] as const;

export function SettingsScreen() {
  const { language } = useSettingsStore();
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <View style={styles.container}>
      <Text style={[Typography.heading, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>Settings</Text>
      <Card>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>Language</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => (
            <Pressable key={lang.key} onPress={() => {
              setLanguage(lang.key);
              setLocale(lang.key);
            }} style={[styles.langOption, language === lang.key && styles.langActive]}>
              <Text style={[Typography.body, { color: language === lang.key ? Colors.accent : Colors.textSecondary }]}>{lang.label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.xl },
  langRow: { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
  langOption: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.pill, backgroundColor: Colors.surfaceMid },
  langActive: { borderWidth: 1, borderColor: Colors.accent },
});
