// navigation/MainStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/login/Login';
import Map from '../components/map/Map';
import { StyleSheet, View, Image, Text } from 'react-native';
import Profile from '../components/profile/Profile';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    title: 'LOGIN',
                    headerStyle: {
                        backgroundColor: '#039043',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                }}

            />
            <Stack.Screen
                name="Map"
                component={Map}
                options={{
                    title: 'Map Screen',
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
                name="Profile"
                component={Profile}
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