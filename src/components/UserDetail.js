import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Avatar, Card, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../assets/UserDetailStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserDetail = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);

    const handleSignOut = async () => {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    };

    const fetchUserDetail = async () => {
        try {
            const userDetailJSON = await AsyncStorage.getItem('user');
            if (userDetailJSON) {
                const userData = JSON.parse(userDetailJSON);
                setUserData(userData);
                setLoading(false);
            }
        } catch (error) {
            console.warn('Error fetching user detail:', error);
        }
    };

    useEffect(() => {
        fetchUserDetail();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }


    const [fName, lName] = userData.name.split(' ');
    const label = `${fName ? fName[0] : ''}${lName ? lName[0] : ''}`.toUpperCase();
    return (
        <View style={styles.container}>
            <Avatar.Text size={150} style={styles.avatar} label={label} />
            <View style={styles.cardContainer}>
                <Card>
                    <Card.Content>
                        <View style={styles.detail}>
                            <Text style={styles.label}>Username:</Text>
                            <Text style={styles.value}>{userData.name ?? 'N/A'}</Text>
                        </View>
                        <Divider style={styles.detail} bold={true} />
                        <View style={styles.detail}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{userData.email ?? 'N/A'}</Text>
                        </View>
                        <Divider style={styles.detail} bold={true} />
                        <View style={styles.detail}>
                            <Text style={styles.label}>Mobile:</Text>
                            <Text style={styles.value}>{userData.phone ?? 'N/A'}</Text>
                        </View>
                        <Divider style={styles.detail} bold={true} />
                        <View style={styles.detail}>
                            <Text style={styles.label}>Role:</Text>
                            <Text style={styles.value}>{userData.role ?? 'N/A'}</Text>
                        </View>
                        <Divider style={styles.detail} bold={true} />
                        <View style={styles.detail}>
                            <Text style={styles.label}>Status:</Text>
                            <Text style={styles.value}>{userData.status ?? 'N/A'}</Text>
                        </View>
                    </Card.Content>
                </Card>
                <View style={styles.logout}>
                    <Button icon="logout" mode="contained" onPress={handleSignOut}>
                        Log Out
                    </Button>
                </View>
            </View>
        </View>
    );
};

export default UserDetail;