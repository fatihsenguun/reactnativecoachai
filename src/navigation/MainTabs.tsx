import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import DashboardStack from './DashboardStack';
import WorkoutCreate from '../pages/WorkoutCreate';
import BottomTabs from './BottomTabs';
import WorkoutDetails from '../pages/WorkoutDetails';

const MainTabs = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen name="WorkoutCreate" component={WorkoutCreate} />
              <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} />
        </Stack.Navigator>
    )
}

export default MainTabs

const styles = StyleSheet.create({})