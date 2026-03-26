import { createContext, useContext, useEffect, useState } from "react";
import api from "../config/apiClient";
import { useAuth } from "./AuthProvider";

interface UserContextType {
    fitnessProfile: FitnessProfile | null;
    fetchFitnessProfile: () => Promise<void>;
    isLoading: boolean;
}
interface FitnessProfile {
    weightKg: number,
    heightCm: number,
    age: number,
    sportsHistory: string,
    currentGoal: string

}

export const UserContext = createContext<UserContextType | null>(null);


const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [fitnessProfile, setFitnessProfile] = useState<FitnessProfile | null>(null);
    const { user } = useAuth(); // Get user from AuthContext

    useEffect(() => {
        if (user) {
            fetchFitnessProfile();
        } else {
            setFitnessProfile(null);
            setIsLoading(false);
        }
    }, [user]);

    const fetchFitnessProfile = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/fitness_profile');
            // Assuming the profile is in response.data.data
            const profile = response.data?.data;
            if (profile) {
                setFitnessProfile(profile);
            } else {
                setFitnessProfile(null);
            }
        } catch (error) {
            console.error("Failed to fetch fitness profile:", error);
            setFitnessProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ fetchFitnessProfile, fitnessProfile, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};