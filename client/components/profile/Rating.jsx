import React, {useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';

const Rating = () => {
    const [rating, setRating] = useState(0);
  // Handle the logic for selecting stars, giving compliments, adding tips, and pressing 'Done'
  
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://c8.alamy.com/zooms/9/80d94c5b96c54446b2dc609a62b9f61b/2c5xkmf.jpg' }} // Replace with actual image link
          style={styles.profileImage}
        />
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
      <TouchableOpacity style={styles.doneButton}>
        <Text style={styles.doneButtonText}>DONE</Text>
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
