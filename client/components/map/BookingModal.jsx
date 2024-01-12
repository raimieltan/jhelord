import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Modal, Alert, SafeAreaView, FlatList, StatusBar, Image, ActivityIndicator, ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rating from '../profile/Rating';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

// Functions for calculating distance and filtering cars
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const filterCarsWithinRadius = (carOptions, currentLocation, radius) => {
    return carOptions.filter(car => {
        const distance = calculateDistance(
            currentLocation.lat, currentLocation.lng,
            car.unit[0]?.location?.latitude, car.unit[0]?.location?.longitude
        );


        return distance <= radius;
    });
};

const BookingModal = ({ isVisible, onClose, pickupLocation, pickupAddress }) => {
    const carPlaceholderImage = "https://cdn-icons-png.flaticon.com/512/55/55283.png";

    const [driversData, setDriversData] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(10); // default radius of 10 km
    const [bookingStatus, setBookingStatus] = useState(null); // New state for booking status
    const [bookingId, setBookingId] = useState(null);
    const [bookedDriver, setBookedDriver] = useState(null)
    const [user, setUser] = useState(null)

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
                    // if (bookingStatus === 'COMPLETED' || bookingStatus === 'CANCELLED') {

                    //     setBookingId(null)
                    //     setBookingStatus(null)

                    // }
                    if (bookingStatus === 'CANCELLED') {

                        setBookingId(null)
                        setBookingStatus(null)

                    }
                }
            } catch (error) {
                console.error('Error fetching booking status:', error);
            }
        };

        const intervalId = setInterval(() => {
            fetchBookingStatus();

        }, 5000);

        return () => clearInterval(intervalId);
    }, [bookingId, bookingStatus]);


    useEffect(() => {
        const fetchDrivers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://jhelord-backend.onrender.com/api/drivers/');
                const data = await response.json();
                setDriversData(data);
                setFilteredDrivers(data); // Initially, don't filter drivers
            } catch (err) {
                setError(err.message);
                Alert.alert('Error', 'Could not fetch drivers');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    // useEffect to filter drivers when driversData or radius changes
    useEffect(() => {
        if (pickupLocation && driversData.length > 0) {
            const filtered = filterCarsWithinRadius(driversData, pickupLocation, radius);
            console.log(filtered)
            setFilteredDrivers(filtered);
        }
    }, [driversData, pickupLocation, radius]);


    const handleBooking = async (driverId) => {
        try {
            setIsLoading(true);
            // Assume we have a token and user ID
            const token = 'yourAuthToken'; // Replace with actual token
            const userId = await AsyncStorage.getItem('userId'); // Replace with actual user ID from storage or state
            setUser(userId)
            const response = await fetch('https://jhelord-backend.onrender.com/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    driverId: driverId,
                    userId: Number(userId),
                    location: pickupLocation,
                    status: 'PENDING', // Initial status
                }),
            });

            if (!response.ok) {

                throw new Error('Failed to create booking');
            }

            const data = await response.json();
            setBookingId(data.id);
            console.log(bookingId)
            // You can set the booking ID here if needed with setBookingId(data.id);

            Alert.alert('Success', 'Your booking is confirmed!');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const changeBookingStatus = async (bookingId) => {
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
                body: JSON.stringify({ status: 'CANCELLED' }),
            });

            if (!response.ok) {
                throw new Error('Failed to update booking status');
            }

            const updatedBooking = await response.json();


            Alert.alert('Cancelled', `Booking has been cancelled.`);

        } catch (error) {
            console.error('Error updating booking status:', error);
            Alert.alert('Error', 'Failed to update booking status');

        }
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return 0; // Return 0 if there are no reviews
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        return averageRating;
    };


    const CarItem = ({ unit, driverName, driver }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: `https://jhelord-backend.onrender.com/uploads/${driver.User.profileImage.split("/")[2]}` }} style={styles.carImage} />
            <View style={styles.carDetails}>
                <Text style={styles.carModel}>{`${unit.model} ${unit.make} `}</Text>
                <Text style={styles.carPrice}>{`Plate: ${unit.plateNumber}`}</Text>
                <Text style={styles.driverName}>{driverName}</Text>
                <Text style={styles.driverName}>{calculateDistance(pickupLocation.lat, pickupLocation.lng,
                    driver.unit[0]?.location?.latitude, driver.unit[0]?.location?.longitude).toFixed(2) + ' km away'}</Text>
                <StarRatingDisplay
                    starSize={16}
                    color='green'
                    rating={calculateAverageRating(driver.driverReview)}
                />


            </View>
            <TouchableOpacity style={styles.bookButton} onPress={() => {
                setBookedDriver(driver)
                handleBooking(driver.id)
            }} disabled={isLoading}>
                <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>

            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    {bookingStatus ? (
                        <>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 24
                            }}>
                                Booking Status
                            </Text>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                                margin: 10
                            }}>
                                {`${bookingStatus}`}
                            </Text>
                            {
                                bookingStatus === 'PENDING' ? (
                                    <>


                                        <ActivityIndicator style={{
                                            marginVertical: 10
                                        }} size="large" color="blue" />
                                        <TouchableOpacity
                                            style={styles.rejectButton}
                                            onPress={() => changeBookingStatus(bookingId)}>
                                            <Text style={{
                                                color: 'white'
                                            }}>CANCEL</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : bookingStatus === 'ACCEPTED' ? (
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '400',
                                        margin: 10
                                    }}>
                                        Your driver is on the way.
                                    </Text>
                                ) : bookingStatus === 'COMPLETED' ? (
                                    <>

                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '400',
                                            margin: 10
                                        }}>
                                            Booking has been completed. Thanks for trusting our company.
                                        </Text>
                                        <Rating onClose={onClose} driver={bookedDriver} userId={user} setBookingId={setBookingId} setBookingStatus={setBookingStatus} />
                                    </>
                                ) : (
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '400',
                                        margin: 10
                                    }}>
                                        Booking has been cancelled
                                    </Text>
                                )
                            }

                        </>

                    ) : (
                        <>
                            <View>

                                <Text style={styles.modalTitle}>Choose your taxi</Text>
                                <Text style={styles.modalAddress}>{pickupAddress}</Text>
                                <View>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={1}
                                        maximumValue={100}
                                        step={1}
                                        value={radius}
                                        onValueChange={setRadius}
                                        minimumTrackTintColor="#1fb28a"
                                        maximumTrackTintColor="#d3d3d3"
                                        thumbTintColor="#1a9274"
                                    />
                                    <Text>Search radius: {radius} km</Text>
                                </View>

                            </View>



                            <SafeAreaView style={styles.safeAreaView}>
                                {error ? (
                                    <Text style={styles.errorText}>{error}</Text>
                                ) : filteredDrivers.length > 0 ? (
                                    <FlatList
                                        data={filteredDrivers}
                                        renderItem={({ item }) => item.unit.map(car => (
                                            <CarItem
                                                key={car.id}
                                                unit={car}
                                                driverName={`${item.User.firstName} ${item.User.lastName}`}
                                                driver={item}
                                            />
                                        ))}
                                        keyExtractor={item => item.id.toString()}
                                    />
                                ) : (
                                    <Text style={styles.noDriversText}>There are no drivers near you</Text>
                                )}
                            </SafeAreaView>



                        </>
                    )}


                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // ... existing styles
    slider: {
        width: '100%',
        height: 40,
        marginVertical: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalAddress: {
        fontSize: 18,

        marginBottom: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    driverName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '95%',
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

        justifyContent: 'center',
        alignItems: 'center',

    },
    safeAreaView: {
        width: '100%',
        height: '60%'

    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#dedad5',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    carImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 120,
        borderWidth: 1,
        borderColor: 'green'
    },
    carDetails: {
        flex: 1,
        marginLeft: 10,
    },
    carModel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    carPrice: {
        fontSize: 14,
        color: 'green',
    },
    carSeats: {
        fontSize: 14,
    },
    bookButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 10, // Adjust as needed for proper spacing from the top
        right: 10, // Adjust as needed for proper spacing from the right
        backgroundColor: 'transparent',
        // Add other styling as needed
    },
    closeButtonText: {
        fontSize: 24,
        color: '#333',
        // Add other styling as needed
    },
    rejectButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    noDriversText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20, // Adjust as needed
        // Add other styling as needed
    },
    // ... rest of your styles
});

export default BookingModal;
