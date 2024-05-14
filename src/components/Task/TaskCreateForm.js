import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import React, { useState, useEffect } from 'react';
import { Dialog, Portal, PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CustomSelectDropdown from '../CustomSelectDropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TaskCreateForm = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [userId, setUserId] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [remark, setRemark] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskCategoryId, setTaskCategoryId] = useState();
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const fetchCategories = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json' };
        try {
            const response = await axios.get('https://task.market99.org.in/public/api/categories', { headers });
            if (response.data.success) {
                setCategories(response.data.categories);
                setLoading(false);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const fetchUsers = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json' };
        try {
            const response = await axios.get('https://task.market99.org.in/public/api/user-list', { headers });
            if (response.data.success) {
                setUsers(response.data.users);
                setLoading(false);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => { fetchCategories(); fetchUsers(); }, []);

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
        };
        fetchData();
    }, [userId]);

    const handleTaskCreationSuccess = async () => {
        setTitle('');
        setDescription('');
        setAssigneeId('');
        setRemark('');
        navigation.navigate('Home', { params: { refresh: true } });
    };

    const handleSubmit = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json', };
        const data = { user_id: userId, task_category: taskCategoryId, title: title, description: description, start_date: startDate, end_date: endDate, assignee: assigneeId, remark: remark, };

        try {
            const response = await axios.post('https://task.market99.org.in/public/api/task/store', JSON.stringify(data), { headers });
            console.log('Response', response.data);
            if (response.data.success) {
                setDialogMessage('Task created successfully');
                setVisible(true);
                handleTaskCreationSuccess();
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const errDetail = err.response.data.error;
                let msg = "Failed to create Task: \n";
                for (let key in errDetail) {
                    msg += `• ${errDetail[key][0]}\n`;
                }
                setDialogMessage(msg);
                setVisible(true);
            }
        }
    };

    if (visible) {
        return (
            <PaperProvider>
                <View>
                    <Portal>
                        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                            <View style={{ flexDirection: 'row' }}>
                                <Dialog.Content><Text style={{ fontSize: 15 }}>{dialogMessage}</Text></Dialog.Content>
                                <Dialog.Actions>
                                    <TouchableOpacity onPress={() => {
                                        setVisible(false);
                                        if (dialogMessage.includes('successfully')) {
                                            handleTaskCreationSuccess();
                                        }
                                    }}>
                                        <Text style={{ backgroundColor: '#b39ddb', padding: 10, borderRadius: 10 }}>Ok</Text>
                                    </TouchableOpacity>
                                </Dialog.Actions>
                            </View>
                        </Dialog>
                    </Portal>
                </View>
            </PaperProvider>
        );
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Task Category:</Text>
            <CustomSelectDropdown data={categories} onSelect={(category) => { setTaskCategoryId(category.id); }} label="Task Category" />

            <Text style={styles.label}>Task Title<Text style={{ color: 'red' }}>*</Text>:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter task title" />

            <Text style={styles.label}>Description:</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Enter description" multiline />

            <Text style={styles.label}>Start Date<Text style={{ color: 'red' }}>*</Text>:</Text>
            <TextInput style={styles.input} placeholder="Select Start Date" value={formatDateTime(startDate)} onPress={() => setOpenStartDate(true)} />
            <DatePicker modal mode='date' open={openStartDate} date={startDate} onConfirm={(date) => {
                setOpenStartDate(false);
                setStartDate(date);
            }}
                onCancel={() => { setOpenStartDate(false) }}
            />

            <Text style={styles.label}>End Date<Text style={{ color: 'red' }}>*</Text>:</Text>
            <TextInput style={styles.input} placeholder="Select End Date" value={formatDateTime(endDate)} onPress={() => setOpenEndDate(true)} />
            <DatePicker modal mode='date' open={openEndDate} date={endDate} onConfirm={(date) => {
                setOpenEndDate(false)
                setEndDate(endDate)
            }}
                onCancel={() => { setOpenEndDate(false) }}
            />

            <Text style={styles.label}>Assignee:</Text>
            <CustomSelectDropdown data={users} onSelect={(user) => { setAssigneeId(user.id); }} label="User" />

            <Text style={styles.label}>Remark:</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={remark} onChangeText={setRemark} placeholder="Enter remark" multiline />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        overflow: 'scroll'
    },
    label: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    submitButton: {
        marginVertical: 10,
        marginBottom: 50,
        backgroundColor: '#388e3c',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
});

export default TaskCreateForm;