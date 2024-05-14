import axios from 'axios';
import TaskEdit from './TaskEdit';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../../assets/TaskListStyles';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import { markImportant, unmarkImportant } from './Action';
import { View, Text, FlatList, TouchableHighlight, ActivityIndicator, Modal, TouchableOpacity, ScrollView, StyleSheet, Button, RefreshControl } from 'react-native';
import GetRemainingTime from '../GetRemainingTime';

const TaskList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { fetchTasks(); }, [page, onRefresh]);

    const fetchTasks = useCallback(async () => {
        const startTime = Date.now();
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json' };
        try {
            setLoadingMore(true);
            const response = await axios.get('https://task.market99.org.in/public/api/task?page=' + page, { headers });
            console.log('Task Data: ', response.data.success);
            if (response.data.success) {
                if (page === 1) {
                    setTasks(response.data.taskData);
                } else {
                    setTasks(prevTasks => [...prevTasks, ...response.data.taskData]);
                }
                setLoading(false);
                setLoadingMore(false);
            }
        } catch (err) {
            console.warn(err);
        } finally {
            setRefreshing(false);
            const endTime = Date.now();
            const duration = endTime - startTime;
            console.log('fetchTasks duration:', duration, 'ms');
        }
    }, [page]);

    useFocusEffect(
        useCallback(() => {
            const refresh = route.params?.refresh;
            console.log('route: ', route); 
            if (refresh) {
                fetchTasks();
            }
        }, [route])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchTasks();
    };

    const loadMore = () => {
        setPage(page + 1);
        console.log('page: ', page);
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

        return (
            <TouchableOpacity style={styles.taskItem}>

                <View style={styles.taskRow}>
                    <Text style={styles.taskTitle}>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</Text>
                    <Text style={styles.remainingTime}>{<GetRemainingTime endDate={item.end_date} />}</Text>
                </View>

                <Text>{item.assigned_by} → {item.assigned_to}</Text>

                <ProgressBar style={{ width: `${item?.progress ?? 1}%`, backgroundColor: '#2e7d32', marginVertical: 10, borderRadius: 100 }} />

                <View style={styles.iconRow}>
                    <TouchableOpacity style={{ padding: 5, }} onPress={() => {
                        item.is_important === 0 ? handleMarkImportant(item.id) : handleUnmarkImportant(item.id);
                    }} underlayColor="transparent">
                        <Icon name={item.is_important === 0 ? "star-outline" : "star"} size={20} color="gold" style={styles.starIcon} />
                    </TouchableOpacity>

                    <View style={styles.editAndViewIcons}>
                        <TouchableOpacity style={{ padding: 5, }} underlayColor="transparent" onPress={() => handleUpdateTask(item)}>
                            <Icon name="pencil" size={20} style={styles.editAndViewIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5, }} underlayColor="transparent">
                            <Icon name="open-outline" size={20} style={styles.editAndViewIcon} onPress={() => handleTaskPress(item)} />
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableOpacity>
        );
    };


    const handleTaskPress = (task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const handleUpdateTask = (task) => {
        navigation.navigate('TaskUpdate', { task });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <View style={[styles.container]}>


            <FlatList data={tasks} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} onEndReached={loadMore} onEndReachedThreshold={0.1}
                ListFooterComponent={() => (
                    loadingMore && <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 10, marginBottom: 10 }} />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />

            {/* View Modal */}
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
