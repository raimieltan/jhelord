import React, { useState, useEffect, useRef } from 'react';
import { View, Text, AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './navigation/MainStackNavigator';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);


  const socket = io('https://jhelord-backend.onrender.com/');


  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      const id = await AsyncStorage.getItem("userId")
      if(id && appState.current=='background'){
        console.log("Offline")
      
        console.log('AppState', appState.current);
        socket.emit('logout', id);
        console.log("Xbackground" + id)
      }

    });

    return () => {
      subscription.remove();
    };
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
        <View style={{ padding: 25, backgroundColor:'green', position: 'relative', zIndex: 10 }}>
        
        </View>
        <NavigationContainer>
          <MainStackNavigator />
        </NavigationContainer>
      </View>
  

  );
}
