import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutCreate from '../pages/WorkoutCreate';
import BottomTabs from './BottomTabs';
import WorkoutDetails from '../pages/WorkoutDetails';
import { useAuth } from '../context/AuthProvider';
import AuthStack from './AuthStack';

const MainTabs = () => {
  const Stack = createNativeStackNavigator();
  const { user } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.onboardingCompleted ? (
          <>
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} />
          </>
        ) : (
          <Stack.Screen name="WorkoutCreate" component={WorkoutCreate} />
        )
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

export default MainTabs;