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
    ScrollView
} from 'react-native';


const Register = ({ navigation }: any) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}

        >
            <View style={styles.imageBox}>
                <Image style={styles.image} source={require("../assets/women.png")} resizeMode='center' />
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Create your CoachAI account</Text>

                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="#ffffff80"
                        value={name}
                        onChangeText={setName}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#ffffff80"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#ffffff80"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} >
                    <Text style={styles.buttonText}>CREATE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkContainer}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.linkText}>
                        Have an account ? <Text style={styles.linkHighlight}>Sign in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Register;

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%'
    },
    imageBox: {
        width: '100%',
        height: 200
    },
    container: {
        backgroundColor: '#151515', //  background color
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 350,
        height: 480,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#ffffff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#ffffffcc',
        marginBottom: 30,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 55,
        backgroundColor: '#ffffff20',
        borderRadius: 15,
        paddingHorizontal: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ffffff30',
    },
    button: {
        width: '100%',
        height: 55,
        backgroundColor: '#d6fa6f', // neon lime color
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#151515',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    linkContainer: {
        marginTop: 25,
    },
    linkText: {
        color: '#ffffffcc',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#d6fa6f',
        fontWeight: 'bold',
    }
});