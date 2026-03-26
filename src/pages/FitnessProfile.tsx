import React, { useState, useEffect } from 'react';
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
    FlatList,
    Modal,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import api from '../config/apiClient';
import { useUser } from '../context/UserProvider';

// It's a good practice to define your stack param list in a central place
// For this example, we define it here.
type RootStackParamList = {
    FitnessProfile: { primaryGoal?: string };
    // ... other screens
};

type Props = NativeStackScreenProps<RootStackParamList, 'FitnessProfile'>;

const GOAL_OPTIONS = [
    { title: "Gaining Muscle", icon: "💪" },
    { title: "Losing Weight", icon: "🔥" },
    { title: "Improving Endurance", icon: "🏃‍♂️" },
    { title: "General Fitness", icon: "🧘‍♂️" },
    { title: "Flexibility & Mobility", icon: "🤸‍♂️" }
];

interface FormErrors {
    weightKg?: string;
    heightCm?: string;
    age?: string;
    sportsHistory?: string;
    currentGoal?: string;
}

const FitnessProfile = ({ route, navigation }: Props) => {
    const [weightKg, setWeightKg] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [age, setAge] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [sportsHistory, setSportsHistory] = useState('');
    const [currentGoal, setCurrentGoal] = useState('');
    const [isGoalMenuVisible, setIsGoalMenuVisible] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { fetchFitnessProfile } = useUser();

    useEffect(() => {
        if (route.params?.primaryGoal) {
            setCurrentGoal(route.params.primaryGoal);
        }
    }, [route.params?.primaryGoal]);

    const validateForm = () => {
        let tempErrors: FormErrors = {};
        const weight = parseFloat(weightKg);
        const height = parseFloat(heightCm);
        const ageNum = parseInt(age, 10);

        if (!currentGoal) tempErrors.currentGoal = "Please select a fitness goal.";
        if (!weightKg) tempErrors.weightKg = "Weight is required.";
        else if (isNaN(weight) || weight < 30 || weight > 300) tempErrors.weightKg = "Enter a valid weight (30-300kg).";
        if (!heightCm) tempErrors.heightCm = "Height is required.";
        else if (isNaN(height) || height < 100 || height > 250) tempErrors.heightCm = "Enter a valid height (100-250cm).";
        if (!age) tempErrors.age = "Age is required.";
        else if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) tempErrors.age = "Age must be between 13 and 100.";
        if (!sportsHistory.trim()) tempErrors.sportsHistory = "Please describe your history.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) {
            Alert.alert("Invalid Input", "Please correct the errors before saving.");
            return;
        }

        const payload = {
            weightKg: parseFloat(weightKg),
            heightCm: parseFloat(heightCm),
            age: parseInt(age, 10),
            sportsHistory: sportsHistory.trim(),
            currentGoal: currentGoal
        };

        try {
            const response = await api.post('/fitness_profile/save', payload);
            if (response.data) {
                Alert.alert("Success", "Your profile has been saved!");
                await fetchFitnessProfile();
                // navigation.goBack(); or navigate to the main dashboard
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
            Alert.alert("Save Failed", "An error occurred while saving your profile. Please try again.");
        }
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
                        {/* Goal Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Current Goal</Text>
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    styles.dropdownTrigger,
                                    isGoalMenuVisible && styles.inputFocused,
                                    errors.currentGoal ? styles.inputError : {}
                                ]}
                                onPress={() => setIsGoalMenuVisible(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.dropdownText, !currentGoal && { color: PLACEHOLDER_COLOR }]}>
                                    {currentGoal || "Select your goal"}
                                </Text>
                                <Text style={styles.dropdownArrow}>▼</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Other inputs... */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput
                                style={[getInputStyle('weightKg'), errors.weightKg ? styles.inputError : {}]}
                                placeholder="e.g. 80"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={weightKg}
                                onChangeText={setWeightKg}
                                keyboardType="numeric"
                                onFocus={() => setFocusedField('weightKg')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <TextInput
                                style={[getInputStyle('heightCm'), errors.heightCm ? styles.inputError : {}]}
                                placeholder="e.g. 180"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={heightCm}
                                onChangeText={setHeightCm}
                                keyboardType="numeric"
                                onFocus={() => setFocusedField('heightCm')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={[getInputStyle('age'), errors.age ? styles.inputError : {}]}
                                placeholder="e.g. 22"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                onFocus={() => setFocusedField('age')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Sports History (years)</Text>
                            <TextInput
                                style={[getInputStyle('sportsHistory'), errors.sportsHistory ? styles.inputError : {}]}
                                placeholder="e.g. 4"
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                value={sportsHistory}
                                onChangeText={setSportsHistory}
                                keyboardType="default"
                                onFocus={() => setFocusedField('sportsHistory')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Modal remains the same */}
                <Modal
                    visible={isGoalMenuVisible}
                    transparent={true}
                    animationType='slide'
                    onRequestClose={() => setIsGoalMenuVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity
                            style={styles.modalDismissArea}
                            activeOpacity={1}
                            onPress={() => setIsGoalMenuVisible(false)}
                        />
                        <View style={styles.modalContent}>
                            <View style={styles.modalDragIndicator} />
                            <Text style={styles.modalTitle}>Select Your Goal</Text>
                            <Text style={styles.modalSubtitle}>What are you trying to achieve?</Text>
                            <FlatList
                                data={GOAL_OPTIONS}
                                keyExtractor={(item) => item.title}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.goalCard, currentGoal === item.title && styles.goalCardSelected]}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setCurrentGoal(item.title);
                                            setIsGoalMenuVisible(false);
                                        }}
                                    >
                                        <Text style={styles.goalIcon}>{item.icon}</Text>
                                        <Text style={[styles.goalCardText, currentGoal === item.title && styles.goalCardTextSelected]}>
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

                <View style={styles.bottomNav}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Image style={styles.left} source={require('../assets/left.png')} />
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
const ERROR_RED = '#FF453A';

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: BG_DARK },
    container: { flex: 1, backgroundColor: BG_DARK },
    header: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 10 },
    progressBarBackground: { height: 6, backgroundColor: CARD_DARK, borderRadius: 3, width: '100%' },
    progressBarFill: { height: 6, backgroundColor: BRAND_PURPLE, borderRadius: 3, width: '30%' },
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
    inputFocused: { borderColor: BRAND_PURPLE, backgroundColor: '#242038' },
    inputError: { borderColor: ERROR_RED },
    dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dropdownText: { color: TEXT_WHITE, fontSize: 16 },
    dropdownArrow: { color: TEXT_MUTED, fontSize: 12 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalDismissArea: { flex: 1 },
    modalContent: {
        backgroundColor: CARD_DARK, borderTopLeftRadius: 30, borderTopRightRadius: 30,
        paddingHorizontal: 25, paddingTop: 15, paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        maxHeight: '80%',
    },
    modalDragIndicator: {
        width: 40, height: 5, backgroundColor: BORDER_DARK,
        borderRadius: 3, alignSelf: 'center', marginBottom: 20,
    },
    modalTitle: { color: TEXT_WHITE, fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    modalSubtitle: { fontSize: 14, color: TEXT_MUTED, marginBottom: 25 },
    goalCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: BG_DARK,
        padding: 16, borderRadius: 16, marginBottom: 12,
        borderWidth: 1.5, borderColor: BORDER_DARK,
    },
    goalCardSelected: { borderColor: BRAND_LIME, backgroundColor: '#2A2D1C' },
    goalIcon: { fontSize: 24, marginRight: 15 },
    goalCardText: { color: TEXT_WHITE, fontSize: 16, fontWeight: '600' },
    goalCardTextSelected: { color: BRAND_LIME },
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