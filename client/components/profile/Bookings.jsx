import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import * as Location from 'expo-location';

const BookingList = ({ fetchDirections, setDirections }) => {
  const [bookings, setBookings] = useState([]);
  const [driver, setDriver] = useState(null)

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
      if (userProfile) {
        const response = await fetch(`https://jhelord-backend.onrender.com/api/drivers/${userProfile.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const driverProfile = await response.json();

        setDriver(driverProfile)
  
      }


    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      Alert.alert('Error', 'Failed to fetch user profile');
    }
  };


  useEffect(() => {
    fetchUserProfile()

  }, [])

  useEffect(() => {
    // Initial fetch
    fetchBookings();

    // Set up interval to fetch every 5 seconds
    const intervalId = setInterval(() => {
      fetchBookings();
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [driver]);


  const handleChangeUnitLocation = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'You must be logged in to perform this action');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.High,
      });

      const newlocation = {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude
      }

      const response = await fetch(`https://jhelord-backend.onrender.com/api/units/${driver?.unit[0].id}/location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ location: newlocation }),
      });

      if (!response.ok) {
        throw new Error('Failed to update unit location');
      }

      const updatedUnit = await response.json();



    } catch (error) {
      console.error('Error updating unit location:', error);

    }
  };

  useEffect(() => {
    // Assuming `driver.unitId` is available and valid


    // Function to update the unit's location



    const updateLocation = async () => {

      await handleChangeUnitLocation();

    }



    // Set up the interval
    const intervalId = setInterval(() => {
      updateLocation();

    }, 10000);

    // Clear the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalId);
  }, [driver]); // Dependencies array



  const fetchBookings = async () => {
    try {

      if (driver) {
        const response = await fetch(`https://jhelord-backend.onrender.com/api/bookings/driver/${driver?.id}`);
        if (!response.ok) {
          throw new Error('Error fetching bookings');
        }
        const data = await response.json();
        setBookings(data);
      }

    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };



  const changeBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'You must be logged in to perform this action');
        return;
      }

      const response = await fetch(`https://jhelord-backend.onrender.com/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBooking = await response.json();

      if (updatedBooking.status === "ACCEPTED") {
        const location = {

          lat: updatedBooking.location.lat,
          lng: updatedBooking.location.lng

        }


        // const originLatitude = location.coords.latitude;
        // const originLongitude = location.coords.longitude;
        fetchDirections(location)
      }
    
      Alert.alert('Success', `Booking has been ${newStatus.toLowerCase()}.`);

      // Update the local state to reflect the change
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ),
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      Alert.alert('Error', 'Failed to update booking status');

    }
  };


  const renderBooking = ({ item }) => (
    <TouchableOpacity>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri:`https://jhelord-backend.onrender.com/uploads/${item.User.profileImage.split("/")[2]}` }} // Replace with the actual user profile image URI
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{item.User.firstName + " " +item.User.lastName }</Text>
          <Text style={styles.phoneText}>Phone Number: {item.User.phoneNumber}</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {item.status !== 'ACCEPTED' ? (
            <>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => changeBookingStatus(item.id, 'ACCEPTED')}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => {
                  setDirections([]);
                  changeBookingStatus(item.id, 'CANCELLED')}}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
             <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                setDirections([]);
                changeBookingStatus(item.id, 'COMPLETED');
              }}>
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => changeBookingStatus(item.id, 'CANCELLED')}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
           
            
          )}
        </View>
      </View>
    </TouchableOpacity>

  );

  return (

    <>
      {
        bookings.filter((booking) => {
          return booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED'
        }).length <= 0 ? (
          <View style={{

            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10
          }}>
            <Text>No pending Bookings</Text>

          </View>
        ) : (
          <FlatList
            data={bookings.filter((booking) => {
              return booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED'
            })}
            renderItem={renderBooking}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        )
      }


    </>





  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 50, // Set the image size as needed
    height: 50, // Set the image size as needed
    borderRadius: 25, // Makes the image round
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontWeight: 'bold',
  },
  phoneText: {
    color: 'grey',
  },
  statusText: {
    color: 'blue', // or any color that indicates status
  },

  itemText: {
    fontSize: 16,
    marginBottom: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'green', // Color for the accept button
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: 'red', // Color for the reject button
    padding: 10,
    borderRadius: 5,
  },
  completeButton: {
    backgroundColor: 'blue', // Color for the complete button
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {

    paddingVertical: 20,

  },
});

export default BookingList;
