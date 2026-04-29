import React, { createContext, useState, useContext, useEffect } from 'react';

const StepsContext = createContext();

// Mock data for organization members
const mockOrganizationMembers = [
  { id: '1', name: 'John Doe', steps: 8542, avatar: '👨' },
  { id: '2', name: 'Jane Smith', steps: 12350, avatar: '👩' },
  { id: '3', name: 'Mike Johnson', steps: 6789, avatar: '👨‍💼' },
  { id: '4', name: 'Sarah Williams', steps: 15234, avatar: '👩‍💼' },
  { id: '5', name: 'Tom Brown', steps: 9876, avatar: '🧑' },
  { id: '6', name: 'Emily Davis', steps: 11234, avatar: '👩‍🦰' },
  { id: '7', name: 'Chris Wilson', steps: 7654, avatar: '👨‍🦱' },
  { id: '8', name: 'Lisa Anderson', steps: 13456, avatar: '👩‍🦳' },
];

export const StepsProvider = ({ children }) => {
  const [personalSteps, setPersonalSteps] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [organizationMembers, setOrganizationMembers] = useState(mockOrganizationMembers);
  const [weeklySteps, setWeeklySteps] = useState([
    { day: 'Mon', steps: 8234 },
    { day: 'Tue', steps: 9542 },
    { day: 'Wed', steps: 7123 },
    { day: 'Thu', steps: 11234 },
    { day: 'Fri', steps: 6543 },
    { day: 'Sat', steps: 12345 },
    { day: 'Sun', steps: 0 },
  ]);

  const updatePersonalSteps = (steps) => {
    setPersonalSteps(steps);
  };

  const getTotalOrganizationSteps = () => {
    return organizationMembers.reduce((total, member) => total + member.steps, 0);
  };

  const getAverageOrganizationSteps = () => {
    if (organizationMembers.length === 0) return 0;
    return Math.round(getTotalOrganizationSteps() / organizationMembers.length);
  };

  const getTopPerformers = (count = 5) => {
    return [...organizationMembers]
      .sort((a, b) => b.steps - a.steps)
      .slice(0, count);
  };

  return (
    <StepsContext.Provider
      value={{
        personalSteps,
        setPersonalSteps,
        updatePersonalSteps,
        dailyGoal,
        setDailyGoal,
        weeklySteps,
        organizationMembers,
        getTotalOrganizationSteps,
        getAverageOrganizationSteps,
        getTopPerformers,
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};

export const useSteps = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error('useSteps must be used within a StepsProvider');
  }
  return context;
};

export default StepsContext;
