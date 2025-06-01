import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container} accessible accessibilityLabel="Loading screen">
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text} accessibilityLabel="Loading text">Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold', // Improved readability
  },
});