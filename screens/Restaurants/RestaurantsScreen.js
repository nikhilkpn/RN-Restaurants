import React,{useState, useEffect,useCallback} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import {firebaseApp} from '../../utils/firebase'
import * as firebase from 'firebase'
import {useNavigation} from '@react-navigation/native'
import {useFocusEffect} from '@react-navigation/native'
import 'firebase/firestore';
import ListRestaurants from '../../components/Restaurant/ListRestaurants'

const db = firebase.firestore(firebaseApp)

const RestaurantsScreen = (props) => {
    const {navigation} = props
    const [user, setUser] = useState(null)
    const [restaurants, setRestaurants] = useState([])
    const [totalRestaurants, setTotalRestaurants] = useState(0)
    const [startRestaurants, setStartRestaurants] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const limitRestaurants = 10;

    useEffect(() => {
        firebase.auth().onAuthStateChanged(userInfo=>{
            setUser(userInfo)
        })
    }, [])
    
    useFocusEffect(
        useCallback(()=>{
            db.collection('restaurants').get().then(snap=>{
                setTotalRestaurants(snap.size)
            })
            const allRestaurants = [];
            db.collection('restaurants')
            .orderBy('createAt',"desc")
            .limit(limitRestaurants)
            .get().then(response=>{
                setStartRestaurants(response.docs[response.docs.length-1])
                response.forEach(doc=>{
                    const restaurant = doc.data()
                    restaurant.id = doc.id;
                    allRestaurants.push(restaurant)
                })
                setRestaurants(allRestaurants)
            })

        },[])
    )

    
    const handleLoadMore = () => {
        const allRestaurants = [];
        restaurants.length < totalRestaurants && setIsLoading(true);

        db.collection('restaurants')
        .orderBy('createAt',"desc")
        .startAfter(startRestaurants.data().createAt)
        .limit(limitRestaurants)
        .get().then(response=>{
            if (response.docs.length > 0){
                setStartRestaurants(response.docs[response.docs.length-1])
                
            }else {
                setIsLoading(false)
            }
            
            response.forEach(doc=>{
                const restaurant = doc.data()
                restaurant.id = doc.id;
                allRestaurants.push(restaurant)
            })
            setRestaurants([...restaurants,...allRestaurants])
        })
    }
    return (
        <View style={styles.container}>
            <ListRestaurants 
                restaurants={restaurants}
                isLoading={isLoading}
                handleLoadMore={handleLoadMore}
            />
           {user && <Icon 
                reverse
                type='material-community'
                name='plus'
                color='#00a680'
                containerStyle={styles.iconContainer}
                onPress={()=> navigation.navigate('add-restaurant')}
            />}
        </View>
    )
}

export default RestaurantsScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    iconContainer:{
        position: 'absolute',
        bottom:15,
        right:15,
        shadowColor:'black',
        shadowOffset:{width:2,height:2},
        shadowOpacity:0.5
    }
})
