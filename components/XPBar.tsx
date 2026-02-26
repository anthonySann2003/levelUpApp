import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useCharacterStore } from '../store/habitsStore';

export default function XpBar() {
  const { currentXp, xpToNextLevel, lastXpGained } = useCharacterStore();

  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  const xpPercentage = (currentXp / xpToNextLevel) * 100;

  useEffect(() => {
    if (lastXpGained === 0) return;

    translateY.setValue(-80);
    opacity.setValue(0);
    barWidth.setValue(((currentXp - lastXpGained) / xpToNextLevel) * 100);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(barWidth, {
        toValue: xpPercentage,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [lastXpGained]);

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ translateY }] }
    ]}>
      <Animated.View style={{ opacity }}>
        <View style={styles.row}>
          <Text style={styles.xpText}>XP</Text>
          <Text style={styles.xpGained}>+{lastXpGained} XP</Text>
          <Text style={styles.xpTotal}>{currentXp} / {xpToNextLevel}</Text>
        </View>

        <View style={styles.barBackground}>
          <Animated.View style={[
            styles.barFill,
            { width: barWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            })}
          ]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111827',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpText: {
    color: '#facc15',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  xpGained: {
    color: '#facc15',
    fontSize: 13,
    fontWeight: '700',
  },
  xpTotal: {
    color: '#9ca3af',
    fontSize: 12,
  },
  barBackground: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#facc15',
    borderRadius: 3,
  },
});