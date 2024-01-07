import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './navigation/MainStackNavigator';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

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
        <MainStackNavigator />
      </NavigationContainer>
    </View>
  );
}
