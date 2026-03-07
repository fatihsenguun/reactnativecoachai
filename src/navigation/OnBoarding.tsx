import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FitnessProfile from '../pages/FitnessProfile';
import StartPage from '../pages/StartPage';
import WorkoutCreate from '../pages/WorkoutCreate';
import { useWorkout } from '../context/WorkoutProvider';

const OnBoarding = () => {
       const {programData} = useWorkout();
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StartPage" component={StartPage} />
            <Stack.Screen name="WorkoutCreate" component={WorkoutCreate} />

        </Stack.Navigator>
    )
}

export default OnBoarding

const styles = StyleSheet.create({})