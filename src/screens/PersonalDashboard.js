import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSteps } from '../context/StepsContext';
import StepCounter from '../components/StepCounter';

const { width } = Dimensions.get('window');

const PersonalDashboard = () => {
  const {
    personalSteps,
    setPersonalSteps,
    dailyGoal,
    weeklySteps,
  } = useSteps();

  const [animatedSteps, setAnimatedSteps] = useState(0);

  useEffect(() => {
    // Animate step count
    const timer = setInterval(() => {
      setAnimatedSteps((prev) => {
        if (prev < personalSteps) {
          return Math.min(prev + Math.ceil((personalSteps - prev) / 10), personalSteps);
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [personalSteps]);

  const progressPercentage = Math.min((personalSteps / dailyGoal) * 100, 100);
  const caloriesBurned = Math.round(personalSteps * 0.04);
  const distanceKm = (personalSteps * 0.0008).toFixed(2);
  const activeMinutes = Math.round(personalSteps / 100);

  const getProgressColor = () => {
    if (progressPercentage >= 100) return '#4CAF50';
    if (progressPercentage >= 70) return '#8BC34A';
    if (progressPercentage >= 40) return '#FFC107';
    return '#FF9800';
  };

  const maxWeeklySteps = Math.max(...weeklySteps.map(d => d.steps), 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.greeting}>Hello!</Text>
            <Ionicons name="hand-right" size={28} color="#FFB800" />
          </View>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Main Step Counter Card */}
        <View style={styles.mainCard}>
          <View style={styles.stepsCircleContainer}>
            <View style={[styles.stepsCircle, { borderColor: getProgressColor() }]}>
              <FontAwesome5 name="shoe-prints" size={32} color="#6C63FF" />
              <Text style={styles.stepsCount}>{animatedSteps.toLocaleString()}</Text>
              <Text style={styles.stepsLabel}>steps today</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%`, backgroundColor: getProgressColor() },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progressPercentage.toFixed(0)}% of {dailyGoal.toLocaleString()} goal
            </Text>
          </View>

          {/* Step Counter Component (handles pedometer) */}
          <StepCounter onStepsUpdate={setPersonalSteps} />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <MaterialCommunityIcons name="fire" size={28} color="#FF5722" />
            <Text style={styles.statValue}>{caloriesBurned}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
            <MaterialCommunityIcons name="map-marker-distance" size={28} color="#9C27B0" />
            <Text style={styles.statValue}>{distanceKm}</Text>
            <Text style={styles.statLabel}>Km</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="clock-outline" size={28} color="#4CAF50" />
            <Text style={styles.statValue}>{activeMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        {/* Weekly Overview */}
        <View style={styles.weeklyCard}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.chartContainer}>
            {weeklySteps.map((day, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(day.steps / maxWeeklySteps) * 100}%`,
                        backgroundColor: index === 6 ? '#6C63FF' : '#E0E0E0',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Motivation Card */}
        <View style={styles.motivationCard}>
          <View style={styles.motivationIconContainer}>
            {progressPercentage >= 100 ? (
              <Ionicons name="trophy" size={40} color="#FFD700" />
            ) : progressPercentage >= 50 ? (
              <MaterialCommunityIcons name="arm-flex" size={40} color="#FFFFFF" />
            ) : (
              <MaterialCommunityIcons name="walk" size={40} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.motivationText}>
            {progressPercentage >= 100
              ? 'Amazing! You crushed your goal today!'
              : progressPercentage >= 50
              ? 'Great progress! Keep moving!'
              : 'Every step counts! Get moving!'}
          </Text>
        </View>
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  stepsCircleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  stepsIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  stepsCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  stepsLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  weeklyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 100,
    width: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 6,
  },
  motivationCard: {
    backgroundColor: '#6C63FF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 100,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationIconContainer: {
    marginRight: 16,
  },
  motivationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default PersonalDashboard;
