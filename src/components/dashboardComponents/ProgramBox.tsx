import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWorkout } from '../../context/WorkoutProvider'; // Adjust path if needed

const ProgramBox = () => {

    useEffect(() => {
        fetchCurrentProgram();


    }, [])
    const { isLoading, programData, todaySession, stats, fetchCurrentProgram } = useWorkout();

    const navigation = useNavigation<any>();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BRAND_LIME} />
                <Text style={styles.loadingText}>Loading your program...</Text>
            </View>
        );
    }

    if (!programData) {
        return (
            <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>No Active Program</Text>
                <Text style={styles.emptyStateSub}>
                    You don't have a plan yet. Let our AI coach design the perfect 30-day program for you.
                </Text>
                <TouchableOpacity
                    style={styles.createProgramBtn}
                    onPress={() => navigation.navigate('WorkoutCreate')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.createProgramBtnText}>+ Create New Program</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.programCard}>
            <View style={styles.programHeaderRow}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>AI GENERATED</Text>
                </View>
                <Text style={styles.daysLeftText}>{stats.daysLeft} days left</Text>
            </View>

            <Text style={styles.programTitle}>{programData.name}</Text>
            <Text style={styles.programFocus}>
                {todaySession ? todaySession.name : "Rest Day - Recovery"}
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${stats.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{stats.progress}% Completed</Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity
                style={[
                    styles.startWorkoutBtn,
                    !todaySession && { backgroundColor: CARD_DARK, borderWidth: 1, borderColor: BORDER_DARK }
                ]}
                onPress={() => todaySession ? console.log("Navigate to Workout Details", todaySession) : console.log("Enjoy your rest")}
                activeOpacity={0.8}
                disabled={!todaySession}
            >
                <Text style={[styles.startWorkoutBtnText, !todaySession && { color: TEXT_WHITE }]}>
                    {todaySession ? "Start Today's Session" : "Rest Day"}
                </Text>
                {todaySession && <Text style={styles.arrowIcon}>→</Text>}
            </TouchableOpacity>
        </View>
    );
};

export default ProgramBox;

const BG_DARK = '#151515';
const CARD_DARK = '#1C1C1E';
const BRAND_PURPLE = '#A084E8';
const BRAND_LIME = '#d6fa6f';
const TEXT_WHITE = '#FFFFFF';
const TEXT_MUTED = '#8E8E93';
const BORDER_DARK = '#2C2C2E';


const styles = StyleSheet.create({

    loadingContainer: {
        backgroundColor: CARD_DARK,
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        marginBottom: 35,
        borderWidth: 1,
        borderColor: BORDER_DARK,
    },
    loadingText: {
        color: TEXT_MUTED,
        marginTop: 15,
        fontSize: 16,
    },


    programCard: {
        backgroundColor: CARD_DARK,
        borderRadius: 24,
        padding: 24,
        marginBottom: 35,
        borderWidth: 1,
        borderColor: '#2C2C2E80',
        shadowColor: BRAND_PURPLE,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    programHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    tag: {
        backgroundColor: '#A084E820',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        color: BRAND_PURPLE,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    daysLeftText: {
        color: TEXT_MUTED,
        fontSize: 12,
        fontWeight: '600',
    },
    programTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: TEXT_WHITE,
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    programFocus: {
        fontSize: 15,
        color: '#b19cd9',
        marginBottom: 20,
        fontWeight: '500',
    },
    progressContainer: {
        marginBottom: 25,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: BG_DARK,
        borderRadius: 4,
        width: '100%',
        marginBottom: 8,
    },
    progressBarFill: {
        height: 8,
        backgroundColor: BRAND_LIME,
        borderRadius: 4,
    },
    progressText: {
        color: TEXT_MUTED,
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'right',
    },
    startWorkoutBtn: {
        flexDirection: 'row',
        backgroundColor: BRAND_LIME,
        height: 55,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startWorkoutBtnText: {
        color: BG_DARK,
        fontSize: 16,
        fontWeight: '800',
        marginRight: 8,
    },
    arrowIcon: {
        color: BG_DARK,
        fontSize: 18,
        fontWeight: 'bold',
    },

    // Empty State Card
    emptyStateCard: {
        backgroundColor: CARD_DARK,
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        marginBottom: 35,
        borderWidth: 1,
        borderColor: BORDER_DARK,
        borderStyle: 'dashed',
    },
    emptyStateTitle: {
        color: TEXT_WHITE,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptyStateSub: {
        color: TEXT_MUTED,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    createProgramBtn: {
        backgroundColor: BRAND_PURPLE,
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
    },
    createProgramBtnText: {
        color: TEXT_WHITE,
        fontWeight: 'bold',
        fontSize: 16,
    },
});