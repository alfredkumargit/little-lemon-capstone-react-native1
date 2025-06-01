import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { MaskedTextInput } from 'react-native-mask-text'; // Phone number masking
import Header from '../components/Header'; // Import Header component

export default function Profile() {
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState({
    orderStatus: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });

  const [originalData, setOriginalData] = useState({}); // Stores original values for Discard Changes

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('userFirstName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedLastName = await AsyncStorage.getItem('userLastName');
        const storedPhone = await AsyncStorage.getItem('userPhone');
        const storedAvatar = await AsyncStorage.getItem('userAvatar');
        const storedNotifications = await AsyncStorage.getItem('userNotifications');

        const userData = {
          firstName: storedFirstName || '',
          lastName: storedLastName || '',
          email: storedEmail || '',
          phone: storedPhone || '',
          avatar: storedAvatar || null,
          notifications: storedNotifications ? JSON.parse(storedNotifications) : {},
        };

        setOriginalData(userData); // Store original values
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPhone(userData.phone);
        setAvatar(userData.avatar);
        setNotifications(userData.notifications);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const removeAvatar = () => setAvatar(null);

  const isValidUSPhoneNumber = (phone) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // Matches (XXX) XXX-XXXX format
    return phoneRegex.test(phone);
  };

  const saveChanges = async () => {
    if (!isValidUSPhoneNumber(phone)) {
      alert('Please enter a valid US phone number in (XXX) XXX-XXXX format.');
      return; // Stop execution if invalid
    }

    try {
      await AsyncStorage.setItem('userFirstName', firstName);
      await AsyncStorage.setItem('userLastName', lastName);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPhone', phone);
      await AsyncStorage.setItem('userAvatar', avatar || '');
      await AsyncStorage.setItem('userNotifications', JSON.stringify(notifications));

      setOriginalData({ firstName, lastName, email, phone, avatar, notifications });

      console.log('Profile saved successfully!');
      navigation.navigate('Home'); // Redirect to Home screen
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  const discardChanges = () => {
    setFirstName(originalData.firstName);
    setLastName(originalData.lastName);
    setEmail(originalData.email);
    setPhone(originalData.phone);
    setAvatar(originalData.avatar);
    setNotifications(originalData.notifications);

    console.log('Changes discarded, reverted to saved values.');
    navigation.navigate('Onboarding'); // Redirect to Onboarding screen
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.clear(); // Clears all stored user data
      navigation.navigate('Onboarding'); // Redirects to Onboarding screen
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header /> {/* Updated to include Header component */}

        {/* Personal Information */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Personal Information</Text>

          {/* Profile Picture or Initials Placeholder */}
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.initialsText}>
                  {/* CORRECTED LINE BELOW */}
                  {`${firstName ? firstName.charAt(0).toUpperCase() : ''}${lastName ? lastName.charAt(0).toUpperCase() : ''}`}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.avatarButtons}>
            <TouchableOpacity style={styles.changePictureButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Change Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeAvatarButton} onPress={removeAvatar}>
              <Text style={styles.buttonText}>Remove Avatar</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

            <Text style={styles.label}>Phone Number</Text>
            <MaskedTextInput style={styles.input} mask="(999) 999-9999" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </View>

        {/* Skip to Home Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.skipLink}>Skip to Home</Text>
        </TouchableOpacity>

        {/* Logout and Save Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.discardButton} onPress={discardChanges}>
              <Text style={styles.buttonText}>Discard Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures content can grow and scroll
    justifyContent: 'space-between', // Distributes content vertically
  },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  initialsText: { fontSize: 36, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  avatarButtons: { flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingHorizontal: 10, },
  changePictureButton: {
    flex: 1, backgroundColor: '#495E57', padding: 10, borderRadius: 6, alignItems: 'center', marginRight: 5,
  },
  removeAvatarButton: { flex: 1, backgroundColor: 'red', padding: 10, borderRadius: 6, alignItems: 'center', marginLeft: 5, },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ccc', marginTop: 5 },
  buttonContainer: { alignItems: 'center', marginTop: 40, paddingBottom: 20 }, // Added padding to prevent button cutoff
  logoutButton: { backgroundColor: '#F4CE14', padding: 10, borderRadius: 6, width: '80%', alignItems: 'center', marginBottom: 10 },
  actionButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  skipLink: { textAlign: 'center', marginVertical: 5, fontSize: 16, color: '#495E57', fontWeight: 'bold', textDecorationLine: 'underline' },
  discardButton: { backgroundColor: '#aaa', padding: 10, borderRadius: 6, alignItems: 'center', width: 140 },
  saveButton: { backgroundColor: '#495E57', padding: 10, borderRadius: 6, alignItems: 'center', width: 140 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
});