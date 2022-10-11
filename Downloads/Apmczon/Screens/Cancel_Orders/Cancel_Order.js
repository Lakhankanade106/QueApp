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
       CancelOrders:[],
       user_Type:'',
       userType_Array:[],
       Select_Cancel:'cancelled my order'
     }
   }
 
   displayData = async ()=>{  
     console.log('chalaaa')
     try{  
       let user = await AsyncStorage.getItem('user');  
       let UserID = await AsyncStorage.getItem('UserID');  
       console.log('useriddddd',user)
      this.setState({user_Type:user})
       
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
    this.setState({CancelOrders:[]})
     let url= api.baseURL;
       fetch( url+'wb/cancel_order_list', {
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
             this.setState({CancelOrders:responseData.data})
           }
           })
          .catch((err) => { console.log(err); });
   }
   UserType_Fun(){
     this.setState({userType_Array:['cancelled my under orders','cancelled my order']})
   }
   Select_Fun(item){
    this.setState({Select_Cancel:item})
     if(item =='cancelled my under orders'){
       //cancel_order by vendor List
      this.Cancel_Order_by_Vendor()
     }
     else{
       // get cancel Order List
       this.GetProductList()
     }
     this.setState({userType_Array:[]})

   }
   Cancel_Order_by_Vendor(){
     this.setState({CancelOrders:[]})
    let url= api.baseURL;
    fetch( url+'wb/cancel_order_by_vendor_list', {
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
          this.setState({CancelOrders:responseData.data})
        }
        
        })
       .catch((err) => { console.log(err); });
   }
   render(){
     console.log('user id',this.state.UserID)
   return (
     <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
         <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
            <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.drawerMenu()}>
                <Image style={{width:25,height:20}}
                    source={require('../../Images/Digital__Design_99-512.png')} />
            </TouchableOpacity>
            <View style={{alignItems:'center',width:'80%'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Cancel Orders List</Text>
            </View>
        </View>
        {this.state.user_Type=='Vender'?
        <View style={{marginTop:10,width:'90%',alignSelf:'center'}}>
          <TouchableOpacity style={{width:'100%',height:35,alignItems:'center',justifyContent:'center',borderWidth:1,borderRadius:5}}
            onPress={()=>this.UserType_Fun()}  >
            <Text style={{fontSize:14}}>{this.state.Select_Cancel}</Text>
          </TouchableOpacity>
          <FlatList
             data={this.state.userType_Array}
             renderItem={({item})=>
             <TouchableOpacity style={{borderWidth:1,width:'100%',alignItems:'center',borderRadius:8,marginTop:5,height:30,justifyContent:'center'}}
                onPress={()=>this.Select_Fun(item)} >
               <Text>{item}</Text>
             </TouchableOpacity>
            }
          />
        </View>
        :null}
         <ScrollView horizontal={true} style={{flex:1}}>
             <View style={{flex:1}}>
                 <View style={{flexDirection:'row',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                   <View style={{width:30,alignItems:'center'}}>
                      <Text style={[styles.Header_Text,]}>#</Text>
                   </View>
                   <View style={{width:100,alignItems:'center'}}>
                      <Text style={[styles.Header_Text,]}>Order Number</Text>
                   </View>
                  <View style={{width:150,alignItems:'center'}}>
                      <Text style={[styles.Header_Text,]}>Order Amount</Text>
                  </View>
                   <View style={{width:100,alignItems:'center'}}>
                      <Text style={[styles.Header_Text,]}>Order Date</Text>
                   </View>
                   <View style={{width:100,alignItems:'center'}}>
                      <Text style={[styles.Header_Text,]}>Cancel Order Date</Text>
                   </View>
                   <View style={{width:150,alignItems:'center'}}>
                      <Text style={[styles.Header_Text,]}>Vendor</Text>
                   </View>
                   <View style={{width:150,alignItems:'center'}}>
                      <Text style={[styles.Header_Text,]}>Broker</Text>
                   </View>
                  <View style={{width:150,alignItems:'center'}}>
                    <Text style={[styles.Header_Text,]}>Transport</Text>
                  </View>
                  {this.state.Select_Cancel =='My Cancel List'?
                  <View style={{width:150,alignItems:'center'}}>
                    <Text style={[styles.Header_Text,]}>Shop</Text>
                  </View>
                  :null}
                  
                  <View style={{width:150,alignItems:'center'}}>
                    <Text style={[styles.Header_Text,]}>Cancelled By</Text>
                  </View>
                  <View style={{width:150,alignItems:'center'}}>
                    <Text style={[styles.Header_Text,]}>Reason</Text>
                  </View>
                 </View>
                 <View style={{flex:1}}>
                   <FlatList 
                       data={this.state.CancelOrders}
                       renderItem={({item,index})=>
                       <View style={{borderBottomWidth:0.5,marginTop:5}}>
                         <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                            <View style={{width:30,alignItems:'center'}}>
                                <Text  style={{}}>{index+1}</Text>
                            </View>
                            <View style={{width:100,alignItems:'center'}}>
                              <Text style={{}}>{item.order_no}</Text>
                            </View>
                            <View style={{width:150,alignItems:'center'}}>
                              <Text style={{alignSelf:'center'}}>{item.order_amount}</Text>
                            </View>
                            <View style={{width:100,alignItems:'center'}}>
                              <Text style={{}}>{item.order_date}</Text>
                            </View>
                            <View style={{width:100,alignItems:'center'}}>
                              <Text style={{}}>{item.cancel_order_date}</Text>
                            </View>
                            {/* <TouchableOpacity>
                              <Text style={[styles.Header_Text,{width:100,color:'green',marginRight:10,marginLeft:10}]}>Vendor one</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity style={{borderBottomWidth:1}}>
                              <Text style={{color:'green'}}>Broker Two</Text>
                            </TouchableOpacity> */}
                            <View style={{width:150,alignItems:'center'}}>
                              <TouchableOpacity style={{borderBottomWidth:1}} onPress={()=>{Storage.OrderScreenId = item.vendor_id,Actions.Profile()}}>
                                <Text style={{color:'green'}}>{item.vendor}</Text>
                              </TouchableOpacity>
                           </View>
                             <View style={{width:150,alignItems:'center'}}>
                              <TouchableOpacity style={{borderBottomWidth:1}} onPress={()=>{Storage.OrderScreenId = item.broker_id,Actions.Profile()}}>
                                <Text style={{color:'green'}}>{item.broker}</Text>
                              </TouchableOpacity>
                           </View>
                           <View style={{width:150,alignItems:'center'}}>
                              <TouchableOpacity style={{borderBottomWidth:1}} onPress={()=>{Storage.OrderScreenId = item.transporter_id,Actions.Profile()}} >
                                <Text style={{color:'green'}}>{item.transporter}</Text>
                              </TouchableOpacity>
                           </View>
                           {this.state.Select_Cancel =='My Cancel List'?
                            <View style={{width:150,alignItems:'center'}}>
                              <Text style={[styles.Header_Text,]}>{item.shop}</Text>
                            </View>
                           :null}
                            
                            <View style={{width:150,alignItems:'center'}}>
                              <Text style={[styles.Header_Text,]}>{item.cancelled_by}</Text>
                            </View>
                            <View style={{width:150,alignItems:'center'}}>
                              <Text style={[styles.Header_Text,]}>{item.reason}</Text>
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
 