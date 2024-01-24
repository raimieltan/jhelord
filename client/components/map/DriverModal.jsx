import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

const DriverInfoModal = ({ isVisible, onClose, driver }) => {
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return 0; // Return 0 if there are no reviews
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        return averageRating;
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
                    }} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>


                    <View style={styles.itemContainer}>
                
                        <Image source={{ uri: `https://jhelord-backend.onrender.com//uploads/${driver.User?.profileImage.split("/")[2]}` }} style={styles.carImage} />
                        <View style={styles.carDetails}>
                            <Text style={styles.carModel}>{driver.unit[0].model + ' ' + driver.unit[0].make}</Text>
                            <Text style={styles.carPrice}>{driver.unit[0].plateNumber}</Text>
                            <Text style={styles.driverName}>{driver.User?.firstName} {driver.User?.lastName}</Text>

                            <StarRatingDisplay
                                starSize={16}
                                color='green'
                                rating={calculateAverageRating(driver.driverReview)}
                            />


                        </View>
                    </View>
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
});
