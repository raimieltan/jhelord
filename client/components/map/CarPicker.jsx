import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, LayoutAnimation, Platform, UIManager } from 'react-native';
 // or from 'react-native' if you're using the built-in slider
import DriverInfoModal from './DriverModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingList from '../profile/Bookings';

// Enable LayoutAnimation on Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
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
    // console.log(currentLocation)
    return carOptions.filter(car => {
        const distance = calculateDistance(
            currentLocation.coords.latitude, currentLocation.coords.longitude,
            car.unit[0]?.location?.latitude, car.unit[0]?.location?.longitude
        );
        return distance <= radius; // 10 km radius
    });
};

const CarOption = ({ car, isSelected, onSelect, currentLocation }) => {


    const distance = calculateDistance(
        parseFloat(currentLocation.coords.latitude),
        parseFloat(currentLocation.coords.longitude),
        parseFloat(car.unit[0].location.latitude),
        parseFloat(car.unit[0].location.longitude)
    ).toFixed(2); // Round to 2 decimal places
    // const distance = calculateDistance(
    //     currentLocation.coords.latitude, currentLocation.coords.latitude,
    //     car.location.lat, car.location.lng
    // ).toFixed(2); // Round to 2 decimal places


    return (
        <TouchableOpacity
            onPress={() => onSelect(car)}
            style={[styles.carOption]}

        >
            <Text style={styles.carType}>{car.unit[0].model + " " + car.unit[0].make}</Text>
            <Text style={styles.carDistance}>{distance} km away</Text>
        </TouchableOpacity>
    );
};


const CarPicker = ({ carOptions, selectedCar, onSelectCar, currentLocation, fetchDirections, setDirections }) => {
    const [expanded, setExpanded] = useState(false);
    const [radius, setRadius] = useState(10); // Default radius of 10 km
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCarDetails, setSelectedCarDetails] = useState();
    const [role, setRole] = useState('')
    const toggleExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const carsWithinRadius = filterCarsWithinRadius(carOptions, currentLocation, radius);


    const fetchRole = async () => {
        const role = await AsyncStorage.getItem("userRole")
        setRole(role)
    }

    useEffect(() => {
        // Function that sets up the interval
        const interval = setInterval(() => {
            fetchRole()
        }, 5000); // Set the interval time in milliseconds (e.g., 1000ms = 1 second)

        // Cleanup function to clear the interval
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            {selectedCarDetails && (
                <DriverInfoModal
                    driver={selectedCarDetails}
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
            )}
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',


            }}>
                <TouchableOpacity onPress={toggleExpanded} style={styles.header}>
                    <Text style={styles.headerText}>Bookings</Text>
                </TouchableOpacity>
            </View>

            {expanded && (
                <>


                    <BookingList fetchDirections={fetchDirections} setDirections={setDirections} />


                </>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8F8',
        borderRadius: 5,

        overflow: 'hidden', // This keeps child views within the rounded border
        width: '100%',

    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#039043',
        textAlign: 'center',

        width: '100%',

    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    list: {
        backgroundColor: '#F8F8F8',
    },
    carOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
    },
    selectedCarOption: {
        backgroundColor: '#E0FFE0', // or any subtle highlight color
    },
    carDetail: {
        flexDirection: 'column',
    },
    carType: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    carETA: {
        fontSize: 14,
        color: '#555',
    },
    carPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sliderText: {
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default CarPicker;
