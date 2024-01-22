import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import StarRating from 'react-native-star-rating-widget';

const Rating = ({ 
  onClose, 
  driver, 
  userId, 
  setBookingId,
  setBookingStatus }) => {
  const [rating, setRating] = useState(0);
  // Handle the logic for selecting stars, giving compliments, adding tips, and pressing 'Done'

  const handleCreateReview = async () => {
    try {

      const response = await fetch(`http://192.168.1.101:8000/api/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, driverId: Number(driver.id), userId: Number(userId) }),
      });


      const data = await response.json();

      Alert.alert('Success', 'You have submitted a rating.');
      setBookingId(null)
      setBookingStatus(null)
    } catch (error) {
      console.error('Error submitting rating:', error.message);
      Alert.alert('Rating Creation Failed', 'Failed to create rating');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: `http://192.168.1.101:8000/uploads/${driver.User.profileImage.split("/")[2]}` }} // Replace with actual image link
          style={styles.profileImage}
        />
        <Text>
          {driver.User.firstName + " " + driver.User.lastName}
        </Text>
      </View>
      <View style={styles.starContainer}>
        <StarRating
          rating={rating}
          onChange={setRating}
        />
      </View>
      <TouchableOpacity style={styles.complimentButton}>
        <Text style={styles.complimentText}>Give a compliment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.doneButton} onPress={() => {
        handleCreateReview()
        onClose()
      }}>
        <Text style={styles.doneButtonText}>Rate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF', // Adjust the background color as needed
  },
  profileContainer: {
    // Add styles for the profile image container
  },
  profileImage: {
    width: 100, // Adjust size as needed
    height: 100,
    borderRadius: 50, // Half the size of the width/height to make it circular
  },
  starContainer: {
    // Add styles for the star rating container
  },
  complimentButton: {
    // Add styles for the compliment button
  },
  complimentText: {
    // Add styles for the compliment text
  },
  tipPrompt: {
    // Add styles for the tip prompt text
  },
  tipOptions: {
    // Add styles for the tip options container
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Adjust width as necessary
  },
  tipButton: {
    // Add styles for the tip amount buttons
    borderRadius: 50, // Make it circular
    borderWidth: 1, // Adjust border width as needed
    borderColor: '#000', // Adjust border color as needed
    padding: 10, // Adjust padding as needed
  },
  tipAmount: {
    // Add styles for the tip amount text
  },
  customTipButton: {
    // Add styles for the custom tip button
  },
  customTipText: {
    // Add styles for the custom tip text
  },
  doneButton: {
    backgroundColor: 'black', // Adjust background color as needed
    position: 'absolute',
    bottom: 0, // Position at the bottom
    width: '100%', // Full width
  },
  doneButtonText: {
    textAlign: 'center',
    color: 'white',
    padding: 20, // Adjust padding as needed
    fontSize: 16, // Adjust font size as needed
  },
  // ... any other styles you need
});

export default Rating;
