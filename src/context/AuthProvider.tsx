import React, { createContext, useContext, useState, useEffect } from 'react';
import { setTokens, getTokens, clearTokens } from './tokenStorage';
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

interface AuthContextType {
    user: User | null;
    curTokens: Tokens | null;
    isLoading: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => void;
    getUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [curTokens, setCurTokens] = useState<Tokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = () => {
        setUser(null);
        setCurTokens(null);
        clearTokens();
    };

    const getUser = async () => {
        try {
            const response = await api.get("/user");
            const userProfile = response.data.data || response.data;
            setUser(userProfile);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            // If fetching the user fails, the token is likely invalid, so log out.
            await logout();
        }
    }

    const isLoggedIn = async () => {
        try {
            const tokens = await getTokens();
            if (tokens?.accessToken && tokens?.refreshToken) {
                setCurTokens(tokens);
                await getUser();
            }
        } catch (error) {
            console.error("Error during initial login check:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData: User) => {
        setIsLoading(true);
        if (!userData || !userData.accessToken || !userData.refreshToken) {
            console.error("Login failed: User data or tokens are missing.");
            setIsLoading(false);
            return;
        }
        await setTokens(userData.accessToken, userData.refreshToken);
        setCurTokens({ accessToken: userData.accessToken, refreshToken: userData.refreshToken });
        await getUser();
        setIsLoading(false);
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ user, curTokens, isLoading, login, logout, getUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};