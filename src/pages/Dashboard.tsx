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
import { useAuth } from '../context/AuthProvider';

const Dashboard = ({ navigation }: any) => {
    const { user } = useAuth();
    
    const firstName = user?.firstName || 'Fatih';

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>READY TO WORK?</Text>
                        <Text style={styles.name}>Hello, {firstName} 👋</Text>
                    </View>
                </View>

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
                        <Image 
                            source={require('../assets/fire.png')} 
                            style={styles.statIcon} 
                        />
                        <Text style={styles.statValue}>1,240</Text>
                        <Text style={styles.statLabel}>KCAL BURNED</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Image 
                            source={require('../assets/flash.png')} 
                            style={styles.statIcon} 
                        />
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>WORKOUTS DONE</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0A0A0A'
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35
    },
    greeting: {
        fontSize: 12,
        color: '#A084E8',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8
    },
    name: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1
    },
    weeklyTracker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        paddingHorizontal: 5
    },
    dayBubbleContainer: {
        alignItems: 'center'
    },
    dayBubble: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#141415',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#242426'
    },
    dayBubbleActive: {
        backgroundColor: '#D6FA6F',
        borderColor: '#D6FA6F',
        shadowColor: '#D6FA6F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6
    },
    dayBubblePast: {
        backgroundColor: '#0A0A0A',
        borderColor: '#1C1C1E'
    },
    dayText: {
        color: '#8A8A8E',
        fontSize: 15,
        fontWeight: '700'
    },
    dayTextActive: {
        color: '#0A0A0A',
        fontWeight: '900'
    },
    dayTextPast: {
        color: '#444446'
    },
    todayDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D6FA6F',
        marginTop: 8
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 20,
        letterSpacing: -0.5
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statCard: {
        width: '48%',
        backgroundColor: '#141415',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#242426',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5
    },
    statIcon: {
        width: 32,
        height: 32,
        marginBottom: 16,
        resizeMode: 'contain'
    },
    statValue: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: -0.5
    },
    statLabel: {
        fontSize: 11,
        color: '#8A8A8E',
        fontWeight: '800',
        letterSpacing: 1
    }
});