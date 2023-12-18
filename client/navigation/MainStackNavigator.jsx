// navigation/MainStackNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Image, Text } from 'react-native';
import Profile from '../components/profile/Profile';
import MapHome from '../components/map/InitialMapScreen';
import Login from '../components/login/Login';
import Map from '../components/map/Map';
import Signup from '../components/login/Signup';
import CreateDriverProfile from '../components/profile/CreateDriverProfile';
import ProfileDriver from '../components/profile/ProfileDriver';
import CreateEditUnit from '../components/profile/CreateUnit';
import MainProfile from '../components/profile/MainProfile';
const Stack = createStackNavigator();

const MainStackNavigator = () => {



    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    title: '',
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerShown: false
                }}

            />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                    title: '',
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerShown: false
                }}

            />
            <Stack.Screen
                name="Home"
                component={MapHome}
                options={{
                    title: '',
                    headerStyle: {
                        backgroundColor: '#039043',

                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },

                }}
            />
            <Stack.Screen
                name="Map"
                component={Map}
                options={{
                    title: 'Taxis',
                    headerStyle: {
                        backgroundColor: '#039043',

                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerShown: false

                }}
            />
            <Stack.Screen
                name="Profile"
                component={MainProfile}
                options={{
                    title: 'Profile',
                    headerStyle: {
                        backgroundColor: '#039043',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="CreateProfile"
                component={CreateDriverProfile}
                options={{
                    title: 'Create Profle',
                    headerStyle: {
                        backgroundColor: '#039043',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="ManageUnit"
                component={CreateEditUnit}
                options={{
                    title: 'Manage Unit',
                    headerStyle: {
                        backgroundColor: '#039043',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    );
};

export default MainStackNavigator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },



});