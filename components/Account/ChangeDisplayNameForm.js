import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input,Button} from 'react-native-elements'
import * as firebase from 'firebase'

const ChangeDisplayNameForm = (props) => {
    const {displayName,toastRef,setShowModal,setReloadUserInfo} = props
    const [newName, setNewName] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit =()=>{
        setError(null);
        if(!newName){
            setError('Enter a username')
        }else if(newName === displayName){
            setError('New Name is same as old Name')
        }else{
            const update = {
                displayName: newName
            }
            setIsLoading(true)
            firebase
            .auth().currentUser.updateProfile(update)
            .then(()=>{
                setIsLoading(false)
                setShowModal(false)
                setReloadUserInfo(true)
            })
            .catch(()=> {
                setIsLoading(false)
                setError('serverError')
            }
                )
        }
    }
    return (
        <View style={styles.view}>
            <Input 
                placeholder='change username'
                containerStyle={styles.container}
                rightIcon={{
                    type:'material-community',
                    name:'account-circle-outline',
                    color:'#c2c2c2'
                }}
                defaultValue={displayName || ''}
                onChange={e=>setNewName(e.nativeEvent.text)}
                // onChangeText={name=>setNewName(name)}
                errorMessage={error}
            />
            <Button
                title='Save'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

export default ChangeDisplayNameForm

const styles = StyleSheet.create({
    view:{
        alignContent:'center',
        paddingVertical:10
    },
    container:{
        marginBottom:10
    },
    btnContainer:{
        marginTop:20,
        width:'95%',
        // margin:'auto'
    },
    btn:{
        backgroundColor:'#00a680'
    }

})
