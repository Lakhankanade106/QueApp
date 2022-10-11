/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React from 'react';
 import { FlatList } from 'react-native';
import { Linking } from 'react-native';
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
 import api from '../Config/api'
 import Storage from '../Config/Storage'
 
 export default class App extends React.Component {
   constructor(props){
     super(props)
     this.state={
       LoginType:1,
       UserID:'',
       OderReciveArray:[],
       ErrorShow:''
     }
   }
 
   displayData = async ()=>{  
     console.log('chalaaa')
     try{  
       let user = await AsyncStorage.getItem('user');  
       let UserID = await AsyncStorage.getItem('UserID');  
       //console.log('useriddddd',UserID)
       
       this.setState({UserID:UserID})
       this.GetProductList()
       
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
   GetProductList(){
     console.log('user id ',this.state.UserID)
     let url= api.baseURL;
       fetch( url+'wb/get_order_received_list', {
          method: 'POST',
          headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          },
          body:JSON.stringify({user_id:this.state.UserID})
        }).then((response) => response.json())
          .then((responseData) =>
           { console.log("responsessss: " + JSON.stringify(responseData));
           if(responseData.status=='200'){
             this.setState({OderReciveArray:responseData.data})
           }
           else{
             this.setState({ErrorShow:responseData.message})
           }
           })
          .catch((err) => { console.log(err); });
   }
   DownloadApiFun(item){
     console.log('other id ' ,item.other_id)
     console.log('Vendor id ',item.vendor_id)
     console.log('Order id ',item.order_no)
    let url= api.baseURL;
    fetch( url+'wb/download_received_bill', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       },
       body:JSON.stringify({user_id:item.other_id,order_no:item.order_no,vendor_id:item.vendor_id})
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("responsessss: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
          console.log('url ',responseData.data.url)
          //this.setState({OderReciveArray:responseData.data})
          const Download = Linking.openURL(responseData.data.url)
          //console.log('Download',Download)
        }
        else{
         // this.setState({ErrorShow:responseData.message})
        }
        })
       .catch((err) => { console.log(err); });

   }
   SignatureFun(item){
     console.log('itemsss ',item)
   }
 
   render(){
     console.log('Error show',this.state.ErrorShow)
   return (
     <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
         <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
            <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.drawerMenu()}>
                <Image style={{width:25,height:20}}
                    source={require('../../Images/Digital__Design_99-512.png')} />
            </TouchableOpacity>
            <View style={{alignItems:'center',width:'80%'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Received List</Text>
            </View>
        </View>
         <ScrollView horizontal={true} style={{flex:1}}>
             <View style={{flex:1}}>
                 <View style={{flexDirection:'row',borderWidth:0.5,padding:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                   <Text style={[styles.Header_Text,{width:20,marginLeft:10}]}>#</Text>
                   <Text style={[styles.Header_Text,{width:150}]}>User</Text>
                   <Text style={[styles.Header_Text,{width:170}]}>Order Number</Text>
                   <Text style={[styles.Header_Text,{width:150}]}>Vendor</Text>
                   <Text style={[styles.Header_Text,{width:150}]}>Vendor Status</Text>
                   <Text style={[styles.Header_Text,{width:150}]}>Broker Status</Text>
                   <Text style={[styles.Header_Text,{width:150,marginRight:10}]}>Transport Status</Text>
                   <Text style={[styles.Header_Text,{width:150}]}>Received status</Text>
                 </View>
                 <View style={{flex:1}}>
                 {this.state.ErrorShow?
                   <View style={{justifyContent:'center',marginTop:40,marginLeft:150}}>
                     <Text style={{fontSize:16,fontWeight:'600',color:'red'}}>{this.state.ErrorShow}</Text>
                   </View>
                   :null}
                   <FlatList 
                       data={this.state.OderReciveArray}
                       renderItem={({item,index})=>
                       <View style={{borderBottomWidth:0.5,marginTop:5,padding:10}}>
                         <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                            <Text  style={{width:20,alignSelf:'center',marginLeft:10}}>{index+1}</Text>
                            <Text style={{width:150,alignSelf:'center'}}>{item.user}</Text>
                            <Text style={{width:170,alignSelf:'center'}}>{item.order_no}</Text>
                            <Text style={{width:150,alignSelf:'center'}}>{item.vendor}</Text>
                            <Text style={{width:150,alignSelf:'center'}}>{item.vendor_status}</Text>
                            <Text style={{width:150,alignSelf:'center'}}>{item.broker_status}</Text>
                            <Text style={{width:150,marginRight:10,alignSelf:'center'}}>{item.transport_status}</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-around',width:150,alignItems:'center'}}>
                              {/* <Text style={{}}>{item.received_status}</Text> */}
                             {item.received_status =="add_signature"?
                             <TouchableOpacity style={{backgroundColor:'green',width:110,height:40,alignItems:'center',justifyContent:'center'}}
                                onPress={()=>this.props.navigation.navigate('Recive_Charges',{itemData:item})} >
                                  <Text style={{color:'white'}}>Add Signature</Text>
                                {/* <Image style={{width:20,height:20,tintColor:'white'}}
                                   source={require('../../Images/Downloadvc.png')} /> */}
                             </TouchableOpacity>
                             :
                              <TouchableOpacity style={{backgroundColor:'green',width:40,height:25,alignItems:'center',justifyContent:'center'}}
                                onPress={()=>this.DownloadApiFun(item)} >
                                <Image style={{width:20,height:20,tintColor:'white'}}
                                    source={require('../../Images/Downloadvc.png')} />
                              </TouchableOpacity>
                             }
                            </View>
                         </View>
                       </View>
                     }
                   />
                   
                 </View>
                
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
   ButtonView:{
     width:70,
     borderRadius:15,
     height:40,
     backgroundColor:'white',
     alignItems:'center',
     justifyContent:'center',
     alignSelf:'center'
   }
   // Button_View:{
   //   justifyContent:'center',
   //   alignItems:'center',
   //   alignSelf:'center',
   //   borderBottomWidth:1
   // },
   
 });
 