// components/profile/Profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import BottomNavBar from '../nav/BottomNav';
import io from 'socket.io-client';



const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('')
  const [userId, setUserId] = useState(null)
  const [recentBookings, setRecentBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);

  const navigation = useNavigation();


  const socket = io('https://jhelord-backend.onrender.com/');


  useEffect(() => {



    const intervalId = setInterval(() => {
      fetchUserProfile();
      fetchBookings()
    }, 2000);

    return () => clearInterval(intervalId);
  }, [userId]);


  const fetchBookings = async () => {
    try {
      if (userId) {

        const response = await fetch(`https://jhelord-backend.onrender.com/api/bookings/user/${userId}`, {
          method: 'GET',

        });


        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const bookings = await response.json();

        processBookings(bookings);

      }

    } catch (error) {
      console.error('Error fetching bookings:', error.message);
      Alert.alert('Error', 'Failed to fetch bookings');
    }
  };

  const processBookings = (bookings) => {
    const active = bookings.find(booking => booking.status === 'ACCEPTED' || booking.status === 'PENDING');
    const recent = bookings.filter(booking => booking.status !== 'ACCEPTED' && booking.status !== 'PENDING');

    setActiveBooking(active);
    setRecentBookings(recent);
    console.log(activeBooking)
  };

  const renderBookingDetails = (booking) => (
    <View key={booking.id} style={styles.bookingContainer}>
      <Text style={styles.bookingText}>Driver: {booking.driver.User.firstName} {booking.driver.User.lastName}</Text>
      <Text style={styles.bookingText}>Status: {booking.status}</Text>
    </View>
  );



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

      // Emit 'login' event to notify the server
      const userId = userProfile.id.toString(); // Convert to string if not already
   
  
      // Update state and AsyncStorage
      await AsyncStorage.setItem('userId', userId);
      setUserId(userId);
      setUsername(userProfile.username);
      setEmail(userProfile.email);
      setImageUrl(`https://jhelord-backend.onrender.com/uploads/${userProfile.profileImage.split("/")[2]}`)
      socket.emit('login', userId);
      await AsyncStorage.setItem("userRole", userProfile.role)
      

    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      Alert.alert('Error', 'Failed to fetch user profile');
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
      <TouchableOpacity style={styles.mapButton} onPress={() => navigation.navigate('FareCalculator')}>
        <Text style={styles.mapButtonText}>Fare Calculator</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={{
        marginTop: 20
      }}>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 24,
          color: '#737272'
        }}>
          Active Booking
        </Text>

        {activeBooking && (
          <View>

            {renderBookingDetails(activeBooking)}
          </View>
        )}


        <View style={
          {
            borderWidth: 0.5,
            borderColor: 'gray',
            marginVertical: 20,
            width: '100%'
          }
        }>

        </View>

        <Text style={{
          fontWeight: 'bold',
          fontSize: 24,
          color: '#737272'
        }}>
          Recent Bookings
        </Text>
        <ScrollView style={{
          height: '30%'
        }}>
          {recentBookings.map(booking => renderBookingDetails(booking))}
        </ScrollView>

      </View>



      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',



      }}>
        <View style={{
          position: 'absolute',
          bottom: 0,
          width: '100vw',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center'
        }}>

          <BottomNavBar />
        </View>

      </View>


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
    color: '#737272'
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bookingContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  bookingText: {
    fontSize: 16,
    color: '#555',
  },
});

export default Profile;
