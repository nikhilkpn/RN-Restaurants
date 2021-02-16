import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Avatar} from 'react-native-elements';
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase'

const UserInfo = (props) => {
    const {userInfo:{
            uid,
            photoURL,
            displayName,
            email, 
        },
        toastRef,
        setLoading,
        setLoadingText,
        } = props

    const changeAvatar = async ()=>{
        const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'denied') {
            toastRef.current.show('Allow camera permission')
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing:true,
                aspect:[4,3]
            });

            if (result.cancelled){
                toastRef.current.show('Please select any Image')
            }else{
                uploadImage(result.uri)
                .then(res=>{
                    updatePhotoUrl();
                })
                .catch(err=>{
                    console.log("err");
                })
            }
        }
    }

    const uploadImage =async (uri)=>{
        setLoadingText("uploading image");
        setLoading(true);
        // setLoadingText("Actualizando Avatar");
        // setLoading(true);
        const resp = await fetch(uri);
        const blob = await resp.blob();
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob)
    }
    const updatePhotoUrl = () =>{
        firebase
        .storage()
        .ref(`avatar/${uid}`)
        .getDownloadURL()
        .then(async res=>{
            const update = {
                photoURL: res
            }
            await firebase.auth().currentUser.updateProfile(update)
            setLoading(false)
        })
        .catch(err=> console.log("err"))
    }
    return (
        <View style={styles.container}>
            <Avatar 
                rounded
                size='large'
                containerStyle={styles.avatarContainer}
                onPress={changeAvatar}
                source={
                    photoURL ? {uri:photoURL}: require("../../assets/avatar.png")
                }
            />
            <View>
                <Text style={styles.displayName}>{displayName? displayName:'Anonymous'}</Text>
                <Text>{email?email: 'Social Login'}</Text>
            </View>
        </View>
    )
}

export default UserInfo

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingVertical: 30,
      },
    avatarContainer: {
        marginRight: 20,
      },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
      },
})
