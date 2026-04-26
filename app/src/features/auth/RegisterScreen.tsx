import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { PillButton } from "../../components/ui/PillButton";
import { Colors, Typography, Spacing, Radius } from "../../utils/constants";

interface RegisterScreenProps {
  onRegister: (username: string, password: string) => Promise<void>;
  onGoToLogin: () => void;
}

export function RegisterScreen({ onRegister, onGoToLogin }: RegisterScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    await onRegister(username, password);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[Typography.title, { color: Colors.accent }]}>chess.krd</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>Create an account</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Username" placeholderTextColor={Colors.textSecondary} value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.textSecondary} value={password} onChangeText={setPassword} secureTextEntry />
        <PillButton label={loading ? "Creating..." : "Register"} onPress={handleRegister} disabled={loading} />
      </View>
      <Pressable onPress={onGoToLogin}>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Already have an account? <Text style={{ color: Colors.accent }}>Sign In</Text></Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center", padding: Spacing.xl, gap: Spacing.lg },
  form: { width: "100%", maxWidth: 400, gap: Spacing.md },
  input: { backgroundColor: Colors.surfaceMid, borderRadius: Radius.pill, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, color: Colors.textPrimary, fontSize: 16 },
});
