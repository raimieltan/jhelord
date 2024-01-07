import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Logo from '../../assets/images/logo/logo.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('')

  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
    
    await AsyncStorage.removeItem('accessToken');
      const response = await fetch('https://jhelord-backend.onrender.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, phoneNumber, role, password }),
      });

      Alert.alert('Signup Successful', 'You have successfully signed up.');

      // Assuming your signup API returns user data including a token
      const data = await response.json();

      // Store the JWT token in AsyncStorage
      await AsyncStorage.setItem('accessToken', data.token);

      // Navigate to the home or profile screen
      navigation.navigate('Profile'); // or 'Profile'

    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} />

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By signing up you are agreeing to our Terms and privacy policy
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
        <Icon name="mail" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Role"
          value={role}
          onChangeText={setRole}
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
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleNavigateToLogin}>
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
  

export default Signup;
