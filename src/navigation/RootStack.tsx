import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack'
import { useAuth } from '../context/AuthProvider'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabs from './MainTabs'

const RootStack = () => {

const Stack = createNativeStackNavigator();
const {user, isLoading} = useAuth();

if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#151515' }}>
                <ActivityIndicator color="#d6fa6f" size="large" />
            </View>
        );
    }




    return (
       <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main" component={MainTabs} />
                ) : (

                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack

const styles = StyleSheet.create({})