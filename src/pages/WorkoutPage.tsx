import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useWorkout } from '../context/WorkoutProvider';

const WorkoutPage = () => {
    const { programData, isLoading, stats, fetchCurrentProgram } = useWorkout();
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchCurrentProgram();
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D6FA6F" />
            </SafeAreaView>
        );
    }

    if (!programData) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.emptyContent}>
                    <Image 
                        source={require('../assets/trophy.png')} 
                        style={styles.largeHeroImage} 
                        resizeMode="contain" 
                    />
                    <Text style={styles.mainTitle}>No Active Plan</Text>
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('WorkoutCreate')}
                    >
                        <Text style={styles.buttonText}>Create Program</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // --- SORTING LOGIC ---
    // We create a shallow copy with [...] then sort by dayNumber ascending
    const sortedSessions = [...programData.sessions].sort((a, b) => a.dayNumber - b.dayNumber);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MY TRAINING PLAN</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.programHero}>
                    <Text style={styles.programName}>{programData.name}</Text>
                    <Text style={styles.dateRange}>
                        {programData.startDate} — {programData.endDate}
                    </Text>
                    
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{stats.progress}%</Text>
                            <Text style={styles.statLabel}>COMPLETED</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{stats.daysLeft}</Text>
                            <Text style={styles.statLabel}>DAYS LEFT</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionLabel}>SESSIONS</Text>

                {sortedSessions.map((session) => (
                    <TouchableOpacity 
                        key={session.id}
                        style={[
                            styles.sessionCard,
                            session.completed && styles.sessionCompleted
                        ]}
                        onPress={() => navigation.navigate('WorkoutDetails', { session })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.sessionMain}>
                            <View style={[
                                styles.dayIndicator,
                                session.completed && styles.dayIndicatorDone
                            ]}>
                                <Text style={[
                                    styles.dayNumber,
                                    session.completed && styles.dayNumberDone
                                ]}>
                                    {session.dayNumber}
                                </Text>
                            </View>
                            
                            <View style={styles.sessionInfo}>
                                <Text style={styles.sessionTitle}>{session.name}</Text>
                                <Text style={styles.sessionMeta}>
                                    {session.exercises.length} Exercises • {session.scheduledDate}
                                </Text>
                            </View>
                        </View>

                        {session.completed ? (
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusIcon}>✓</Text>
                            </View>
                        ) : (
                            <Text style={styles.arrowIcon}>→</Text>
                        )}
                    </TouchableOpacity>
                ))}

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default WorkoutPage;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        paddingVertical: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#111'
    },
    headerTitle: {
        color: '#666',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingTop: 25
    },
    programHero: {
        backgroundColor: '#111',
        borderRadius: 24,
        padding: 24,
        marginBottom: 35,
        borderWidth: 1,
        borderColor: '#222'
    },
    programName: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
        marginBottom: 8
    },
    dateRange: {
        color: '#666',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 24
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#222'
    },
    statBox: {
        flex: 1,
        alignItems: 'center'
    },
    statValue: {
        color: '#D6FA6F',
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 4
    },
    statLabel: {
        color: '#444',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#222'
    },
    sectionLabel: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 16,
        marginLeft: 4
    },
    sessionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111',
        padding: 18,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#222'
    },
    sessionCompleted: {
        borderColor: '#D6FA6F20',
        opacity: 0.6
    },
    sessionMain: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    dayIndicator: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    dayIndicatorDone: {
        backgroundColor: '#D6FA6F10'
    },
    dayNumber: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900'
    },
    dayNumberDone: {
        color: '#D6FA6F'
    },
    sessionInfo: {
        flex: 1
    },
    sessionTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 4
    },
    sessionMeta: {
        color: '#666',
        fontSize: 12,
        fontWeight: '600'
    },
    statusBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#D6FA6F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusIcon: {
        color: '#000',
        fontSize: 14,
        fontWeight: '900'
    },
    arrowIcon: {
        color: '#333',
        fontSize: 18,
        fontWeight: '800'
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40
    },
    largeHeroImage: {
        width: 300,
        height: 300,
        marginBottom: 20
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 40,
        letterSpacing: -1
    },
    primaryButton: {
        width: '100%',
        height: 60,
        backgroundColor: '#D6FA6F',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700'
    },
    bottomPadding: {
        height: 120
    }
});