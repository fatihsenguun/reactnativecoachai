import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootStack from './src/navigation/RootStack';
import AuthProvider from '../CoachAI/src/context/AuthProvider'
import FitnessProfile from './src/pages/FitnessProfile';
import StartPage from './src/pages/StartPage';
import OnBoarding from './src/navigation/OnBoarding';
import { NavigationContainer } from '@react-navigation/native';
import RootProvider from './src/context/RootProvider';
export default function App() {
  return (

    <RootProvider>
      <RootStack />
    </RootProvider>




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
