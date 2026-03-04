import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useState } from 'react'
import { getTokens } from './tokenStorage';

interface User {
    accessToken: string;
    refreshToken: string;
}

export const AuthContext=createContext(null);
const [user, setUser] = useState<User | null>(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            const tokens = await getTokens();


            if (tokens && tokens.accessToken) {

                setUser({
                    accessToken: tokens.accessToken ,
                    refreshToken: tokens.refreshToken
                });
              //  await fetchUser();
            }
        } catch (error) {
            console.log("Token error: ", error);
        } finally {

            setIsLoading(false);
        }
    }


const AuthProvider = () => {
  return (
    <View>
      <Text>AuthProvider</Text>
    </View>
  )
}

export default AuthProvider

const styles = StyleSheet.create({})