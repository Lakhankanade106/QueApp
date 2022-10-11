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
       AdvertisementArray:[]
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
     let url= api.baseURL;
       fetch( url+'wb/advertisement_list', {
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
             this.setState({AdvertisementArray:responseData.data})
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
                <Text style={{fontSize:16,fontWeight:'bold'}}>Advertisement List</Text>
            </View>
        </View>
         <ScrollView horizontal={true} style={{flex:1}}>
             <View style={{flex:1}}>
                 <View style={{flexDirection:'row',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                   <Text style={[styles.Header_Text,{width:20,marginLeft:10}]}>#</Text>
                   <Text style={[styles.Header_Text,{width:150}]}>Advertisement Category</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Product</Text>
                   <Text style={[styles.Header_Text,{width:50}]}>Days</Text>
                   <Text style={[styles.Header_Text,{width:100,marginRight:10}]}>Image</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Added Date</Text>
                   <Text style={[styles.Header_Text,{width:100}]}>Expiry Date</Text>
                 </View>
                 <View style={{flex:1}}>
                   <FlatList 
                       data={this.state.AdvertisementArray}
                       renderItem={({item,index})=>
                       <View style={{borderBottomWidth:0.5,marginTop:5}}>
                         <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                            <Text  style={{width:20,alignSelf:'center',marginLeft:10}}>{index+1}</Text>
                            <Text style={{width:150,alignSelf:'center'}}>{item.advertisement_category}</Text>
                            <Text style={{width:100,alignSelf:'center'}}>{item.product}</Text>
                            <Text style={{width:50,alignSelf:'center'}}>{item.days}</Text>
                            <View style={{width:100,marginRight:10,marginBottom:5}}>
                                <Image style={{width:80,height:80}} resizeMode='cover'
                                   source={{uri:item.image}}
                                />
                            </View>
                            <Text style={{width:100,alignSelf:'center'}}>{item.added_date}</Text>
                            <Text style={{width:100,alignSelf:'center'}}>{item.expiry_date}</Text>
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
 