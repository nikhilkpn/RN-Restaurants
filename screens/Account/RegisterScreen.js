import React, {useRef} from 'react'
import { StyleSheet, Text,Image, View } from 'react-native'
import {Button,Input} from 'react-native-elements'
import RegistrationForm from '../../components/Account/RegistrationForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'

const RegisterScreen = () => {
    const toastRef = useRef()
    return (
        <KeyboardAwareScrollView>
            <Image 
                source={require("../../assets/fork-logo.png")}
                resizeMode='contain'
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <RegistrationForm  toastRef={toastRef}/>
            </View>
            <Toast ref={toastRef} position='top' opacity={0.9}/>
        </KeyboardAwareScrollView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
      },
      viewForm:{
          marginHorizontal:40
      }
    });
