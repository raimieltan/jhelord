import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapHeader from '../map/Header';

const CreateDriverProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [userId, setUserId] = useState(null)

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
      const userId = userProfile.id;
      setUserId(userId)

      setFirstName(userProfile.profile?.firstName || '');
      setLastName(userProfile.profile?.lastName || '');
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      Alert.alert('Error', 'Failed to fetch user profile');
    }
  };

  const handleCreateProfile = async () => {
    try {
      await fetchUserProfile();


      const response = await fetch(`https://jhelord-backend.onrender.com/api/drivers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseNumber, userId: userId }),
      });


      const data = await response.json();
      console.log(data)
      Alert.alert('Profile Created', 'Your driver profile has been successfully created.');
    } catch (error) {
      console.error('Error creating driver profile:', error.message);
      Alert.alert('Profile Creation Failed', 'Failed to create driver profile');
    }
  };

  useEffect(() => {
    fetchUserProfile()
  }, [])
  return (
    <View style={styles.container2}>
         
    <View style={styles.container}>
       
      <View style={styles.inputContainer}>
        <Icon name="idcard" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="License Number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />
      </View>


      <TouchableOpacity style={styles.button} onPress={handleCreateProfile}>
        <Text style={styles.buttonText}>Create Profile</Text>
      </TouchableOpacity>
    </View>
    </View>

  );
};

const styles = StyleSheet.create({
    container2: {
        flex: 1,

        width: '100%',

        backgroundColor: 'white',
      },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#039043',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CreateDriverProfile;
