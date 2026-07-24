import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '@/theme';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  color?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  badge?: string;
  progress?: number;
}

export function Card({
  title,
  subtitle,
  icon,
  color = colors.primary,
  onPress,
  children,
  style,
  badge,
  progress,
}: CardProps) {
  const content = (
    <View style={[styles.card, style]}>
      {icon ? (
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      ) : null}
      <View style={styles.content}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {progress !== undefined ? (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
          </View>
        ) : null}
        {children}
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} accessibilityRole="button">
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 28 },
  content: { flex: 1 },
  title: { ...typography.subheading, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radius.full },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: { ...typography.caption, color: colors.textLight, fontWeight: '700' },
});
