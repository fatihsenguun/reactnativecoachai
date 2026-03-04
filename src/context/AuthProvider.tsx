import React, { createContext, useContext, useState, useEffect } from 'react';
import { setTokens, getTokens, clearTokens } from './tokenStorage';

interface User {
    accessToken: string;
    refreshToken: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            const tokens = await getTokens();
            if (tokens && tokens.accessToken) {
                setUser({
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
        setUser(userData);
        console.log(userData);
        await setTokens(userData.accessToken, userData.refreshToken);
    };

    const logout = () => {
        setUser(null);
        clearTokens();
    };


    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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