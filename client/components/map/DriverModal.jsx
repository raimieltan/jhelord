import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

const DriverInfoModal = ({ isVisible, onClose, driver }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalText}>Driver Type: {driver.type}</Text>
                    <Text style={styles.modalText}>Price: {driver.price}</Text>
                    <Text style={styles.modalText}>ETA: {driver.eta}</Text>
                    <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, backgroundColor: 'green'}}>
                        <Text style={{color: 'white'}}>BOOK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default DriverInfoModal;

const styles = StyleSheet.create({
    // ... existing styles ...

    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative', // Added for absolute positioning of the close button
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'transparent',
    },
    closeButtonText: {
        fontSize: 24,
        color: '#333',
    }
});
