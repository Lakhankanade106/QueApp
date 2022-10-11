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
   Linking,
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
       BankingArray:[],
       ErrorShow:'',
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
       fetch( url+'wb/view_order', {
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
             this.setState({BankingArray:responseData.data})
           }
           else{
             this.setState({ErrorShow:responseData.message})
           }
           
           })
          .catch((err) => { console.log(err); });
   }

   DownloadApi(item){
     console.log('order no',item)
    let url= api.baseURL;
    fetch( url+'wb/download_bill', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       },
       body:JSON.stringify({user_id:item.other_id,vendor_id:item.vendor_id,order_no:item.order_no})
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("responsessss: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
          console.log('download url',responseData.data.url)
          const Download =Linking.openURL(responseData.data)
          console.log('Download ',Download)
          //this.setState({BankingArray:responseData.data})
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
            <View style={{alignItems:'center',width:'80%'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Order Details</Text>
            </View>
        </View>
         <ScrollView horizontal={true} style={{flex:1}}>
             <View style={{flex:1}}>
                 <View style={{flexDirection:'row',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                   <Text style={[styles.Header_Text,{width:20,marginLeft:10}]}>#</Text>
                   <Text style={[styles.Header_Text,{width:150}]}>Order Number</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Order Amount</Text>
                   <Text style={[styles.Header_Text,{width:120}]}>Order Date</Text>
                   {/* <Text style={[styles.Header_Text,{width:100,marginRight:15}]}>Screenshot</Text> */}
                   <Text style={[styles.Header_Text,{width:100}]}>Vendor</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Action</Text>
                 </View>
                 <View style={{flex:1}}>
                   {this.state.ErrorShow?
                   <View style={{marginLeft:150}}>
                     <Text style={{fontSize:16,fontWeight:'700',color:'red'}}>{this.state.ErrorShow}</Text>
                   </View>
                   :null}
                   <FlatList 
                       data={this.state.BankingArray}
                       renderItem={({item,index})=>
                       <View style={{borderBottomWidth:0.5,marginTop:5}}>
                         <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                            <Text  style={{width:20,alignSelf:'center',marginLeft:10}}>{index+1}</Text>
                            <Text style={{width:150,alignSelf:'center'}}>{item.order_no}</Text>
                            <Text style={{width:100,alignSelf:'center'}}>{item.order_amount}</Text>
                            <Text style={{width:120,alignSelf:'center'}}>{item.order_date}</Text>
                            {/* <View style={{width:100,marginBottom:5,marginRight:15}}>
                                <Image style={{width:100,height:80}} resizeMode='cover'
                                   source={{url:item.screenshot}}
                                />
                            </View> */}
                            <Text style={{width:100,alignSelf:'center'}}>{item.vendor}</Text>
                            <View style={{width:100,alignSelf:'center',marginTop:5,marginBottom:5}}>
                                <TouchableOpacity style={{width:50,height:30,borderRadius:5,backgroundColor:'green',justifyContent:'center',alignItems:'center'}}
                                    onPress={()=> this.props.navigation.navigate('ProductView',{'order_no':item.order_no,'vendor_id':item.vendor_id})} >
                                    <Image style={{width:20,height:20,tintColor:'white'}}
                                        source={require('../Menu_images/document-icon-vector-27.jpg')} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:50,height:30,borderRadius:5,alignItems:'center',backgroundColor:'green',justifyContent:'center',marginTop:5}}
                                    onPress={()=>this.props.navigation.navigate('OrderStatus',{'order_no':item.order_no})}  >
                                    <Text style={{color:'white'}} >Status</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:50,height:30,borderRadius:5,alignItems:'center',marginTop:5,justifyContent:'center',backgroundColor:'green'}}
                                    onPress={()=>this.DownloadApi(item)} >
                                    <Image style={{width:20,height:20,tintColor:'white'}}
                                        source={require('../../Images/Downloadvc.png')} />
                                </TouchableOpacity>
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
 