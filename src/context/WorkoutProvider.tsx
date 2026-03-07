import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../config/apiClient";

export interface Exercise {
    name: string;
    targetSets: number;
    targetReps: number;
    startWeightKg: number;
    targetWeightKg: number;
    restDurationSeconds: number;
}

export interface WorkoutSession {
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

interface WorkoutContextType {
    programData: WorkoutProgram | null;      
    todaySession: WorkoutSession | null;    
    isLoading: boolean;
    stats: { progress: number; daysLeft: number }; 
    fetchCurrentProgram: () => Promise<void>;
}

export const WorkoutContext = createContext<WorkoutContextType | null>(null);

const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    

    const [programData, setProgramData] = useState<WorkoutProgram | null>(null);
    const [todaySession, setTodaySession] = useState<WorkoutSession | null>(null);
    const [stats, setStats] = useState({ progress: 0, daysLeft: 0 });

    const fetchCurrentProgram = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/program/get');

            if (response.data && response.data.result && response.data.data) {
                const program = response.data.data;
                setProgramData(program);

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
            }
        } catch (error) {
            console.error("Failed to fetch program:", error);
            setProgramData(null);
            setTodaySession(null);
        } finally {
            setIsLoading(false);
        }
    };

  

    return (
        <WorkoutContext.Provider value={{ fetchCurrentProgram, programData, todaySession, isLoading, stats }}>
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