import React, {useEffect} from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import RestaurantNavigator from './navigation/RestaurantNavigator';
import {firebaseApp} from './utils/firebase';
import * as firebase from 'firebase'
import {encode,decode} from 'base-64'

// if (!global.btoa) global.btoa = encode;
// if (!global.atob) global.atob = decode;

LogBox.ignoreLogs(["Setting a timer"])
export default function App() {

  return (
      <RestaurantNavigator/>
    );
}
