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
import Storage from './Config/Storage'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      OTP:'',
      mobile:'',
      ErrorShow:'',
      Resend_Otp:false
    }
  }
  ResendOTP(){
   
    
    let body = JSON.stringify({mobile:this.state.mobile})
    let url= api.baseURL;
      fetch( url+'wb/resend_otp', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: body
       }).then((response) => response.text())
         .then((responseData) =>
          { console.log("response: " + responseData);
          if(responseData.status == '201'){
            this.setState({ErrorShow:responseData.message})
          }
          else{
            this.setState({Resend_Otp:true})
            let that = this;
            setTimeout(function(){that.setState({Resend_Otp: false})}, 120000);
          }
          })
         .catch((err) => { console.log(err); });
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let user = await AsyncStorage.getItem('Mobile');  
      this.setState({mobile:user})
      //this.ResendOTP()
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  }  
  componentDidMount(){
    this.displayData()
  }
  OtpVerification(){
    if(this.state.OTP == ''){
      this.setState({ErrorShow:'Please Enter OTP'})
    }
    else{
      let body = JSON.stringify({mobile:this.state.mobile,otp:this.state.OTP})
      let url= api.baseURL;
      fetch( url+'wb/verify_otp', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: body
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Verify_Otp: " + JSON.stringify(responseData));
          if(responseData.status == '201'){
            this.setState({ErrorShow:responseData.message})
          }
          else{
            Storage.UserId = responseData.data[0].user_id
            Actions.AddPartner()
          }
          })
         .catch((err) => { console.log(err); });
      //Actions.Login()
    }
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
                <View>
                  <Text style={styles.Header_Text}>OTP</Text>
                </View>
                <View style={styles.Text_Discription}>
                  <Text style={styles.Font_Text}>Enter the 6-digit verification code sent to</Text>
                  <Text style={styles.Font_Text}>{this.state.mobile}</Text>
                </View>
                <Text style={{fontSize:16,alignSelf:'center',marginTop:20,color:'red'}}>{this.state.ErrorShow}</Text>
                <View style={styles.Input_View}>
                  <TextInput style={styles.Font_Text}
                    placeholder='Enter OTP'
                    keyboardType='numeric'
                    onChangeText={(text)=>this.setState({OTP:text})} />
                </View>
                <View>
                  <TouchableOpacity style={styles.Login_Button} onPress={()=>this.OtpVerification()} >
                    <Text style={{fontSize:16,color:'white',fontWeight:'600'}}>Next</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop:70,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                  {this.state.Resend_Otp ==true?
                  <Text style={{fontSize:16,color:'red'}}>OTP Send On your Mobile No</Text>
                  :<TouchableOpacity style={{borderBottomColor:'#DC8A33',borderBottomWidth:1}} onPress={()=>this.ResendOTP()}>
                      <Text style={{fontSize:16,color:'#DC8A33'}}>Resend OTP</Text>
                   </TouchableOpacity>}
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
    alignSelf:'center',
    alignItems:'center',
    marginTop:120,
  },
  Font_Text:{
    fontSize:16,
    color:'#707B7C'
  },
  Input_View:{
    width:'80%',
    height:50,
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'center',
    borderRadius:20,
    backgroundColor:'white',
    marginTop:25,
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
