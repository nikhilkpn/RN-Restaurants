import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import SearchScreen from '../screens/SearchScreen';


const Stack = createStackNavigator();

export default SearchStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='search'
                component={SearchScreen}
                options={{title:'Search Restaurants'}}
            />
        </Stack.Navigator>
    )
}

