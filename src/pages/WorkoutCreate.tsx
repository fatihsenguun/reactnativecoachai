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
    Modal,
    FlatList,
    ActivityIndicator 
} from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../config/apiClient';

// --- Maps exactly to your Java Enum ---
const DAY_OPTIONS = [
    { id: 'MONDAY', label: 'Monday' },
    { id: 'TUESDAY', label: 'Tuesday' },
    { id: 'WEDNESDAY', label: 'Wednesday' },
    { id: 'THURSDAY', label: 'Thursday' },
    { id: 'FRIDAY', label: 'Friday' },
    { id: 'SATURDAY', label: 'Saturday' },
    { id: 'SUNDAY', label: 'Sunday' }
];

const WorkoutCreate = ({ navigation }: any) => {

    const [daysPerWeek, setDaysPerWeek] = useState('');
    const [equipmentAvailable, setEquipmentAvailable] = useState('');
    const [specificFocus, setSpecificFocus] = useState('');
    
    // --- State for Day Selection ---
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isDaysMenuVisible, setIsDaysMenuVisible] = useState(false);
    
    // --- State for Loading Overlay ---
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const { getUser } = useAuth();

    const filledFieldsCount = [daysPerWeek, equipmentAvailable, specificFocus]
        .filter(field => field.trim() !== '').length; 
    const progressPercentage = (filledFieldsCount / 3) * 100;

    const handleCreateWorkout = async () => {
        // Validation check (optional, but good practice)
        if (!daysPerWeek) {
            alert("Please tell us how many days a week you want to train!");
            return;
        }

        setIsGenerating(true); // SHOW THE LOADING SCREEN

        const payload = {
            daysPerWeek: parseInt(daysPerWeek, 10) || 0,
            equipmentAvailable: equipmentAvailable,
            specificFocus: specificFocus,
            trainingDays: selectedDays
        };

        try {
            const response = await api.post('/program/generate', payload);

            if (response.data) {
                console.log("Workout generated!", response.data);
                getUser();
                navigation.goBack(); 
            }
        } catch (error) {
            console.error("Error generating workout: ", error);
            alert("Something went wrong while generating your program. Please try again.");
            setIsGenerating(false); // HIDE THE LOADING SCREEN ON ERROR
        }
    };

    const toggleDaySelection = (dayId: string) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    const getSelectedDaysText = () => {
        if (selectedDays.length === 0) return "Flexible (Let AI Decide)"; 
        if (selectedDays.length === 7) return "Everyday";
        
        return selectedDays
            .map(id => DAY_OPTIONS.find(opt => opt.id === id)?.label)
            .join(', ');
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

    // --- IF GENERATING, SHOW THE FULL SCREEN LOADER ---
    if (isGenerating) {
        return (
            <SafeAreaView style={styles.generatingContainer}>
                <ActivityIndicator size="large" color={BRAND_LIME} style={styles.spinner} />
                <Text style={styles.generatingTitle}>Consulting AI Coach...</Text>
                <Text style={styles.generatingSubtitle}>
                    Analyzing your profile and generating a personalized 30-day program. This may take a few seconds.
                </Text>
            </SafeAreaView>
        );
    }

    // --- STANDARD UI ---
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

                        {/* Preferred Training Days Trigger */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Preferred Training Days (Optional)</Text>
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    styles.dropdownTrigger,
                                    isDaysMenuVisible && styles.inputFocused 
                                ]}
                                onPress={() => setIsDaysMenuVisible(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.dropdownText,
                                    selectedDays.length === 0 && { color: BRAND_PURPLE } 
                                ]} numberOfLines={1}>
                                    {getSelectedDaysText()}
                                </Text>
                                <Text style={styles.dropdownArrow}>▼</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Specific Focus Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Specific Focus & Goals</Text>
                            <TextInput
                                style={getInputStyle('specificFocus')}
                                placeholder="e.g. Lean bulk with a strong focus on upper chest."
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={specificFocus}
                                onChangeText={setSpecificFocus}
                                autoCapitalize="sentences"
                                onFocus={() => setFocusedField('specificFocus')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Equipment Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Equipment, Locations, & Current Stats</Text>
                            <TextInput
                                style={getTextAreaStyle('equipmentAvailable')}
                                placeholder="e.g. Gym access Mon-Wed. No heavy barbell deadlifts due to past injury."
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

                {/* MULTI-SELECT DAYS MODAL */}
                <Modal
                    visible={isDaysMenuVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsDaysMenuVisible(false)} 
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity
                            style={styles.modalDismissArea}
                            activeOpacity={1}
                            onPress={() => setIsDaysMenuVisible(false)}
                        />
                        
                        <View style={styles.modalContent}>
                            <View style={styles.modalDragIndicator} />
                            
                            <View style={styles.modalHeaderRow}>
                                <View>
                                    <Text style={styles.modalTitle}>Select Training Days</Text>
                                    <Text style={styles.modalSubtitle}>Pick days or let AI optimize it.</Text>
                                </View>
                                {selectedDays.length > 0 && (
                                    <TouchableOpacity onPress={() => setSelectedDays([])}>
                                        <Text style={styles.clearText}>Clear</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            <FlatList
                                data={DAY_OPTIONS}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                renderItem={({ item }) => {
                                    const isSelected = selectedDays.includes(item.id);
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.dayCard,
                                                isSelected && styles.dayCardSelected
                                            ]}
                                            activeOpacity={0.7}
                                            onPress={() => toggleDaySelection(item.id)}
                                        >
                                            <Text style={[
                                                styles.dayCardText,
                                                isSelected && styles.dayCardTextSelected
                                            ]}>
                                                {item.label}
                                            </Text>
                                            <View style={[
                                                styles.checkbox,
                                                isSelected && styles.checkboxSelected
                                            ]}>
                                                {isSelected && <Text style={styles.checkmark}>✓</Text>}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />

                            <TouchableOpacity 
                                style={[
                                    styles.modalConfirmButton, 
                                    selectedDays.length === 0 && styles.modalConfirmButtonOutline
                                ]}
                                onPress={() => setIsDaysMenuVisible(false)}
                            >
                                <Text style={[
                                    styles.modalConfirmText,
                                    selectedDays.length === 0 && styles.modalConfirmTextOutline
                                ]}>
                                    {selectedDays.length === 0 ? "Skip (Flexible Days)" : "Confirm Days"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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
    safeArea: { flex: 1, backgroundColor: BG_DARK },
    container: { flex: 1, backgroundColor: BG_DARK },
    header: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 10 },
    progressBarBackground: { height: 6, backgroundColor: CARD_DARK, borderRadius: 3, width: '100%' },
    progressBarFill: { height: 6, backgroundColor: BRAND_PURPLE, borderRadius: 3 },
    scrollContainer: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 40, paddingTop: 10 },
    left: { width: 30, height: 30, tintColor: TEXT_WHITE },
    title: { fontSize: 28, fontWeight: '800', color: TEXT_WHITE, marginBottom: 12, letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: TEXT_MUTED, lineHeight: 20, marginBottom: 35 },
    form: { width: '100%' },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: TEXT_WHITE, marginBottom: 8 },
    input: {
        width: '100%', height: 55, backgroundColor: CARD_DARK, borderRadius: 16,
        paddingHorizontal: 15, color: TEXT_WHITE, fontSize: 16, borderWidth: 1.5, borderColor: BORDER_DARK,
    },
    textArea: { height: 140, paddingTop: 15, paddingBottom: 15 },
    inputFocused: { borderColor: BRAND_PURPLE, backgroundColor: '#242038' },
    
    // Dropdown styles
    dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dropdownText: { color: TEXT_WHITE, fontSize: 16, flex: 1, paddingRight: 10 },
    dropdownArrow: { color: TEXT_MUTED, fontSize: 12 },

    // --- GENERATING OVERLAY STYLES ---
    generatingContainer: {
        flex: 1,
        backgroundColor: BG_DARK,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    spinner: {
        marginBottom: 30,
        transform: [{ scale: 1.5 }], // Makes the spinner a bit larger
    },
    generatingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: TEXT_WHITE,
        marginBottom: 15,
        textAlign: 'center',
    },
    generatingSubtitle: {
        fontSize: 16,
        color: TEXT_MUTED,
        textAlign: 'center',
        lineHeight: 24,
    },

    // --- MODAL STYLES ---
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalDismissArea: { flex: 1 },
    modalContent: {
        backgroundColor: CARD_DARK, borderTopLeftRadius: 30, borderTopRightRadius: 30,
        paddingHorizontal: 25, paddingTop: 15, paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        maxHeight: '85%', 
    },
    modalDragIndicator: {
        width: 40, height: 5, backgroundColor: BORDER_DARK, borderRadius: 3,
        alignSelf: 'center', marginBottom: 20,
    },
    modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    modalTitle: { color: TEXT_WHITE, fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    modalSubtitle: { fontSize: 14, color: TEXT_MUTED, marginBottom: 25 },
    clearText: { color: BRAND_PURPLE, fontSize: 16, fontWeight: '600', marginTop: 5 },
    
    // Day Selection Cards
    dayCard: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: BG_DARK, padding: 18, borderRadius: 16, marginBottom: 12,
        borderWidth: 1.5, borderColor: BORDER_DARK,
    },
    dayCardSelected: { borderColor: BRAND_PURPLE, backgroundColor: '#242038' },
    dayCardText: { color: TEXT_WHITE, fontSize: 16, fontWeight: '600' },
    dayCardTextSelected: { color: BRAND_PURPLE },
    
    // Checkbox UI
    checkbox: {
        width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: TEXT_MUTED,
        justifyContent: 'center', alignItems: 'center',
    },
    checkboxSelected: { backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE },
    checkmark: { color: TEXT_WHITE, fontSize: 14, fontWeight: 'bold' },

    modalConfirmButton: {
        backgroundColor: BRAND_LIME, height: 55, borderRadius: 27.5,
        justifyContent: 'center', alignItems: 'center', marginTop: 10, borderWidth: 1.5, borderColor: BRAND_LIME
    },
    modalConfirmText: { color: BG_DARK, fontSize: 18, fontWeight: '700' },
    
    // Transparent "Skip" button styling
    modalConfirmButtonOutline: {
        backgroundColor: 'transparent',
        borderColor: BRAND_PURPLE,
    },
    modalConfirmTextOutline: {
        color: BRAND_PURPLE,
    },

    // Nav
    bottomNav: {
        flexDirection: 'row', paddingHorizontal: 25, paddingVertical: 15,
        paddingBottom: Platform.OS === 'ios' ? 10 : 25, backgroundColor: BG_DARK,
        borderTopWidth: 1, borderTopColor: BORDER_DARK,
    },
    backButton: {
        width: 55, height: 55, borderRadius: 27.5, borderWidth: 1.5,
        borderColor: BORDER_DARK, backgroundColor: CARD_DARK, justifyContent: 'center',
        alignItems: 'center', marginRight: 15,
    },
    primaryButton: {
        flex: 1, height: 55, backgroundColor: BRAND_LIME, borderRadius: 27.5,
        justifyContent: 'center', alignItems: 'center',
    },
    primaryButtonText: { color: BG_DARK, fontSize: 18, fontWeight: '700' }
});