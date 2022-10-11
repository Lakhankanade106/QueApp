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
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from '../Config/api'
import Storage from '../Config/Storage'
import DatePicker from 'react-native-datepicker'
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
       // TrangectionArry:[],
        Fname:'',
        Lname:'',
        Email:'',
        MobilNo:'',
        Password:'',
        ConPassword:'',
        Address:'',
        City:'',
        States:'',
        CompanyName:'',
        UserID:'',
        ErrorShow:'',
        GenderArray:[],
        Gender:'Please select gender',
        date:"2016-05-15",
        Activity:false
    }
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let user = await AsyncStorage.getItem('user');  
      let UserID = await AsyncStorage.getItem('UserID');  
      //console.log('useriddddd',UserID)
      
      this.setState({UserID:UserID})
      
      //console.log('user',user)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  }  
  componentDidMount(){
    this.displayData()
  }
  SubmitProcess(){
    this.setState({Activity:true})
    this.setState({ErrorShow:''})
    let url= api.baseURL;
      fetch( url+'wb/add_staff', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID,
          firstname:this.state.Fname,
          lastname:this.state.Lname,
          email:this.state.Email,
          mobile:this.state.MobilNo,
          password:this.state.Password,
          confirm_password:this.state.ConPassword,
         // gender:this.state.Gender,
         // dob:this.state.date,
          address:this.state.Address,
          city:this.state.City,
          state:this.state.States,
          company_name:this.state.CompanyName
        })
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss addd: " + JSON.stringify(responseData));
          this.setState({Activity:false})
          if(responseData.status=='200'){
            Actions.StaffList()
          }
          else{
            this.setState({ErrorShow:responseData.message})
          }
          })
         .catch((err) => { console.log(err); });
  }
  GenderFun(){
   const genderData=[{
     title:'Male',
     id:1
   },{
     title:'Female',
     id:2
   },
  {
    title:'Other',
    id:3
  }]
  this.setState({GenderArray:genderData})
  }
  SelectGenderFun(item){
    console.log(item)
    this.setState({Gender:item.title})
    this.setState({GenderArray:[]})
  }
  render(){
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
      <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
            <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.pop()}>
                <Image style={{width:25,height:20}}
                    source={require('../../Images/Digital__Design_99-512.png')} />
            </TouchableOpacity>
            <View style={{alignItems:'center',width:'80%'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Add Staff Details</Text>
            </View>
        </View>
        <ScrollView>
            <View style={{flex:1,marginLeft:20,marginTop:20}}>
              <View>
                 <Text style={styles.Header_Text}>First Name</Text>
                 <TextInput style={styles.InputView}
                    placeholder='First Name'
                    onChangeText={(text)=>this.setState({Fname:text})}  />
              </View>
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Last Name</Text>
                 <TextInput style={styles.InputView}
                    placeholder='Last Name'
                    onChangeText={(text)=>this.setState({Lname:text})}  />
              </View>
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Email</Text>
                 <TextInput style={styles.InputView}
                    placeholder='Email'
                    autoCapitalize={false}
                    onChangeText={(text)=>this.setState({Email:text})}  />
              </View>
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Mobile</Text>
                 <TextInput style={styles.InputView}
                    placeholder='Telephone'
                    onChangeText={(text)=>this.setState({MobilNo:text})}  />
              </View>
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Address</Text>
                 <TextInput style={styles.InputView}
                    placeholder='Address...'
                    onChangeText={(text)=>this.setState({Address:text})}  />
              </View>
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>City</Text>
                 <TextInput style={styles.InputView}
                    placeholder='City....'
                    onChangeText={(text)=>this.setState({City:text})}  />
              </View>
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>State</Text>
                 <TextInput style={styles.InputView}
                    placeholder='State....'
                    onChangeText={(text)=>this.setState({States:text})}  />
              </View>
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Company Name</Text>
                 <TextInput style={styles.InputView}
                    placeholder='Company Name.....'
                    onChangeText={(text)=>this.setState({CompanyName:text})}  />
              </View>
              {/* <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Gender</Text>
                 <TouchableOpacity style={[styles.InputView,{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}]}
                    onPress={()=>this.GenderFun()} >
                   <Text>{this.state.Gender}</Text>
                   <Image style={{width:12,height:10}}
                      source={require('../Menu_images/Drop_Down-512.png')}
                   />
                 </TouchableOpacity>
                 <FlatList
                     data={this.state.GenderArray}
                     renderItem={({item})=>
                    <View>
                      <TouchableOpacity style={{width:'85%',height:30,justifyContent:'center',alignItems:'center',backgroundColor:'white',marginTop:5}}
                        onPress={()=>this.SelectGenderFun(item)}  >
                        <Text>{item.title}</Text>
                      </TouchableOpacity>
                    </View>
                    }
                 />
              </View> */}
              {/* <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Date of Birth</Text> */}
                 {/* <TouchableOpacity style={[styles.InputView,{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}]}
                    onPress={()=>this.GenderFun()} >
                   <Text>{this.state.Gender}</Text>
                   <Image style={{width:12,height:10}}
                      source={require('../Menu_images/Drop_Down-512.png')}
                   />
                 </TouchableOpacity> */}
                 {/* <DatePicker
                    style={{width: '85%',marginTop:5}}
                    date={this.state.date}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    //minDate="2016-05-01"
                    //maxDate="2016-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                   // ... You can check the source to find the other keys.
                 }}
                 onDateChange={(date) => {this.setState({date: date})}}
               /> */}
              {/* </View> */}
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Password</Text>
                 <TextInput style={styles.InputView}
                    placeholder='Password'
                    //keyboardType={'email-address'}
                    autoCapitalize={false}
                    onChangeText={(text)=>this.setState({Password:text})}  />
              </View>
              <View style={styles.ViewStyle}>
                 <Text style={styles.Header_Text}>Confirm Pasword</Text>
                 <TextInput style={styles.InputView}
                    placeholder='Confirm Password'
                    autoCapitalize={false}
                    onChangeText={(text)=>this.setState({ConPassword:text})}  />
              </View>
              
              {this.state.Activity?
              <View style={{marginTop:10}}>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
              :null}
              <Text style={{justifyContent:'center',color:'red',marginTop:5,fontSize:14,fontWeight:'700',alignSelf:'center'}}>{this.state.ErrorShow}</Text>
              <TouchableOpacity style={styles.ButtonView} onPress={()=>this.SubmitProcess()}>
                <Text style={{fontSize:15,color:'white',fontWeight:'600'}}>Submit</Text>
              </TouchableOpacity>
              
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
    color:'#424949'
  },
  InputView:{
    width:'85%',
    height:40,
    backgroundColor:'white',
    marginTop:10,
    borderRadius:10,
    padding:10,
    fontSize:14,
  },
  ViewStyle:{
    marginTop:15
  },
  ButtonView:{
    width:'35%',
    height:40,
    backgroundColor:'green',
    marginTop:12,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10
  }  
});
