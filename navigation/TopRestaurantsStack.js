import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import TopRestaurantsScreen from '../screens/TopRestaurantsScreen';


const Stack = createStackNavigator();

export default TopRestaurantsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='top-restaurants'
                component={TopRestaurantsScreen}
                options={{title:'Top restaurants '}}
            />
        </Stack.Navigator>
    )
}

