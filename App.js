import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StepsProvider } from './src/context/StepsContext';
import PersonalDashboard from './src/screens/PersonalDashboard';
import OrganizationDashboard from './src/screens/OrganizationDashboard';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, iconName, label }) => (
  <View style={styles.tabIconContainer}>
    <Ionicons 
      name={iconName} 
      size={24} 
      color={focused ? '#6C63FF' : '#999'} 
    />
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <StepsProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarShowLabel: false,
            }}
          >
            <Tab.Screen
              name="Personal"
              component={PersonalDashboard}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon focused={focused} iconName={focused ? "person" : "person-outline"} label="Personal" />
                ),
              }}
            />
            <Tab.Screen
              name="Organization"
              component={OrganizationDashboard}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon focused={focused} iconName={focused ? "people" : "people-outline"} label="Organization" />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </StepsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 0,
    paddingTop: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999',
  },
  tabLabelFocused: {
    color: '#6C63FF',
    fontWeight: '600',
  },
});
