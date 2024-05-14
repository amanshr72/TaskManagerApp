import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomSelectDropdown from '../CustomSelectDropdown';
import { Dialog, Portal, PaperProvider } from 'react-native-paper';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { fetchTasks } from './TaskList';

const TaskEdit = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const task = route.params.task;

    const taskId = task?.id ?? '';
    const [assigneeId, setAssigneeId] = useState('');
    const [remark, setRemark] = useState(task?.remark ?? '');
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

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

    useEffect(() => { fetchUsers(); }, []);

    const handleTaskCreationSuccess = async () => {
        setAssigneeId('');
        setRemark('');
        setUsers([]);
        setStatus('');
        setProgress('');
        navigation.navigate('Home', { screen: 'TaskList', params: { refresh: true } });
    }

    const handleSubmit = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json', };
        const data = { id: taskId, assigned_to: assigneeId, status: status, progress: progress, remark: remark };

        try {
            const response = await axios.put('https://task.market99.org.in/public/api/task/update', JSON.stringify(data), { headers });
            console.log('Response', response.data);
            if (response.data.success) {
                setDialogMessage('Task updated successfully');
                setVisible(true);
                handleTaskCreationSuccess();
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const errDetail = err.response.data.error;
                let msg = "Failed to update Task: \n";
                for (let key in errDetail) {
                    msg += `• ${errDetail[key][0]}\n`;
                }
                setDialogMessage(msg);
                setVisible(true);
            }
        }
    }

    const taskStatus = { Pending: "Pending", Unassigned: "Unassigned", InProcess: "In Process", Assigned: "Assigned" };
    const statusArray = Object.keys(taskStatus).map(key => ({ name: taskStatus[key], value: taskStatus[key] }));

    const taskProgress = { '25': '25', '50': '50', '75': '75', '100': '100' };
    const progressArray = Object.keys(taskProgress).map(key => ({ name: taskProgress[key] + '%', value: taskProgress[key] }));

    const trimDescription = task?.description?.split(' ').slice(0, 30).join(' ') + (task?.description?.split(' ').length > 50 ? '...' : '');

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

            <View style={styles.readOnlyContainer}>
                <Text style={styles.readOnlyLabel}>Category: </Text>
                <Text style={styles.readOnlyValue}>{task?.task_category ?? ''}</Text>
            </View>

            <View style={styles.readOnlyContainer}>
                <Text style={styles.readOnlyLabel}>Title: </Text>
                <Text style={styles.readOnlyValue}>{task?.title ?? ''}</Text>
            </View>

            <View style={styles.readOnlyContainer}>
                <Text style={styles.readOnlyLabel}>Description: </Text>
                <Text style={styles.readOnlyValue}>{trimDescription}</Text>
            </View>

            <Text style={styles.label}>Assignee:</Text>
            <CustomSelectDropdown data={users} selectedValue={task.assigned_to} onSelect={(user) => { setAssigneeId(user.id); }} label="User" />

            <Text style={styles.label}>Status:</Text>
            <CustomSelectDropdown data={statusArray} selectedValue={task.status} onSelect={(status) => { setStatus(status.value); }} label="Status" />

            <Text style={styles.label}>Progress:</Text>
            <CustomSelectDropdown data={progressArray} selectedValue={task.progress} onSelect={(progress) => { setProgress(progress.value); }} label="Progress" />

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
    readOnlyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10
    },
    readOnlyLabel: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 16,
    },
    readOnlyValue: {
        color: 'black',
        fontSize: 16,
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

export default TaskEdit;
