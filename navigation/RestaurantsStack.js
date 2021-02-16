import React from 'react'
import { View, Text } from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import RestaurantsScreen from '../screens/Restaurants/RestaurantsScreen';
import RestaurantScreen from '../screens/Restaurants/RestaurantScreen';
import AddRestaurantScreen from '../screens/Restaurants/AddRestaurantScreen';
import AddReviewRestaurantScreen from '../screens/Restaurants/AddReviewRestaurantScreen';

const Stack = createStackNavigator();

export default RestaurantsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='restaurants'
                component={RestaurantsScreen}
                options={{title:'Restaurants'}}
            />
            <Stack.Screen 
                name='add-restaurant'
                component={AddRestaurantScreen}
                options={{title:'Add Restaurant'}}
            />
            <Stack.Screen 
                name='restaurant'
                component={RestaurantScreen}
            />
            <Stack.Screen 
                name='add-review-restaurant'
                component={AddReviewRestaurantScreen}
            />
        </Stack.Navigator>
    )
}

