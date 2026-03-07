import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgramBox from '../components/dashboardComponents/ProgramBox';

const Dashboard = ({ navigation }: any) => {

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 0 is Monday, 6 is Sunday

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Ready to work?</Text>
                        <Text style={styles.name}>Hello, Fatih 👋</Text>
                    </View>
                    <TouchableOpacity style={styles.profileAvatar}>
                        <Image 
                            source={require('../assets/women.png')} 
                            style={styles.avatarImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>

                {/* --- WEEKLY TRACKER --- */}
                <View style={styles.weeklyTracker}>
                    {weekDays.map((day, index) => {
                        const isToday = index === currentDayIndex;
                        const isPast = index < currentDayIndex;
                        return (
                            <View key={index} style={styles.dayBubbleContainer}>
                                <View style={[
                                    styles.dayBubble,
                                    isToday && styles.dayBubbleActive,
                                    isPast && styles.dayBubblePast
                                ]}>
                                    <Text style={[
                                        styles.dayText,
                                        isToday && styles.dayTextActive,
                                        isPast && styles.dayTextPast
                                    ]}>
                                        {day}
                                    </Text>
                                </View>
                                {isToday && <View style={styles.todayDot} />}
                            </View>
                        );
                    })}
                </View>

                <Text style={styles.sectionTitle}>Your Active Plan</Text>
            
                <ProgramBox /> 
                
                <Text style={styles.sectionTitle}>Weekly Overview</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#d6fa6f20' }]}>
                            <Text style={styles.iconText}>🔥</Text>
                        </View>
                        <Text style={styles.statValue}>1,240</Text>
                        <Text style={styles.statLabel}>Kcal Burned</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#A084E820' }]}>
                            <Text style={styles.iconText}>⚡</Text>
                        </View>
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Workouts Done</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Dashboard;

// --- Colors ---
const BG_DARK = '#151515';
const CARD_DARK = '#1C1C1E';
const BRAND_PURPLE = '#A084E8';
const BRAND_LIME = '#d6fa6f';
const TEXT_WHITE = '#FFFFFF';
const TEXT_MUTED = '#8E8E93';
const BORDER_DARK = '#2C2C2E';

// --- Cleaned Stylesheet ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG_DARK,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 14,
        color: BRAND_LIME,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    name: {
        fontSize: 26,
        fontWeight: '800',
        color: TEXT_WHITE,
        letterSpacing: -0.5,
    },
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: CARD_DARK,
        borderWidth: 2,
        borderColor: BRAND_PURPLE,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },

    // Weekly Tracker
    weeklyTracker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
        paddingHorizontal: 5,
    },
    dayBubbleContainer: {
        alignItems: 'center',
    },
    dayBubble: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: CARD_DARK,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: BORDER_DARK,
    },
    dayBubbleActive: {
        backgroundColor: BRAND_PURPLE,
        borderColor: BRAND_PURPLE,
    },
    dayBubblePast: {
        backgroundColor: '#242426',
    },
    dayText: {
        color: TEXT_MUTED,
        fontSize: 14,
        fontWeight: '600',
    },
    dayTextActive: {
        color: TEXT_WHITE,
        fontWeight: 'bold',
    },
    dayTextPast: {
        color: '#555555',
    },
    todayDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: BRAND_LIME,
        marginTop: 6,
    },

    // Section Titles
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: TEXT_WHITE,
        marginBottom: 15,
        letterSpacing: -0.3,
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        backgroundColor: CARD_DARK,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2C2C2E50',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconText: {
        fontSize: 18,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: TEXT_WHITE,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: TEXT_MUTED,
        fontWeight: '500',
    },
});