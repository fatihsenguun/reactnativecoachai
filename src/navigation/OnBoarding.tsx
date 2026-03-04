import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FitnessProfile from '../pages/FitnessProfile';
import StartPage from '../pages/StartPage';

const OnBoarding = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="StartPage" component={StartPage} />
            <Stack.Screen name="FitnessProfile" component={FitnessProfile} />
   
        </Stack.Navigator>
    )
}

export default OnBoarding

const styles = StyleSheet.create({})