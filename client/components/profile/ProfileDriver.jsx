// components/profile/Profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import CreateEditUnit from './CreateUnit';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import io from 'socket.io-client';

const ProfileDriver = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('')
  const [id, setId] = useState('')
  const [profile, setProfile] = useState({})
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [imageUrl, setImageUrl] = useState('')


  const socket = io('https://jhelord-backend.onrender.com/');

  useEffect(() => {
  
    const interval = setInterval(() => {
      fetchUserProfile();
  }, 2000); // Set the interval time in milliseconds (e.g., 1000ms = 1 second)

  // Cleanup function to clear the interval
  console.log("Fetched user profile")
  return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Function that sets up the interval
    const interval = setInterval(() => {
        fetchDriverProfile();
    }, 5000); // Set the interval time in milliseconds (e.g., 1000ms = 1 second)

    // Cleanup function to clear the interval
    console.log("Fetched driver profile")
    return () => clearInterval(interval);
}, [id]); // Dependencies array, the interval will reset if `id` changes


  useEffect(() => {

  }, [profile])

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
      const userProfile = await response.json();

      // Emit 'login' event to notify the server
      const userId = userProfile.id.toString(); // Convert to string if not already
      socket.emit('login', userId);
  
      // Update state and AsyncStorage
      await AsyncStorage.setItem('userId', userId);
      setUsername(userProfile.username);
      setEmail(userProfile.email);
      setRole(userProfile.role)
      setId(userProfile.id)
      setUser(userProfile)
      setImageUrl(`https://jhelord-backend.onrender.com/uploads/${userProfile.profileImage.split("/")[2]}`)


    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      Alert.alert('Error', 'Failed to fetch user profile');
    }
  };


  const fetchDriverProfile = async () => {
    try {

      console.log(id)
      const response = await fetch(`https://jhelord-backend.onrender.com/api/drivers/${id}`, {
        method: 'GET',

      });

      const driver = await response.json();

      console.log({driver})
      if(driver){
        setProfile(driver)
    
      }

      await AsyncStorage.setItem("driverId", String(driver.userId))

    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      const userId = await AsyncStorage.getItem('userId');

      // Emit 'logout' event to notify the server
      socket.emit('logout', userId);

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error.message);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleNavigateToMap = () => {
    navigation.navigate('Map');
  };
  const handleNavigateToCreateDriver = () => {
    navigation.navigate('CreateProfile');
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return 0; // Return 0 if there are no reviews
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return averageRating;
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
          <Text style={styles.email}>{role}</Text>
          <StarRatingDisplay
                    starSize={16}
                    color='green'
                    rating={calculateAverageRating(profile.driverReview)}
                />
        </View>
      </View>

      {profile.id && user && (
        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>First Name: {user.firstName}</Text>
          <Text style={styles.profileText}>Last Name: {user.lastName}</Text>
          <Text style={styles.profileText}>License Number: {profile.licenseNumber}</Text>
       

        
        </View>
      )}


      <TouchableOpacity style={styles.mapButton} onPress={handleNavigateToMap}>
        <Text style={styles.mapButtonText}>Go to Map</Text>
      </TouchableOpacity>
      {!profile.id && (
        <TouchableOpacity style={styles.mapButton} onPress={handleNavigateToCreateDriver}>
          <Text style={styles.mapButtonText}>Create Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.mapButton} onPress={() => {
            navigation.navigate('ManageUnit');
      }}>
        <Text style={styles.mapButtonText}>Manage Unit</Text>
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
  profileInfo: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#a7a8a2',
    borderRadius: 20
  },
  profileText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
    marginBottom: 5,

  },
});

export default ProfileDriver;
