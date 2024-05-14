import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const CreateCategoryModal = ({ visible, onClose, onCategoryCreated }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json', };
        const data = { name: categoryName };

        try {
            const response = await axios.post('https://task.market99.org.in/public/api/category/store', JSON.stringify(data), { headers });
            if (response.data.success) {
                console.warn('Task Category Created Successfully');
                onCategoryCreated();
                setCategoryName('');
                onClose()
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const errDetail = err.response.data.error;
                let msg = "Failed to create category: \n";
                for (let key in errDetail) {
                    msg += `• ${errDetail[key][0]}\n`;
                }
                Alert.alert(msg);
            }
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create New Category</Text>
                    <TextInput style={styles.input} placeholder="Enter Category Name" value={categoryName} onChangeText={setCategoryName} />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#ef5350',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#388e3c',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});


export default CreateCategoryModal;
