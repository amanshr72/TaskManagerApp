import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CreateCategoryModal from './CreateCategoryModal';
import { styles } from '../../../assets/TaskCategoryStyles';
import { Avatar, Tooltip, IconButton, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, Modal, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchUserId = async () => {
        try {
            const userDetailJSON = await AsyncStorage.getItem('user');
            if (userDetailJSON) {
                const userData = JSON.parse(userDetailJSON);
                setUserId(userData.id);
            }
        } catch (error) {
            console.warn('Error fetching user detail:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserId();
            if (userId) {
                fetchCategories();
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json' };
        try {
            const response = await axios.post('https://task.market99.org.in/public/api/category-list', { id: userId }, { headers });
            console.log('Category Data: ', response.data.success);
            if (response.data.success) {
                setCategories(response.data.categories);
                setLoading(false);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleCategoryCreated = () => {
        fetchCategories();
    };

    const renderCategoryItem = ({ item }) => (
        <View style={styles.categoryItem}>
            <Text style={styles.categoryTitle}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
            <TouchableOpacity style={{ padding: 10, backgroundColor: '#d1c4e9', borderRadius: 15 }} onPress={() => handleCategoryPress(item)} activeOpacity={0.7}>
                <Icon name="open-outline" size={20} />
            </TouchableOpacity>
        </View>
    );

    const handleCategoryPress = (task) => {
        setSelectedCategory(task);
        setModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList data={categories} renderItem={renderCategoryItem} keyExtractor={(item) => item.id.toString()} />

            <CreateCategoryModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onCategoryCreated={handleCategoryCreated} />

            <Tooltip title="Create New Category">
                <TouchableOpacity style={styles.addButton} onPress={() => setCreateModalVisible(true)} >
                    <Text style={{ color: 'white', fontSize: 30 }}>+</Text>
                </TouchableOpacity>
            </Tooltip>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.modalContent}>

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedCategory ? selectedCategory.name.charAt(0).toUpperCase() + selectedCategory.name.slice(1) : ''}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider}></View>

                            <Text style={styles.modalDesc}>{selectedCategory ? 'Total Tasks: ' + selectedCategory.task_count : ''}</Text>

                            {selectedCategory && selectedCategory.tasks.map((task, index) => (
                                <Text key={index} style={styles.modalDesc}>{index + 1}. {task.title}</Text>
                            ))}

                        </View>
                    </ScrollView>
                </View>
            </Modal>

        </View>
    );
};

export default CategoryList;
