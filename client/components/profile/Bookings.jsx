import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const BookingList = () => {
  const bookings = [
    {
      "id": 1,
      "driverId": 2,
      "userId": 3,
      "status": "PENDING",
      "location": {
        "latitude": 34.052235,
        "longitude": -118.243683
      },
      "createdAt": "2023-12-18T11:56:01.096Z"
    }
    // ... add more bookings as needed
  ];

  const renderBooking = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Booking ID: {item.id}</Text>
      <Text style={styles.itemText}>Driver ID: {item.driverId}</Text>
      <Text style={styles.itemText}>User ID: {item.userId}</Text>
      <Text style={styles.itemText}>Status: {item.status}</Text>
      <Text style={styles.itemText}>Location: Lat {item.location.latitude}, Long {item.location.longitude}</Text>
      <Text style={styles.itemText}>Created At: {item.createdAt}</Text>
    </View>
  );

  return (
    <FlatList
      data={bookings}
      renderItem={renderBooking}
      keyExtractor={item => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5
  }
});

export default BookingList;
