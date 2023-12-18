import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Profile from "./Profile";
import ProfileDriver from "./ProfileDriver";

const MainProfile = () => {
    const [userRole, setUserRole] = useState(null);


    const fetchUserProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');

            if (!token) {
                navigation.navigate('LOGIN');
                return;
            }

            const response = await fetch('https://jhelord-backend.onrender.com/api/users/profile', {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const userProfile = await response.json();
            setUserRole(userProfile.role);


            console.log(userProfile.role)

            await AsyncStorage.setItem("userRole", userProfile.role)




        } catch (error) {
            console.error('Error fetching user profile:', error.message);
            Alert.alert('Error', 'Failed to fetch user profile');
        }
    };


    useEffect(() => {
        fetchUserProfile()
    }, [])

    return (
        <>
            {
                userRole === 'USER' ? (

                    <Profile />

                ) : (<ProfileDriver />)
            }
        </>
    );
}

export default MainProfile;