import React, { useState } from 'react'
import { Alert, Button, Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../../assets/LoginFormStyles';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Dialog, Portal, PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleLogin = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json', };
        const data = { email: email, password: password };

        try {
            const response = await axios.post('https://task.market99.org.in/public/api/login', JSON.stringify(data), { headers });
            if (response.data.success) {
                // Store user login in AsyncStorage
                await AsyncStorage.setItem('isLoggedIn', 'true');
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
                setDialogMessage('Welcome ' + response.data.user.name + '!');
                setVisible(true);
            }
        } catch (err) {
            if (err.response.status == 401) {
                setDialogMessage('Login Failed Whoops!, Invalid Credentials, Please Try Again.');
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
                                <Dialog.Content>
                                    <Text style={{ fontSize: 15 }}>{dialogMessage}</Text>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <TouchableOpacity onPress={() => {
                                        setVisible(false);
                                        if (dialogMessage.includes('Welcome')) {
                                            navigation.navigate('Home');
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
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>Login</Text>

            <View style={styles.inputView}>
                <TextInput style={styles.input} placeholder='EMAIL' onChangeText={(text) => setEmail(text)} value={email} autoCorrect={false}
                    autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry={!showPassword} onChangeText={(text) => setPassword(text)} value={password} autoCorrect={false}
                    autoCapitalize='none' />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Switch value={showPassword} onValueChange={value => setShowPassword(value)} />
                    <Text>Show Password</Text>
                </View>
            </View>


            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.7}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>Don't Have Account?
                <Text style={styles.signup} onPress={() => navigation.navigate('Register')}>Sign Up</Text>
            </Text>

        </SafeAreaView>
    );
};

export default LoginForm;
