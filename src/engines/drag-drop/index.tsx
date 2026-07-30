import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { EngineProps, DragDropPayload, EngineResult } from '@/core/types';
import type { GameEngine } from '@/core/types';
import { colors, radius, spacing, typography } from '@/theme';

function DragDropEngine({ payload, onComplete, onProgress }: EngineProps<DragDropPayload>) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const startTime = useRef(Date.now());
  const mistakes = useRef<string[]>([]);

  const placedItems = new Set(Object.keys(placements));
  const availableItems = payload.items.filter((i) => !placedItems.has(i.id));

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleZonePress = (zoneId: string) => {
    if (!selectedItem) return;

    const correctZone = payload.correctMapping[selectedItem];
    const newPlacements = { ...placements, [selectedItem]: zoneId };
    setPlacements(newPlacements);
    setSelectedItem(null);

    if (correctZone !== zoneId) {
      mistakes.current.push(`${selectedItem}->${zoneId}`);
      // MBA-BENCHMARK-001 Control of Error — alarm yok
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const progress = Object.keys(newPlacements).length / payload.items.length;
    onProgress?.(progress);

    if (Object.keys(newPlacements).length === payload.items.length) {
      const correct = payload.items.filter(
        (i) => payload.correctMapping[i.id] === newPlacements[i.id],
      ).length;

      const result: EngineResult = {
        correct,
        total: payload.items.length,
        score: Math.round((correct / payload.items.length) * 100),
        timeSpentMs: Date.now() - startTime.current,
        mistakes: mistakes.current,
        completed: true,
      };
      onComplete(result);
    }
  };

  const getZoneItems = (zoneId: string) =>
    Object.entries(placements)
      .filter(([, z]) => z === zoneId)
      .map(([itemId]) => payload.items.find((i) => i.id === itemId)!);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.instruction}>{payload.instruction}</Text>

      <View style={styles.zonesRow}>
        {payload.zones.map((zone) => {
          const zoneItems = getZoneItems(zone.id);
          const isHighlighted = selectedItem !== null;
          return (
            <TouchableOpacity
              key={zone.id}
              style={[styles.zone, isHighlighted && styles.zoneActive]}
              onPress={() => handleZonePress(zone.id)}
              disabled={!selectedItem}
            >
              <Text style={styles.zoneLabel}>{zone.label}</Text>
              <View style={styles.zoneContent}>
                {zoneItems.map((item) => (
                  <View key={item.id} style={styles.placedItem}>
                    {item.emoji ? <Text style={styles.emoji}>{item.emoji}</Text> : null}
                    <Text style={styles.itemText}>{item.content}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Sürükle ve bırak:</Text>
      <View style={styles.itemsRow}>
        {availableItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.draggableItem, selectedItem === item.id && styles.itemSelected]}
            onPress={() => handleItemSelect(item.id)}
          >
            {item.emoji ? <Text style={styles.emoji}>{item.emoji}</Text> : null}
            <Text style={styles.itemText}>{item.content}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {payload.hint ? <Text style={styles.hint}>💡 {payload.hint}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.lg },
  instruction: { ...typography.heading, color: colors.text, textAlign: 'center' },
  zonesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  zone: {
    flex: 1,
    minWidth: 140,
    minHeight: 120,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: spacing.md,
    alignItems: 'center',
  },
  zoneActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  zoneLabel: { ...typography.bodyBold, color: colors.primary, marginBottom: spacing.sm },
  zoneContent: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'center' },
  placedItem: {
    backgroundColor: colors.successLight,
    borderRadius: radius.sm,
    padding: spacing.xs,
    alignItems: 'center',
  },
  sectionTitle: { ...typography.subheading, color: colors.text },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  draggableItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    minWidth: 80,
  },
  itemSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  emoji: { fontSize: 28 },
  itemText: { ...typography.bodyBold, color: colors.text },
  hint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});

export const dragDropEngine: GameEngine<DragDropPayload> = {
  id: 'drag_drop',
  name: 'Sürükle Bırak Motoru',
  description: 'Öğeleri doğru kategorilere yerleştir',
  Component: DragDropEngine,
};
