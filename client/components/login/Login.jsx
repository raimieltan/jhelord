import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Logo from '../../assets/images/logo/logo.png'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation()

  const handleLogin = async () => {
    try {
      // Assume you have an authentication API endpoint
      const response = await fetch('https://jhelord-backend.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });



      if (!response.ok) {
        throw new Error('Invalid credentials'); // or handle specific errors from the server
      }

      // Authentication successful, navigate to the next screen or perform any other action
      // For example, you can use React Navigation to navigate to another screen
      // navigation.navigate('Home');
      Alert.alert('Login Successful', 'You have successfully logged in.');
      const data = await response.json();

      // Store the JWT token in AsyncStorage
      await AsyncStorage.setItem('accessToken', data.token);
      console.log(data.token)
      // Navigate to the "Map" screen
      navigation.navigate('Home');


    } catch (error:any) {

      Alert.alert('Login Failed', error.message);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (token) {
        navigation.navigate('Profile');
        return;
      }
    } catch (error:any) {
      console.error('Error fetching user profile:', error.message);
     
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={Logo} />

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By signing in you are agreeing to our Terms and privacy policy
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: 'white'

  },
  image: {
    width: '10%',
    height: '10%',
  
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  greenBackground: {
    backgroundColor: '#039043',
    width: '100%',
    height: 100, // Adjust the height as needed
  },

  termsContainer: {
    justifyContent: 'center',
    alignItems: 'center', // Center text horizontally
    width: '70%',

  },
  termsText: {
    textAlign: 'center', // Text alignment to center

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 10,

  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#039043',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default Login;
