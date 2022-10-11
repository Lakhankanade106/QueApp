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
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from '../Config/api'
import Storage from '../Config/Storage'
import Geolocation from '@react-native-community/geolocation';
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
        TrangectionArry:[],
        dimensions: {
          window,
          screen
        },
        is_driver:''
    }
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let user = await AsyncStorage.getItem('user');  
      let UserID = await AsyncStorage.getItem('UserID');  
      let is_driver = await AsyncStorage.getItem('is_driver') 
      console.log('useriddddd',is_driver)
      if(is_driver ==1){
        this.setState({is_driver:is_driver})
        this.Tracking()
      }
      this.setState({})
      this.setState({UserID:UserID})
      this.orederDataList()
      
      //console.log('user',user)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  } 
  
  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
       // console.log('postitionss ',position);
        // this.state.coordinate.latitude = position.coords.latitude;
        // this.state.coordinate.longitude = position.coords.longitude;
        // this.setState({coordinate:this.state.coordinate})
       //this.setState({latitude:position.coords.latitude,longitude: position.coords.longitude,})
       // this.setState({latitude:currentLatitude})
       let url= api.baseURL;
    fetch( url+'wb/add_driver_latlong', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       //'Content-Length': data.length 
       },
       body:JSON.stringify({driver_id:this.state.UserID,current_lat:position.coords.latitude,current_long:position.coords.longitude})
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("responsessss: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
         // this.setState({TrangectionArry:responseData.data})
        // this.componentDidMount()
        this.Tracking()
        }
        
        })
       .catch((err) => { console.log(err); });
      },
  
      
      error => console.log(error),
     // { enableHighAccuracy: true, timeout: 20000 }
      
    );}
    Tracking(){
      const that =this
      setTimeout(() => {that.findCoordinates()}, 100000)
    }
  
  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onChange);
  }
  componentDidMount(){
      this.setState({TrangectionArry:[]})
      this.displayData()
      Dimensions.addEventListener("change", this.onChange);
  }
  orederDataList(){
    let url= api.baseURL;
      fetch( url+'wb/under_get_total_orders_list', {
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
    const { dimensions } = this.state;
    console.log('storageeeee',window.height)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6',height:'100%',width:'100%'}}>
        {/* <ScrollView style={{flex:1}} > */}
            <View style={{flex:1}}>
           
              <ScrollView horizontal={true} style={{width:'100%'}}>
                <View style={{width:'100%',flex:1}}>
                <View style={{flexDirection:'row',height:50,borderTopWidth:0.5,borderBottomWidth:0.5,marginTop:15}}>
                  <View style={{width:'5%',}}>
                     <Text style={styles.Header_Text}>#</Text>
                  </View>
                  <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Order Number</Text>
                  </View>
                  <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Order Amount</Text>
                  </View>
                  <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Order Date</Text>
                  </View>
                  <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Order By</Text>
                  </View>
                  {/* <View style={{width:'15%',marginLeft:5,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Broker</Text>
                  </View> */}
                  {Storage.userType == 6?
                  <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Broker</Text>
                  </View>
                  :null}
                  {Storage.userType == 6?
                  <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Transport</Text>
                  </View>
                  :null}
                
                {Storage.userType == 4?
                  <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Vendore</Text>
                  </View>
                :null}
                {Storage.userType ==4?
                <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                  <Text style={styles.Header_Text}>Transport</Text>
                </View>
                :null}
                {Storage.userType == 5?
                <View style={{flexDirection:'row'}}>
                  <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Vendore</Text>
                  </View>
                  <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Broker</Text>
                  </View>
                </View>
                :null}
                  
                  <View style={{width:80,marginRight:5,alignItems:'center',marginRight:30}}>
                  <Text style={styles.Header_Text}>Action</Text>
                  </View>
                </View>
                <FlatList style={{flex:1}} //nestedScrollEnabled={true}
                    data={this.state.TrangectionArry}
                    renderItem={({item,index})=>
                    <View style={{flexDirection:'row',marginTop:15,borderBottomWidth:1}}>
                         <View style={{width:'5%',marginLeft:10}}>
                             <Text>{index+1}</Text>
                         </View>
                         <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                            <Text>{item.order_no}</Text>
                         </View>
                         <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                            <Text>{item.orderamount}</Text>
                         </View>
                         <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                            <Text>{item.entry_date}</Text>
                         </View>
                         <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                             <TouchableOpacity style={{borderBottomWidth:1,borderBottomColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.order_by_id,Actions.Profile()}}>
                               <Text style={{color:'green'}}>{item.order_by}</Text>
                             </TouchableOpacity>
                         </View>
                         { Storage.userType ==5?
                         <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                           <TouchableOpacity style={{borderBottomWidth:1,borderColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.broker_id,Actions.Profile()}}>
                              <Text style={{color:'green'}}>{item.vendor}</Text>
                           </TouchableOpacity>
                         </View>
                         :null}
                         {Storage.userType == 6 ?
                         <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                           <TouchableOpacity style={{borderBottomWidth:1,borderColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.broker_id,Actions.Profile()}}>
                              <Text style={{color:'green'}}>{item.broker}</Text>
                           </TouchableOpacity>
                         </View>
                         :null}
                         {Storage.userType == 4 ?
                         <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                            <TouchableOpacity style={{borderBottomWidth:1,borderColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.vendor_id,Actions.Profile() }}>
                               <Text style={{color:'green'}}>{item.vendor}</Text>
                            </TouchableOpacity>
                         </View>
                         :null}
                         
                         { Storage.userType ==5?
                         <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                            <TouchableOpacity style={{borderBottomWidth:1,borderColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.vendor_id,Actions.Profile() }}>
                               <Text style={{color:'green'}}>{item.broker}</Text>
                            </TouchableOpacity>
                         </View>
                         :null}
                         {Storage.userType == 6 || Storage.userType == 4?
                         <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                            <TouchableOpacity style={{borderBottomWidth:1,borderColor:'green'}} onPress={()=>{Storage.OrderScreenId = item.transport_id,Actions.Profile()}}>
                              <Text style={{color:'green'}}>{item.transport}</Text>
                            </TouchableOpacity>
                         </View>
                         :null}
                         {/* <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                            <Text>{item.broker}</Text>
                         </View>
                         <View style={{width:70,marginLeft:5,alignItems:'center'}}>
                            <Text>{item.vender}</Text>
                         </View>
                         <View style={{width:80,marginLeft:5,alignItems:'center'}}>
                         <Text>{item.transport}</Text>
                         </View> */}
                         <View style={{marginBottom:5,width:80}}>
                         <TouchableOpacity style={{width:35,height:35,marginLeft:5,justifyContent:'center',backgroundColor:'green',borderRadius:4}} onPress={()=>{Storage.OrderNumber = item.order_no,Actions.DocView()}}>
                             <Image style={{width:20,height:20,alignSelf:'center'}}
                                source={require('../Menu_images/document-icon-vector-27.jpg')} />
                         </TouchableOpacity>
                         {this.state.is_driver !=1?
                        <View>
                          {item.deliver_status==0?
                            <TouchableOpacity style={{marginLeft:5,padding:5,justifyContent:'center',marginTop:10,backgroundColor:'green',borderRadius:4}} onPress={()=>this.Track_Order_lat_long_Api(item)} >
                              {/* <Image style={{width:20,height:20,alignSelf:'center'}}
                                source={require('../Menu_images/document-icon-vector-27.jpg')} /> */}
                              <Text>Track</Text>
                            </TouchableOpacity>
                          :
                          <TouchableOpacity style={{marginLeft:5,padding:5,justifyContent:'center',marginTop:10,backgroundColor:'green',borderRadius:4}} onPress={()=>this.props.navigation.navigate('Show_image',item.signature_image)} >
                              {/* <Image style={{width:40,height:20,alignSelf:'center'}}
                                source={{uri:item.signature_image}} /> */}
                              <Text style={{}}>View Signature</Text>
                            </TouchableOpacity>
                          }
                        </View>
                         :<TouchableOpacity disabled={item.order_deliverd ==1?true:false} style={{marginLeft:5,padding:5,justifyContent:'center',marginTop:10,backgroundColor:'green',borderRadius:4}} 
                            onPress={()=>this.props.navigation.navigate('Add_Signature',{order_no:item.order_no})} >
                         {/* <Image style={{width:20,height:20,alignSelf:'center'}}
                            source={require('../Menu_images/document-icon-vector-27.jpg')} /> */}
                            {item.order_deliverd ==1?<Text style={{color:'white'}}>Order Delivered</Text>:<Text style={{color:'white'}}>Add signature</Text>}
                            
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
