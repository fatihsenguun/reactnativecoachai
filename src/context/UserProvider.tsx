import { createContext, useState } from "react";
import api from "../config/apiClient";

interface UserContextType {
      fitnessProfile: FitnessProfile | null;  
  fetchFitnessProfile: () => Promise<void>;
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

    const fetchFitnessProfile = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/fitness_profile');

            if (response.data && response.data.result && response.data.data) {
                const profile = response.data.data;
                setFitnessProfile(profile);

            } else {
                setFitnessProfile(null);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setFitnessProfile(null);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <UserContext.Provider value={{ fetchFitnessProfile, fitnessProfile}}>
            {children}
        </UserContext.Provider>
    );
}