import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useCharacterStore } from '../store/habitsStore';

export default function LevelUpOverlay() {
  const { level, hasJustLeveledUp, clearLevelUp } = useCharacterStore();

  const isAnimating = useRef(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!hasJustLeveledUp) return;

    isAnimating.current = true;
    opacity.setValue(0);
    scale.setValue(0.8);

    Animated.sequence([
      // delay to let XP bar animation finish first
      Animated.delay(2000),
      // fade in and scale up
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // hold
      Animated.delay(2000),
      // fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      clearLevelUp();
    });
  }, [hasJustLeveledUp]);

  if (!hasJustLeveledUp && !isAnimating.current) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
        <Text style={styles.levelUpText}>LEVEL UP</Text>
        <Text style={styles.levelNumber}>{level}</Text>
        <Text style={styles.subtext}>Keep pushing, hero</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
  },
  levelUpText: {
    color: '#facc15',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 6,
    marginBottom: 16,
  },
  levelNumber: {
    color: '#facc15',
    fontSize: 120,
    fontWeight: '700',
    lineHeight: 130,
  },
  subtext: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 16,
    letterSpacing: 2,
  },
});