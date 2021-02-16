import React from 'react'
import { StyleSheet, Text,ScrollView,Image, View } from 'react-native'
import {Button} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'

const GuestUserScreen = () => {
    const navigation  = useNavigation()
    return (
        <ScrollView
            centerContent={true}
            style={styles.container}
        >
            <Image 
                source={require("../../assets/guest-user.png")}
                style={styles.image}
            />
            <Text style={styles.title}>Visit the best Restaurants near you</Text>
            <Text style={styles.description}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but 
            </Text>
            <View style={styles.viewBtn}>
                <Button 
                    title='View your profile'
                    onPress={()=>navigation.navigate('login')}
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btnStyle}
                />

            </View>
        </ScrollView>
    )
}

export default GuestUserScreen

const styles = StyleSheet.create({
    container:{
        marginHorizontal:30
    },
    image:{
        height:200,
        width:'100%',
        marginBottom:40
    },
    title:{
        fontWeight:'bold',
        fontSize:20,
        marginBottom:10,
        textAlign:'center'
    },
    description : {
        textAlign : "center" ,
        marginBottom : 20 ,
      } ,
    viewBtn : {
        flex : 1 ,
        alignItems : "center" ,
        } ,
    btnStyle : {
        backgroundColor : "#00a680" ,
    } ,
    btnContainer : {
        width : "70%" ,
    } ,
})
