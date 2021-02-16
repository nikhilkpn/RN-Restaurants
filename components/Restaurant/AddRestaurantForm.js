import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,ScrollView,Dimensions,Alert } from 'react-native'
import {Input,Button,Icon,Avatar,Image} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import MapView  from 'react-native-maps'
import {map,size,filter} from 'lodash'
import  Modal from '../../components/Modal';
// import * as firebase from 'firebase'
import {firebaseApp} from '../../utils/firebase'
import firebase  from 'firebase/app'
import 'firebase/storage/'
import 'firebase/firestore'
import uuid from 'random-uuid-v4'

const db= firebase.firestore(firebaseApp)

const screenWidth = Dimensions.get('window').width;

const ImageRestaurant = props =>{
    const {imageRestaurant} = props
    return (    
        <View style={styles.viewPhoto}>
            {imageRestaurant ?
                <Image 
                    source={{uri:imageRestaurant}}
                    style={{width:screenWidth, height:200}}
                />:
                <Text>No Image Uploaded</Text>
            }
        </View>
    )
}


const Map = (props)=>{
    const {
        isVisibleMap,
        setIsVisibleMap, 
        toastRef,
        setRestaurantLocation
    } = props;
    const [location, setLocation] = useState(null)
    useEffect(() => {
        (async ()=>{
            const locationPermission = await Permissions.askAsync(Permissions.LOCATION)
            const locationPermissionStatus = locationPermission.permissions.location.status
            if(locationPermissionStatus !== 'granted'){
                toastRef.current.show(
                    "Please allow location permission",2000
                )
            }else{
                const loc = await Location.getCurrentPositionAsync({})
                setLocation({
                    latitude:loc.coords.latitude,
                    longitude:loc.coords.longitude,
                    latitudeDelta:0.001,
                    longitudeDelta:0.001,
                })
            }
        })()
    }, [])
    const confirmLocation = () =>{
        setRestaurantLocation(location);
        toastRef.current.show('Location saved')
        setIsVisibleMap(false)
    }
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={reg=>setLocation(reg)}
                    >
                        <MapView.Marker 
                            coordinate={{
                                latitude:location.latitude,
                                longitude:location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )
                }
            <View style={styles.viewMapBtn}>
                <Button 
                    title='Save Location'
                    buttonStyle={styles.viewMapBtnSave}
                    onPress={confirmLocation}
                />
                <Button 
                    title='Cancel Location'
                    containerStyle={styles.viewMapBtnContainerCancel}
                    buttonStyle={styles.viewMapBtnCancel}
                    onPress={()=>setIsVisibleMap(false)}
                />

            </View>
            </View>
        </Modal>
    )
}
const AddRestaurantForm = (props) => {
    const {toastRef,setIsLoading,navigation} = props
    const [restaurantName, setRestaurantName] = useState("")
    const [address, setAddress] = useState('')
    const [description, setDescription] = useState('')
    const [imageSelected, setImageSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [restaurantLocation, setRestaurantLocation] = useState(null)
    
    const uploadImageToFirebase = async () =>{
        const imageBlob = []
        await Promise.all(
            map(imageSelected, async image=>{
                const response = await fetch(image);
                const blob = await response.blob()
                const ref = firebase.storage().ref('restaurants').child(uuid())
                await ref.put(blob).then(async res=>{
                    await firebase.storage()
                    .ref(`restaurants/${res.metadata.name}`)
                    .getDownloadURL()
                    .then(url=>{
                        imageBlob.push(url)
                    })
                })
                .catch(err=>{
                    console.log('err');
                });
            })
    
        )
        return imageBlob
    
    }
    const addRestaurant = ()=>{
        if (!restaurantName || !address || !description ) {
            toastRef.current.show("All fields are empty");
        } else if (size(imageSelected) === 0) {
        toastRef.current.show("Select atleast one image");
        } else if (!restaurantLocation) {
        toastRef.current.show("Please select the restaurant Location");
        } else {
            setIsLoading(true)
            uploadImageToFirebase().then(res=>{
                const payload = {
                    name:restaurantName,
                    address:address,
                    description:description,
                    location:restaurantLocation,
                    images: res,
                    rating:0,
                    ratingTotal:0,
                    quantityVoting:0,
                    createAt:new Date(),
                    createBy:firebase.auth().currentUser.uid
                }
                db.collection('restaurants')
                .add({
                    ...payload
                })
                .then(()=>{
                    setIsLoading(false)
                    navigation.navigate('restaurants')
                })
                .catch(err=>{
                    setIsLoading(false)
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log('eee');
            });
        }
    }
    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant 
                imageRestaurant={imageSelected[0]}
            />
            <FormAdd 
                setRestaurantName={setRestaurantName}
                setDescription={setDescription}
                setAddress={setAddress}
                setIsVisibleMap={setIsVisibleMap}
                restaurantLocation={restaurantLocation}
            />
            <UploadImage 
                toastRef={toastRef}
                imageSelected={imageSelected}
                setImageSelected={setImageSelected}
            />
            <Button 
                title='Create Restaurant'
                onPress={addRestaurant}
                buttonStyle={styles.btnRestaurant}
            />
            <Map 
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap}
                toastRef={toastRef}
                setRestaurantLocation={setRestaurantLocation}
                />
        </ScrollView>
    )
}


const FormAdd = props =>{
    return (
        <View style={styles.form}>
            <Input 
                placeholder='Name of the Restaurant'
                containerStyle={styles.input}
                onChange={e=>props.setRestaurantName(e.nativeEvent.text)}
                />
            <Input 
                placeholder='Address'
                containerStyle={styles.input}
                onChange={e=>props.setAddress(e.nativeEvent.text)}
                rightIcon={{
                    type:'material-community',
                    name:'google-maps',
                    color:props.restaurantLocation? '#00a680':'#c2c2c2',
                    onPress:()=>{props.setIsVisibleMap(true)}
                }}
                />
            <Input 
                placeholder='Description'
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e=>props.setDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

const UploadImage = (props) =>{
    const {toastRef,setImageSelected, imageSelected} = props
    const imageSelect = async ()=>{
        const permissions = await Permissions.askAsync(Permissions.CAMERA);
        if (permissions.status === 'denied'){
            toastRef.current.show('Please grant Camera permission',3000)
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing:true,
                aspect:[4,3]
            })
            if(result.cancelled){
                toastRef.current.show('Cancelled',2000)
            }else{
                setImageSelected([...imageSelected,result.uri])
            }
        }
    }
    const removeImage = (image) =>{
        const arrayOfImages = imageSelected;
    
        Alert.alert(
            'Remove Image',
            "Are you sure that you want to remove the image",
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },
                {
                    text:'Remove',
                    onPress:()=> {
                        setImageSelected(filter(imageSelected,img=>img !==image))
                    }
                }
            ],
            {cancelable:false}
        )
    }
    return (
        <View style={styles.imageUpload}>
            {size(imageSelected) < 4 && 
                <Icon 
                    type='material-community'
                    name='camera'
                    color='#7a7a7a'
                    containerStyle={styles.imageContainer}
                    onPress={imageSelect}
                />
            }
            {map(imageSelected,(img, index)=>(
                <Avatar 
                    key={index}
                    style={styles.selectedImage}
                    source={{uri:img}}
                    onPress={()=>removeImage(img)}
                />

            ))}
        </View>
    )
}
export default AddRestaurantForm

const styles = StyleSheet.create({
    scrollView:{
        height:'100%'
    },
    form:{
        marginHorizontal:10
    },
    input:{
        marginBottom:10
    },
    textArea:{
        height:100,
        padding:0,
        width:'100%',
        margin:0
    },
    btnRestaurant:{
        backgroundColor:'#00a680',
        margin:20
    },
    imageUpload:{
        flexDirection:'row',
        marginHorizontal:20,
        marginTop:30
    },
    imageContainer:{
        alignItems:'center',
        justifyContent:'center',
        marginRight:10,
        height:70,
        width:70,
        backgroundColor:'#e3e3e3'

    },
    selectedImage:{
        width:70,
        height:70,
        marginRight:10
    },
    viewPhoto:{
        height:200,
        marginBottom:20,
        alignItems:'center'
    },
    mapStyle:{
        width:'100%',
        height:550
    },
    viewMapBtn:{
        flexDirection:'row',
        // justifyContent:'center',
        marginVertical:10,
        justifyContent:'space-between'
    },
    viewMapBtnContainerCancel:{
        paddingLeft:5
    },
    viewMapBtnCancel:{
        backgroundColor:'#a60d0d',
    },
    viewMapBtnSave:{
        backgroundColor:'#00a680',
    }
})
