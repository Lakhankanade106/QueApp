/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { FlatList } from 'react-native';
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
  AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from '../Config/api'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      LoginType:1,
      PartnerArray:[],
      UserID:''
    }
  }
  componentDidMount(){
      this.displayData()
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let UserID = await AsyncStorage.getItem('UserID');  
      this.setState({UserID:UserID})
      this.GetDataFun()
      console.log('user id',UserID)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  } 
  
  GetDataFun(){

    let url= api.baseURL;
    fetch( url+'wb/get_partners', {
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
       { console.log("response1111: " + JSON.stringify(responseData));
       //this.setState({Activity:false})
       if(responseData.status == 200){
         this.setState({PartnerArray:responseData.data})
         //this.props.navigation.navigate('drawerMenu')
       }else{
       }
       
       })
      .catch((err) => { console.log(err); });
  }

  render(){
    
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
      <View style={{marginLeft:20,marginTop:10}}>
        <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>Actions.pop()}>
          <Image style={{width:20,height:20}}
            source={require('../Menu_images/Digital__Design_99-512.png')}
          />
          <Text style={{fontSize:16,marginLeft:10}}>Back</Text>
        </TouchableOpacity>
      </View>
        <ScrollView horizontal={true}>
            <View style={{flex:1}}>
                <View style={{flexDirection:'row',alignItems:'center',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                  <Text style={[styles.Header_Text,{width:40,marginLeft:10}]}>#</Text>
                  <Text style={styles.Header_Text}>First Name</Text>
                  <Text style={styles.Header_Text}>Last Name</Text>
                  <Text style={styles.Header_Text}>Mobile</Text>
                  <Text style={styles.Header_Text}>Email</Text>
                  <Text style={styles.Header_Text}>User Type</Text>
                </View>
                <FlatList
                    data={this.state.PartnerArray}
                    renderItem={({item,index})=> 
                    <View style={{flexDirection:'row',borderBottomWidth:0.5,alignItems:'center',paddingBottom:10,marginTop:15,justifyContent:'space-around'}}>
                        <Text style={[styles.Header_Text,{width:40,marginLeft:10}]} >{index+1}</Text>
                        <Text style={styles.Header_Text}>{item.firstname}</Text>
                        <Text style={styles.Header_Text}>{item.lastname}</Text>
                        <Text style={styles.Header_Text}>{item.mobile}</Text>
                        <Text style={styles.Header_Text}>{item.email}</Text>
                        {item.user_type ==4?
                        <Text style={styles.Header_Text}>Broker</Text>
                        :null}
                        {item.user_type ==3?
                        <Text style={styles.Header_Text}>Shop</Text>
                        :null}
                        {item.user_type ==5?
                        <Text style={styles.Header_Text}>Transpoter</Text>
                        :null}
                        {item.user_type ==6?
                        <Text style={styles.Header_Text}>Vender</Text>
                        :null}
                        
                    </View>
                }
                />
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
    marginLeft:20
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
