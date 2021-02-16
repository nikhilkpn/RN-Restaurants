import React,{useEffect, useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as firebase from 'firebase'
import LoggedInUserScreen from './LoggedInUserScreen'
import GuestUserScreen from './GuestUserScreen'
import Loading from '../../components/Loading'

const AccountScreen = () => {
    const [login,setLogin] = useState(null)
    useEffect(()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            !user? setLogin(false):setLogin(true)
        })
    },[])
    if (login === null) return <Loading isVisible={true} text='Loading...'/>
    return login ? <LoggedInUserScreen/> : <GuestUserScreen />
}

export default AccountScreen

const styles = StyleSheet.create({})
