import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AuthProvider from './AuthProvider'
import WorkoutProvider from './WorkoutProvider'

const RootProvider = ({ children }: { children: any }) => {
    return (
        <AuthProvider>
            <WorkoutProvider>
                {children}
            </WorkoutProvider>
        </AuthProvider>
    )
}

export default RootProvider

const styles = StyleSheet.create({})