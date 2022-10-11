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
import Geolocation from '@react-native-community/geolocation';

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
        TrangectionArry:[],
        UserID:'',
        ErrorShow:''
    }
  }
  componentDidMount(){
      this.displayData()
      
      
  }
  displayData = async ()=>{  
  //  console.log('chalaaa')
    try{  
      let user = await AsyncStorage.getItem('user');  
      let UserID = await AsyncStorage.getItem('UserID'); 
      let is_driver = await AsyncStorage.getItem('is_driver')  
      console.log('useriddddd',UserID)
      // if(is_driver ==1){
      //   this.Tracking()
      // }
      this.setState({UserID:UserID})
      this.MyOderGetData()
      
      //console.log('user',user)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  }  
  MyOderGetData(){
    let url= api.baseURL;
      fetch( url+'wb/my_orders_list', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            this.setState({TrangectionArry:responseData.data})
          }
          })
         .catch((err) => { console.log(err); });
  }
  // FunctionCall(){
  //   console.log('function Call')
  //   let url= api.baseURL;
  //   fetch( url+'wb/my_orders_list', {
  //      method: 'POST',
  //      headers: { 
  //      'Accept': 'application/json', 
  //      'Content-Type': 'application/json',
  //      //'Content-Length': data.length 
  //      },
  //      body:JSON.stringify({user_id:this.state.UserID})
  //    }).then((response) => response.json())
  //      .then((responseData) =>
  //       { console.log("responsessss: " + JSON.stringify(responseData));
  //       if(responseData.status=='200'){
  //        // this.setState({TrangectionArry:responseData.data})
  //       }
        
  //       })
  //      .catch((err) => { console.log(err); });
  // }
  // findCoordinates = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //      // console.log('postitionss ',position);
  //       // this.state.coordinate.latitude = position.coords.latitude;
  //       // this.state.coordinate.longitude = position.coords.longitude;
  //       // this.setState({coordinate:this.state.coordinate})
  //      //this.setState({latitude:position.coords.latitude,longitude: position.coords.longitude,})
  //      // this.setState({latitude:currentLatitude})
  //      let url= api.baseURL;
  //   fetch( url+'wb/add_driver_latlong', {
  //      method: 'POST',
  //      headers: { 
  //      'Accept': 'application/json', 
  //      'Content-Type': 'application/json',
  //      //'Content-Length': data.length 
  //      },
  //      body:JSON.stringify({driver_id:this.state.UserID,current_lat:position.coords.latitude,current_long:position.coords.longitude})
  //    }).then((response) => response.json())
  //      .then((responseData) =>
  //       { console.log("responsessss: " + JSON.stringify(responseData));
  //       if(responseData.status=='200'){
  //        // this.setState({TrangectionArry:responseData.data})
  //       // this.componentDidMount()
  //       this.Tracking()
  //       }
        
  //       })
  //      .catch((err) => { console.log(err); });
  //     },
  
      
  //     error => console.log(error),
  //    // { enableHighAccuracy: true, timeout: 20000 }
      
  //   );}
  // Tracking(){
  //   const that =this
  //   setTimeout(() => {that.findCoordinates()}, 100000)
  // }

  Track_Order_lat_long_Api(item){
    let url= api.baseURL;
    fetch( url+'wb/tracking_order_latlong', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       //'Content-Length': data.length 
       },
       body:JSON.stringify({order_no:item.order_no})
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("Track Order Lat Long api: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
         // this.setState({driver_id:responseData.data[0].driver_id})
          //this.get_Driver_lat_Long_Api(responseData.data[0].driver_id)
          this.props.navigation.navigate('map',{Openmap:'TrackLocation',driver_id:responseData.data[0].driver_id,SendData:responseData.data})
         // this.setState({TrangectionArry:responseData.data})
        }
        else{
          alert(responseData.message)
          //this.setState({ErrorShow:responseData.message})
        }
        })
       .catch((err) => { console.log(err); });
   }

  render(){
   // console.log
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6',width:'100%'}}>
        {/* <ScrollView showsVerticalScrollIndicator={false} style={{flex:1,height:'100%'}}> */}
            <View style={{flex:1,width:'100%'}}>
              <ScrollView horizontal={true} style={{flex:1,width:'100%'}}>
                <View style={{width:'100%',flex:1}}>
                  <View style={{flexDirection:'row',borderTopWidth:0.5,borderBottomWidth:0.5,marginTop:10}}>
                    <View style={{width:20,}}>
                      <Text style={styles.Header_Text}>#</Text>
                    </View>
                    <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>Order Number</Text>
                    </View>
                    <View style={{width:60,marginLeft:5,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>Order Amount</Text>
                    </View>
                    <View style={{width:60,marginLeft:5,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>Order Date</Text>
                    </View>
                    <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>Vender</Text>
                    </View>
                    <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>Broker</Text>
                    </View>
                    <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>Transport</Text>
                    </View>
                  <View style={{width:60,marginRight:5,alignItems:'center',marginRight:30}}>
                  <Text style={styles.Header_Text}>Action</Text>
                  </View>
                </View>
                <FlatList style={{flex:1,marginTop:10}}
                    data={this.state.TrangectionArry}
                    renderItem={({item,index})=>
                    <View style={{flexDirection:'row',alignItems:'center',borderBottomWidth:1}}>
                         <View style={{width:20,marginLeft:10}}>
                             <Text>{index+1}</Text>
                         </View>
                         <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                            <Text>{item.order_no}</Text>
                         </View>
                         <View style={{width:60,marginLeft:5,alignItems:'center'}}>
                            <Text>{item.amount}</Text>
                         </View>
                         <View style={{width:60,marginLeft:5,alignItems:'center'}}>
                            <Text>{item.entry_date}</Text>
                         </View>
                         <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                         <TouchableOpacity style={{borderBottomWidth:1,borderColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.vendor_id,Actions.Profile()}}>
                            <Text style={{color:'green'}}>{item.vendor}</Text>
                         </TouchableOpacity>
                         </View>
                         <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                            <TouchableOpacity style={{borderBottomWidth:1,borderColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.brokers_id,Actions.Profile()}}>
                              <Text style={{color:'green'}}>{item.brokers}</Text>
                            </TouchableOpacity>
                         </View>
                         <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                            <TouchableOpacity style={{borderBottomWidth:1,borderColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.transport_id,console.log('itemsssssss',item.transport_id),Actions.Profile()}}>
                              <Text style={{color:'green'}}>{item.transporters}</Text>
                            </TouchableOpacity>
                         </View>
                         <View style={{width:80,marginBottom:5}}>
                          <TouchableOpacity style={{marginLeft:5,alignItems:'center',padding:5,justifyContent:'center',backgroundColor:'green',borderRadius:4}}
                              onPress={()=>this.props.navigation.navigate('OrderShow',{'order_no':item.order_no})} >
                             <Image style={{width:20,height:20,alignSelf:'center'}}
                                source={require('../Menu_images/document-icon-vector-27.jpg')} />
                          </TouchableOpacity>
                          {item.deliver_status ==0?
                            <TouchableOpacity style={{marginLeft:5,alignItems:'center',padding:5,justifyContent:'center',marginTop:10,backgroundColor:'green',borderRadius:4}} onPress={()=>this.Track_Order_lat_long_Api(item)} >
                            {/* <Image style={{width:20,height:20,alignSelf:'center'}}
                               source={require('../Menu_images/document-icon-vector-27.jpg')} /> */}
                               <Text>Track</Text>
                            </TouchableOpacity>
                          
                          : 
                          <TouchableOpacity style={{marginLeft:5,padding:5,justifyContent:'center',marginTop:10,backgroundColor:'green',borderRadius:4}} onPress={()=>this.props.navigation.navigate('Show_image',item.signature_image)} >
                            <Text style={{}}>View Signature</Text>
                         </TouchableOpacity>}
                        </View>
                    </View>} />
                </View>
                    </ScrollView>
                
            </View>
        {/* </ScrollView> */}
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
