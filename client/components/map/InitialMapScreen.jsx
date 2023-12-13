import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Taxi from '../../assets/images/icon/taxi.png'
import Icon from 'react-native-vector-icons/FontAwesome';
import TaxiVector from '../../assets/images/vectors/taxi-vector.png'
import MapHeader from './Header';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../nav/BottomNav';

const MapHome = () => {
    const navigation = useNavigation();

    const handleNavigateToMap = () => {
        navigation.navigate('Map');
      };

  
    return (
        <View style={styles.container}>
            <MapHeader title="Let's find you a driver" subtext="We will ensure your safety with our trusted drivers" />
            <TouchableOpacity style={styles.whereToContainer} onPress={handleNavigateToMap}>
                <Icon name="map-pin" size={30} color="#900" />
                <Text style={styles.destinationText}>Where to?</Text>
                <View style={{
              
                    width: '50%',
                    alignItems: 'flex-end'

                }}>
                <Icon name="arrow-right" size={30} color="#039043" />
                </View>
             
            </TouchableOpacity>
            <ScrollView>


                <View style={styles.destinationContainer}>
                    <Text style={styles.moreWaysText}>Top places to visit in the city!</Text>
                    <Text style={styles.subText}>Type the place in the search bar to begin your journey.</Text>

                    <TouchableOpacity style={styles.destinationItem}>
                        <Text style={styles.destinationName}>Molo Church</Text>
                        <Text style={styles.destinationAddress}>San Pedro Street, Molo, Iloilo City</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.destinationItem}>
                        <Text style={styles.destinationName}>Jaro Cathedral</Text>
                        <Text style={styles.destinationAddress}>Plaza Rizal Street, Jaro, Iloilo City</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.destinationItem}>
                        <Text style={styles.destinationName}>Iloilo River Esplanade</Text>
                        <Text style={styles.destinationAddress}>Diversion Road to Carpenter's Bridge, Iloilo City</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.destinationItem}>
                        <Text style={styles.destinationName}>Camiña Balay nga Bato</Text>
                        <Text style={styles.destinationAddress}>Osmeña Street, Arevalo, Iloilo City</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.destinationItem}>
                        <Text style={styles.destinationName}>Madge Café</Text>
                        <Text style={styles.destinationAddress}>Inside La Paz Public Market, Iloilo City</Text>
                    </TouchableOpacity>

                    {/* ... other destination items ... */}
                </View>

                <View style={styles.moreWaysContainer}>
                    <Text style={styles.moreWaysText}>More ways to travel</Text>
                    <TouchableOpacity style={styles.moreWaysItem}>
                        {/* Icon can be an image or an imported icon component */}
                        <Image source={Taxi} style={styles.moreWaysIcon} />
                        <Text style={styles.moreWaysDescription}>Coming Soon!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>


            {/* ... other sections like Ride to Saved Places ... */}
            <BottomNavBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    whereToContainer: {
        borderRadius: 5,
        padding: 20,
        margin: 10,
        flexDirection: 'row',
        columnGap: 30,
        backgroundColor: 'white', // Assuming the bar has a white background
        marginTop: -30, // Adjust as needed to overlap the MapHeader
        zIndex: 10, // Ensure this is higher than the zIndex of MapHeader
        shadowColor: 'black', // Add shadow to lift the component visually
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10, // For Android shadow
    },
    weatherText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
        marginLeft: 20,
    },
    subText: {
        fontSize: 12,
        color: '#333333',
        marginBottom: 20,
    },
    destinationContainer: {
        backgroundColor: 'white',
        padding: 20,
    },
    destinationText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    destinationItem: {
        margin: 10,
    },
    destinationName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#424242',
    },
    destinationAddress: {
        fontSize: 14,
        color: '#666666',
    },
    moreWaysContainer: {
        padding: 20,
    },
    moreWaysText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    moreWaysItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    moreWaysIcon: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    moreWaysDescription: {
        fontSize: 14,
        color: '#666666',
    },
    separator: {
        height: 1,
        backgroundColor: '#DDDDDD', // Light grey color for a subtle look
        marginTop: 10,
        marginBottom: 10,
    },
    // ... other styles ...
});

export default MapHome;
