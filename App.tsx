import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootStack from './src/navigation/RootStack';
import AuthProvider from '../CoachAI/src/context/AuthProvider'
import FitnessProfile from './src/pages/FitnessProfile';
import StartPage from './src/pages/StartPage';
import OnBoarding from './src/navigation/OnBoarding';
import { NavigationContainer } from '@react-navigation/native';
export default function App() {
  return (
   
    <AuthProvider>
     <RootStack/>
    </AuthProvider>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
