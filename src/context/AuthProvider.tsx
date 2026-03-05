import React, { createContext, useContext, useState, useEffect } from 'react';
import { setTokens, getTokens, clearTokens } from './tokenStorage';
import axios from 'axios';
import api from '../config/apiClient';

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface User {
    accessToken: string;
    refreshToken: string;
    firstName: string,
    lastName: string,
    role: string,
    onboardingCompleted: boolean
}
interface FitnessProfile {
    weightKg: number;
    heightCm: number;
    age: number,
    sportsHistory: string,
    currentGoal: string,

}


interface AuthContextType {
    user: User | null;
    curTokens: Tokens | null;
    isLoading: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [curTokens, setCurTokens] = useState<Tokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            const tokens = await getTokens();
            if (tokens && tokens.accessToken) {
                setCurTokens({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                });
            }
        } catch (error) {
            console.log("Token error: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData: User) => {
        await setTokens(userData.accessToken, userData.refreshToken);
        try {
            const response = await api.get("/user", {})
            const userProfile = response.data.data ? response.data.data : response.data;
            setUser(userProfile);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        setUser(null);
        clearTokens();
    };


    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ user, curTokens, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};