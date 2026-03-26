import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../config/apiClient";
import { useAuth } from "./AuthProvider";

export interface Exercise {
    name: string;
    targetSets: number;
    targetReps: number;
    startWeightKg: number;
    targetWeightKg: number;
    restDurationSeconds: number;
}

export interface WorkoutSession {
    id: number,
    dayNumber: number;
    name: string;
    smallTips: string;
    scheduledDate: string;
    completed: boolean;
    exercises: Exercise[];
}

export interface WorkoutProgram {
    name: string;
    startDate: string;
    endDate: string;
    active?: boolean;
    sessions: WorkoutSession[];
}
export interface TimelineDay {
    date: string;
    dayName: string;
    dayNumber: number;
    isRestDay: boolean;
    sessionData: WorkoutSession | null;
}

interface WorkoutContextType {
    programData: WorkoutProgram | null;
    todaySession: WorkoutSession | null;
    isLoading: boolean;
    stats: { progress: number; daysLeft: number };
    fetchCurrentProgram: () => Promise<void>;
    fullSchedule: TimelineDay[];
}

export const WorkoutContext = createContext<WorkoutContextType | null>(null);

const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth(); // You need to know if the user is logged in
    const [isLoading, setIsLoading] = useState(false);
    const [fullSchedule, setFullSchedule] = useState<TimelineDay[]>([]);
    const [programData, setProgramData] = useState<WorkoutProgram | null>(null);
    const [todaySession, setTodaySession] = useState<WorkoutSession | null>(null);
    const [stats, setStats] = useState({ progress: 0, daysLeft: 0 });

    useEffect(() => {
        if (user) {
            fetchCurrentProgram();
        } else {
            // Clean up when logged out
            setProgramData(null);
            setFullSchedule([]);
            setTodaySession(null);
            setStats({ progress: 0, daysLeft: 0 });
        }
    }, [user]);

    const generateFullSchedule = (programData: WorkoutProgram): TimelineDay[] => {
        const { startDate, endDate, sessions } = programData;
        const schedule: TimelineDay[] = [];

        let current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            const session = sessions.find((s: WorkoutSession) => s.scheduledDate === dateStr);

            schedule.push({
                date: dateStr,
                dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: current.getDate(),
                isRestDay: !session,
                sessionData: session || null,
            });
            current.setDate(current.getDate() + 1);
        }
        return schedule;
    }

    const fetchCurrentProgram = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/program/get');

            if (response.data?.data) {
                const program: WorkoutProgram = response.data.data;
                setProgramData(program);

                const generatedTimeline = generateFullSchedule(program);
                setFullSchedule(generatedTimeline);

                const offset = new Date().getTimezoneOffset();
                const today = new Date(new Date().getTime() - (offset * 60 * 1000));
                const todayStr = today.toISOString().split('T')[0];

                const sessionForToday = program.sessions.find((s: WorkoutSession) => s.scheduledDate === todayStr);
                setTodaySession(sessionForToday || null);

                const completedSessions = program.sessions.filter((s: WorkoutSession) => s.completed).length;
                const totalSessions = program.sessions.length;
                const progressPct = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

                const endDate = new Date(program.endDate);
                const diffTime = endDate.getTime() - new Date().getTime();
                const daysRemaining = Math.ceil(diffTime / (1000 * 3600 * 24));

                setStats({ progress: progressPct, daysLeft: daysRemaining > 0 ? daysRemaining : 0 });
            } else {
                setProgramData(null);
                setTodaySession(null);
                setFullSchedule([]);
            }
        } catch (error: any) {
            if (error.response && (error.response.status === 400 || error.response.status === 404)) {
                console.info("No active program found for this user.");
            } else {
                console.error("Failed to fetch program:", error.message);
            }
            setProgramData(null);
            setTodaySession(null);
            setFullSchedule([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WorkoutContext.Provider value={{ fullSchedule, fetchCurrentProgram, programData, todaySession, isLoading, stats }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export default WorkoutProvider;

export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (!context) throw new Error("useWorkout must be used within a WorkoutProvider");
    return context;
};