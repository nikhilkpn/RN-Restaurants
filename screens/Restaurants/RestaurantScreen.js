import React,{useState,useEffect,useCallback, useRef} from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import {firebaseApp} from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import {map} from 'lodash'
import { Rating, ListItem, Icon } from "react-native-elements";
import Loading from '../../components/Loading'
import { ScrollView } from 'react-native-gesture-handler'
import CarouselImages from '../../components/Carousel'
import Map from '../../components/Map'
import ListReviews from '../../components/Restaurant/ListReviews'
import Toast from 'react-native-easy-toast'


const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get('window').width;

const RestaurantScreen = (props) => {
    const [restaurant, setRestaurant] = useState(null)
    const [rating, setRating] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const toastRef = useRef()
    const {navigation, route} = props
    const {name,id } = route.params
    firebase.auth().onAuthStateChanged(user=>{
      user? setUserLogged(true): setUserLogged(false)
    })

    useFocusEffect(
      useCallback(() => {
          navigation.setOptions({title:name})
          db.collection('restaurants')
          .doc(id)
          .get()
          .then(response=>{
              const data = response.data();
              data.id = response.id;
              setRestaurant(data)
              setRating(data.rating)
          })
      }, [])
    );

    useEffect(() => {
      if (userLogged && restaurant) {
        db.collection("favorites")
          .where("restaurantId", "==", restaurant.id)
          .where("userId", "==", firebase.auth().currentUser.uid)
          .get()
          .then((response) => {
            if (response.docs.length === 1) {
              setIsFavorite(true);
            }
          });
      }
    }, [userLogged,restaurant])


    const addFavorite = () => {
      if (!userLogged) {
        toastRef.current.show(
          "Please login"
        );
      } else {
        const payload = {
          userId: firebase.auth().currentUser.uid,
          restaurantId: restaurant.id,
        };
        db.collection("favorites")
          .add(payload)
          .then(() => {
            setIsFavorite(true);
            toastRef.current.show("Added to favorites");
          })
          .catch(() => {
            toastRef.current.show("Error occured ");
          });
      }
    };

    const removeFavorite = () => {
      db.collection("favorites")
        .where("restaurantId", "==", restaurant.id)
        .where("userId", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            const idFavorite = doc.id;
            db.collection("favorites")
              .doc(idFavorite)
              .delete()
              .then(() => {
                setIsFavorite(false);
                toastRef.current.show("Removed from favorites");
              })
              .catch(() => {
                toastRef.current.show(
                  "Error while removing favorites"
                );
              });
          });
        });
    };

    if(!restaurant) return <Loading isVisible={true} text='Loading'/>
    return (
        <ScrollView vertical style={styles.viewBody }>
            <View style={styles.viewFavorite}>
                <Icon 
                  type='material-community'
                  name={isFavorite ? 'heart':'heart-outline'}
                  color={isFavorite ? '#f00':'#000'}
                  underlayColor='transparent'
                  size={35}
                  onPress={ isFavorite ? removeFavorite: addFavorite}
                />
            </View>
            <CarouselImages 
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo 
                name={restaurant.name}
                location={restaurant.location}
                address={restaurant.address}
            />
            <ListReviews 
                navigation={navigation}
                restaurantId={restaurant.id}
                setRating={setRating}
            />
            <Toast ref={toastRef} position='top' opacity={.9}/>
        </ScrollView>
    )
}


function TitleRestaurant(props) {
    const { name, description, rating } = props;
  
    return (
      <View style={styles.viewRestaurantTitle}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.nameRestaurant}>{name}</Text>
          <Rating
            style={styles.rating}
            imageSize={20}
            readonly
            startingValue={parseFloat(rating)}
          />
        </View>
        <Text style={styles.descriptionRestaurant}>{description}</Text>
      </View>
    );
  }
  function RestaurantInfo(props) {
    const { location, name, address } = props;
  
    const listInfo = [
      {
        text: address,
        iconName: "map-marker",
        iconType: "material-community",
        action: null,
      },
      {
        text: "1000000",
        iconName: "phone",
        iconType: "material-community",
        action: null,
      },
      {
        text: "nikhil@gmail.com",
        iconName: "at",
        iconType: "material-community",
        action: null,
      },
    ];
  
    return (
      <View style={styles.viewRestaurantInfo}>
        <Text style={styles.restaurantInfoTitle}>
          Restaurant Information
        </Text>
        <Map location={location} name={name} height={100} />
        {map(listInfo, (item, index) => (
            <ListItem key={index} bottomDivider onPress={()=>{}}>
                <Icon name={item.iconName} type={item.iconType} color='#00a680' />
                <ListItem.Content>
                <ListItem.Title>{item.text}</ListItem.Title>
                {/* <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle> */}
                </ListItem.Content>
                {/* <ListItem.Chevron /> */}
            </ListItem>
        ))}
      </View>
    );
  }
  

export default RestaurantScreen

const styles = StyleSheet.create({
    viewBody: {
      flex: 1,
      backgroundColor: "#fff",
    },
    viewRestaurantTitle: {
      padding: 15,
    },
    nameRestaurant: {
      fontSize: 20,
      fontWeight: "bold",
    },
    descriptionRestaurant: {
      marginTop: 5,
      color: "grey",
    },
    rating: {
      position: "absolute",
      right: 0,
    },
    viewRestaurantInfo: {
      margin: 15,
      marginTop: 25,
    },
    restaurantInfoTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    containerListItem: {
      borderBottomColor: "#d8d8d8",
      borderBottomWidth: 1,
    },
    viewFavorite: {
      position: "absolute",
      top: 0,
      right: 0,
      zIndex: 2,
      backgroundColor: "#fff",
      borderBottomLeftRadius: 100,
      padding: 5,
      paddingLeft: 15,
    }
})