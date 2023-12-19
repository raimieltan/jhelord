import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './navigation/MainStackNavigator';
import * as Location from 'expo-location';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [location, setLocation] = useState({"coords": {"accuracy": 156.89999389648438, "altitude": 89.80000305175781, "altitudeAccuracy": 13.584489822387695, "heading": 0, "latitude": 10.7752659, "longitude": 122.4831714, "speed": 0.0028111569117754698}, "mocked": false, "timestamp": 1702341514824});


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


 
    setLocation(location);
};


useEffect(() => {
  const interval = setInterval(() => {
    
    fetchLocation()
  }, 20000);
  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10, margintop: 10, backgroundColor: isConnected ? 'green' : 'red', position: 'relative', top: 10, zIndex: 10 }}>
        <Text style={{ color: 'white' }}>
          {isConnected ? 'Online' : 'Offline'}
        </Text>
      </View>
      <NavigationContainer>
        <MainStackNavigator location={location} />
      </NavigationContainer>
    </View>
  );
}
