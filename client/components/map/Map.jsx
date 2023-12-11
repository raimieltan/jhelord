import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';
import Taxi from '../../assets/images/icon/taxi.png'; // Assuming you have this asset
import CarPicker from './CarPicker'; // Assuming you have this component

const carOptions = [
    { id: 1, type: 'Jhelord 4-seater', price: '₱286.00', eta: '9:35AM - 9:49AM' },
    { id: 2, type: 'Jhelord 6-seater', price: '₱346.00', eta: '9:34AM - 9:48AM' },
    // Add more car options as needed
];

const Map = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedCar, setSelectedCar] = useState(carOptions[0]);
    const [directions, setDirections] = useState([]);
    const [destinationLatLng, setDestinationLatLang] = useState()

    const fetchDirections = async () => {
        if (!location) return;

        const originLatitude = location.coords.latitude;
        const originLongitude = location.coords.longitude;
        const destinationAddress = 'festive mall iloilo'; // Replace with actual destination address
        const apiKey = 'AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs'; // Use your actual API key

        try {
            // Step 1: Geocode the destination address
            const geocodeResponse = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=${apiKey}`
            );
            const geocodeJson = await geocodeResponse.json();
            if (!geocodeJson.results.length) {
                setErrorMsg('Geocoding failed');
                return;
            }
            const destinationLatLng = geocodeJson.results[0].geometry.location;
            setDestinationLatLang(destinationLatLng)
            // Step 2: Compute the route
            const requestBody = {
                origin: {
                    location: {
                        latLng: {
                            latitude: originLatitude,
                            longitude: originLongitude,
                        },
                    },
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: destinationLatLng.lat,
                            longitude: destinationLatLng.lng,
                        },
                    },
                },
                travelMode: "DRIVE",
                routingPreference: "TRAFFIC_AWARE",
                computeAlternativeRoutes: false,
                routeModifiers: {
                    avoidTolls: false,
                    avoidHighways: false,
                    avoidFerries: false,
                },
                languageCode: "en-US",
                units: "IMPERIAL",
            };

            const routeResponse = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
                },
                body: JSON.stringify(requestBody),
            });
            const routeJson = await routeResponse.json();
            // console.log(routeJson.routes[0])
            if (routeJson.routes && routeJson.routes.length) {
                const route = routeJson.routes[0];
                // The Routes API may return the path in a different format than the Directions API
                // You will need to adjust the following code according to the actual response structure

                const points = polyline.decode(route.polyline.encodedPolyline);

                const coords = points.map(point => ({
                    latitude: point[0],
                    longitude: point[1],
                }));
                setDirections(coords);
            }
        } catch (error) {
            console.log(error);
            setErrorMsg('Failed to fetch directions');
        }
    };

    const fetchLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    useEffect(() => {
        fetchDirections();

    }, [location]); // Fetch directions when location changes

    const handleRefreshLocation = () => {
        fetchLocation(); // Re-fetch the location when the button is pressed
    };


    return (
        <View style={styles.container}>
            {location ? (
                <>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {/* User's Current Location Marker */}
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                        >
                            <View style={styles.blueCircle} />
                        </Marker>

                        {/* Destination Marker */}
                        {destinationLatLng && (
                            <Marker
                                coordinate={{
                                    latitude: destinationLatLng.lat,
                                    longitude: destinationLatLng.lng,
                                }}
                            >
                                <View style={styles.redCircle} />
                            </Marker>
                        )}

                        {/* Render the polyline for directions */}
                        {directions.length > 0 && (
                            <Polyline
                                coordinates={directions}
                                strokeColor="#000" // black
                                strokeWidth={6}
                            />
                        )}
                    </MapView>

                    <Button title="Refresh Location" onPress={handleRefreshLocation} />
                    <CarPicker
                        carOptions={carOptions}
                        selectedCar={selectedCar}
                        onSelectCar={setSelectedCar}
                    />
                </>
            ) : (
                <Text>Loading...</Text>
            )}
            {errorMsg && <Text>{errorMsg}</Text>}
        </View>
    );
};

export default Map;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',

    },
    map: {
        flex: 1,
        height: "100%", width: "100%",
        borderWidth: 2,
        borderColor: 'red'
    },
    refreshButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    blueCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'blue',
        borderWidth: 3,
        borderColor: 'white',
    },
    redCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        borderWidth: 3,
        borderColor: 'white',
    },

});