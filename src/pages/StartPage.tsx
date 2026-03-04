import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const StartPage = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* Background Glow Effect */}
                <View style={styles.glowOrb} />

                {/* Hero Image Section */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../assets/start.png')} 
                        style={styles.image} 
                        resizeMode='contain' 
                    />
                </View>

                {/* Bottom Content Area */}
                <View style={styles.bottomContent}>
                    {/* Two-tone Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Transform Your</Text>
                        <Text style={[styles.title, styles.titleHighlight]}>Body & Mind</Text>
                    </View>
                    
                    <Text style={styles.subtitle}>
                        Your AI-powered personal trainer is ready to build the perfect program for your goals.
                    </Text>

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('FitnessProfile')} 
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};

export default StartPage;

// --- Premium Dark Theme Colors ---
const BG_DARK = '#101010'; // Slightly richer dark than plain #151515
const BRAND_LIME = '#D6FA6F'; 
const BRAND_PURPLE = '#9D76F0'; // Match the reference image purple
const TEXT_WHITE = '#FFFFFF';
const TEXT_MUTED = '#A0A0A0';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG_DARK,
    },
    container: {
        flex: 1,
        backgroundColor: BG_DARK,
        justifyContent: 'space-between', 
    },

    glowOrb: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: width * 0.8,
        height: width * 0.8,
        backgroundColor: BRAND_PURPLE,
        borderRadius: width * 0.4,
        opacity: 0.15, 
        transform: [{ scaleX: 1.2 }], 
    },
    imageContainer: {
        flex: 1.2, 
        justifyContent: 'center', 
        alignItems: 'center',    
        width: '100%',
        paddingTop: 40, 
    },
    image: {
        width: '85%', 
        height: '85%',
        // Optional: drop shadow on the image itself if it's a transparent PNG
        shadowColor: BRAND_PURPLE,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    bottomContent: {
        flex: 1, // Takes up remaining space
        justifyContent: 'flex-end', // Pushes content to the bottom
        paddingHorizontal: 35,
        paddingBottom: Platform.OS === 'ios' ? 40 : 60, // Extra padding at the bottom
    },
    titleContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 38, // Much larger and punchier
        fontWeight: '900',
        color: TEXT_WHITE,
        textAlign: 'center',
        letterSpacing: -1,
        lineHeight: 44,
    },
    titleHighlight: {
        color: BRAND_PURPLE, // Makes the second line pop
    },
    subtitle: {
        fontSize: 16,
        color: TEXT_MUTED,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 45, // Creates space before the button
        paddingHorizontal: 10,
    },
    button: {
        width: '100%',
        height: 64, 
        backgroundColor: BRAND_LIME,
        borderRadius: 32, 
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: BRAND_LIME,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6, 
    },
    buttonText: {
        color: '#000000', 
        fontSize: 19,
        fontWeight: '800',
        letterSpacing: 0.5,
    }
});