import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FitnessProfile = ({ navigation }: any) => {
    const [weightKg, setWeightKg] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [age, setAge] = useState('');
    const [sportsHistory, setSportsHistory] = useState('');
    const [currentGoal, setCurrentGoal] = useState('');

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSaveProfile = () => {
        const payload = {
            weightKg: parseFloat(weightKg),
            heightCm: parseFloat(heightCm),
            age: parseInt(age, 10),
            sportsHistory: sportsHistory,
            currentGoal: currentGoal
        };
        
        console.log("Profile Data ready for API:", payload);
    };

    const getInputStyle = (fieldName: string) => {
        return [
            styles.input, 
            focusedField === fieldName ? styles.inputFocused : {}
        ];
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <View style={styles.header}>
                    <View style={styles.progressBarBackground}>
                        <View style={styles.progressBarFill} />
                    </View>
                </View>

                <ScrollView 
                    contentContainerStyle={styles.scrollContainer} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>What's your body profile?</Text>
                    <Text style={styles.subtitle}>
                        Your details will be used to calculate key indicators and generate your perfect program.
                    </Text>

                    <View style={styles.form}>
                        {/* Weight Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput
                                style={getInputStyle('weightKg')}
                                placeholder="e.g. 80"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={weightKg}
                                onChangeText={setWeightKg}
                                keyboardType="numeric"
                                onFocus={() => setFocusedField('weightKg')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Height Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <TextInput
                                style={getInputStyle('heightCm')}
                                placeholder="e.g. 180"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={heightCm}
                                onChangeText={setHeightCm}
                                keyboardType="numeric"
                                onFocus={() => setFocusedField('heightCm')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Age Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={getInputStyle('age')}
                                placeholder="e.g. 22"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                onFocus={() => setFocusedField('age')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Sports History Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Sports History (years)</Text>
                            <TextInput
                                style={getInputStyle('sportsHistory')}
                                placeholder="e.g. 4"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={sportsHistory}
                                onChangeText={setSportsHistory}
                                keyboardType="default" 
                                onFocus={() => setFocusedField('sportsHistory')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Goal Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Current Goal</Text>
                            <TextInput
                                style={getInputStyle('currentGoal')}
                                placeholder="e.g. Gaining Muscle"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={currentGoal}
                                onChangeText={setCurrentGoal}
                                autoCapitalize="words"
                                onFocus={() => setFocusedField('currentGoal')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Navigation Area */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        
                        <Image style={styles.left} source={require('../assets/left.png')}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSaveProfile} style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default FitnessProfile;

const BG_DARK = '#151515'; 
const CARD_DARK = '#1C1C1E'; 
const BRAND_PURPLE = '#A084E8'; 
const BRAND_LIME = '#d6fa6f';
const TEXT_WHITE = '#FFFFFF';
const TEXT_MUTED = '#8E8E93'; 
const BORDER_DARK = '#2C2C2E'; 
const PLACEHOLDER_COLOR = '#666666';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG_DARK,
    },
    container: {
        flex: 1,
        backgroundColor: BG_DARK,
    },
    header: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 10,
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: CARD_DARK,
        borderRadius: 3,
        width: '100%',
    },
    progressBarFill: {
        height: 6,
        backgroundColor: BRAND_PURPLE, 
        borderRadius: 3,
        width: '33%', 
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingBottom: 40,
        paddingTop: 10,
    },
    left:{
        width:30,
        height:30
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: TEXT_WHITE,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: TEXT_MUTED,
        lineHeight: 20,
        marginBottom: 35,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: TEXT_WHITE, 
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 55,
        backgroundColor: CARD_DARK, 
        borderRadius: 16, 
        paddingHorizontal: 15,
        color: TEXT_WHITE,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: BORDER_DARK,
    },
    inputFocused: {
        borderColor: BRAND_PURPLE, 
        backgroundColor: '#242038',
    },
    bottomNav: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 15,
        paddingBottom: Platform.OS === 'ios' ? 10 : 25,
        backgroundColor: BG_DARK,
        borderTopWidth: 1,
        borderTopColor: BORDER_DARK, 
    },
    backButton: {
        width: 55,
        height: 55,
        borderRadius: 27.5, 
        borderWidth: 1.5,
        borderColor: BORDER_DARK,
        backgroundColor: CARD_DARK,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    backButtonText: {
        fontSize: 20,
        color: TEXT_WHITE,
        fontWeight: '600',
    },
    primaryButton: {
        flex: 1, 
        height: 55,
        backgroundColor: BRAND_LIME, 
        borderRadius: 27.5, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: BG_DARK, 
        fontSize: 18,
        fontWeight: '700',
    }
});