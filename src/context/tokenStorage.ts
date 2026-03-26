import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'coach_ai_user_tokens';

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export const setTokens = async (accessToken: string, refreshToken: string) => {
    if (!accessToken || !refreshToken) {
        console.error("Attempted to store empty tokens");
        return;
    }
    try {
        const tokens = JSON.stringify({ accessToken, refreshToken });
        await SecureStore.setItemAsync(TOKEN_KEY, tokens);
    } catch (error) {
        console.error("Error saving tokens to secure store:", error);
    }
};

export const getTokens = async (): Promise<Tokens | null> => {
    try {
        const credentials = await SecureStore.getItemAsync(TOKEN_KEY);
        if (credentials) {
            try {
                return JSON.parse(credentials) as Tokens;
            } catch (error) {
                console.error("Error parsing tokens from secure store:", error);
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error("Error retrieving tokens from secure store:", error);
        return null;
    }
}

export const clearTokens = async () => {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error("Error clearing tokens:", error);
    }
};