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
import BookingModal from './BookingModal'


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
    const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(carOptions[0]);
    const [drivers, setDrivers] = useState(carOptions)
    const [role, setRole] = useState(null)
    const [pickupLocation, setPickupLocation] = useState(null)
    const [pickupAddress, setPickUpAddress] = useState(null)
    const [isActiveBooking, setIsActiveBooking] = useState(false)
    const [userId, setUserId] = useState(null)
    const [currentBooking, setCurrentBooking] = useState(0)
    const [currentDriver, setCurrentDriver] = useState(null)
    const [isBooking, setIsBooking] = useState(false)
    const [bookedDriver, setBookedDriver] = useState(null)
    const mapViewRef = React.useRef(null);

    const handleMarkerPress = (driver) => {

        setSelectedDriver(driver);
        setIsDriverModalVisible(true);
    };


    const fetchRole = async () => {
        const role = await AsyncStorage.getItem("userRole")
        setRole(role)
    }

    const fetchuserId = async () => {
        const id = await AsyncStorage.getItem("userId")
        setUserId(id)
    }

    useEffect(() => {
        fetchRole()
        fetchuserId()
    }, [])

    function getPendingOrAcceptedBookings(bookings) {
        return bookings.filter(booking => booking.status === "PENDING" || booking.status === "ACCEPTED");
    }


    const fetchUserBookings = async () => {
        try {

            if (userId) {
                const response = await fetch(`https://jhelord-backend.onrender.com/api/bookings/user/${userId}`, {
                    method: 'GET',

                });
                const bookings = await response.json();
                const pending = getPendingOrAcceptedBookings(bookings)
                if (pending.length > 0) {

                    setCurrentBooking(pending[0].id)
                    setCurrentDriver(pending[0].driver)
                    setIsBooking(true)
                    setPickupLocation({ "lat": 10.761488062748754, "lng": 122.49605119228364 })
                    setPickUpAddress("PHF5+J27, Jaro, Iloilo City, Iloilo, Philippines")


                }
                else {
                    setCurrentBooking(null)
                    setIsBooking(false)

                }

            } else {
                console.log("no user")
            }


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {


        // Set up the interval
        const intervalId = setInterval(() => {

            fetchUserBookings()
            fetchCurrentUserBooking()
            if(bookedDriver){
                console.log({"Booked driver": bookedDriver?.unit[0]})
            }
        
        }, 1000);

        // Clear the interval when the component unmounts or dependencies change
        return () => clearInterval(intervalId);
    }, [userId, isBooking, currentBooking])


    const fetchCurrentUserBooking = async () => {
        try {

            if(userId){
                const response = await fetch(`https://jhelord-backend.onrender.com/api/bookings/${currentBooking}`, {
                    method: 'GET',
    
                });

                const bookings = await response.json();
                if(bookings.length >= 0){
                    const pending = getPendingOrAcceptedBookings(bookings)
   
                    setBookedDriver(pending[0].driver)
                }
                else {
                    setBookedDriver(null)
                }
              
           
            }
      
        } catch (error) {
            console.log(error)
        }
    }



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

        }, 10000);

        // Clear the interval when the component unmounts or dependencies change
        return () => clearInterval(intervalId);
    }, [])


    const fetchDirections = async (destinationInput) => {
        if (!location) return;

        const originLatitude = location.coords.latitude;
        const originLongitude = location.coords.longitude;
        const apiKey = 'AIzaSyAk6A4zr7QABD_5fQKL8KXJ8gA4vMQcs2U'; // Use your actual API key

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
                    console.log(geocodeJson)
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
        const apiKey = 'AIzaSyAk6A4zr7QABD_5fQKL8KXJ8gA4vMQcs2U';
        const { latitude, longitude } = event.nativeEvent.coordinate;
        if (role === 'USER') {
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
                setPickUpAddress(geocodeJson.results[0].formatted_address)
                console.log(pickupAddress)

            } catch (error) {
                console.log('Geocoding error:', error);
                setErrorMsg('Failed to geocode destination');
                return;
            }
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
                            <MapHeader title={role === 'USER' ? "Book a taxi" : "Bookings"} subtext={role === 'USER' ? "We have provided taxis near your location. Tap and hold an area in the map to choose your pickup location" : "Wait for bookings at the bookings tab. Please accept only one booking at a time"} />
                        </View>


                        <DriverInfoModal
                            isVisible={isDriverModalVisible}
                            onClose={() => setIsDriverModalVisible(false)}
                            driver={selectedDriver}
                        />


                        {
                            pickupLocation && pickupAddress && <BookingModal
                                isVisible={isModalVisible}
                                onClose={() => setIsModalVisible(false)}

                                pickupLocation={pickupLocation}
                                pickupAddress={`Near ${pickupAddress.split(",").slice(0, 2)}`}
                                setIsActiveBooking={setIsActiveBooking}
                                bookedId={currentBooking}
                                currentDriver={currentDriver}
                            />
                        }



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

                                {pickupLocation  && (
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

                                { (role === 'USER' & bookedDriver !== null) ? (

                                    <Marker
                                   
                                        coordinate={{ latitude: bookedDriver.unit[0]?.location?.latitude, longitude: bookedDriver.unit[0]?.location?.longitude }}
                                        onPress={() => handleMarkerPress(bookedDriver)}

                                    >
                                        <CustomMarker />
                                    </Marker>
                                ) : <View></View>}

                            </MapView>
                        </View>

                        {
                            (pickupLocation && pickupAddress && role === 'USER') && (
                                <View style={{
                                    backgroundColor: 'white',
                                    width: '100%'
                                }}>

                                    {
                                        !currentBooking ? (<View >
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
                                                    Near {pickupAddress.split(",").slice(0, 2)}
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
                                                <TouchableOpacity
                                                    onPress={() => setIsModalVisible(true)}
                                                    style={{
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
                                        </View>) : (
                                            <View style={{
                                                margin: 20
                                            }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setIsModalVisible(true)
                                                    }}
                                                    style={{
                                                        backgroundColor: 'green',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 5,
                                                        borderRadius: 10

                                                    }}>
                                                    <Text style={{
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}>You have an active Booking</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }






                                </View>

                            )
                        }






                        {location && role === 'DRIVER' && <CarPicker
                            carOptions={drivers}
                            selectedCar={selectedCar}
                            onSelectCar={setSelectedCar}
                            currentLocation={location} // Your user's current location
                            fetchDirections={fetchDirections}
                            setDirections={setDirections}

                        />}

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
