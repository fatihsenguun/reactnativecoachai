import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import { useUser } from '../context/UserProvider';

const Profile = () => {
    const { user, logout, isLoading: isAuthLoading } = useAuth();
    const { fitnessProfile, isLoading: isProfileLoading } = useUser();
    const navigation = useNavigation<any>();

    const isLoading = isAuthLoading || isProfileLoading;

    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName ? firstName.charAt(0) : '';
        const last = lastName ? lastName.charAt(0) : '';
        return `${first}${last}`.toUpperCase() || '👤';
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D6FA6F" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBar}>
                <View style={styles.topBarCenter}>
                    <Text style={styles.topBarText}>PROFILE</Text>
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerSection}>
                    <View style={styles.avatarContainer}>
                        <Image style={{width:70,height:70}} source={require('../assets/user.png')}/>
                    </View>
                    <Text style={styles.userName}>
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{user?.role || 'MEMBER'}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Physical Stats</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{fitnessProfile?.weightKg || '-'}</Text>
                        <Text style={styles.statLabel}>WEIGHT (KG)</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{fitnessProfile?.heightCm || '-'}</Text>
                        <Text style={styles.statLabel}>HEIGHT (CM)</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{fitnessProfile?.age || '-'}</Text>
                        <Text style={styles.statLabel}>AGE</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Fitness Journey</Text>
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Text style={styles.infoIcon}>🎯</Text>
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Current Goal</Text>
                            <Text style={styles.infoValue}>
                                {fitnessProfile?.currentGoal || 'Not set'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoDivider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Text style={styles.infoIcon}>⏳</Text>
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Experience Level</Text>
                            <Text style={styles.infoValue}>
                                {fitnessProfile?.sportsHistory || 'Not set'}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.logoutBtn}
                    onPress={logout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>LOG OUT</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0A0A0A'
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        alignItems: 'center'
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',

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
        tintColor: '#FFFFFF'
    },
    topBarCenter: {
        flex: 1,
        alignItems: 'center'
    },
    topBarText: {
        color: '#8A8A8E',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 2
    },
 
    scrollContainer: {
        paddingHorizontal: 25,
        paddingBottom: 40
    },
    headerSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D6FA6F',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#D6FA6F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#0A0A0A',
        letterSpacing: 2
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 8,
        letterSpacing: -0.5
    },
    roleBadge: {
        backgroundColor: '#A084E820',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    roleText: {
        color: '#A084E8',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
        letterSpacing: 0.5
    },
    statsGrid: {
        flexDirection: 'row',
        backgroundColor: '#141415',
        borderRadius: 24,
        paddingVertical: 20,
        marginBottom: 35,
        borderWidth: 1,
        borderColor: '#242426',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    statBox: {
        alignItems: 'center',
        flex: 1
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4
    },
    statLabel: {
        color: '#8A8A8E',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#242426'
    },
    infoCard: {
        backgroundColor: '#141415',
        borderRadius: 24,
        padding: 20,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#242426'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#242426',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    infoIcon: {
        fontSize: 20
    },
    infoTextContainer: {
        flex: 1
    },
    infoLabel: {
        color: '#8A8A8E',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4
    },
    infoValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'capitalize'
    },
    infoDivider: {
        height: 1,
        backgroundColor: '#242426',
        marginVertical: 16,
        marginLeft: 60
    },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF453A30'
    },
    logoutIcon: {
        fontSize: 18,
        marginRight: 10
    },
    logoutText: {
        color: '#FF453A',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1.5
    }
});