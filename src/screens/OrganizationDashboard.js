import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSteps } from '../context/StepsContext';

const OrganizationDashboard = () => {
  const {
    organizationMembers,
    getTopPerformers,
  } = useSteps();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const topPerformers = getTopPerformers(3);

  const getMedalIcon = (index) => {
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    if (index < 3) {
      return <Ionicons name="medal" size={22} color={colors[index]} />;
    }
    return <Text style={styles.rankNumber}>{index + 1}</Text>;
  };

  const renderLeaderboardItem = ({ item, index }) => (
    <View
      style={[
        styles.leaderboardItem,
        index < 3 && styles.topThreeItem,
        index === 0 && styles.firstPlace,
      ]}
    >
      <View style={styles.rankContainer}>
        {getMedalIcon(index)}
      </View>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={36} color="#6C63FF" />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberSteps}>
          {item.steps.toLocaleString()} steps
        </Text>
      </View>
      <View style={styles.stepsProgressContainer}>
        <View
          style={[
            styles.miniProgress,
            { width: `${Math.min((item.steps / 15000) * 100, 100)}%` },
          ]}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Organization</Text>
          <Ionicons name="business" size={28} color="#6C63FF" />
        </View>
        <Text style={styles.subtitle}>Leaderboard</Text>
      </View>

      {/* Leaderboard Content */}
      <View style={styles.leaderboardContainer}>
        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {topPerformers.length >= 3 && (
            <>
              {/* Second Place */}
              <View style={[styles.podiumItem, styles.secondPlace]}>
                <Ionicons name="person-circle" size={40} color="#C0C0C0" />
                <Text style={styles.podiumName}>{topPerformers[1].name.split(' ')[0]}</Text>
                <Text style={styles.podiumSteps}>{(topPerformers[1].steps / 1000).toFixed(1)}k</Text>
                <View style={[styles.podiumBar, { height: 60, backgroundColor: '#C0C0C0' }]}>
                  <Ionicons name="medal" size={24} color="#FFFFFF" />
                </View>
              </View>

              {/* First Place */}
              <View style={[styles.podiumItem, styles.firstPlacePodium]}>
                <Ionicons name="person-circle" size={40} color="#FFD700" />
                <Text style={styles.podiumName}>{topPerformers[0].name.split(' ')[0]}</Text>
                <Text style={styles.podiumSteps}>{(topPerformers[0].steps / 1000).toFixed(1)}k</Text>
                <View style={[styles.podiumBar, { height: 80, backgroundColor: '#FFD700' }]}>
                  <Ionicons name="medal" size={24} color="#FFFFFF" />
                </View>
              </View>

              {/* Third Place */}
              <View style={[styles.podiumItem, styles.thirdPlace]}>
                <Ionicons name="person-circle" size={40} color="#CD7F32" />
                <Text style={styles.podiumName}>{topPerformers[2].name.split(' ')[0]}</Text>
                <Text style={styles.podiumSteps}>{(topPerformers[2].steps / 1000).toFixed(1)}k</Text>
                <View style={[styles.podiumBar, { height: 40, backgroundColor: '#CD7F32' }]}>
                  <Ionicons name="medal" size={24} color="#FFFFFF" />
                </View>
              </View>
            </>
          )}
        </View>

        {/* Full Leaderboard */}
        <FlatList
          data={[...organizationMembers].sort((a, b) => b.steps - a.steps)}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  leaderboardContainer: {
    flex: 1,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  podiumAvatar: {
    fontSize: 32,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  podiumSteps: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  podiumBar: {
    width: 60,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumRank: {
    fontSize: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  topThreeItem: {
    borderWidth: 1,
  },
  firstPlace: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFEF0',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '600',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A2E',
  },
  memberSteps: {
    fontSize: 12,
    color: '#666',
  },
  stepsProgressContainer: {
    width: 60,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgress: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
});

export default OrganizationDashboard;
