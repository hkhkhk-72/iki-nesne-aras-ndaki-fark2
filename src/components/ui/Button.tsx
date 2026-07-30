import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, shadows, touchTarget, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  fullWidth = false,
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <>
          {icon ? <Text style={[styles.icon, sizeStyles.icon]}>{icon}</Text> : null}
          <Text style={[styles.label, variantStyles.text, sizeStyles.text]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function getVariantStyles(variant: ButtonVariant): {
  container: ViewStyle;
  text: TextStyle;
  textColor: string;
} {
  switch (variant) {
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary },
        text: { color: colors.textLight },
        textColor: colors.textLight,
      };
    case 'outline':
      return {
        container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary },
        text: { color: colors.primary },
        textColor: colors.primary,
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' },
        text: { color: colors.primary },
        textColor: colors.primary,
      };
    case 'success':
      return {
        container: { backgroundColor: colors.success },
        text: { color: colors.textLight },
        textColor: colors.textLight,
      };
    default:
      return {
        container: { backgroundColor: colors.primary, ...shadows.button },
        text: { color: colors.textLight },
        textColor: colors.textLight,
      };
  }
}

function getSizeStyles(size: ButtonSize) {
  switch (size) {
    case 'sm':
      return {
        container: { minHeight: touchTarget.min, paddingHorizontal: 16 },
        text: { ...typography.caption, fontWeight: '700' as const },
        icon: { fontSize: 16 },
      };
    case 'lg':
      return {
        container: { minHeight: touchTarget.large, paddingHorizontal: 32 },
        text: typography.button,
        icon: { fontSize: 24 },
      };
    default:
      return {
        container: { minHeight: touchTarget.comfortable, paddingHorizontal: 24 },
        text: typography.button,
        icon: { fontSize: 20 },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    gap: 8,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  label: { textAlign: 'center' },
  icon: {},
});
