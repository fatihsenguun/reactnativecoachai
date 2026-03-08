import React from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../pages/Profile';
import DashboardStack from './DashboardStack';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarIcon: ({ focused }) => {
                    let iconSource;
                    let label = '';

                    if (route.name === 'DashboardMain') {
                        iconSource = require('../assets/home.png');
                        label = 'HOME';
                    } else if (route.name === 'Profile') {
                        iconSource = require('../assets/user.png');
                        label = 'PROFILE';
                    }

                    return (
                        <View style={styles.iconContainer}>
                            <Image 
                                source={iconSource}
                                style={[
                                    styles.iconImage,
                                    { tintColor: focused ? '#A084E8' : '#8A8A8E' }
                                ]}
                                resizeMode="contain"
                            />
                            {focused && (
                                <Text style={styles.activeLabel}>
                                    {label}
                                </Text>
                            )}
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="DashboardMain" component={DashboardStack} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default BottomTabs;

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 25 : 15,
        left: 20,
        right: 20,
        backgroundColor: '#141415',
        borderRadius: 24,
        height: 70,
        borderWidth: 1,
        borderColor: '#242426',
        shadowColor: '#000',
        shadowOffset: { 
            width: 0, 
            height: 10 
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        paddingBottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        top: Platform.OS === 'ios' ? 15 : 0,
        height: '100%',
        width: 80
    },
    iconImage: {
        width: 24,
        height: 24
    },
    activeLabel: {
        color: '#A084E8',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        marginTop: 4,
        textAlign: 'center'
    }
});