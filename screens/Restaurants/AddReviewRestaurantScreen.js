import React, { useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const AddReviewRestaurantScreen = (props) =>{
  const { navigation, route } = props;
  const { restaurantId } = route.params;
  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();

  const addRevew = () => {
    if (!rating) {
      toastRef.current.show("Select any rating");
    } else if (!title) {
      toastRef.current.show("Write a title");
    } else if (!review) {
      toastRef.current.show("Write a reviews");
    } else {
      setIsLoading(true);
      const user = firebase.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        restaurantId: restaurantId,
        title: title,
        review: review,
        rating: rating,
        createAt: new Date(),
      };
      db.collection("reviews")
        .add(payload)
        .then(() => {
          updateRestaurant();
        })
        .catch(() => {
          toastRef.current.show("Server error");
          setIsLoading(false);
        });
    }
  };

  const updateRestaurant = () => {
    const restaurantRef = db.collection("restaurants").doc(restaurantId);

    restaurantRef.get().then((response) => {
      const restaurantData = response.data();
      const ratingTotal = restaurantData.ratingTotal + rating;
      const quantityVoting = restaurantData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      restaurantRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    });
  };

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Terrible "," Poor "," Average "," Very Good "," Excellent "]}
          defaultRating={0}
          size={35}
          onFinishRating={(value) => {
            setRating(value);
          }}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Title"
          containerStyle={styles.input}
          onChange={(e) => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Review"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={(e) => setReview(e.nativeEvent.text)}
        />
        <Button
          title="Submit Review"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={addRevew}
          />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Sending Review..." />
    </View>
  );
}

export default AddReviewRestaurantScreen
const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReview: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
