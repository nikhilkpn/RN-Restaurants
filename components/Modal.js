import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Overlay} from 'react-native-elements'

const Modal = (props) => {
    const {isVisible, setIsVisible,children } = props
    const closeModal = () => setIsVisible(false)
    return (
        <Overlay 
            isVisible={isVisible} 
            backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
            overlayStyle={styles.overlay}
            onBackdropPress={closeModal}
            >
            {children}
        </Overlay>
    )
}

export default Modal

const styles = StyleSheet.create({
    overlay:{
        height:'auto',
        width:'90%',
        backgroundColor:'white',


    }
})
