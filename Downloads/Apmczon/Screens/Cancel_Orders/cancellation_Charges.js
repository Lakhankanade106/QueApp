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
       CancelOrders:[]
     }
   }
 
   displayData = async ()=>{  
     console.log('chalaaa')
     try{  
       let user = await AsyncStorage.getItem('user');  
       let UserID = await AsyncStorage.getItem('UserID');  
       //console.log('useriddddd',UserID)
       
       this.setState({UserID:UserID})
       //this.GetProductList()
       
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
                <Text style={{fontSize:16,fontWeight:'bold'}}>Cancellation charge</Text>
            </View>
        </View>
        <View style={{width:'90%',alignSelf:'center',borderWidth:1,marginTop:20,}}>
            <Text style={{marginTop:10,marginBottom:10,color:'red',fontWeight:'500',marginLeft:5}}>If you cancel your order then it will take Rs 50.00 as a order cancellation charge.</Text>
        </View>
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
 