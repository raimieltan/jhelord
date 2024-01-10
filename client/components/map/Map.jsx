import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';
import Taxi from '../../assets/images/icon/taxi.png'; // Assuming you have this asset
import CarPicker from './CarPicker'; // Assuming you have this component
import DestinationPicker from './DestinationPicker'; // Assuming you have this component
import DriverInfoModal from './DriverModal';
import MapHeader from './Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomNavBar from '../nav/BottomNav';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const carOptions = [
    {
        "id": 1,
        "firstName": "hannah",
        "lastName": "casquite",
        "licenseNumber": "a1213sz9",
        "address": "iloilo city",
        "birthdate": "09-18-99",
        "userId": 1,
        "unit": [{
            "id": 12,
            "driverId": 2,
            "model": "Loading",
            "make": "Loading",
            "number": "Unit Number11",
            "plateNumber": "Plate Number11",
            "runTime": "2023-12-19T10:45:59.688Z",
            "status": "active",
            "location": {
                "latitude": 10.76345280577066,
                "longitude": 122.4944525957108
            }
        }]
    },
    {
        "id": 2,
        "firstName": "hannah 2",
        "lastName": "tan",
        "licenseNumber": "123123",
        "address": "Iloilo city 2",
        "birthdate": "09-19-99",
        "userId": 3,
        "unit": [
            {
                "id": 12,
                "driverId": 2,
                "model": "Loading",
                "make": "Loading",
                "number": "Unit Number11",
                "plateNumber": "Plate Number11",
                "runTime": "2023-12-19T10:45:59.688Z",
                "status": "active",
                "location": {
                    "latitude": 10.7752659,
                    "longitude": 122.4831714
                }
            }
        ]
    }
]
    ;

const CustomMarker = () => (
    <Image
        source={Taxi}
        style={{ width: 40, height: 40 }} // Adjust the size as needed
        resizeMode="contain"
    />
);



const Map = () => {
    const [location, setLocation] = useState({ "coords": { "accuracy": 156.89999389648438, "altitude": 89.80000305175781, "altitudeAccuracy": 13.584489822387695, "heading": 0, "latitude": 10.7752659, "longitude": 122.4831714, "speed": 0.0028111569117754698 }, "mocked": false, "timestamp": 1702341514824 });
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedCar, setSelectedCar] = useState(carOptions[0]);
    const [directions, setDirections] = useState([]);
    const [destinationLatLng, setDestinationLatLang] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(carOptions[0]);
    const [drivers, setDrivers] = useState(carOptions)
    const [role, setRole] = useState(null)
    const [pickupLocation, setPickupLocation] = useState(null)
    const [pickupAddress, setPickUpAddress] = useState(null)
    const mapViewRef = React.useRef(null);

    const handleMarkerPress = (driver) => {
        setSelectedDriver(driver);
        setIsModalVisible(true);
    };


    const fetchRole = async () => {
        const role = await AsyncStorage.getItem("userRole")
        setRole(role)
    }

    useEffect(() => {
        fetchRole()
    }, [])


    const fetchDrivers = async () => {
        try {
            const response = await fetch(`https://jhelord-backend.onrender.com/api/drivers`, {
                method: 'GET',

            });
            const driversData = await response.json();

            if (driversData) {
                setDrivers(driversData.filter((driver) => {
                    if (driver.unit.length >= 1) {
                        return true
                    }
                }))

            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {


        // Set up the interval
        const intervalId = setInterval(() => {
            fetchDrivers()
            console.log("fetched drivers")
        }, 10000);

        // Clear the interval when the component unmounts or dependencies change
        return () => clearInterval(intervalId);
    }, [])


    const fetchDirections = async (destinationInput) => {
        if (!location) return;

        const originLatitude = location.coords.latitude;
        const originLongitude = location.coords.longitude;
        const apiKey = 'AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs'; // Use your actual API key

        let destinationLatLng;
        console.log(destinationInput)


        // Check if destinationInput is an object with lat and lng
        if (destinationInput && destinationInput.lat && destinationInput.lng) {
            destinationLatLng = destinationInput;
            console.log(destinationLatLng)
        } else {
            // Geocode the destination address
            try {
                const geocodeResponse = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${destinationInput}&key=${apiKey}`
                );

                const geocodeJson = await geocodeResponse.json();
                if (!geocodeJson.results.length) {
                    setErrorMsg('Geocoding failed');
                    return;
                }
                destinationLatLng = geocodeJson.results[0].geometry.location;
            } catch (error) {
                console.log('Geocoding error:', error);
                setErrorMsg('Failed to geocode destination');
                return;
            }
        }

        // Continue with getting directions
        try {
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

            if (routeJson.routes && routeJson.routes.length) {
                const route = routeJson.routes[0];
                const points = polyline.decode(route.polyline.encodedPolyline);
                const coords = points.map(point => ({
                    latitude: point[0],
                    longitude: point[1],
                }));
                setDirections(coords);
            }
        } catch (error) {
            console.log("XXXX")
            setErrorMsg("failed to fetch directions");
        }
    };

    const handleMapLongPress = async (event) => {
        const apiKey = 'AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs';
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setPickupLocation({ lat: latitude, lng: longitude });
        try {
            const geocodeResponse = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );

            const geocodeJson = await geocodeResponse.json();
            if (!geocodeJson.results.length) {
                setErrorMsg('Geocoding failed');
                return;
            }

            console.log(geocodeJson.results[0].address_components)

            setPickUpAddress(geocodeJson.results[0].formatted_address)

        } catch (error) {
            console.log('Geocoding error:', error);
            setErrorMsg('Failed to geocode destination');
            return;
        }
    };

    const fetchLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
            accuracy: Location.Accuracy.High,
        });
        console.log(location)


        setLocation(location);
    };
    const handleRefreshLocation = () => {

        if (location) {
            mapViewRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005, // Smaller value for closer zoom
                longitudeDelta: 0.005, // Smaller value for closer zoom
            }, 1000); // 1000 ms for the animation duration
        }
        fetchLocation(); // Re-fetch the location when the button is pressed
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.container}>


                {location ? (
                    <>
                        <View style={{

                            width: '100%'
                        }}>
                            <MapHeader title="Book a taxi" subtext="We have provided taxis near your location. Tap and hold an area in the map to ch0ose your pickup location" />
                        </View>


                        <DriverInfoModal
                            isVisible={isModalVisible}
                            onClose={() => setIsModalVisible(false)}
                            driver={selectedDriver}
                        />

                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <TouchableOpacity style={{

                                alignContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                bottom: 20,
                                right: 10,
                                zIndex: 50
                            }} onPress={handleRefreshLocation}>
                                <Icon2 name="gps-fixed" size={40} color="blue" />

                            </TouchableOpacity>
                            <MapView
                                ref={mapViewRef}
                                style={styles.map}
                                provider={PROVIDER_GOOGLE}
                                initialRegion={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                onLongPress={handleMapLongPress}
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
                                        <Icon name="map-pin" size={30} color="#900" />
                                    </Marker>
                                )}

                                {pickupLocation && (
                                    <Marker
                                        coordinate={{
                                            latitude: pickupLocation.lat,
                                            longitude: pickupLocation.lng,
                                        }}
                                    >
                                        <Icon name="map-pin" size={30} color="#900" />
                                    </Marker>
                                )}

                                {/* Render the polyline for directions */}
                                {directions.length > 0 && (
                                    <Polyline
                                        coordinates={directions}
                                        strokeColor="green"
                                        strokeWidth={6}
                                    />
                                )}

                                {role === 'USER' && drivers?.map((car, index) => (

                                    <Marker
                                        key={index}
                                        coordinate={{ latitude: car.unit[0]?.location?.latitude, longitude: car.unit[0]?.location?.longitude }}
                                        onPress={() => handleMarkerPress(car)}
                                    >
                                        <CustomMarker />
                                    </Marker>
                                ))}

                            </MapView>
                        </View>

                        {
                            pickupLocation && (
                                <View style={{
                                    backgroundColor: 'white',
                                    width: '100%'
                                }}>

                                    <View style={{
                                        backgroundColor: '#a1a1a1',
                                        marginVertical: 10,
                                        marginHorizontal: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        color: 'white'
                                    }}>
                                        <Text style={{
                                            color: 'white',
                                            fontSize: 18
                                        }}>
                                           Near {pickupAddress.split(",")[0]}
                                        </Text>
                                        <Text>
                                        {pickupAddress}
                                        </Text>
                                    </View>

                                    <View style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: 'green',
                                            margin: 10,
                                            width: '90%',
                                            padding: 10,
                                            alignItems: 'center',
                                            borderRadius: 10

                                        }}>
                                            <Text style={{
                                                color: 'white'
                                            }}>
                                                Confirm Pickup Location
                                            </Text>

                                        </TouchableOpacity>
                                    </View>
                                </View>

                            )
                        }



                        {/* {location && <CarPicker
                            carOptions={drivers}
                            selectedCar={selectedCar}
                            onSelectCar={setSelectedCar}
                            currentLocation={location} // Your user's current location
                            fetchDirections={fetchDirections}
                            setDirections={setDirections}
                        />} */}

                    </>
                ) : (
                    <Text>Loading...</Text>
                )}
                {errorMsg && <Text>{errorMsg}</Text>}

            </View>
            <BottomNavBar />
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
