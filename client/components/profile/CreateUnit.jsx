import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';

const CreateEditUnit = () => {
  const [model, setModel] = useState('');
  const [make, setMake] = useState('');
  const [number, setNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');


  const [id, setId] = useState()
  const [unit, setUnit] = useState({})
  const [status, setStatus] = useState(unit?.status ?? 'Active');
  const statuses = ["active", "inactive", "maintenance"];
  const [driver, setDriver] = useState({})

  const navigation = useNavigation()

  const fetchId = async () => {
    const id = await AsyncStorage.getItem('driverId');
    setId(id)

  }

  useEffect(() => {
    setStatus(unit?.status ?? 'active')
    setMake(unit?.make ?? 'Make')
    setModel(unit?.model ?? 'Model')
    setPlateNumber(unit?.plateNumber ?? 'Plate Number')
    setNumber(unit?.number ?? 'Unit Number')
  },[unit])

  useEffect(() => {
    fetchId()


  }, [])

  useEffect(() => {
    fetchDriverProfile()
  }, [id])


  const fetchDriverProfile = async () => {
    try {

      if (id) {
        console.log(id)
        const response = await fetch(`https://jhelord-backend.onrender.com/api/drivers/${id}`, {
          method: 'GET',

        });

        const driver = await response.json();


        if (driver) {
          setUnit(driver.unit[0])
          setDriver(driver)
        }
      }


    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  };



  const handleCreateEditUnit = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      const method = unit ? 'PUT' : 'POST'
      const response = await fetch(`https://jhelord-backend.onrender.com/api/units${unit ? '/' + unit.id : ''}`, {
        method:  method, // Change to 'PUT' and add an ID for editing an existing unit
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ model, make, number, plateNumber, runTime: new Date(), status, driverId: driver.id}),
      });


  
      const data = await response.json();
      if(data.id) {
        Alert.alert('Success', 'Unit has been successfully created/updated.');
        navigation.navigate('Profile')
        
      }
  
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', 'Failed to create/edit unit');
    }
  };

  return (
    <View style={styles.container2}>


      <View style={styles.container}>

        {/* Add Input fields for each unit attribute */}
        {/* Example for 'model' */}
        <View style={styles.inputContainer}>
          <Icon name="car" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={unit?.model ?? 'Model'}
            value={model}
            onChangeText={setModel}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="car" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={unit?.make ?? 'Make'}
            value={make}
            onChangeText={setMake}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="car" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={unit?.number ?? 'Unit Number'}
            value={number}
            onChangeText={setNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="car" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={unit?.plateNumber ?? 'Plate Number'}
            value={plateNumber}
            onChangeText={setPlateNumber}
          />
        </View>

        <View style={styles.inputContainer}>
        <Icon name="car" size={20} style={styles.icon} />
          <SelectDropdown
            data={statuses}
            onSelect={(selectedItem, index) => {
              setStatus(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdownButtonStyle}
            buttonTextStyle={styles.dropdownButtonTextStyle}
            renderDropdownIcon={() => {
              return (
                <Text style={styles.dropdownIcon}>▼</Text>
              );
            }}
            dropdownIconPosition={"right"}
            defaultButtonText={status}
          />
        </View>



        <TouchableOpacity style={styles.button} onPress={handleCreateEditUnit}>
          <Text style={styles.buttonText}>Save Unit</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,

    width: '100%',

    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: 'gray',
    marginVertical: 10,
    justifyContent: 'space-around'
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
    zIndex: 10
  },
  button2: {
    backgroundColor: '#039043',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    marginTop: 20,
    zIndex: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CreateEditUnit;
