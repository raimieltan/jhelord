// components/profile/Profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import CreateEditUnit from './CreateUnit';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('')
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        navigation.navigate('LOGIN');
        return;
      }

      const response = await fetch('https://jhelord-backend.onrender.com/api/users/profile', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userProfile = await response.json();
   
      await AsyncStorage.setItem("userId", userProfile.id+"")
      setUsername(userProfile.username);
      setEmail(userProfile.email);

 
      setImageUrl(`https://jhelord-backend.onrender.com/uploads/${userProfile.profileImage.split("/")[2]}`)

      await AsyncStorage.setItem("userRole", userProfile.role)
   
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      Alert.alert('Error', 'Failed to fetch user profile');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error.message);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleNavigateToMap = () => {
    navigation.navigate('Map');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar
          size="large"
          rounded
          source={{ uri: imageUrl }} // Replace with the user's profile picture URL
          containerStyle={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.mapButton} onPress={handleNavigateToMap}>
        <Text style={styles.mapButtonText}>Go to Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  mapButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;
