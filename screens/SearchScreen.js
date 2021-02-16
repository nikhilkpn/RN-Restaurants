import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";
import { rest } from "lodash";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
  const { navigation } = props;
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
        .then((response) => {
          setRestaurants(response);
        });
    }
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Search for restaurants"
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />
      {restaurants.length === 0 ? (
        <NoFoundRestaurants />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function NoFoundRestaurants() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {/* <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      /> */}
      <Text>No results found</Text>
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { id, name, images } = restaurant.item;
    console.log(restaurant);
  return (
    <ListItem 
        key={id} 
        bottomDivider 
        onPress={()=>{
            navigation.navigate("restaurants", {
                screen: "restaurant",
                params: { id, name },
            })
    }}>
        <Avatar source={{uri: images[0]}} />
        <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
        {/* <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle> */}
        </ListItem.Content>
        <ListItem.Chevron />
    </ListItem>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
});