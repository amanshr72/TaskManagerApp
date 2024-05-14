import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import LoginForm from './src/components/LoginForm';
import RegisterForm from './src/components/RegisterForm';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskList from './src/components/Task/TaskList';
import MyTaskList from './src/components/Task/MyTaskList';
import UserDetail from './src/components/UserDetail';
import TaskCategoryList from './src/components/Category/TaskCategoryList';
import TaskCreateForm from './src/components/Task/TaskCreateForm';
import ImportantTaskList from './src/components/Task/ImportantTaskList';
import Icon from 'react-native-vector-icons/Ionicons';
import TaskEdit from './src/components/Task/TaskEdit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'TaskList') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'My Task') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Categories') {
          iconName = focused ? 'folder-open' : 'folder-outline';
        } else if (route.name === 'Important') {
          iconName = focused ? 'star' : 'star-outline';
        } else if (route.name === 'Account') {
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        }

        return <Icon name={iconName} size={30} color='black' />;
      },
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
    })}
    >
      <Tab.Screen name="TaskList" component={HomeScreen} options={({ navigation }) => ({
        title: 'Home', headerRight: () => (
          <View style={{ marginRight: 20 }}>
            <Button icon="plus" mode="contained" onPress={() => navigation.navigate('TaskCreate')}>Add Task</Button>
          </View>
        ),
      })} />
      <Tab.Screen name="My Task" component={MyTask} />
      <Tab.Screen name="Categories" component={TaskCategory} />
      <Tab.Screen name="Important" component={ImportantTask} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const LoginScreenNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getData = async () => {
    const data = await AsyncStorage.getItem('isLoggedIn');
    console.log('isLoggedIn =>', data);
    setIsLoggedIn(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="TaskCreate" component={TaskCreate} options={{ title: 'Add Task' }} />
          <Stack.Screen name="TaskUpdate" component={TaskUpdate} options={{ title: 'Update Task' }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      ) : (
        <LoginScreenNavigation />
      )}
    </NavigationContainer>
  );
}

/* HOME SCREEN */
const HomeScreen = () => { return (<TaskList />) }

/* TASK CREATE SCREEN */
const TaskCreate = () => { return (<TaskCreateForm />); }

/* TASK UPDATE SCREEN */
const TaskUpdate = () => { return (<TaskEdit />); }

/* MY TASK SCREEN */
const MyTask = () => { return (<MyTaskList />); }

/* TASK CATEGORY SCREEN */
const TaskCategory = () => { return (<TaskCategoryList />); }

/* IMP TASK SCREEN */
const ImportantTask = () => { return (<ImportantTaskList />); }

/* LOGIN SCREEN */
const LoginScreen = () => { return (<LoginForm />); }

/* REGISTER SCREEN */
const RegisterScreen = () => { return (<RegisterForm />); }

// Account screen
const AccountScreen = () => { return (<UserDetail />); };

export default App;
