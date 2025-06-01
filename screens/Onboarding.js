import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Onboarding = ({ setOnboardingComplete }) => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValidName, setIsValidName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showError, setShowError] = useState(false);

  const validateName = (text) => {
    setName(text);
    setIsValidName(/^[A-Za-z]+$/.test(text) && text.length > 0);
    setShowError(false);
  };

  const validateEmail = (text) => {
    setEmail(text);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
    setShowError(false);
  };

  const completeOnboarding = async () => {
    if (!isValidName || !isValidEmail) {
      setShowError(true);
      Alert.alert('Invalid Input', 'Please enter a valid name and email.');
      return;
    }

    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', JSON.stringify(true));
      await AsyncStorage.setItem('userFirstName', name);
      await AsyncStorage.setItem('userEmail', email);
      setOnboardingComplete(true);

      navigation.replace('Profile');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Let us get to know you!</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Enter your first name" 
          onChangeText={validateName} 
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={validateEmail}
        />

        {/* Error Message - Only shows when user clicks "Next" without valid input */}
        {showError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: Missing required fields.</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Next" disabled={!isValidName || !isValidEmail} onPress={completeOnboarding} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D3D3D3' },
  header: { alignItems: 'center', backgroundColor: '#E0E0E0', marginTop: 30, paddingVertical: 20 },
  logo: { width: 148, height: 40 },
  formContainer: { flex: 1, paddingHorizontal: 20, marginTop: 200 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  input: { height: 40, borderWidth: 1, borderColor: '#A9A9A9', borderRadius: 5, paddingHorizontal: 10, marginBottom: 15, backgroundColor: '#FFF' },
  errorContainer: { marginTop: 10, padding: 10, backgroundColor: '#FFDDDD', borderRadius: 5 },
  errorText: { color: '#D8000C', textAlign: 'center', fontWeight: 'bold' },
  buttonContainer: { marginTop: 20 }, // Wrapped button inside a view to prevent text rendering issues
});

export default Onboarding;