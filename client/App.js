import React, { useState, useEffect } from 'react';

import Login from './components/login/Login';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './navigation/MainStackNavigator';
import Map from './components/map/Map';

export default function App() {

  return (

      <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>

  );
}


