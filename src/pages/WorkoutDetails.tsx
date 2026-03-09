import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../config/apiClient'; 
import { useWorkout } from '../context/WorkoutProvider';

const WorkoutDetails = ({ route, navigation }: any) => {
    const session = route.params?.session;
    const [isInsightOpen, setIsInsightOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { fetchCurrentProgram } = useWorkout(); 

    if (!session) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.noDataText}>
                    No session data found.
                </Text>
            </SafeAreaView>
        );
    }

    const offset = new Date().getTimezoneOffset();
    const localDate = new Date(new Date().getTime() - (offset * 60 * 1000));
    const todayStr = localDate.toISOString().split('T')[0];
    const isToday = session.scheduledDate === todayStr;

    const handleCompleteWorkout = async () => {
        if (session.completed || isSubmitting || !isToday) return;

        try {
            setIsSubmitting(true);
            await api.get(`/session/set_completed?id=${session.id}`);
            await fetchCurrentProgram();
            navigation.goBack(); 
        } catch (error) {
            console.error("Error completing workout:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getButtonText = () => {
        if (isSubmitting) return "";
        if (session.completed) return "WORKOUT COMPLETED 🏆";
        if (!isToday) return `LOCKED UNTIL ${session.scheduledDate}`;
        return "FINISH WORKOUT";
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require('../assets/left.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.topBarCenter}>
                    <Text style={styles.topBarText}>PLAN DETAILS</Text>
                </View>
                <View style={styles.topBarSpacer} /> 
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroHeader}>
                    <View style={styles.dayBadge}>
                        <Text style={styles.dayBadgeText}>DAY {session.dayNumber}</Text>
                    </View>
                    <Text style={styles.heroTitle}>{session.name}</Text>
                    <Text style={styles.heroSubtitle}>
                        {session.scheduledDate} • {session.exercises.length} Exercises
                    </Text>
                </View>

                {session.smallTips ? (
                    <View style={styles.tipsContainer}>
                        <TouchableOpacity 
                            style={styles.tipsHeader} 
                            onPress={() => setIsInsightOpen(!isInsightOpen)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.tipsHeaderLeft}>
                                <View style={styles.tipsIconBg}>
                                    <Text style={styles.tipsIcon}>🧠</Text>
                                </View>
                                <Text style={styles.tipsTitle}>Coach's Insight</Text>
                            </View>
                            <Text style={styles.chevronIcon}>
                                {isInsightOpen ? '▲' : '▼'}
                            </Text>
                        </TouchableOpacity>

                        {isInsightOpen && (
                            <View style={styles.tipsBody}>
                                <Text style={styles.tipsText}>{session.smallTips}</Text>
                            </View>
                        )}
                    </View>
                ) : null}

                <View style={styles.listContainer}>
                    {session.exercises.map((ex: any, index: number) => (
                        <View key={index} style={styles.exerciseCard}>
                            
                            <View style={styles.exerciseHeader}>
                                <View style={styles.numberBadge}>
                                    <Text style={styles.numberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.exerciseName}>{ex.name}</Text>
                            </View>

                            <View style={styles.metricsContainer}>
                                <View style={styles.metricGroup}>
                                    <View style={styles.metricPill}>
                                        <Text style={styles.metricValue}>{ex.targetSets}</Text>
                                        <Text style={styles.metricLabel}>SETS</Text>
                                    </View>
                                    
                                    <View style={styles.metricPill}>
                                        <Text style={styles.metricValue}>{ex.targetReps}</Text>
                                        <Text style={styles.metricLabel}>REPS</Text>
                                    </View>

                                    {ex.targetWeightKg > 0 && (
                                        <View style={[styles.metricPill, styles.weightPill]}>
                                            <Text style={styles.weightValue}>{ex.targetWeightKg}</Text>
                                            <Text style={styles.weightLabel}>KG</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.restPill}>
                                    <Text style={styles.restIcon}>⏳</Text>
                                    <Text style={styles.restValue}>{ex.restDurationSeconds}s</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.bottomSpacer} /> 
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity 
                    style={[
                        styles.completeBtn,
                        session.completed && styles.completeBtnDone,
                        (!isToday && !session.completed) && styles.completeBtnDisabled
                    ]} 
                    onPress={handleCompleteWorkout}
                    activeOpacity={0.9}
                    disabled={session.completed || isSubmitting || !isToday}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={BG_DARK} />
                    ) : (
                        <Text style={[
                            styles.completeBtnText,
                            session.completed && { color: BRAND_LIME },
                            (!isToday && !session.completed) && { color: '#444' }
                        ]}>
                            {getButtonText()}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default WorkoutDetails;

const BG_DARK = '#000'; 
const CARD_DARK = '#111'; 
const BRAND_PURPLE = '#A084E8';
const BRAND_LIME = '#D6FA6F';
const TEXT_WHITE = '#FFFFFF';
const TEXT_MUTED = '#8A8A8E';
const BORDER_DARK = '#222';

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: BG_DARK 
    },
    noDataText: { 
        color: 'white', 
        textAlign: 'center', 
        marginTop: 50 
    },
    topBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15, 
        paddingBottom: 15, 
        paddingTop: Platform.OS === 'android' ? 20 : 0 
    },
    backButton: { 
        padding: 10 
    },
    backIcon: { 
        width: 22, 
        height: 22, 
        tintColor: TEXT_WHITE 
    },
    topBarCenter: { 
        flex: 1, 
        alignItems: 'center' 
    },
    topBarText: { 
        color: TEXT_MUTED, 
        fontSize: 11, 
        fontWeight: '900', 
        letterSpacing: 2 
    },
    topBarSpacer: { 
        width: 40 
    },
    scrollContainer: { 
        paddingBottom: 20 
    },
    heroHeader: { 
        paddingHorizontal: 25, 
        paddingTop: 10, 
        paddingBottom: 30 
    },
    dayBadge: { 
        backgroundColor: '#A084E820', 
        alignSelf: 'flex-start', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 8, 
        marginBottom: 12 
    },
    dayBadgeText: { 
        color: BRAND_PURPLE, 
        fontSize: 12, 
        fontWeight: '900', 
        letterSpacing: 1.5 
    },
    heroTitle: { 
        fontSize: 34, 
        fontWeight: '900', 
        color: TEXT_WHITE, 
        letterSpacing: -1, 
        marginBottom: 8 
    },
    heroSubtitle: { 
        fontSize: 15, 
        color: TEXT_MUTED, 
        fontWeight: '600' 
    },
    tipsContainer: { 
        marginHorizontal: 25, 
        backgroundColor: CARD_DARK, 
        borderRadius: 20, 
        marginBottom: 35, 
        borderWidth: 1, 
        borderColor: BORDER_DARK 
    },
    tipsHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 16 
    },
    tipsHeaderLeft: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    tipsIconBg: { 
        width: 36, 
        height: 36, 
        borderRadius: 12, 
        backgroundColor: '#1A1A1A', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 12 
    },
    tipsIcon: { 
        fontSize: 18 
    },
    tipsTitle: { 
        color: TEXT_WHITE, 
        fontSize: 16, 
        fontWeight: '800' 
    },
    chevronIcon: { 
        color: TEXT_MUTED, 
        fontSize: 12, 
        fontWeight: '900', 
        paddingRight: 5 
    },
    tipsBody: { 
        paddingHorizontal: 16, 
        paddingBottom: 20, 
        paddingTop: 0 
    },
    tipsText: { 
        color: '#D1D1D6', 
        fontSize: 15, 
        lineHeight: 24 
    },
    listContainer: { 
        paddingHorizontal: 25 
    },
    exerciseCard: { 
        backgroundColor: CARD_DARK, 
        borderRadius: 24, 
        padding: 20, 
        marginBottom: 16, 
        borderWidth: 1, 
        borderColor: BORDER_DARK 
    },
    exerciseHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 16 
    },
    numberBadge: { 
        width: 32, 
        height: 32, 
        borderRadius: 16, 
        backgroundColor: '#D6FA6F20', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 12 
    },
    numberText: { 
        color: BRAND_LIME, 
        fontSize: 14, 
        fontWeight: '900' 
    },
    exerciseName: { 
        color: TEXT_WHITE, 
        fontSize: 18, 
        fontWeight: '800', 
        flex: 1 
    },
    metricsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    metricGroup: { 
        flexDirection: 'row', 
        gap: 8 
    },
    metricPill: { 
        backgroundColor: '#000', 
        paddingHorizontal: 14, 
        paddingVertical: 10, 
        borderRadius: 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        minWidth: 60,
        borderWidth: 1,
        borderColor: BORDER_DARK
    },
    metricValue: { 
        color: TEXT_WHITE, 
        fontSize: 18, 
        fontWeight: '900', 
        marginBottom: 2 
    },
    metricLabel: { 
        color: TEXT_MUTED, 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 0.5 
    },
    weightPill: { 
        backgroundColor: '#A084E810',
        borderColor: '#A084E830'
    },
    weightValue: { 
        color: BRAND_PURPLE, 
        fontSize: 18, 
        fontWeight: '900', 
        marginBottom: 2 
    },
    weightLabel: { 
        color: BRAND_PURPLE, 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 0.5, 
        opacity: 0.8 
    },
    restPill: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#1A1A1A', 
        paddingHorizontal: 12, 
        paddingVertical: 8, 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: BORDER_DARK 
    },
    restIcon: { 
        fontSize: 14, 
        marginRight: 6 
    },
    restValue: { 
        color: TEXT_MUTED, 
        fontSize: 14, 
        fontWeight: '700' 
    },
    bottomSpacer: { 
        height: 40 
    },
    bottomNav: { 
        paddingHorizontal: 25, 
        paddingVertical: Platform.OS === 'ios' ? 25 : 20, 
        backgroundColor: BG_DARK, 
        borderTopWidth: 1, 
        borderTopColor: BORDER_DARK 
    },
    completeBtn: { 
        backgroundColor: BRAND_LIME, 
        height: 60, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    completeBtnDone: { 
        backgroundColor: '#D6FA6F15', 
        borderWidth: 1.5, 
        borderColor: BRAND_LIME 
    },
    completeBtnDisabled: {
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#222'
    },
    completeBtnText: { 
        color: BG_DARK, 
        fontSize: 14, 
        fontWeight: '900', 
        letterSpacing: 1.5 
    }
});