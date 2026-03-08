import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWorkout } from '../../context/WorkoutProvider';

const ProgramBox = () => {
    const { isLoading, programData, todaySession, stats, fetchCurrentProgram } = useWorkout();
    const navigation = useNavigation<any>();

    const isRestDay = !todaySession;
    const isCompleted = todaySession?.completed;

    useEffect(() => {
        fetchCurrentProgram();
    }, []);

    // --- STATE 1: LOADING ---
    if (isLoading) {
        return (
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 40 }]}>
                <ActivityIndicator size="large" color={BRAND_LIME} />
                <Text style={styles.mutedText}>Loading your program...</Text>
            </View>
        );
    }

    // --- STATE 2: NO PROGRAM ---
    if (!programData) {
        return (
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 40 }]}>
                <Text style={styles.emptyTitle}>No Active Plan</Text>
                <Text style={[styles.mutedText, { marginBottom: 25 }]}>
                    Let our AI coach build your perfect 30-day routine.
                </Text>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('WorkoutCreate')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryBtnText}>Create New Program</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- STATE 3: COMPLETED (Ultra Simple & Clickable) ---
    if (isCompleted) {
        return (
            <TouchableOpacity 
                style={styles.completedSimpleCard}
                onPress={() => navigation.navigate('WorkoutDetails', { session: todaySession })}
                activeOpacity={0.9}
            >
                <Text style={styles.completedEmoji}>🏆</Text>
                <Text style={styles.completedSimpleTitle}>Today's Workout Completed</Text>
                <View style={styles.percentPill}>
                    <Text style={styles.percentPillText}>⚡ {stats.progress}% Program Finished</Text>
                </View>
                <Text style={styles.reviewText}>Tap to review workout →</Text>
            </TouchableOpacity>
        );
    }

    // --- STATE 4: ACTIVE / PENDING (Normal Complex View) ---
    return (
        <View style={styles.card}>

            <View style={styles.headerRow}>
                <View style={styles.planBadge}>
                    <Text style={styles.planNameText} numberOfLines={1}>{programData.name}</Text>
                </View>
                <Text style={styles.daysLeftText}>{stats.daysLeft} days left</Text>
            </View>

            <View style={styles.focusContainer}>
                <Text style={styles.todayFocus}>
                    {isRestDay ? "Rest Day" : todaySession.name}
                </Text>
            </View>

            {/* Premium Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${stats.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{stats.progress}% Completed</Text>
            </View>

            {/* Smart Action Button */}
            <TouchableOpacity
                style={[
                    styles.primaryBtn,
                    isRestDay && styles.restBtn
                ]}
                onPress={() => !isRestDay ? navigation.navigate('WorkoutDetails', { session: todaySession }) : null}
                activeOpacity={0.8}
                disabled={isRestDay}
            >
                <Text style={[
                    styles.primaryBtnText,
                    isRestDay && { color: TEXT_WHITE }
                ]}>
                    {isRestDay ? "Enjoy Your Rest 🧘‍♂️" : "Start Today's Workout"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProgramBox;

const BG_DARK = '#0A0A0A'; 
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    
    // --- Completed State Styles ---
    completedSimpleCard: {
        backgroundColor: '#D6FA6F10',
        borderRadius: 24,
        padding: 30,
        marginBottom: 30,
        borderWidth: 1.5,
        borderColor: BRAND_LIME,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: BRAND_LIME,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
    },
    completedEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    completedSimpleTitle: {
        color: TEXT_WHITE,
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    percentPill: {
        backgroundColor: BRAND_LIME,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 12,
    },
    percentPillText: {
        color: BG_DARK,
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    reviewText: {
        color: BRAND_LIME,
        fontSize: 12,
        fontWeight: '700',
        opacity: 0.8,
        marginTop: 8,
        letterSpacing: 0.5,
    },

    // --- Active State Styles ---
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    planBadge: {
        backgroundColor: '#A084E815', 
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flex: 1,
        marginRight: 15,
    },
    planNameText: {
        color: BRAND_PURPLE,
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    daysLeftText: {
        color: TEXT_MUTED,
        fontSize: 13,
        fontWeight: '700',
    },
    focusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    todayFocus: {
        fontSize: 28,
        fontWeight: '900',
        color: TEXT_WHITE,
        letterSpacing: -0.5,
        flex: 1,
    },
    progressContainer: {
        marginBottom: 25,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#242426',
        borderRadius: 3,
        width: '100%',
        marginBottom: 8,
    },
    progressBarFill: {
        height: 6,
        backgroundColor: BRAND_LIME,
        borderRadius: 3,
    },
    progressText: {
        color: TEXT_MUTED,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'right',
    },
    primaryBtn: {
        backgroundColor: BRAND_LIME,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: BRAND_LIME,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    restBtn: {
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: BORDER_DARK,
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryBtnText: {
        color: BG_DARK,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    emptyTitle: { color: TEXT_WHITE, fontSize: 24, fontWeight: '900', marginBottom: 10, textAlign: 'center' },
    mutedText: { color: TEXT_MUTED, fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 22 },
});