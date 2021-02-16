import React,{useRef,useEffect,useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Button} from 'react-native-elements'
import * as firebase from 'firebase'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import UserInfo from '../../components/Account/UserInfo'
import AccountOptions from '../../components/Account/AccountOptions'

const LoggedInUserScreen = () => {
    const toastRef = useRef()
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const [userInfo, setUserInfo] = useState(null)
    const [reloadUserInfo, setReloadUserInfo] = useState(false)

    useEffect(() => {
        (async ()=>{
            const user =  await firebase.auth().currentUser;
            setUserInfo(user)
        })();
        setReloadUserInfo(false)
    }, [reloadUserInfo])
    return (
        <View style={styles.userInfo}>
            {userInfo && <UserInfo 
                            userInfo={userInfo} 
                            toastRef={toastRef} 
                            setLoading={setLoading}
                            setLoadingText={setLoadingText}
                            />}
            <AccountOptions 
                userInfo={userInfo}
                toastRef={toastRef}
                setReloadUserInfo={setReloadUserInfo}
            />
            <Button 
                title='Logout'
                onPress={()=> firebase.auth().signOut()}
                buttonStyle={styles.btnLogout}
                titleStyle={styles.btnLogoutText}
            />
            <Toast ref={toastRef} position='center' opacity={0.9}/>
            <Loading text={loadingText} isVisible={loading}/>
        </View>
    )
}

export default LoggedInUserScreen

const styles = StyleSheet.create({
    userInfo:{
        minHeight:'100%',
        backgroundColor:'#f2f2f2'
    },
    btnLogout: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnLogoutText: {
        color: "#00a680",
    },
})
