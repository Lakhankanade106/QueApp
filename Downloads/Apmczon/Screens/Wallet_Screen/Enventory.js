/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

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

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
        UserID:'',
        WalletData:[]
    }
  }
  componentDidMount(){
      this.displayData()
      //this.WalletApiData()
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let UserID = await AsyncStorage.getItem('UserID');  
      this.setState({UserID:UserID})
      this.WalletApiData()
      console.log('user id',UserID)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  } 

  WalletApiData(){
   
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
        body:JSON.stringify({user_id:this.state.UserID})
      }).then((response) => response.json())
        .then((responseData) =>
         { //console.log("response1111: " + JSON.stringify(responseData));
         //this.setState({Activity:false})
         if(responseData.status == 200){
           this.setState({WalletData:responseData.data})
         }else{
         }
         
         })
        .catch((err) => { console.log(err); });
  }
  componentWillReceiveProps(){
    this.WalletApiData();
    
  }
  UNSAFE_componentWillReceiveProps(){
    this.WalletApiData()
  }
  // shouldComponentUpdate(){
  //   //this.WalletApiData(),[];
  // }
  render(){
    //console.log('Responce data  ',Storage.Wallet_Enventry_list)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
          <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.pop()}>
            <Image style={{width:25,height:20}}
              source={require('../../Images/Digital__Design_99-512.png')} />
          </TouchableOpacity>
          <View style={{alignItems:'center',width:'80%'}}>
            <Text style={{alignItems:"center",fontSize:20,fontWeight:'600',alignSelf:'center',justifyContent:"center"}}>Transaction History </Text>
          </View>
        </View>
        <ScrollView horizontal={true}>
            <View style={{flex:1}}>
                <View style={{flexDirection:'row',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                  <Text style={[styles.Header_Text,{width:30}]}>#</Text>
                  <Text style={styles.Header_Text}>Amount</Text>
                  <Text style={[styles.Header_Text,{width:40}]}>Type</Text>
                  <Text style={styles.Header_Text}>Date</Text>
                  <Text style={[styles.Header_Text,{marginRight:10}]}>Transaction ID</Text>
                </View>
                <FlatList 
                    data={this.state.WalletData}
                    renderItem={({item,index})=>
                    <View style={{flexDirection:'row',marginTop:15,borderBottomWidth:0.5,justifyContent:'space-around'}}>
                         <Text style={[styles.Header_Text,{width:30}]}>{index+1}</Text>
                         <Text style={styles.Header_Text}>{item.amount}</Text>
                         <Text style={[styles.Header_Text,{width:40}]}>{item.type}</Text>
                         <Text style={styles.Header_Text}>{item.entry_date}</Text>
                         <Text style={[styles.Header_Text,{marginRight:10,marginBottom:5}]}>{item.transaction_id}</Text>
                    </View>} />
            </View>
        </ScrollView>
    </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  Header_Text:{
    fontSize:16,
    fontWeight:'500',
    color:'#424949',
    width:100,
    marginLeft:20,
  },
  Font_Text:{
    fontSize:18,
    color:'#707B7C'
  },
  ButtonView:{
    width:70,
    borderRadius:15,
    height:40,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center'
  }
  // Button_View:{
  //   justifyContent:'center',
  //   alignItems:'center',
  //   alignSelf:'center',
  //   borderBottomWidth:1
  // },
  
});
