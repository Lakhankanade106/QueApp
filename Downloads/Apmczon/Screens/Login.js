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
  NativeModules,
  BackHandler,
  ActivityIndicator
  //AsyncStorageStatic
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Geolocation from '@react-native-community/geolocation';
import api from '../Screens/Config/api'
import Storage from '../Screens/Config/Storage'
//import DeviceInfo, { getDeviceToken } from 'react-native-device-info';
//import DeviceId from "react-native-device-id";

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      LoginType:1,
      Email:'',
      Password:'',
      ErrorShow:'',
      Activity:false
    }
  }
  // getdeviceId (){
  //   //var uniqueId = DeviceId.getUniqueId();
  //   //var uniqueId = DeviceInfo.getAndroidId()
  //  // var uniqueId = DeviceInfo.getUniqueId()
  //   //console.log('device id',uniqueId)
  //   console.log(NativeModules.PlatformConstants)
  //   console.log(NativeModules.PlatformConstants.fingerprint)
  // };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    const options = { provider: "gps" || "network" };
   const position = Geolocation.getCurrentPosition({ provider: "network" });
     console.log('postion',position) ;
  
  
    // navigator.geolocation.getCurrentPosition(
		// 	position => {
		// 		const location = JSON.stringify(position);

		// 		this.setState({ location });
		// 	},
		// 	error => Alert.alert(error.message),
		// 	{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		// );
    // this.watchID = navigator.geolocation.watchPosition(
    //   position => {
    //     const { coordinate, routeCoordinates, distanceTravelled } =   this.state;
    //     const { latitude, longitude } = position.coords;
        
    //     const newCoordinate = {
    //       latitude,
    //       longitude
    //     };
    //     if (Platform.OS === "android") {
    //       if (this.marker) {
    //         this.marker._component.animateMarkerToCoordinate(
    //           newCoordinate,
    //           500
    //         );
    //        }
    //      } else {
    //        coordinate.timing(newCoordinate).start();
    //      }
    //      this.setState({
    //        latitude,
    //        longitude,
    //        routeCoordinates: routeCoordinates.concat([newCoordinate]),
    //        distanceTravelled:
    //        distanceTravelled + this.calcDistance(newCoordinate),
    //        prevLatLng: newCoordinate
    //      });
    //    },
    //    error => console.log(error),
    //    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );
  }
  BackHandlerFun(){
    Alert.alert("Hold on!", "Are you sure you want to Exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  LoginAPIProcesss(){
    console.log('api data',api.baseURL)
    this.setState({ErrorShow:''})
    this.setState({Activity:true})
    let body = JSON.stringify({email_mobile:this.state.Email,password:this.state.Password,device_id:'123456'})
    let url= api.baseURL;
      fetch( url+'wb/login', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: body
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Login: " + JSON.stringify(responseData));
         // AsyncStorage.setItem('UserID',responseData.data.id);
         this.setState({Activity:false})
         if(responseData.status == '201'){
          this.setState({ErrorShow:responseData.message})
          }
          if (responseData.status=='201'&& responseData.data.mobile !=null){
            //AsyncStorage.setItem('UserID',responseData.data.id);
            AsyncStorage.setItem('Mobile',responseData.data.mobile)
            Actions.OTP()
          }
          
          else {
            console.log(responseData.data.step)
            Storage.userType = responseData.data.user_type
            AsyncStorage.setItem('is_driver',responseData.driver[0].is_driver);
            Storage.company_logo = responseData.data.company_logo
            if(responseData.data.step=='1'){
              Storage.UserId = responseData.data.id
              Actions.AddPartner()
              // if(responseData.driver[0].is_driver ==1){
              //   console.log('if condition chali')
              //   Actions.drawerMenu()
                
              // }
              // else{
              //   console.log('Else condtion  chali ')
              // //  AsyncStorage.setItem('UserID',responseData.data.id);
              //   Actions.AddPartner()
              // }
              
            }
            else if(responseData.data.step=='2' && responseData.driver[0].is_driver ==1){
              
                AsyncStorage.setItem('UserID',responseData.data.id);
                Actions.drawerMenu()
              
            }
            else{
              if(responseData.data.user_type == '3')
              {
                  AsyncStorage.setItem('UserID',responseData.data.id);
                  AsyncStorage.setItem('user','Shop');
                  Actions.drawerMenu()
                
              }
             else if(responseData.data.user_type == '4')
              {
                  AsyncStorage.setItem('UserID',responseData.data.id);
                  AsyncStorage.setItem('user','Broker');
                  Actions.drawerMenu()
               
              }
              else if(responseData.data.user_type == '5')
              {
                  AsyncStorage.setItem('UserID',responseData.data.id);
                  AsyncStorage.setItem('user','Transpoter');
                  Actions.drawerMenu()
              }
              else if(responseData.data.user_type == '6')
              {
                  AsyncStorage.setItem('UserID',responseData.data.id);
                  AsyncStorage.setItem('user','Vender');
                  Actions.drawerMenu()
              }
             // Actions.drawerMenu()
            }
          }
          })
         .catch((err) => { console.log(err); });
  }
  LoginProsess(){
    console.log('Email',this.state.Email)
    console.log("Password",this.state.Password)
    if(this.state.Email ==''&& this.state.Password ==''){
      this.setState({ErrorShow:'Please Enter Your Id Password'})
    }
    else{
      // if(this.state.Email =='9098343935'&& this.state.Password =='123456'){
      //   AsyncStorage.setItem('user','Vender');  
      //   Actions.drawerMenu()
      // }
      // else if(this.state.Email == '1234567891'&& this.state.Password =='123456'){
      //   AsyncStorage.setItem('user','Transpoter');  
      //   Actions.drawerMenu()
      // }
      // else if(this.state.Email =='1234567893'&& this.state.Password =='123456'){
      //   AsyncStorage.setItem('user','Broker');  
      //   Actions.drawerMenu()
      // }
      // else if(this.state.Email =='1234567892'&& this.state.Password =='123456'){
      //   AsyncStorage.setItem('user','Shop');  
      //   Actions.drawerMenu()
      //}
      // else{
      //   this.setState({ErrorShow:'Please check the Email Id and Password'})
      // }
      this.LoginAPIProcesss()
    }
    
  }
  
  render(){
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <ScrollView>
            <View style={{flex:1}}>
                {/* <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:15,marginLeft:15,marginTop:10}}>
                  <TouchableOpacity>
                    <Image style={{width:25,height:25,tintColor:'#707B7C'}}
                      source={require('../Images/Digital__Design_99-512.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={{fontSize:20,color:'#707B7C'}}>Skip</Text>
                  </TouchableOpacity>
                </View> */}
                <View style={{marginTop:20}}>
                  <Text style={styles.Header_Text}>Login</Text>
                </View>
                <View style={styles.Text_Discription}>
                  <Text style={styles.Font_Text}>We are Happy to Have you on APMCZON</Text>
                  <Text style={styles.Font_Text}>please login here</Text>
                </View>
                <Text style={{fontSize:13,color:'red',alignSelf:'center',marginTop:20}}>{this.state.ErrorShow}</Text>
                <View style={{flexDirection:'row',marginTop:30,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                  <TouchableOpacity style={{justifyContent:'center',alignItems:'center',alignSelf:'center',borderBottomWidth:1,borderColor:this.state.LoginType==1? '#DC8A33':'#707B7C'}} onPress={()=>this.setState({LoginType:1})} >
                    <Text style={{fontSize:16,fontWeight:'500',padding:10,marginLeft:18,marginRight:18,color:this.state.LoginType==1? '#DC8A33':'#707B7C'}}>Mobile No</Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={{justifyContent:'center',alignItems:'center',alignSelf:'center',borderBottomWidth:1,borderColor:this.state.LoginType==2? '#DC8A33':'#707B7C'}} onPress={()=>this.setState({LoginType:2})} >
                    <Text style={{fontSize:16,fontWeight:'500',padding:10,marginLeft:18,marginRight:18,color:this.state.LoginType==2? '#DC8A33':'#707B7C'}}>Email Address</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Input_View}>
                  <TextInput style={styles.Font_Text}
                    placeholder={this.state.LoginType==1? 'Phone Number':'Email....'}
                    keyboardType={this.state.LoginType==1? 'numeric':''}
                    //keyboardType='email-address'
                    onChangeText={(text)=>this.setState({Email:text})} />
                </View>
                <View style={styles.Input_View}>
                  <TextInput style={styles.Font_Text}
                    //placeholder='Username, Email, Phone Number'
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={(text)=>this.setState({Password:text})} />
                </View>
                {this.state.Activity?
                <ActivityIndicator style={{marginTop:5}} size="large" color="#00ff00" />:null}
                <View>
                  <TouchableOpacity disabled={this.state.Activity} style={styles.Login_Button} onPress={()=>this.LoginProsess()} >
                    <Text style={{fontSize:16,color:'white',fontWeight:'600'}}>Login</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:30,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                  <Text style={styles.Font_Text}>Don't have an account?</Text>
                  <TouchableOpacity disabled={this.state.Activity} style={{marginLeft:5}} onPress={()=>Actions.Registration()}>
                    <Text style={{fontSize:16,color:'#DC8A33'}}>Signup</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop:50,justifyContent:'center',alignItems:'center',alignSelf:'center',borderBottomColor:'#229954',borderBottomWidth:1}}>
                  <TouchableOpacity disabled={this.state.Activity} onPress={()=>Actions.ForgotPass()}>
                    <Text style={{fontSize:16,color:'#229954'}}>Forgot Password?</Text>
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
    alignSelf:'center',
    alignItems:'center',
    marginTop:80,
  },
  Font_Text:{
    fontSize:16,
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
    height:45,
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'center',
    borderRadius:18,
    backgroundColor:'white',
    marginTop:20,
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
