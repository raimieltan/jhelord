import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import TaxiVector from '../../assets/images/vectors/taxi-vector.png'; // make sure to replace with your actual path

const MapHeader = ({title, subtext}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.weatherText}>{title}</Text>
        <Text style={styles.subText}>{subtext}</Text>
      </View>
      
      <Image source={TaxiVector} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:  '#039043', // Adjust the color to match the screenshot
    flexDirection: 'row',
    justifyContent: 'space-between', // This will position the text and image on opposite ends
    padding: 20, // Add padding as needed
  },
  textContainer: {
    width: '70%', // Half the width of the container
  },
  weatherText: {
    fontSize: 20, // Adjust the font size as needed
    fontWeight: 'bold',
    color: '#FFFFFF', // Assuming white text color
    marginBottom: 5, // Space between the title and subtext
  },
  subText: {
    fontSize: 14, // Adjust the font size as needed
    color: '#FFFFFF', // Assuming white text color
  },
  image: {
    width: 100, // Set image width
    height: 100, // Set image height
    resizeMode: 'contain' // Keep the image aspect ratio
  },
  // ... add any other styles you need here ...
});

export default MapHeader;
