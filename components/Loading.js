import React from 'react'
import { StyleSheet,ActivityIndicator, Text, View } from 'react-native'
import {Overlay} from 'react-native-elements'

const Loading = ({text,isVisible}) => {
    return (
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor='rgba(0,0,0,0,5)'
            overlayBackgroundColor='transparent'
            overlayStyle={styles.overlay}
        >
            <View style={styles.container}>
                <ActivityIndicator 
                    size='large'
                    color='#00a680'
                />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>
    )
}

export default Loading

const styles = StyleSheet.create({
    overlay:{
        height:100,
        width:200,
        backgroundColor:'#fff',
        borderColor:'#00a680',
        borderWidth:2,
        borderRadius:10
    },
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        marginTop:10,
        textTransform:'uppercase',
        color:'#00a680'
    }
})
