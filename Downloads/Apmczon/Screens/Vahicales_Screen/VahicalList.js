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
        VehicleArray:[],
        UserID:''
    }
  }

  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let UserID = await AsyncStorage.getItem('UserID');  
      this.setState({UserID:UserID})
      this.GetVahicalDetails()
    }  
    catch(error){  
      alert(error)  
    }  
  }  
  componentDidMount(){
    this.displayData()
      //this.setState({TrangectionArry:[]})
      //this.GetVahicalDetails()
  }
  GetVahicalDetails(){
    let url= api.baseURL;
    fetch( url+'wb/vehicle_list', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       //'Content-Length': data.length 
       },
       body:JSON.stringify({user_id:this.state.UserID})
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("response Vehicle details: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
          this.setState({VehicleArray:responseData.data})
        }
        
        })
       .catch((err) => { console.log(err); });
  }
  render(){
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
       <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
            <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.drawerMenu()}>
                <Image style={{width:25,height:20}}
                    source={require('../../Images/Digital__Design_99-512.png')} />
            </TouchableOpacity>
            <View style={{alignItems:'center',width:'80%'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Vehicle List</Text>
            </View>
        </View>
        <ScrollView>
            <View style={{flex:1}}>
              <ScrollView horizontal={true} style={{width:'100%'}}>
                <View style={{width:'100%'}}>
                <View style={{flexDirection:'row',borderTopWidth:0.5,borderBottomWidth:0.5,marginTop:15}}>
                  <View style={{width:'5%'}}>
                     <Text style={styles.Header_Text}>#</Text>
                  </View>
                  <View style={{width:'15%',marginLeft:5,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Name</Text>
                  </View>
                  <View style={{width:'15%',marginLeft:5,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Vehicle Number</Text>
                  </View>
                  <View style={{width:'18%',marginLeft:5,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Vehicle Information</Text>
                  </View>
                  <View style={{width:'15%',marginLeft:5,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Added Date</Text>
                  </View>
                  <View style={{width:'15%',marginRight:5,alignItems:'center',marginRight:30}}>
                  <Text style={styles.Header_Text}>Action</Text>
                  </View>
                </View>
                <FlatList 
                    data={this.state.VehicleArray}
                    renderItem={({item,index})=>
                    <View style={{flexDirection:'row',marginTop:15}}>
                         <View style={{width:'5%',marginLeft:10}}>
                             <Text>{index+1}</Text>
                         </View>
                         <View style={{width:'15%',marginLeft:5,alignItems:'center'}}>
                            <Text>{item.name}</Text>
                         </View>
                         <View style={{width:'15%',marginLeft:5,alignItems:'center'}}>
                            <Text>{item.vehicle_no}</Text>
                         </View>
                         <View style={{width:'15%',marginLeft:5,alignItems:'center'}}>
                            <Text>{item.vehicle_info}</Text>
                         </View>
                         <View style={{width:'15%',marginLeft:5,alignItems:'center'}}>
                             <Text>{item.entry_date}</Text>
                         </View>
                         <TouchableOpacity style={{width:'10%',marginLeft:5,justifyContent:'center',backgroundColor:'green',borderRadius:4}} onPress={()=>{Storage.EditVahicleData = item.vehicle_id,Actions.EditVahical()}}>
                             <Image style={{width:20,height:20,alignSelf:'center'}}
                                source={require('../../Images/EditIconApmc.png')} />
                         </TouchableOpacity>
                    </View>} />
                </View>
                    </ScrollView>
                
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
  Font_Text:{
    fontSize:18,
    color:'#707B7C'
  },
  
});
