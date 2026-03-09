import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../pages/Dashboard';
import WorkoutDetails from '../pages/WorkoutDetails';

const DashboardStack = () => {
        const Stack = createNativeStackNavigator();
  return (
     <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
  )
}

export default DashboardStack

const styles = StyleSheet.create({})