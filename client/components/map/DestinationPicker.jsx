import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const DestinationPicker = ({ onSetDestination }) => {
    const [destination, setDestination] = React.useState('');

    const handleSetDestination = () => {
        onSetDestination(destination); // Sends the entered destination string
    };
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setDestination}
                value={destination}
                placeholder="Enter destination"
            />
            <Button title="Find Destination" onPress={handleSetDestination} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        padding: 10,
    },
});

export default DestinationPicker;
