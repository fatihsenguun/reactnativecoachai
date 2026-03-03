import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { NavigationContainer } from '@react-navigation/native';

const AuthStack = () => {
    const Stack = createNativeStackNavigator();

    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>

    )
}

export default AuthStack

const styles = StyleSheet.create({})