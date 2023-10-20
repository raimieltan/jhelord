import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Login from './components/login/Login';
import Logo from './assets/images/logo/logo.png';

export default function App() {
  return (

      <View style={styles.container}>
        <Login />

        <Image source={Logo} />
        <View style={styles.greenBackground}>
        </View>
      </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  greenBackground: {
    backgroundColor: '#039043',
    width: '100%',
    height: 100, // Adjust the height as needed
  },

});
