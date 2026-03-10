import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWorkout } from '../../context/WorkoutProvider';

interface ProgramBoxProps {
    selectedDateStr: string;
}

const ProgramBox: React.FC<ProgramBoxProps> = ({ selectedDateStr }) => {
    const { isLoading, programData, stats } = useWorkout();
    const navigation = useNavigation<any>();

    // 1. Find the specific session for the selected date
    const displaySession = programData?.sessions?.find(
        (s: any) => s.scheduledDate === selectedDateStr
    );

    // 2. Logic Flags for Context
    const todayStr = new Date().toISOString().split('T')[0];
    const isRestDay = !displaySession;
    const isCompleted = displaySession?.completed;
    const isFuture = selectedDateStr > todayStr;
    const isPast = selectedDateStr < todayStr;

    // --- STATE 1: LOADING ---
    if (isLoading) {
        return (
            <View style={[styles.card, styles.centered]}>
                <ActivityIndicator size="small" color={BRAND_LIME} />
                <Text style={styles.mutedText}>Syncing Schedule...</Text>
            </View>
        );
    }

    // --- STATE 2: NO PROGRAM ---
    if (!programData) {
        return (
            <View style={[styles.card, styles.centered]}>
                <Text style={styles.emptyTitle}>No Active Plan</Text>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('WorkoutCreate')}
                >
                    <Text style={styles.primaryBtnText}>Create Program</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- STATE 3: COMPLETED ---
    if (isCompleted) {
        return (
            <TouchableOpacity 
                style={styles.completedCard}
                onPress={() => navigation.navigate('WorkoutDetails', { session: displaySession })}
                activeOpacity={0.9}
            >
                <View style={styles.trophyContainer}>
                    <Image 
                        style={styles.completedEmoji} 
                        source={require('../../assets/trophy.png')}
                    />
                </View>
                <Text style={styles.completedTitle}>Workout Complete!</Text>
                <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>⚡ {stats.progress}% Finished</Text>
                </View>
                <Text style={styles.actionLink}>Tap to review results →</Text>
            </TouchableOpacity>
        );
    }

    // --- STATE 4: MAIN CARD ---
    return (
        <View style={styles.card}>
            {/* Optimized Header with Overflow Prevention */}
            <View style={styles.headerRow}>
                <View style={styles.badge}>
                    <Text 
                        style={styles.badgeText} 
                        numberOfLines={1} 
                        ellipsizeMode="tail"
                    >
                        {programData.name}
                    </Text>
                </View>
                <Text style={styles.timeLabel}>
                    {isFuture ? "UPCOMING" : isPast ? "INCOMPLETE" : "TODAY'S GOAL"}
                </Text>
            </View>

            <Text style={styles.focusTitle}>
                {isRestDay ? "Rest & Recovery" : displaySession.name}
            </Text>

            {/* Progress Section */}
            {!isPast && (
                <View style={styles.progressSection}>
                    <View style={styles.track}>
                        <View style={[styles.fill, { width: `${stats.progress}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>{stats.progress}% total progress</Text>
                </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
                style={[
                    styles.primaryBtn,
                    (isRestDay || isFuture) && styles.outlineBtn,
                    (isPast && !isRestDay) && styles.missedBtn
                ]}
                onPress={() => !isRestDay ? navigation.navigate('WorkoutDetails', { session: displaySession }) : null}
                activeOpacity={0.8}
                disabled={isRestDay}
            >
                <Text style={[
                    styles.primaryBtnText,
                    (isRestDay || isFuture || (isPast && !isRestDay)) && { color: TEXT_WHITE }
                ]}>
                    {isRestDay ? "Rest Day 🧘‍♂️" 
                    : isFuture ? "Preview Exercises" 
                    : isPast ? "Mark as Finished" 
                    : "Start Workout"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProgramBox;

const CARD_DARK = '#141415'; 
const BRAND_PURPLE = '#A084E8';
const BRAND_LIME = '#D6FA6F';
const TEXT_WHITE = '#FFFFFF';
const TEXT_MUTED = '#8A8A8E';
const BORDER_DARK = '#242426';

const styles = StyleSheet.create({
    card: {
        backgroundColor: CARD_DARK,
        borderRadius: 24,
        padding: 24,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: BORDER_DARK,
    },
    centered: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    // Header Row Fixes
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    badge: {
        backgroundColor: '#A084E815', 
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        flexShrink: 1, // Allows it to resize if program name is long
        marginRight: 10,
    },
    badgeText: {
        color: BRAND_PURPLE,
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    timeLabel: {
        color: TEXT_MUTED,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        flexShrink: 0, // Keeps "INCOMPLETE" from disappearing
    },
    // Content
    focusTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: TEXT_WHITE,
        letterSpacing: -1,
        marginBottom: 25,
    },
    // Progress
    progressSection: {
        marginBottom: 25,
    },
    track: {
        height: 6,
        backgroundColor: '#242426',
        borderRadius: 10,
        width: '100%',
        marginBottom: 8,
    },
    fill: {
        height: 6,
        backgroundColor: BRAND_LIME,
        borderRadius: 10,
    },
    progressLabel: {
        color: TEXT_MUTED,
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'right',
    },
    // Buttons
    primaryBtn: {
        backgroundColor: BRAND_LIME,
        height: 58,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#0A0A0A',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.5,
        padding:10,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: BORDER_DARK,
    },
    missedBtn: {
        backgroundColor: '#FF4B4B15',
        borderColor: '#FF4B4B',
        borderWidth: 1.5,
    },
    // Completed State
    completedCard: {
        backgroundColor: '#D6FA6F10',
        borderRadius: 24,
        padding: 30,
        marginBottom: 30,
        borderWidth: 1.5,
        borderColor: BRAND_LIME,
        alignItems: 'center',
    },
    trophyContainer: {
        backgroundColor: '#D6FA6F15',
        padding: 15,
        borderRadius: 40,
        marginBottom: 15,
    },
    completedEmoji: {
        width: 40,
        height: 40,
    },
    completedTitle: {
        color: TEXT_WHITE,
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 12,
    },
    statusPill: {
        backgroundColor: BRAND_LIME,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusPillText: {
        color: '#0A0A0A',
        fontSize: 13,
        fontWeight: '900',
    },
    actionLink: {
        color: BRAND_LIME,
        fontSize: 12,
        fontWeight: '700',
        marginTop: 15,
    },
    emptyTitle: {
        color: TEXT_WHITE,
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 8,
    },
    mutedText: {
        color: TEXT_MUTED,
        fontSize: 14,
        marginTop: 10,
    },
});