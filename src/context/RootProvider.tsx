import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AuthProvider from './AuthProvider'
import WorkoutProvider from './WorkoutProvider'
import UserProvider from './UserProvider'

const RootProvider = ({ children }: { children: any }) => {
    return (
        <AuthProvider>
            <UserProvider>
                <WorkoutProvider>
                    {children}
                </WorkoutProvider>
            </UserProvider>
        </AuthProvider>
    )
}

export default RootProvider

const styles = StyleSheet.create({})