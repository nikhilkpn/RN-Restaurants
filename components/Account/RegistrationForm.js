import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Button,Icon,Input} from 'react-native-elements'
import { validateEmail } from '../../utils/validations'
import {size, isEmpty } from 'lodash'
import * as firebase from 'firebase'
import {useNavigation} from '@react-navigation/native'
import Loading from '../Loading'

const RegistrationForm = ({toastRef}) => {
    const navigation = useNavigation()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormData)
    const [loading, setLoading] = useState(false)

    const handleSubmit = ()=>{
        if (
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.confirmPassword)
          ) {
            toastRef.current.show("Please fill all fields");
          } else if (!validateEmail(formData.email)) {
            toastRef.current.show("Email not valid");
          } else if (formData.password !== formData.confirmPassword) {
            toastRef.current.show("Email doesnt match");
          } else if (size(formData.password) < 6) {
            toastRef.current.show(
              "Password must be mininum 6 character"
            );
          } else {
              setLoading(true)
              firebase.auth().createUserWithEmailAndPassword(formData.email,formData.password)
              .then(respone=>{
                  setLoading(false)
                  navigation.navigate('account')

              })
              .catch(error=>{
                  setLoading(false)
                  toastRef.current.show("server error",error)
              })
            
            }
}

    const onChange =(e,type) =>{
        setFormData({...formData, [type]:e.nativeEvent.text})
    }
    return (
        <View style={styles.formContainer}>
            <Input 
                placeholder='Email'
                containerStyle={styles.inputForm}
                onChange={e=>onChange(e,'email')}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name="email"
                        iconStyle={styles.iconRight}
                    />
                }
                />
            <Input 
                placeholder='Password'
                containerStyle={styles.inputForm}
                password={true}
                onChange={e=>onChange(e,'password')}
                secureTextEntry={showPassword?false:true}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={showPassword?"eye-off-outline": "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={()=>setShowPassword(!showPassword)}
                        
                    />
                }
                />
                    <Input 
                    placeholder='Confirm Password'
                    containerStyle={styles.inputForm}
                    password={true}
                    onChange={e=>onChange(e,'confirmPassword')}
                    secureTextEntry={showConfirmPassword?false:true}
                    rightIcon={
                        <Icon 
                        type="material-community"
                        name={showConfirmPassword?"eye-off-outline": "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={()=>setShowConfirmPassword(!showConfirmPassword)}
                        />
                    }
            />
            <Button 
                title='Register'
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={handleSubmit}
            />
            <Loading isVisible={loading} text='Creating account'/>
        </View>
    )
}

const defaultFormData = {
    "email":'',
    "password":'',
    "confirmPassword":''
}

export default RegistrationForm

const styles = StyleSheet.create({
    formContainer: {
        flex:  1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1",
    },
    });
