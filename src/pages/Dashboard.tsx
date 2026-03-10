import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgramBox from '../components/dashboardComponents/ProgramBox';
import { useAuth } from '../context/AuthProvider';
import { useWorkout } from '../context/WorkoutProvider';

const Dashboard = ({ navigation }: any) => {
    const { user } = useAuth();
    const { fullSchedule, isLoading } = useWorkout();
    
    // 1. Setup Date Strings
    const todayStr = new Date().toISOString().split('T')[0];
    const firstName = user?.firstName || 'Fatih';

    // 2. State & Refs
    const [selectedDateStr, setSelectedDateStr] = useState(todayStr);
    const flatListRef = useRef<FlatList>(null);

    // 3. Effect: Auto-scroll to today's date when schedule loads
    useEffect(() => {
        if (fullSchedule.length > 0 && flatListRef.current) {
            const todayIndex = fullSchedule.findIndex(item => item.date === todayStr);

            if (todayIndex !== -1) {
                // Short timeout to ensure the list is rendered before scrolling
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({
                        index: todayIndex,
                        animated: true,
                        viewPosition: 0.5 // Centers the item in the viewport
                    });
                }, 600);
            }
        }
    }, [fullSchedule]);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#D6FA6F" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>READY TO WORK?</Text>
                        <Text style={styles.name}>Hello, {firstName} 👋</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                 
                    </TouchableOpacity>
                </View>

                {/* Linear Timeline Schedule */}
                <Text style={styles.sectionTitle}>Your Schedule</Text>
                <View style={styles.trackerWrapper}>
                    <FlatList
                        ref={flatListRef}
                        horizontal
                        data={fullSchedule}
                        keyExtractor={(item) => item.date}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                        // Important for stable auto-scrolling
                        getItemLayout={(data, index) => (
                            { length: 62, offset: 62 * index, index }
                        )}
                        renderItem={({ item }) => {
                            const isSelected = item.date === selectedDateStr;
                            const isToday = item.date === todayStr;
                            const hasWorkout = !item.isRestDay;

                            return (
                                <TouchableOpacity 
                                    onPress={() => setSelectedDateStr(item.date)}
                                    style={styles.dayBubbleContainer}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.dayBubble,
                                        isSelected && styles.dayBubbleActive,
                                        isToday && !isSelected && styles.dayBubbleTodayBorder,
                                        item.isRestDay && !isSelected && styles.dayBubbleRest
                                    ]}>
                                        <Text style={[
                                            styles.dayText, 
                                            isSelected && styles.dayTextActive
                                        ]}>
                                            {item.dayName.charAt(0)}
                                        </Text>
                                        <Text style={[
                                            styles.dayNum, 
                                            isSelected && styles.dayTextActive
                                        ]}>
                                            {item.dayNumber}
                                        </Text>
                                    </View>
                                    
                                    {/* Small indicator dot for workout days */}
                                    {hasWorkout && (
                                        <View style={[
                                            styles.workoutDot, 
                                            isSelected && { backgroundColor: '#FFF' }
                                        ]} />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                <Text style={styles.sectionTitle}>Your Active Plan</Text>
            
                {/* Syncs ProgramBox with the selected day in the tracker */}
                <ProgramBox selectedDateStr={selectedDateStr} /> 
                
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
        backgroundColor: '#0A0A0A',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
    },
    greeting: {
        fontSize: 12,
        color: '#A084E8',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    name: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    settingsIcon: {
        width: 26,
        height: 26,
        tintColor: '#FFF',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 20,
        letterSpacing: -0.5,
    },

    // --- Timeline Tracker Styles ---
    trackerWrapper: {
        marginBottom: 35,
        marginLeft: -25, // Stretch to screen edges
        marginRight: -25,
    },
    flatListContent: {
        paddingHorizontal: 25,
        gap: 12,
    },
    dayBubbleContainer: {
        alignItems: 'center',
    },
    dayBubble: {
        width: 50,
        height: 65,
        borderRadius: 16,
        backgroundColor: '#141415',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#242426',
    },
    dayBubbleActive: {
        backgroundColor: '#D6FA6F',
        borderColor: '#D6FA6F',
    },
    dayBubbleTodayBorder: {
        borderColor: '#D6FA6F',
        borderWidth: 2,
    },
    dayBubbleRest: {
        opacity: 0.5,
    },
    dayText: {
        color: '#8A8A8E',
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 4,
    },
    dayNum: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
    },
    dayTextActive: {
        color: '#0A0A0A',
    },
    workoutDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#D6FA6F',
        marginTop: 6,
    },

    // --- Stats Grid Styles ---
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        backgroundColor: '#141415',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#242426',
    },
    statIcon: {
        width: 32,
        height: 32,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    statValue: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 11,
        color: '#8A8A8E',
        fontWeight: '800',
        letterSpacing: 1,
    },
});