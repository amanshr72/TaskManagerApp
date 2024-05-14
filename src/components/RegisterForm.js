import React, { useState } from 'react';
import { Alert, Button, Pressable, SafeAreaView, Switch, Text, TextInput, View } from 'react-native';
import { styles } from '../../assets/LoginFormStyles';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RegisterForm = () => {
    const navigation = useNavigation();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        const basicAuth = 'Basic QWRtaW46MQ==';
        const headers = { Authorization: basicAuth, 'Content-Type': 'application/json', };
        const data = { name: name, email: email, password: password };

        try {
            const response = await axios.post('https://task.market99.org.in/public/api/register', JSON.stringify(data), { headers });

            if (response.data.success) {
                Alert.alert('Registered Successful', 'Welcome ' + response.data.user);
            }
        } catch (err) {
            const errDetail = err.response.data.error;
            if (err.response.status == 422) {
                let msg = "Validation Error: \n"; 
                for (let key in errDetail) {
                    msg += `• ${errDetail[key][0]}\n`; 
                }
                Alert.alert('Registration Failed', msg);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>Register</Text>
            <View style={styles.inputView}>
                <TextInput style={styles.input} placeholder='FULL NAME' value={name} onChangeText={(text) => setName(text)} autoCorrect={false}
                    autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='EMAIL' value={email} onChangeText={(text) => setEmail(text)} autoCorrect={false}
                    autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry={!showPassword} value={password} onChangeText={(text) => setPassword(text)}
                    autoCorrect={false} autoCapitalize='none' />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Switch value={showPassword} onValueChange={value => setShowPassword(value)} />
                    <Text>Show Password</Text>
                </View>

            </View>

            <View style={styles.buttonView}>
                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>REGISTER</Text>
                </Pressable>
            </View>

            <Text style={styles.footerText}>Already Have An Account? 
                <Text style={styles.signup} onPress={() => navigation.navigate('Login')}>Sign In</Text>
            </Text>

        </SafeAreaView>
    );
};

export default RegisterForm;
