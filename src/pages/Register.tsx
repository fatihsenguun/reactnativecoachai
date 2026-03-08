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
import axios from 'axios';

const Register = ({ navigation }: any) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        try {
            setLoading(true);
            const url = "http://localhost:8080/register";
            const response = await axios.post(url, {
                firstName,
                lastName,
                email,
                password
            });

            if (response.data.result) {
                Alert.alert("Success", "Account created!", [
                    { text: "Login", onPress: () => navigation.navigate('Login') }
                ]);
            }
        } catch (error) {
            Alert.alert("Error", "Registration failed");
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