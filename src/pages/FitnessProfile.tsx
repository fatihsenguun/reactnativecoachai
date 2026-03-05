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
    FlatList,
    Modal,
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const GOAL_OPTIONS = [
    "Gaining Muscle",
    "Losing Weight",
    "Improving Endurance",
    "General Fitness",
    "Flexibility & Mobility"
];

const FitnessProfile = ({ navigation }: any) => {
    const [weightKg, setWeightKg] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [age, setAge] = useState('');
    const [sportsHistory, setSportsHistory] = useState('');
    const [currentGoal, setCurrentGoal] = useState('');
    const [isGoalMenuVisible, setIsGoalMenuVisible] = useState(false);

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
    const renderGoalOption = ({ item }: { item: string }) => (
        <TouchableOpacity 
            style={styles.modalOption}
            onPress={() => {
                setCurrentGoal(item);
                setIsGoalMenuVisible(false); // Close menu on selection
            }}
        >
            <Text style={[
                styles.modalOptionText, 
                currentGoal === item && { color: BRAND_LIME, fontWeight: 'bold' } // Highlight selected
            ]}>
                {item}
            </Text>
        </TouchableOpacity>
    );


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
                            <TouchableOpacity 
                                style={[
                                    styles.input, 
                                    styles.dropdownTrigger,
                                    isGoalMenuVisible && styles.inputFocused // Highlight when menu is open
                                ]}
                                onPress={() => setIsGoalMenuVisible(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.dropdownText, 
                                    !currentGoal && { color: PLACEHOLDER_COLOR }
                                ]}>
                                    {currentGoal ? currentGoal : "Select your goal"}
                                </Text>
                                {/* A simple downward arrow using text */}
                                <Text style={styles.dropdownArrow}>▼</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    visible={isGoalMenuVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setIsGoalMenuVisible(false)} // For Android back button
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay} 
                        activeOpacity={1} 
                        onPress={() => setIsGoalMenuVisible(false)} // Close if clicked outside
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Goal</Text>
                            <FlatList
                                data={GOAL_OPTIONS}
                                keyExtractor={(item) => item}
                                renderItem={renderGoalOption}
                                bounces={false}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>

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
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingBottom: 40,
        paddingTop: 10,
    },
    left:{
        width:30,
        height:30,
        tintColor: TEXT_WHITE // Just in case your icon is dark, this makes it white
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
    
    // --- Custom Dropdown Styles ---
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        color: TEXT_WHITE,
        fontSize: 16,
    },
    dropdownArrow: {
        color: TEXT_MUTED,
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', // Darkens the screen behind the menu
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: CARD_DARK,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1.5,
        borderColor: BRAND_PURPLE,
        shadowColor: BRAND_PURPLE,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    modalTitle: {
        color: TEXT_WHITE,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_DARK,
        alignItems: 'center',
    },
    modalOptionText: {
        color: TEXT_WHITE,
        fontSize: 16,
    },
    // ------------------------------

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