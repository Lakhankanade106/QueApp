/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React from 'react';
 import { FlatList } from 'react-native';
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
   Modal,
   Alert,
   ActivityIndicator
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
       OrdeerReceivedArray:[],
       ErrorShow:'',
       modalVisible:false,
       vendor_id:'',
       order_no:'',
       ReasonText:'',
       cancellation_charge:'',
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
       console.log('View order number',this.props.order_no)
     let url= api.baseURL;
       fetch( url+'wb/order_received_status', {
          method: 'POST',
          headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          },
          body:JSON.stringify({user_id:this.state.UserID,order_no:this.props.order_no})
        }).then((response) => response.json())
          .then((responseData) =>
           { console.log("responsessss: " + JSON.stringify(responseData));
           if(responseData.status=='200'){
             this.setState({OrdeerReceivedArray:responseData.data})
           }
           else{
             this.setState({ErrorShow:responseData.message})
           }
           
           })
          .catch((err) => { console.log(err); });
   }

   
   Cancel_Alert(){
   Alert.alert(
     "Alert",
     "Are you sure you want to cancel Order",
     [
       {
         text: "Cancel",
         onPress: () => console.log("Cancel Pressed"),
         style: "cancel"
       },
       { text: "OK", onPress: () => this.CancelApi() }
     ]
   );}

   CancelApi(){
     //console.log('itemsss',item)
     this.setState({Activity:true})
    let url= api.baseURL;
    fetch( url+'wb/cancel_order', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       },
       body:JSON.stringify({user_id:this.state.UserID,order_no:this.state.order_no,vendor_id:this.state.vendor_id,reason:this.state.ReasonText})
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("responsessss: " + JSON.stringify(responseData));
        this.setState({Activity:false})
        if(responseData.status=='200'){
          this.setState({modalVisible:false})
          //this.setState({BankingArray:responseData.data})
          Actions.Cancel_Order()
        }
        else{
          this.setState({ErrorShow:responseData.message})
        }
        
        })
       .catch((err) => { console.log(err); });
   }
 
   render(){
   return (
     <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
         <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
            <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.pop()}>
                <Image style={{width:25,height:20}}
                    source={require('../../Images/Digital__Design_99-512.png')} />
            </TouchableOpacity>
            {/* <View style={{alignItems:'center',width:'80%'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Order Details</Text>
            </View> */}
        </View>
         <ScrollView horizontal={true} style={{flex:1}}>
             <View style={{flex:1}}>
                 <View style={{flexDirection:'row',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                   <Text style={[styles.Header_Text,{width:20,marginLeft:10}]}>#</Text>
                   <Text style={[styles.Header_Text,{width:150}]}>Order Number</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Order Amount</Text>
                   <Text style={[styles.Header_Text,{width:120}]}>Vendor</Text>
                   <Text style={[styles.Header_Text,{width:100,marginRight:15}]}>Vendor Status</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Transport Status</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Broker Status</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Action</Text>
                 </View>
                 <View style={{flex:1}}>
                   {this.state.ErrorShow?
                   <View style={{marginLeft:150}}>
                     <Text style={{fontSize:16,fontWeight:'700',color:'red'}}>{this.state.ErrorShow}</Text>
                   </View>
                   :null}
                   <FlatList 
                       data={this.state.OrdeerReceivedArray}
                       renderItem={({item,index})=>
                       <View style={{borderBottomWidth:0.5,marginTop:5}}>
                         <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                            <Text  style={{width:20,alignSelf:'center',marginLeft:10}}>{index+1}</Text>
                            <Text style={{width:150,alignSelf:'center'}}>{item.order_no}</Text>
                            <Text style={{width:100,alignSelf:'center'}}>{item.order_amount}</Text>
                            <Text style={{width:120,alignSelf:'center'}}>{item.vendor}</Text>
                           
                            <Text style={{width:100,alignSelf:'center'}}>{item.vendor_status}</Text>
                            <Text style={{width:100,alignSelf:'center'}}>{item.transporter_status}</Text>
                            <Text style={{width:100,alignSelf:'center'}}>{item.broker_status}</Text>
                            <View style={{width:100,alignSelf:'center',marginTop:5,marginBottom:5}}>
                                <TouchableOpacity style={{width:50,height:30,borderRadius:5,backgroundColor:'green',justifyContent:'center',alignItems:'center'}}
                                    onPress={()=> this.props.navigation.navigate('ProductView',{'order_no':item.order_no,'vendor_id':item.vendor_id})} >
                                    <Image style={{width:20,height:20,tintColor:'white'}}
                                        source={require('../Menu_images/document-icon-vector-27.jpg')} />
                                </TouchableOpacity>
                               {item.cancel_order == 'true'?
                                <TouchableOpacity style={{width:60,marginTop:5,height:30,borderRadius:5,backgroundColor:'red',justifyContent:'center',alignItems:'center'}}
                                  onPress={()=> this.setState({vendor_id:item.vendor_id ,order_no:item.order_no,cancellation_charge:item.cancellation_charge,modalVisible:!this.state.modalVisible})} >
                                    <Text style={{color:'white',fontSize:14,fontWeight:'500'}} >Cancel</Text>
                                </TouchableOpacity>
                               :null}
                                {/* <TouchableOpacity style={{width:50,height:30,borderRadius:5,backgroundColor:'green',justifyContent:'center',alignItems:'center'}}
                                    onPress={()=> this.props.navigation.navigate('ProductView',{'order_no':item.order_no,'vendor_id':item.vendor_id})} >
                                    <Image style={{width:20,height:20,tintColor:'white'}}
                                        source={require('../Menu_images/document-icon-vector-27.jpg')} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:50,height:30,borderRadius:5,alignItems:'center',backgroundColor:'green',justifyContent:'center',marginTop:5}}
                                    onPress={()=>this.props.navigation.navigate('OrderStatus',{'order_no':item.order_no})}  >
                                    <Text style={{color:'white'}} >Status</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:50,height:30,borderRadius:5,alignItems:'center',marginTop:5,justifyContent:'center',backgroundColor:'green'}}>
                                    <Image style={{width:20,height:20,tintColor:'white'}}
                                        source={require('../../Images/Downloadvc.png')} />
                                </TouchableOpacity> */}
                            </View>
                         </View>
                       </View>
                     }
                   />
                 </View>
                  <Modal
                    animationType="slide"
                    //transparent={true}
                    visible={this.state.modalVisible}
                    >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <View>
                          <Text style={{marginBottom:5,fontSize:16,fontWeight:'600'}}>Cancellation charge</Text>
                          <View style={{width:'90%',justifyContent:'center',height:30,borderWidth:1,marginTop:5}}>
                            <Text style={{marginLeft:10}}>{this.state.cancellation_charge}</Text>
                          </View>
                        </View>
                        <View style={{marginTop:15}}>
                          <Text style={{marginBottom:5,fontSize:16,fontWeight:'600'}}>Reason</Text>
                          {/* <View style={{width:'90%',justifyContent:'center',height:30,borderWidth:1,marginTop:5}}>
                            <Text style={{marginLeft:10}}>Amount</Text>
                          </View> */}
                          <TextInput style={{width:'90%',padding:5,borderWidth:1,height:80}}
                              placeholder='Reason'
                               onChangeText={(text)=>this.setState({ReasonText:text})}
                               multiline={true}
                          />
                        </View>
                        {this.state.Activity?<ActivityIndicator style={{marginTop:10}} size="large" color="#00ff00" />:null}
                        <View style={{flexDirection:'row',marginTop:20}}>
                          <TouchableOpacity style={{width:'40%',height:40,alignItems:'center',justifyContent:'center',backgroundColor:'#2B83CD'}}
                            onPress={()=>this.setState({modalVisible:false,ErrorShow:''})}  >
                            <Text style={{fontSize:15,color:'white'}}>Back</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{width:'40%',marginLeft:20,height:40,alignItems:'center',justifyContent:'center',backgroundColor:'green'}}
                            onPress={()=>this.Cancel_Alert()}  >
                            <Text style={{fontSize:15,color:'white'}}>Submit</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={{fontSize:16,marginTop:5,color:'red',fontWeight:'500'}}>{this.state.ErrorShow}</Text>
                      </View>
                    </View>
                  </Modal>
                 
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
   },
   centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf:'center',
    width:'80%'
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width:'100%',
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
   // Button_View:{
   //   justifyContent:'center',
   //   alignItems:'center',
   //   alignSelf:'center',
   //   borderBottomWidth:1
   // },
   
 });
 