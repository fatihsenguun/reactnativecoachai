import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = ({ navigation }: any) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (text: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(text);
    };

    const handleSignin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const url = "http://localhost:8080/authenticate";
            const response = await axios.post(url, {
                email: email.trim(),
                password: password
            });

            if (response.data?.data) {
                await login(response.data.data);
            } else {
                const serverMsg = response.data?.errorMessage || "An unknown error occurred.";
                Alert.alert("Sign In Failed", serverMsg);
            }

        } catch (error) {
            const axiosError = error as AxiosError;
            let title = "Error";
            let message = "An unexpected error occurred. Please try again.";

            if (axiosError.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const status = axiosError.response.status;
                if (status === 401 || status === 403) {
                    title = "Authentication Failed";
                    message = "Please check your email and password.";
                } else if (status === 429) {
                    title = "Too Many Requests";
                    message = "You're trying to log in too frequently. Please wait a moment.";
                } else if (status >= 500) {
                    title = "Server Error";
                    message = "There's an issue with our server. Please try again later.";
                }
            } else if (axiosError.request) {
                // The request was made but no response was received
                title = "Network Error";
                message = "Could not connect to the server. Please check your internet connection.";
            }

            Alert.alert(title, message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Image
                        style={styles.logo}
                        source={require("../assets/women.png")}
                        resizeMode='contain'
                    />

                    <Text style={styles.mainTitle}>Sign In</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#444"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#444"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSignin}
                        style={styles.primaryButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>Get Started</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        style={styles.secondaryAction}
                    >
                        <Text style={styles.footerText}>
                            Don't have an account? <Text style={styles.highlight}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'
    },
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        paddingHorizontal: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 220,
        height: 220,
        marginBottom: 20
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 40,
        letterSpacing: -1
    },
    inputWrapper: {
        width: '100%',
        gap: 12,
        marginBottom: 30
    },
    input: {
        width: '100%',
        height: 55,
        backgroundColor: '#111',
        borderRadius: 12,
        paddingHorizontal: 20,
        color: '#FFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#222'
    },
    primaryButton: {
        width: '100%',
        height: 55,
        backgroundColor: '#D6FA6F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#D6FA6F',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700'
    },
    secondaryAction: {
        marginTop: 25
    },
    footerText: {
        color: '#666',
        fontSize: 14
    },
    highlight: {
        color: '#D6FA6F',
        fontWeight: '600'
    }
});