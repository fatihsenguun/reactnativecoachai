import { ActivityIndicator, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { useAuth } from '../context/AuthProvider';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import OnBoarding from './OnBoarding';

const Stack = createNativeStackNavigator();

const RootStack = () => {
    const { user, isLoading } = useAuth();

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
                    // User is authenticated, check if they have completed onboarding
                    user.onboardingCompleted ? (
                        // Onboarding complete, show main app
                        <Stack.Screen name="Main" component={MainTabs} />
                    ) : (
                        // Onboarding not complete, show onboarding flow
                        <Stack.Screen name='OnBoarding' component={OnBoarding} />
                    )
                ) : (
                    // User is not authenticated, show login/register flow
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;