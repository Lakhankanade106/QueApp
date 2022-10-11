/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';
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
  FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from '../Config/api'
import Storage from '../Config/Storage'

export default class App extends Component {
  constructor(props){
    super(props)
    this.state={
        VenderArry:[],
        ProductArry:[],
        SelVender:'Select Vendor',
        SelProduct:'Select Product',
        UserID:'',
        VahicleName:'',
        VahiclNum:'',
        VahiInformation:'',
        ErrorShow:'',
        vehicle_id:''
    }
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
     // let user = await AsyncStorage.getItem('user');  
      let UserID = await AsyncStorage.getItem('UserID');
      this.setState({UserID:UserID}) 
      this.getVahicleDataApi();
    }  
    catch(error){  
      alert(error)  
    }  
  } 
  componentDidMount(){
      this.displayData();
      
    //console.log('vehicle detailss',this.props)
  }
  getVahicleDataApi(){
    console.log('get api call',Storage.EditVahicleData)
    let url= api.baseURL;
    fetch( url+'wb/vehicle_list_by_id', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       //'Content-Type': 'multipart/form-data'
       //'Content-Length': data.length 
       },
       body:JSON.stringify({vehicle_id:Storage.EditVahicleData})
     //body:'vehicle_id'=Storage.EditVahicleData
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("response: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
             this.setState({VahicleName:responseData.data[0].name})
             this.setState({VahiclNum:responseData.data[0].vehicle_no})
             this.setState({VahiInformation:responseData.data[0].vehicle_info})
             this.setState({vehicle_id:Storage.EditVahicleData.vehicle_id})
             //Storage.EditVahicleData =''
           // alert('Vahicle Add Successful')
           // Actions.VahicalList()
        }
        else{
          this.setState({ErrorShow:responseData.message})
        }
        
        })
       .catch((err) => { console.log(err); });
  }
  EditVecaleDetialProps(){
    let url= api.baseURL;
    fetch( url+'wb/edit_vehicle', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       //'Content-Length': data.length 
       },
       body:JSON.stringify({vehicle_id:Storage.EditVahicleData,name:this.state.VahicleName,vehicle_no:this.state.VahiclNum,vehicle_info:this.state.VahiInformation})
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("response: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
           // alert('Vahicle Add Successful')
            Actions.VahicalList()
        }
        else{
          this.setState({ErrorShow:responseData.message})
        }
        
        })
       .catch((err) => { console.log(err); });
  }
  getSnapshotBeforeUpdate(){
      if(Storage.EditVahicleData != ''){
       // this.componentDidMount();
        
      }
    //this.getVahicleDataApi()  
  }
  
  render(){
     // if(Storage.EditVahicleData){}
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
      <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
            <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.pop()}>
                <Image style={{width:25,height:20}}
                    source={require('../../Images/Digital__Design_99-512.png')} />
            </TouchableOpacity>
            <View style={{alignItems:'center',width:'80%'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Edit Vehicle Details</Text>
            </View>
        </View>
        <ScrollView>
            <View style={{flex:1,marginLeft:20}}>
                <View style={{marginTop:20}}>
                  {this.state.ErrorShow ==''?
                  <Text style={{fontSize:14,fontWeight:'600',color:'red',alignSelf:'center'}}>{this.state.ErrorShow}</Text>
                  :null}
                    <Text style={styles.Header_Text}>Name</Text>
                    <TextInput style={styles.InputView}
                        placeholder='Name'
                        defaultValue={this.state.VahicleName}
                        onChangeText={(text)=>this.setState({VahicleName:text})} />
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>vahicle Number</Text>
                    <TextInput style={styles.InputView}
                        placeholder='Vahicle Number'
                        defaultValue={this.state.VahiclNum}
                        onChangeText={(text)=>this.setState({VahiclNum:text})} />
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>vahicle Information</Text>
                    <TextInput style={styles.NotesView}
                        placeholder='Vahicle Number'
                        defaultValue={this.state.VahiInformation}
                        multiline={true}
                        onChangeText={(text)=>this.setState({VahiInformation:text})} />
                </View>
                <TouchableOpacity style={styles.AddButton} onPress={()=>this.EditVecaleDetialProps()} >
                   <Text style={{fontSize:16,fontWeight:'600',color:'white'}}>Edit</Text>
               </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  Header_Text:{
    fontSize:17,
    fontWeight:'500',
    color:'#424949',
    marginLeft:10
  },
  Font_Text:{
    fontSize:15,
    color:'#707B7C',
    marginLeft:20
  },
  InputView:{
      fontSize:15,
      marginTop:10,
      width:'90%',
      height:45,
      alignItems:'center',
      backgroundColor:'white',
      padding:10,
      borderRadius:10
  },
  NotesView:{
      width:'90%',
      height:80,
      backgroundColor:'white',
      borderRadius:10,
      marginTop:5,
      paddingLeft:10
  },
  AddButton:{
      width:'40%',
      height:50,
      backgroundColor:'green',
      marginTop:20,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:10
  }
});
