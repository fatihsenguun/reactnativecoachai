import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack'

const RootStack = () => {
    return (
        <NavigationContainer>
            <AuthStack />
        </NavigationContainer>
    )
}

export default RootStack

const styles = StyleSheet.create({})