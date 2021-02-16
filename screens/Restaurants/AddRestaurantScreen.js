import React, {useState,useRef} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddRestaurantForm from '../../components/Restaurant/AddRestaurantForm'

const AddRestaurantScreen = (props) => {
    const {navigation} = props
    const [isLoading, setIsLoading] = useState(false)
    const toastRef = useRef()

    return (
        <View>
            <AddRestaurantForm 
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
            />
            <Toast 
                ref={toastRef}
                position='top'
                opacity={0.9}
            />
            <Loading 
                isVisible={isLoading}
                text="Saving Restauarant Data"
            />
        </View>
    )
}

export default AddRestaurantScreen

const styles = StyleSheet.create({})
