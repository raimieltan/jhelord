import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const PlaceInput = ({ placeholder, onPress, query }) => {
    return (
        <GooglePlacesAutocomplete
            placeholder={placeholder}
            onPress={onPress}
            query={query}
            styles={{
                textInputContainer: styles.textInputContainer,
                textInput: styles.textInput,
            }}
            suppressDefaultStyles
            renderDescription={row => row.description} // custom description render
            renderRow={(data) => (
                <TouchableOpacity onPress={() => onPress(data, null)}>
                    <View style={styles.suggestionItem}>
                        <Text style={styles.suggestionText}>{data.description}</Text>
                    </View>
                </TouchableOpacity>
            )}
            listViewDisplayed='auto'    // automatically manage listView visibility
            fetchDetails
        />
    );
};

const FareCalculator = () => {
    const [fare, setFare] = useState(null);
    const [startLocation, setStartLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);

    const taxiFare = (d, t) => {
        const baseRate = 40;
        const perKmRate = 13.50;
        const perMinuteRate = 2;

        return baseRate + (d * perKmRate) + (t * perMinuteRate);
    };

    const getCoordinates = async (address) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs`);
            const data = await response.json();
            console.log(data)
            return data.results[0].geometry.location;
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            return null;
        }
    };

    const calculateFare = async () => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startLocation.lat},${startLocation.lng}&destinations=${destinationLocation.lat},${destinationLocation.lng}&key=AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs`);
            const data = await response.json();
            const distance = data.rows[0].elements[0].distance.value / 1000; // distance in km
            const duration = data.rows[0].elements[0].duration.value / 60; // duration in minutes

            const calculatedFare = taxiFare(distance, duration);
            setFare(calculatedFare);
        } catch (error) {
            console.error('Error calculating fare:', error);
        }
    };

    useEffect(() => {
        if (startLocation && destinationLocation) {
            calculateFare()
        }

    }, [startLocation, destinationLocation])

    return (
        <View style={styles.container}>

            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 5
            }}>Starting Location</Text>
            <GooglePlacesAutocomplete
                placeholder='Starting Location'
                onPress={(data, details = null) => {
                    getCoordinates(data.description).then(location => {
                        setStartLocation(location);
                    });
                }}
                query={{
                    key: 'AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs',
                    language: 'en',
                }}
                isRowScrollable
                styles={{
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                }}
            />




            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 5
            }}>Destination</Text>
            <GooglePlacesAutocomplete
                placeholder='Destination'
                onPress={(data, details = null) => {
                    getCoordinates(data.description).then(location => {
                        setDestinationLocation(location);

                    });
                }}
                isRowScrollable
                query={{
                    key: 'AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs',
                    language: 'en',
                }}
                styles={{
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                }}
            />



            {fare !== null && (
                <View style={styles.fareContainer}>
                    <Text style={styles.fareText}>Estimated Fare: ₱{fare.toFixed(2)}</Text>
                </View>
            )}
        </View>
    );
};

export default FareCalculator;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        padding: 10,
        height: '80%',
        width: '100%'
    },
    textInputContainer: {
        padding: 0,
        margin: 0,
        backgroundColor: 'white',

    },
    textInput: {
        height: 44,
        color: '#5d5d5d',
        fontSize: 16,
    },
    fareContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fareText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});