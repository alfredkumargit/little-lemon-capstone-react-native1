import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native'; // Ensure safe text rendering
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Onboarding from './screens/Onboarding';
import ProfileScreen from './screens/Profile';
import SplashScreen from './screens/SplashScreen'; // Ensure SplashScreen is properly imported

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hasCompletedOnboarding');
        if (value !== null) {
          setHasCompletedOnboarding(JSON.parse(value));
        }
      } catch (error) {
        console.error('Error reading onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding">
          {(props) => {
            if (!Onboarding) {
              return (
                <View>
                  <Text>Error: Onboarding component is missing</Text>
                </View>
              );
            }
            return <Onboarding {...props} setOnboardingComplete={setHasCompletedOnboarding} />;
          }}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {(props) => {
            if (!Home) {
              return (
                <View>
                  <Text>Error: Home component is missing</Text>
                </View>
              );
            }
            return <Home {...props} />;
          }}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {(props) => {
            if (!ProfileScreen) {
              return (
                <View>
                  <Text>Error: ProfileScreen component is missing</Text>
                </View>
              );
            }
            return <ProfileScreen {...props} />;
          }}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}