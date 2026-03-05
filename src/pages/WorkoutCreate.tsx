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
import { useAuth } from '../context/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../config/apiClient';

const WorkoutCreate = ({ navigation }: any) => {

    const [daysPerWeek, setDaysPerWeek] = useState('');
    const [equipmentAvailable, setEquipmentAvailable] = useState('');
    const [specificFocus, setSpecificFocus] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const { getUser } = useAuth();

    const filledFieldsCount = [daysPerWeek, equipmentAvailable, specificFocus]
        .filter(field => field.trim() !== '').length;
    const progressPercentage = (filledFieldsCount / 3) * 100;

    const handleCreateWorkout = async () => {
        const payload = {
            daysPerWeek: parseInt(daysPerWeek, 10) || 0,
            equipmentAvailable: equipmentAvailable,
            specificFocus: specificFocus
        };

        try {
            const response = await api.post('/program/generate', payload);

            if (response.data) {
                console.log("Workout generated!", response.data);
                getUser();
            }
        } catch (error) {
            console.error("Error generating workout: ", error);
        }

        console.log("Workout Generation Request:", payload);
    };

    const getInputStyle = (fieldName: string) => {
        return [
            styles.input,
            focusedField === fieldName ? styles.inputFocused : {}
        ];
    };


    const getTextAreaStyle = (fieldName: string) => {
        return [
            styles.input,
            styles.textArea,
            focusedField === fieldName ? styles.inputFocused : {}
        ];
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                {/* Progress Bar */}
                <View style={styles.header}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Design Your Routine</Text>
                    <Text style={styles.subtitle}>
                        Tell the AI exactly how you want to train. Be as detailed as you like!
                    </Text>

                    <View style={styles.form}>
                        {/* Days Per Week Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Days Per Week</Text>
                            <TextInput
                                style={getInputStyle('daysPerWeek')}
                                placeholder="e.g. 4"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={daysPerWeek}
                                onChangeText={setDaysPerWeek}
                                keyboardType="numeric"
                                onFocus={() => setFocusedField('daysPerWeek')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Specific Focus Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Specific Focus & Goals</Text>
                            <TextInput
                                style={getInputStyle('specificFocus')}

                                placeholder="e.g. Lean bulk with a strong focus on growing my upper chest and shoulders."
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={specificFocus}
                                onChangeText={setSpecificFocus}
                                autoCapitalize="sentences"
                                onFocus={() => setFocusedField('specificFocus')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>


                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Equipment, Locations, & Current Stats</Text>
                            <TextInput
                                style={getTextAreaStyle('equipmentAvailable')}
                                placeholder="e.g. Gym access Mon-Wed, calisthenics park on Fridays. Current 1RMs: Bench 80kg, Squat 100kg. Please avoid heavy barbell deadlifts due to a past lower back injury."
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={equipmentAvailable}
                                onChangeText={setEquipmentAvailable}
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                onFocus={() => setFocusedField('equipmentAvailable')}
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
                        <Image style={styles.left} source={require('../assets/left.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCreateWorkout} style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Generate Program</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default WorkoutCreate;

// --- Colors ---
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
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingBottom: 40,
        paddingTop: 10,
    },
    left: {
        width: 30,
        height: 30,
        tintColor: TEXT_WHITE
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
    // --- New TextArea Style ---
    textArea: {
        height: 140, // Much taller for multiline text
        paddingTop: 15, // Pushes text to the top in iOS
        paddingBottom: 15,
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