import { StyleSheet, View, Image, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import Taxi from '../../assets/images/icon/taxi.png'

const Map = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [mapLayout, setMapLayout] = useState(false);

    const handleMapLayout = () => {
        setMapLayout(true);
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync({
                accuracy: Location.Accuracy.High,
                enableHighAccuracy: true,
            });
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
        })();
    }, []);

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                    >
                        {/* Customize the marker with an image */}
                        <Image
                            source={Taxi}
                            style={{ width: 40, height: 40 }}
                        />
                    </Marker>
                </MapView>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

export default Map;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20
    
      },
    map: {
        flex: 1,
        height: "100%", width: "100%", 
        borderWidth: 2,
        borderColor: 'red'
    },

});