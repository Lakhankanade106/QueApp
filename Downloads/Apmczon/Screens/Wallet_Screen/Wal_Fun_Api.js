import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import api from '../Config/api'
import Storage from '../Config/Storage'

export const Wallet_List_Fun = (navigation) =>{
   // let UserID =  AsyncStorage.getItem('UserID');
    console.log('user iddd ',navigation)
    let url= api.baseURL;
      fetch( url+'wb/wallet_list', {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
       // "Content-Disposition": 'multipart/form-data'
        //'Content-Type': 'multipart/form-data'
        //'Content-Length': data.length 
        },
        body:JSON.stringify({user_id:Storage.UserId})
      }).then((response) => response.json())
        .then((responseData) =>
         { console.log("response1111: " + JSON.stringify(responseData));
         //this.setState({Activity:false})
         if(responseData.status == 200){
           //this.setState({WalletData:responseData.data})
           Storage.Wallet_Enventry_list = responseData.data
           navigation.navigate('Enventory');
         }else{
         }
         
         })
        .catch((err) => { console.log(err); });
}