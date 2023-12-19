import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import * as Location from 'expo-location';

const DriverInfoModal = ({ isVisible, onClose, driver }) => {
    const [loading, setLoading] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => {
        const fetchBookingStatus = async () => {
            try {
                if (bookingId) {
                    console.log(bookingId)
                    const token = 'yourAuthToken'; // Replace with the actual authentication token
                    const response = await fetch(`https://jhelord-backend.onrender.com/api/bookings/${bookingId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Error fetching booking status');
                    }

                    const data = await response.json();
                    // Update booking status
                    setBookingStatus(data[0].status);
                    console.log(data[0].status)
                }
            } catch (error) {
                console.error('Error fetching booking status:', error);
            }
        };

        const intervalId = setInterval(() => {
            fetchBookingStatus();

        }, 5000);

        return () => clearInterval(intervalId);
    }, [bookingId]);

    const handleNewBooking = async () => {
        try {
            setLoading(true);

            const userId = await AsyncStorage.getItem('userId'); // Replace with the actual userId
            const token = 'yourAuthToken'; // Replace with the actual authentication token

            let location = await Location.getCurrentPositionAsync({
                enableHighAccuracy: true,
                accuracy: Location.Accuracy.High,
            });

            const newlocation = {
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
            };

            if (driver) {
                const response = await fetch(`https://jhelord-backend.onrender.com/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                    body: JSON.stringify({
                        driverId: driver.id,
                        userId: Number(userId),
                        status: 'PENDING',
                        location: newlocation,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Error creating booking');
                }

                const data = await response.json();
                // Handle success (e.g., update UI, set booking status and ID)
                console.log('Booking created successfully:', data);
                setBookingId(data.id);
                setBookingStatus(data.status);

            }
        } catch (error) {
            console.error('Error creating booking:', error);
        } finally {
            setLoading(false);

        }
    };

    const renderStatusMessage = () => {
        switch (bookingStatus) {
            case 'PENDING':
                return 'Awaiting for driver to accept';
            case 'ACCEPTED':
                return 'Booking accepted. The driver is on the way.';
            case 'COMPLETED':
                setBookingStatus(null)
                setBookingId(null)
                onClose(); // Automatically close the modal when booking is completed
                return 'Booking completed. Thank you!';
            default:
                return ''; // Add default message if needed
        }
    };


    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'transparent',
                        display: `${(bookingStatus === 'PENDING' || bookingStatus === 'ACCEPTED') ? 'none' : ''}`
                    }} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalText}>Driver Name: {driver.firstName}</Text>
                    <Text style={styles.modalText}>Unit: {driver.unit[0].model + ' ' + driver.unit[0].make}</Text>
                    <Text style={styles.modalText}>Plate Number: {driver.unit[0].plateNumber}</Text>
                    <Text style={styles.modalText}>
                        Location: {driver.unit[0].location.latitude + ' ' + driver.unit[0].location.longitude}
                    </Text>
                    <TouchableOpacity
                        style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, backgroundColor: 'green', display: `${(bookingStatus === 'PENDING' || bookingStatus === 'ACCEPTED') ? 'none' : ''}` }}
                        onPress={handleNewBooking}
                        disabled={loading}
                    >
                        <Text style={{ color: 'white' }}>{loading ? 'Booking...' : 'BOOK'}</Text>
                    </TouchableOpacity>
                    {bookingStatus && <Text style={styles.statusMessage}>{renderStatusMessage()}</Text>}
                </View>
            </View>
        </Modal>
    );
};

export default DriverInfoModal;

const styles = StyleSheet.create({


    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative', // Added for absolute positioning of the close button
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'transparent',
    },
    closeButtonText: {
        fontSize: 24,
        color: '#333',
    },
    statusMessage: {
        marginTop: 10,
        textAlign: 'center',
        color: 'blue', // Change color as needed
        fontStyle: 'italic',
    },
});
