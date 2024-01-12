import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Logo from '../../assets/images/logo/logo.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profileImage, setProfileImage] = useState('https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg')
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation();


  const handleImagePick = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to grant permission to access your photos.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (pickerResult.canceled) {
      return;
    }

    // Assuming only one image is picked, access the first asset
    const imageUri = pickerResult.assets && pickerResult.assets[0].uri;

    if (imageUri) {
      setProfileImage(imageUri);
    }
  };

  const handleSignup = async () => {
    if (!firstName || !lastName || !username || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);
    formData.append('role', 'USER');
    // Append the profile image if it has been picked
    if (profileImage) {
      formData.append('profileImage', {
        uri: profileImage,
        type: 'image/jpeg', // or your image type
        name: profileImage.split('/').pop(),
      });
    }

    try {
      setIsLoading(true);
      const response = await fetch('https://jhelord-backend.onrender.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      await AsyncStorage.setItem('accessToken', data.token);
      navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image style={{
        width: 200,
        height: 200
      }} source={Logo} />

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By signing up you are agreeing to our Terms and privacy policy
        </Text>
      </View>


      <ScrollView style={{
        width: '100%'
      }}>

        {
          profileImage && (
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={{ uri: profileImage }}
                style={styles.pickedImage}
              />
            </View>

          )
        }

        <TouchableOpacity style={styles.button} onPress={handleImagePick}>
          <Text style={styles.buttonText}>Pick Profile Image</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Firstname"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Lastname"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} style={styles.icon} />
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
          <Icon name="mobile1" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
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
      </ScrollView>

      {
        !isLoading ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleNavigateToLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ActivityIndicator size={"large"} color={'blue'} />
          </>
        )
      }

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
  },
  pickedImage: {
    width: 100, // You can adjust the width
    height: 100, // You can adjust the height
    borderRadius: 100, // Adjust for round image
    marginTop: 20, // Add some space above the image
  },
});


export default Signup;
