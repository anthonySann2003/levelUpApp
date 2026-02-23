import { useAudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { useCharacterStore } from '../store/habitsStore';

export function useLevelUpSound() {
  const level = useCharacterStore(s => s.level);
  const player = useAudioPlayer(require('../assets/sounds/levelup.wav'));
  const prevLevel = useRef(level);

  useEffect(() => {
    if (level > prevLevel.current) {
      player.seekTo(0);
      player.play();
    }
    prevLevel.current = level;
  }, [level]);
}