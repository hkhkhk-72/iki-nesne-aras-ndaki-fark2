import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';
import {
  loadSettings,
  saveSettings,
  type AppSettings,
  type TextScale,
  defaultSettings,
} from '@/core/settings-store';
import { colors, spacing, typography, radius } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const patch = useCallback(async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      void saveSettings(next);
      return next;
    });
  }, []);

  if (!loaded) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Ayarlar" onBack={() => router.back()} />
        <Text style={styles.loading}>Yükleniyor…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Ayarlar" subtitle="Erişilebilirlik · performans" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.section}>Deneyim</Text>
        <Row
          label="Ses"
          hint="Silent Mode: animasyon anlamı korunur"
          value={settings.soundEnabled}
          onChange={(v) => patch('soundEnabled', v)}
        />
        <Row
          label="Altyazı / metin"
          hint="Karakter replikleri"
          value={settings.captionsEnabled}
          onChange={(v) => patch('captionsEnabled', v)}
        />
        <Row
          label="Hareketi azalt"
          hint="Animasyonları sadeleştir"
          value={settings.reduceMotion}
          onChange={(v) => patch('reduceMotion', v)}
        />
        <Row
          label="Motor destek"
          hint="Daha büyük dokunma alanları"
          value={settings.motorAssist}
          onChange={(v) => patch('motorAssist', v)}
        />

        <Text style={styles.section}>Yazı boyutu</Text>
        <View style={styles.chipRow}>
          {(
            [
              ['normal', 'Normal'],
              ['buyuk', 'Büyük'],
              ['cok_buyuk', 'Çok büyük'],
            ] as const
          ).map(([id, label]) => (
            <Pressable
              key={id}
              onPress={() => patch('textScale', id as TextScale)}
              style={[styles.chip, settings.textScale === id && styles.chipActive]}
            >
              <Text style={[styles.chipText, settings.textScale === id && styles.chipTextActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.note}>
          Zaman baskısı kapalıdır (MBA-BENCHMARK-001). Ayarlar bu cihazda saklanır.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: { ...typography.body, color: colors.textSecondary, padding: spacing.lg },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  section: { ...typography.subheading, color: colors.text, marginTop: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { ...typography.bodyBold, color: colors.text },
  rowHint: { ...typography.caption, color: colors.textSecondary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { ...typography.bodyBold, color: colors.textSecondary },
  chipTextActive: { color: colors.primary },
  note: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.md },
});
