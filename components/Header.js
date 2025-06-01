import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem('userAvatar');
        const storedFirstName = await AsyncStorage.getItem('userFirstName');
        const storedLastName = await AsyncStorage.getItem('userLastName');

        setAvatar(storedAvatar || null);
        setFirstName(storedFirstName || '');
        setLastName(storedLastName || '');
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleProfileNavigation = () => {
    if (!firstName && !lastName) {
      Alert.alert('Profile Incomplete', 'Please update your profile details before proceeding.');
    } else {
      navigation.navigate('Profile');
    }
  };

  return (
    <View style={styles.header} accessible accessibilityLabel="Header Navigation">
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go Back">
        <AntDesign name="arrowleft" size={24} color="#495E57" />
      </TouchableOpacity>

      {/* Little Lemon Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} accessibilityLabel="Little Lemon Logo" />

      {/* Profile Avatar with Navigation */}
      <TouchableOpacity 
        style={styles.avatarContainer} 
        onPress={handleProfileNavigation} 
        accessibilityLabel="Go to Profile"
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initials}>
              {firstName ? firstName.charAt(0).toUpperCase() : ''}
              {lastName ? lastName.charAt(0).toUpperCase() : ''}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF', // Header background set to white
  },
  backButton: { padding: 10 },
  logo: { width: 120, height: 40, resizeMode: 'contain' },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  avatarPlaceholder: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#ccc' 
  },
  initials: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});