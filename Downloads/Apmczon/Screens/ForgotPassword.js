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
  AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from './Config/api'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
        Email:'',
        ErrorShow:''
    }
  }
  ForgotPassword(){
    console.log('Forgot Password')
    this.setState({ErrorShow:''})
    let body = JSON.stringify({email:this.state.Email,})
    let url= api.baseURL;
      fetch( url+'wb/forgot_password', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: body
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status =='201'){
              this.setState({ErrorShow:responseData.message})
          }
          else{
            Actions.drawerMenu()
          }
          })
         .catch((err) => { console.log(err); });
  }
  render(){
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <ScrollView>
            <View style={{flex:1}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:15,marginLeft:15,marginTop:10}}>
                  <TouchableOpacity onPress={()=>Actions.pop()}>
                    <Image style={{width:25,height:25,tintColor:'#707B7C'}}
                      source={require('../Images/Digital__Design_99-512.png')} />
                  </TouchableOpacity>
                  {/* <TouchableOpacity>
                    <Text style={{fontSize:20,color:'#707B7C'}}>Skip</Text>
                  </TouchableOpacity> */}
                </View>
                <View style={styles.Text_Discription}>
                  <Text style={{color:'red'}}>{this.state.ErrorShow}</Text>
                  {/* <Text style={styles.Font_Text}>+919876543210</Text> */}
                </View>
                <Text style={{fontSize:16,marginLeft:50,marginTop:10}}>Email</Text>
                <View style={styles.Input_View}>
                  <TextInput style={styles.Font_Text}
                    placeholder='Enter Email'
                    keyboardType='email-address'
                    onChangeText={(text)=>this.setState({Email:text})} />
                </View>
                <View>
                  <TouchableOpacity style={styles.Login_Button} onPress={()=>this.ForgotPassword()} >
                    <Text style={{fontSize:16,color:'white',fontWeight:'600'}}>Next</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  Header_Text:{
    fontSize:25,
    fontWeight:'500',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:30,
    color:'#424949'
  },
  Text_Discription:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:80,
  },
  Font_Text:{
    fontSize:16,
    color:'#707B7C',
    marginLeft:20
  },
  Input_View:{
    width:'80%',
    height:50,
    alignSelf:'center',
    justifyContent:'center',
    borderRadius:10,
    backgroundColor:'white',
    marginTop:10,
  },
  Login_Button:{
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    width:'80%',
    height:50,
    borderRadius:20,
    backgroundColor:'#DC8A33',
    marginTop:20
  }
  
});
