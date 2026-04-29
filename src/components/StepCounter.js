import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

const StepCounter = ({ onStepsUpdate }) => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // Get steps from the past 24 hours
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0); // Start of today

        try {
          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepCountResult) {
            setCurrentStepCount(pastStepCountResult.steps);
            if (onStepsUpdate) {
              onStepsUpdate(pastStepCountResult.steps);
            }
          }
        } catch (error) {
          console.log('Error getting step count:', error);
        }

        // Subscribe to live step updates
        subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount((prevSteps) => {
            const newSteps = prevSteps + result.steps;
            if (onStepsUpdate) {
              onStepsUpdate(newSteps);
            }
            return newSteps;
          });
        });
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {isPedometerAvailable === 'checking' && (
        <Text style={styles.statusText}>Checking pedometer...</Text>
      )}
      {isPedometerAvailable === 'false' && (
        <View style={styles.unavailableContainer}>
          <Text style={styles.unavailableText}>📱</Text>
          <Text style={styles.statusText}>
            Pedometer not available on this device
          </Text>
          <Text style={styles.hintText}>
            {Platform.OS === 'ios' 
              ? 'Make sure you have granted motion permissions'
              : 'Your device may not support step counting'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    margin: 10,
  },
  unavailableText: {
    fontSize: 40,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default StepCounter;
