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
  AsyncStorage,
  Linking
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from './Config/api'


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      First:'',
      Last:'',
      EmailId:'',
      MobilNo:'',
      Password:'',
      ConfirmPass:'',
      ErrorShow:'',
      TermCond:true,
      //Term_Read:true
    }
  }

  
  SubmitProcess(){
    this.setState({ErrorShow:''})
    const First = this.state.First;
    const Last = this.state.Last;
    const EmailId = this.state.EmailId;
    const MobilNo = this.state.MobilNo;
    const Password = this.state.Password;
    const ConfirmPass = this.state.ConfirmPass;
    if(First == ''&& Last==''&& EmailId ==''&& MobilNo ==''&& Password ==''&& ConfirmPass =='' ){
      console.log('if condition chali')
      this.setState({ErrorShow:'Please file all Filed'})
    }
    else{
      AsyncStorage.setItem('Mobile',MobilNo);
     if(Password == ConfirmPass){
      let body = JSON.stringify({firstname: First,
       // lastname: Last,
        email:EmailId,
        mobile:MobilNo,
        password:Password,
        confirm_password:ConfirmPass
         })
         let url= api.baseURL;
      fetch( url+'wb/register', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: body
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Register : " + JSON.stringify(responseData));
          if(responseData.status == '201'){
            this.setState({ErrorShow:responseData.message})
          }
          else{
            AsyncStorage.setItem('Mobile',MobilNo);
            Actions.OTP()
          }
          })
         .catch((err) => { console.log(err); }); 
      //Actions.OTP()
     }
      else{
        this.setState({ErrorShow:'Please check Confirm Password'})
      }
    }
    
  }
  Term_Condition_Form(){
    console.log('function calll')
    const Form = Linking.openURL("https://apmczon.in/privacy_policy/user_terms_condition")
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
                  <Text style={styles.Header_Text}>Registration</Text>
                </View>
                <View style={styles.Text_Discription}>
                  <Text style={styles.Font_Text}>Fill this information and Be a part of us</Text>
                </View>
                <Text style={{fontSize:16,color:'red',alignSelf:'center'}}>{this.state.ErrorShow}</Text>
                <View style={styles.Input_View}>
                  <TextInput style={{color:'#424949',fontSize:14,marginLeft:10,marginRight:10}}
                    placeholder='Full Name'
                    onChangeText={(text)=>this.setState({First:text})} />
                </View>
                {/* <View style={styles.Input_View}>
                  <TextInput style={{color:'#424949',fontSize:14,marginLeft:10,marginRight:10}}
                    placeholder='Last Name'
                    onChangeText={(text)=>this.setState({Last:text})} />
                </View> */}
                <View style={styles.Input_View}>
                  <TextInput style={{color:'#424949',fontSize:14,marginLeft:10,marginRight:10}}
                    placeholder='Email'
                    autoCapitalize={'none'}
                    onChangeText={(text)=>this.setState({EmailId:text})} />
                </View>
                <View style={styles.Input_View}>
                  <TextInput style={{color:'#424949',fontSize:14,marginLeft:10,marginRight:10}}
                    placeholder='Mobile'
                    keyboardType='numeric'
                    maxLength={12}
                    onChangeText={(text)=>this.setState({MobilNo:text})} />
                </View>
                <View style={styles.Input_View}>
                  <TextInput style={{color:'#424949',fontSize:14,marginLeft:10,marginRight:10}}
                    placeholder='Password'
                    autoCapitalize={'none'}
                    onChangeText={(text)=>this.setState({Password:text})} />
                </View>
                <View style={styles.Input_View}>
                  <TextInput style={{color:'#424949',fontSize:14,marginLeft:10,marginRight:10}}
                    placeholder='Confirm Password'
                    autoCapitalize={'none'}
                    onChangeText={(text)=>this.setState({ConfirmPass:text})} />
                </View>
                <TouchableOpacity style={{marginTop:20}} onPress={()=>{this.Term_Condition_Form()}}>
                    <Text style={{alignSelf:'center',color:'green',fontWeight:'600',fontSize:14}}> Read Term and Condition</Text>
                 </TouchableOpacity>
                <View style={{width:'80%',alignSelf:'center',marginTop:20,flexDirection:'row'}}>
                  <TouchableOpacity  style={{borderWidth:1,borderRadius:3,justifyContent:'center',alignItems:'center',height:22,width:22}}
                    onPress={()=>this.setState({TermCond:!this.state.TermCond})}  >
                    {this.state.TermCond == false?
                    <Image style={{width:15,height:15}} source={require('../Images/Right_Vector.png')}  />
                    :null}
                  </TouchableOpacity>
                 <Text style={{marginLeft:20,fontWeight:'600',fontSize:16}}> I Agree Over Term and Condition</Text>
                </View>
                <View>
                  <TouchableOpacity disabled={this.state.TermCond} style={styles.Login_Button} onPress={()=>this.SubmitProcess()}  >
                    <Text style={{fontSize:16,color:'white',fontWeight:'600'}}>Submit</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop:30,flexDirection:'row',justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                  <Text style={styles.Font_Text}>All ready have a account ? </Text>
                  <TouchableOpacity onPress={()=>Actions.Login()} >
                    <Text style={{fontSize:16,color:'#DC8A33'}}>Login</Text>
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
    marginTop:35,
    color:'#424949'
  },
  Text_Discription:{
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    marginTop:30,
    marginBottom:30
  },
  Font_Text:{
    fontSize:16,
    color:'#707B7C'
  },
  Input_View:{
    width:'80%',
    height:45,
    //alignItems:'center',
    alignSelf:'center',
    justifyContent:'center',
    borderRadius:15,
    backgroundColor:'white',
    marginTop:15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5
    },
    shadowRadius: 5,
    shadowOpacity: 0.2
  },
  Login_Button:{
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    width:'80%',
    height:50,
    borderRadius:18,
    backgroundColor:'#DC8A33',
    marginTop:20
  }
  
});
