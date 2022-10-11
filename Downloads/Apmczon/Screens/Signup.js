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
  TextInput
} from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux'



export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
    }
  }
  SignupProcess(){
    fetch('http://localhost/apmczon/wb/register', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue'
  })
});
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
                  <TouchableOpacity>
                    <Text style={{fontSize:20,color:'#707B7C'}}>Skip</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.Header_Text}>Signup</Text>
                </View>
                <View style={styles.Logo_View}>
                  <Image style={{width:200,height:105}} resizeMode='center'
                    source={require('../Images/Logo.png')} />
                  <Text style={{fontSize:16,color:'#DC8A33'}}>UPLIFTING  THE  LOCALS</Text>
                </View>
                <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:25}}>
                    <Text style={{fontSize:22,color:'#707B7C'}}>Create an Account</Text>
                </View>
                <View style={{flexDirection:'row',marginTop:50,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                  <TouchableOpacity style={{justifyContent:'center',alignItems:'center',alignSelf:'center',borderBottomWidth:1,borderColor:this.state.LoginType==1? '#DC8A33':'#707B7C'}} onPress={()=>this.setState({LoginType:1})} >
                    <Text style={{fontSize:18,fontWeight:'500',padding:10,marginLeft:18,marginRight:18,color:this.state.LoginType==1? '#DC8A33':'#707B7C'}}>Mobile No</Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={{justifyContent:'center',alignItems:'center',alignSelf:'center',borderBottomWidth:1,borderColor:this.state.LoginType==2? '#DC8A33':'#707B7C'}} onPress={()=>this.setState({LoginType:2})} >
                    <Text style={{fontSize:18,fontWeight:'500',padding:10,marginLeft:18,marginRight:18,color:this.state.LoginType==2? '#DC8A33':'#707B7C'}}>Email Address</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Input_View}>
                  <TextInput style={styles.Font_Text}
                    placeholder={this.state.LoginType==1? 'Phone Number':'Email.....'}
                    onChangeText={()=>this.setState({})} />
                </View>
                <View>
                  <TouchableOpacity style={styles.Login_Button} onPress={()=>SignupProcess()}>
                    <Text style={{fontSize:25,color:'white'}}>Submit</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:30,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                  <Text style={styles.Font_Text}>Already have an account?</Text>
                  <TouchableOpacity style={{marginLeft:5}} onPress={()=>Actions.Login()} >
                    <Text style={{fontSize:18,color:'#DC8A33'}}>Signin here</Text>
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
    fontSize:30,
    fontWeight:'500',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:30,
    color:'#424949'
  },
  Logo_View:{
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    marginTop:80,
  },
  Font_Text:{
    fontSize:18,
    color:'#707B7C'
  },
  // Button_View:{
  //   justifyContent:'center',
  //   alignItems:'center',
  //   alignSelf:'center',
  //   borderBottomWidth:1
  // },
  Input_View:{
    width:'80%',
    height:60,
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'center',
    borderRadius:30,
    backgroundColor:'white',
    marginTop:30,
  },
  Login_Button:{
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    width:'80%',
    height:60,
    borderRadius:30,
    backgroundColor:'#DC8A33',
    marginTop:20
  }
  
});
