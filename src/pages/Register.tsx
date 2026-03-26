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
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthProvider';
import axios, { AxiosError } from 'axios';

const Register = ({ navigation }: any) => {
    const { login } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (text: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(text);
    };

    const handleRegister = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Validation Error", "All fields are required.");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Validation Error", "Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Validation Error", "Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            const url = "http://localhost:8080/register";
            const response = await axios.post(url, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
            });

            if (response.data?.data) {
                await login(response.data.data);
            } else {
                const serverMsg = response.data?.errorMessage || "An unknown error occurred during registration.";
                Alert.alert("Registration Failed", serverMsg);
            }
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            let title = "Registration Error";
            let message = "An unexpected error occurred. Please try again.";

            if (axiosError.response) {
                const status = axiosError.response.status;
                const serverMsg = axiosError.response.data?.errorMessage;

                if (status === 409) {
                    title = "Registration Failed";
                    message = serverMsg || "An account with this email already exists.";
                } else if (status === 400) {
                    title = "Invalid Data";
                    message = serverMsg || "Please check the information you provided.";
                } else if (status >= 500) {
                    title = "Server Error";
                    message = "There's an issue with our server. Please try again later.";
                }
            } else if (axiosError.request) {
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
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.content}>
                        <Image 
                            style={styles.logo} 
                            source={require("../assets/women.png")} 
                            resizeMode='contain' 
                        />
                        
                        <Text style={styles.mainTitle}>Sign Up</Text>

                        <View style={styles.inputWrapper}>
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    placeholder="First"
                                    placeholderTextColor="#444"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    placeholder="Last"
                                    placeholderTextColor="#444"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                            
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
                            onPress={handleRegister} 
                            style={styles.primaryButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.buttonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={styles.secondaryAction}
                        >
                            <Text style={styles.footerText}>
                                Have an account? <Text style={styles.highlight}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Register;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'
    },
    container: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    content: {
        paddingHorizontal: 40,
        alignItems: 'center',
        paddingVertical: 20
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
    row: {
        flexDirection: 'row',
        width: '100%',
        gap: 12
    },
    halfInput: {
        flex: 1
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