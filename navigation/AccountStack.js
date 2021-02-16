import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import FavoritesScreen from '../screens/FavoritesScreen';
import AccountScreen from '../screens/Account/AccountScreen';
import LoginScreen from '../screens/Account/LoginScreen';
import RegisterScreen from '../screens/Account/RegisterScreen';


const Stack = createStackNavigator();

export default AccountStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='account'
                component={AccountScreen}
                options={{title:'My Account'}}
            />
            <Stack.Screen 
                name='login'
                component={LoginScreen}
                options={{title:'Login'}}
            />
            <Stack.Screen 
                name='register'
                component={RegisterScreen}
                options={{title:'Register'}}
            />
        </Stack.Navigator>
    )
}

