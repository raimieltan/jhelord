import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable LayoutAnimation on Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CarOption = ({ car, isSelected, onSelect }) => (
    <TouchableOpacity
        onPress={() => onSelect(car)}
        style={[styles.carOption, isSelected && styles.selectedCarOption]}
    >
        <Text style={styles.carType}>{car.type}</Text>
        <Text style={styles.carPrice}>{car.price}</Text>
        <Text style={styles.carETA}>{car.eta}</Text>
    </TouchableOpacity>
);

const CarPicker = ({ carOptions, selectedCar, onSelectCar }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleExpanded} style={styles.header}>
                <Text style={styles.headerText}>Drivers near me</Text>
            </TouchableOpacity>
            {expanded && (
                <FlatList
                    data={carOptions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CarOption
                            car={item}
                            isSelected={item.id === selectedCar.id}
                            onSelect={onSelectCar}
                        />
                    )}
                    style={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8F8',
        borderRadius: 5,
       
        overflow: 'hidden', // This keeps child views within the rounded border
        width: '100%'
    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#E0E0E0',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        backgroundColor: '#F8F8F8',
    },
    carOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
    },
    selectedCarOption: {
        backgroundColor: '#E0FFE0', // or any subtle highlight color
    },
    carDetail: {
        flexDirection: 'column',
    },
    carType: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    carETA: {
        fontSize: 14,
        color: '#555',
    },
    carPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CarPicker;
