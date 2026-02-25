import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCharacterStore } from '../store/habitsStore';
import { Attribute } from '../types';

const ATTRIBUTES: { key: Attribute; icon: string; description: string }[] = [
  { key: 'STRENGTH', icon: '⚔️', description: 'Physical power and raw force' },
  { key: 'ENDURANCE', icon: '🛡️', description: 'Stamina and cardiovascular fitness' },
  { key: 'DISCIPLINE', icon: '🧘', description: 'Consistency and mental fortitude' },
  { key: 'FOCUS', icon: '🎯', description: 'Concentration and mindfulness' },
  { key: 'INTELLIGENCE', icon: '📘', description: 'Knowledge and continuous learning' },
  { key: 'AGILITY', icon: '⚡', description: 'Speed, flexibility and coordination' },
];

export default function OnboardingScreen() {
  const completeOnboarding = useCharacterStore(s => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [strongest, setStrongest] = useState<Attribute | null>(null);
  const [weakest, setWeakest] = useState<Attribute | null>(null);

  const handleFinish = () => {
    if (!name.trim() || !strongest || !weakest) return;
    completeOnboarding(name.trim(), strongest, weakest);
    router.replace('/character' as any);
  };

  // STEP 0 - Name input
  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>👋</Text>
      <Text style={styles.heading}>Welcome, Hero</Text>
      <Text style={styles.subheading}>Before your journey begins, what shall we call you?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name..."
        placeholderTextColor="#6b7280"
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Pressable
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={() => { if (name.trim()) setStep(1); }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );

  // STEP 1 - Attribute introduction
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.heading}>Your Attributes</Text>
      <Text style={styles.subheading}>Every hero has 6 core attributes that grow as you complete habits and quests.</Text>

      <View style={styles.attributeList}>
        {ATTRIBUTES.map(attr => (
          <View key={attr.key} style={styles.attributeRow}>
            <Text style={styles.attributeIcon}>{attr.icon}</Text>
            <View>
              <Text style={styles.attributeName}>{attr.key}</Text>
              <Text style={styles.attributeDesc}>{attr.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.button} onPress={() => setStep(2)}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );

  // STEP 2 - Strongest and weakest selection
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.heading}>Know Thyself</Text>
      <Text style={styles.subheading}>Which attribute are you currently strongest in?</Text>

      <View style={styles.chipGrid}>
        {ATTRIBUTES.map(attr => (
          <Pressable
            key={attr.key}
            style={[
              styles.chip,
              strongest === attr.key && styles.chipStrongest,
              weakest === attr.key && styles.chipDisabled,
            ]}
            onPress={() => {
              if (weakest === attr.key) return;
              setStrongest(attr.key);
            }}
          >
            <Text style={styles.chipIcon}>{attr.icon}</Text>
            <Text style={[
              styles.chipText,
              strongest === attr.key && styles.chipTextSelected,
            ]}>{attr.key}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.subheading, { marginTop: 24 }]}>Which attribute are you currently weakest in?</Text>

      <View style={styles.chipGrid}>
        {ATTRIBUTES.map(attr => (
          <Pressable
            key={attr.key}
            style={[
              styles.chip,
              weakest === attr.key && styles.chipWeakest,
              strongest === attr.key && styles.chipDisabled,
            ]}
            onPress={() => {
              if (strongest === attr.key) return;
              setWeakest(attr.key);
            }}
          >
            <Text style={styles.chipIcon}>{attr.icon}</Text>
            <Text style={[
              styles.chipText,
              weakest === attr.key && styles.chipTextSelected,
            ]}>{attr.key}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.button, (!strongest || !weakest) && styles.buttonDisabled]}
        onPress={handleFinish}
      >
        <Text style={styles.buttonText}>Begin Journey</Text>
      </Pressable>
    </View>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  stepContainer: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  heading: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subheading: {
    color: '#9ca3af',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    backgroundColor: '#111827',
    color: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    backgroundColor: '#facc15',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
  attributeList: {
    width: '100%',
    marginBottom: 24,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  attributeIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  attributeName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  attributeDesc: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 6,
  },
  chipStrongest: {
    backgroundColor: '#facc15',
    borderColor: '#facc15',
  },
  chipWeakest: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  chipDisabled: {
    opacity: 0.3,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  chipTextSelected: {
    color: '#000000',
  },
});