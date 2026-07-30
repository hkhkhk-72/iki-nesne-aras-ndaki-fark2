import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { initializeEngines } from '@/engines';
import { initializeSubjects } from '@/subjects';
import { colors } from '@/theme';

export default function RootLayout() {
  useEffect(() => {
    initializeEngines();
    initializeSubjects();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="grade/[grade]" />
        <Stack.Screen name="unit/[grade]/[unitId]" />
        <Stack.Screen name="outcome/[grade]/[outcomeId]" />
        <Stack.Screen name="activity/[grade]/[outcomeId]/[activityId]" />
        <Stack.Screen name="experience/[code]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="teacher/index" />
        <Stack.Screen name="smartboard/[grade]/[outcomeId]" />      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
