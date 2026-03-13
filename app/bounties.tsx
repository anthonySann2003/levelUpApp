import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCharacterStore } from '../store/habitsStore';
import { Attribute, Quest } from '../types';
import { getTodayLocal } from '../utils/dateHelpers';

export default function BountiesScreen() {
  const { bounties, fetchBounties, habits, attributes, level, completedBounties, completeBounty } = useCharacterStore();
  const today = getTodayLocal();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchBounties({
        habits: habits.map(h => ({ name: h.name, attribute: h.attribute[0] })),
        attributes,
        level,
      });
      setLoading(false);
    };
    load();
  }, []);

  const renderBounty = (quest: Quest) => {
    const isCompleted = completedBounties.includes(quest.title);
  
    return (
      <View style={styles.questItem} key={quest.title}>
        <View style={styles.questLeft}>
          <Text style={styles.questIcon}>{quest.icon}</Text>
          <View>
            <Text style={[styles.questTitle, isCompleted && { color: '#9ca3af' }]}>{quest.title}</Text>
            <Text style={styles.questReward}>{quest.reward}</Text>
          </View>
        </View>
        <Pressable onPress={() => completeBounty(quest.title, quest.xpReward, quest.attribute as Attribute)}>
          <View style={[
            styles.questCircle,
            isCompleted && { backgroundColor: '#facc15', borderColor: '#facc15' }
          ]} />
        </Pressable>
      </View>
    );
  };
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Bounty Board</Text>
        <Text style={styles.subtitle}>THE KINGDOM'S BOUNTIES</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#facc15" />
          <Text style={styles.loadingText}>Generating your bounties...</Text>
        </View>
      ) : bounties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bounties available.</Text>
          <Text style={styles.emptySubtext}>Add some habits to get personalized bounties.</Text>
        </View>
      ) : (
        <FlatList
          data={bounties}
          keyExtractor={q => q.title}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => renderBounty(item)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '600',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 6,
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 6,
  },
  list: {
    padding: 20,
  },
  questItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#111827',
    borderRadius: 12,
    marginBottom: 12,
  },
  questLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  questTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  questReward: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  questCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#374151',
  },
});