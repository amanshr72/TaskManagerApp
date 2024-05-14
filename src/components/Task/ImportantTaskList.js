import axios from 'axios';
import { ProgressBar } from 'react-native-paper';
import GetRemainingTime from '../GetRemainingTime';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../../assets/TaskListStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { markImportant, unmarkImportant, editTask } from './Action';
import { View, Text, FlatList, TouchableHighlight, ActivityIndicator, Modal, TouchableOpacity, ScrollView } from 'react-native';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [userId, setUserId] = useState();

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
                fetchTasks();
            }
        };

        fetchData();
    }, [userId]);

    const fetchTasks = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json', };

        try {
            const response = await axios.post('https://task.market99.org.in/public/api/imp-task', { id: userId }, { headers });
            console.log('Imp Task Data: ', response.data.success);
            if (response.data.success) {
                setTasks(response.data.taskData);
                setLoading(false);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const renderItem = ({ item }) => {
        const handleMarkImportant = (taskId) => {
            markImportant(taskId);
            fetchTasks();
        };

        const handleUnmarkImportant = (taskId) => {
            unmarkImportant(taskId);
            fetchTasks();
        };

        const handleEditTask = (taskId, newData) => {
            editTask(taskId, newData);
            fetchTasks();
        };

        return (
            <TouchableOpacity style={styles.taskItem}>

                <View style={styles.taskRow}>
                    <Text style={styles.taskTitle}>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</Text>
                    <Text style={styles.remainingTime}>{<GetRemainingTime endDate={item.end_date} />}</Text>
                </View>

                <Text>{item.assigned_by} → {item.assigned_to}</Text>

                <ProgressBar style={{ width: `${item?.progress ?? 1}%`, backgroundColor: '#2e7d32', marginVertical: 10, borderRadius: 100 }} />

                <View style={styles.iconRow}>
                    <TouchableHighlight onPress={() => {
                        item.is_important === 0 ? handleMarkImportant(item.id) : handleUnmarkImportant(item.id);
                    }} underlayColor="transparent">
                        <Icon name={item.is_important === 0 ? "star-outline" : "star"} size={20} color="gold" style={styles.starIcon} />
                    </TouchableHighlight>

                    <View style={styles.editAndViewIcons}>
                        <TouchableHighlight underlayColor="transparent">
                            <Icon name="open-outline" size={20} style={styles.editAndViewIcon} onPress={() => handleTaskPress(item)} />
                        </TouchableHighlight>
                    </View>
                </View>

            </TouchableOpacity>
        );
    };


    const handleTaskPress = (task) => {
        setSelectedTask(task);
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

            <FlatList data={tasks} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.modalContent}>

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedTask ? selectedTask.title.charAt(0).toUpperCase() + selectedTask.title.slice(1) : ''}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider}></View>

                            <Text style={styles.modalDesc}>{selectedTask ? selectedTask.description : ''}</Text>
                            <Text style={styles.modalDesc}>{selectedTask ? 'Category: ' + selectedTask.task_category : ''}</Text>
                            <Text style={styles.modalDesc}>{selectedTask ? 'Assigned By: ' + selectedTask.assigned_by : ''}</Text>
                            <Text style={styles.modalDesc}>{selectedTask ? 'Assigned To: ' + selectedTask.assigned_to : ''}</Text>
                            <Text style={styles.modalDesc}>{selectedTask ? 'Status: ' + selectedTask.status : ''}</Text>
                            <Text style={styles.modalDesc}>Time Left: 
                                {selectedTask ? <GetRemainingTime endDate={selectedTask.end_date} /> : ''}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default TaskList;
