import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import openMap from 'react-native-open-maps'

const Map = (props) => {
    const {location,height,name} = props

    const openAppMap = () =>{
        openMap({
            latitude:location.latitude,
            longitude:location.longitude,
            zoom:19,
            query:name
        })
    }
    return (
        <MapView
            initialRegion={location}
            style={{height:height, width:'100%'}}
            onPress={openAppMap}
        >
            <MapView.Marker
                coordinate={{
                    latitude:location.latitude,
                    longitude:location.longitude
                }}
            />
        </MapView>
    )
}

export default Map

const styles = StyleSheet.create({})
