import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'coach_ai_user_tokens';

export const setTokens = async (accessToken: string, refreshToken: string) => {

    try {
        const tokens: any = JSON.stringify({ accessToken, refreshToken })
        await SecureStore.setItemAsync(TOKEN_KEY, tokens);

    } catch (error) {
        console.log(error);
    }
};

export const getTokens = async () => {

    try {
        const credentials = await SecureStore.getItemAsync(TOKEN_KEY);
        if (credentials) {
            return JSON.parse(credentials)
            console.log(credentials);
        }
        return null;
    } catch (error) {
        console.log(error);
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