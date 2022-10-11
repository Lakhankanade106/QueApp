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
AsyncStorage,
ActivityIndicator
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Storage from '../Config/Storage';
import Api from '../Config/api'


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
        VenderArry:[],
        ProductArry:[],
        SelVender:'Select Vendor',
        SelProduct:'Select Product',
        UserID:'',
        VenderId:'',
        ErrorShow:'',
        ProductId:'',
        Discription:'',
        Price:'',
        Activity:false
    }
  }

displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let UserID = await AsyncStorage.getItem('UserID');
      
      this.setState({UserID:UserID}) 
    }  
    catch(error){  
      alert(error)  
    }  
  } 

  componentDidMount(){
      this.displayData()
  }

  VenderGetApi(){
      this.setState({ErrorShow:''})
    let url= Api.baseURL;
    fetch( url+'wb/my_vendor', {
        method: 'POST',
        headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json',
             },
             body:JSON.stringify({user_id:this.state.UserID})
    }).then((response) => response.json())
    .then((responseData) =>
    { console.log("responsessss My_Vender: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
            this.setState({VenderArry:responseData.data})
        }
        else{
            this.setState({ErrorShow:responseData.message})
        }       
    })
    .catch((err) => { console.log(err); });
  }

  SelectVenderFun(item){
      console.log('funnnnn',item)
      this.setState({SelVender:item.firstname+' '+item.lastname})
      this.setState({VenderId:item.vendor_id})
      this.setState({VenderArry:[]})
  }


  ProductGetApi(){
    let url= Api.baseURL;
    fetch( url+'wb/my_deal_product', {
      method: 'POST',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        },
        body:JSON.stringify({user_id:this.state.UserID,vendor_id:this.state.VenderId})
        }).then((response) => response.json())
       .then((responseData) =>
     { console.log("responsessss: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
            this.setState({ProductArry:responseData.data})
        } 
        else{
            this.setState({ErrorShow:responseData.message})
        }     
    })
    .catch((err) => { console.log(err); });
  }

  SelectProductFun(item){
      console.log('selected product',item)
      this.setState({SelProduct:item.title})
      this.setState({ProductId:item.p_id})
      this.setState({ProductArry:[]})

  }

  DealApiFun(){
      this.setState({Activity:true})
      this.setState({ErrorShow:''})
    let url= Api.baseURL;
    fetch( url+'wb/add_deal', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 
             'Content-Type': 'application/json',
             },
        body:JSON.stringify({user_id:this.state.UserID,p_id:this.state.ProductId,vendor_id:this.state.VenderId,deal_price:this.state.Price,deal_description:this.state.Discription})
    }).then((response) => response.json())
    .then((responseData) =>
    { console.log("responsessss: " + JSON.stringify(responseData));
    this.setState({Activity:false})
        if(responseData.status=='200'){
            this.setState({ProductView:responseData.data})
            Actions.ProductDeal()
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
        <ScrollView>
            <View style={{flex:1,marginLeft:20}}>
                <View style={{marginTop:20}}>
                    <Text style={{fontSize:12,fontWeight:'600',color:'red',alignSelf:'center'}}>{this.state.ErrorShow}</Text>
                    <Text style={styles.Header_Text}>Vendors</Text>
                    <TouchableOpacity style={styles.DropView} onPress={()=>this.VenderGetApi()}>
                        <Text style={styles.Font_Text}>{this.state.SelVender}</Text>
                        <Image style={{width:13,height:10,marginRight:10}}
                            source={require('../Menu_images/Drop_icone.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.DropStyle}>
                    <FlatList
                        data={this.state.VenderArry}
                        renderItem={({item})=>
                         <View >
                             <TouchableOpacity style={styles.ItemView} onPress={()=>this.SelectVenderFun(item)}>
                                <Text style={styles.Font_Text}>{item.firstname+' '+item.lastname}</Text>
                                <View style={{borderWidth:1,borderColor:item.firstname+' '+item.lastname === this.state.SelVender ? "green" :'Black',width:20,height:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                                    <View style={{backgroundColor: item.firstname+' '+item.lastname === this.state.SelVender ? "green" :'white',width:10,height:10,borderRadius:5}}></View>
                                </View>
                             </TouchableOpacity>
                         </View> } />
                </View>
                <View style={{marginTop:5}}>
                    <Text style={styles.Header_Text}>Product</Text>
                    <TouchableOpacity style={styles.DropView} onPress={()=>this.ProductGetApi()}>
                        <Text style={styles.Font_Text}>{this.state.SelProduct}</Text>
                        <Image style={{width:13,height:10,marginRight:10}}
                            source={require('../Menu_images/Drop_icone.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.DropStyle}>
                    <FlatList
                        data={this.state.ProductArry}
                        renderItem={({item})=>
                         <View >
                             <TouchableOpacity style={styles.ItemView} onPress={()=>this.SelectProductFun(item)}>
                                <Text style={styles.Font_Text}>{item.title}</Text>
                                <View style={{borderWidth:1,borderColor:item.title === this.state.SelProduct ? "green" :'Black',width:20,height:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                                    <View style={{backgroundColor: item.title === this.state.SelProduct ? "green" :'white',width:10,height:10,borderRadius:5}}></View>
                                </View>
                             </TouchableOpacity>
                         </View> } />
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Deal Price</Text>
                    <View style={styles.DropView}>
                        <TextInput style={styles.Font_Text}
                            placeholder='Deal Price'
                            keyboardType='numeric'
                            onChangeText={(text)=>this.setState({Price:text})} />
                    </View>
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Deal Description</Text>
                    <View style={styles.NotesView}>
                        <TextInput style={styles.Font_Text}
                            placeholder='Deal Description'
                           // keyboardType='numeric'
                            multiline={true}
                            onChangeText={(text)=>this.setState({Discription:text})} />
                    </View>
                </View>
                {this.state.Activity?
                <View style={{marginTop:10,marginBottom:10}}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
                :null}
                <TouchableOpacity style={styles.DealButton} onPress={()=>this.DealApiFun()}>
                    <Text style={{fontSize:16,fontWeight:'600',color:'white'}}>Add Deal</Text>
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
    color:'#424949'
  },
  Font_Text:{
    fontSize:15,
    color:'#707B7C',
    marginLeft:20
  },
  DropView:{
      width:'90%',
      height:50,
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'space-between',
      borderRadius:10,
      marginTop:5,
      flexDirection:'row',
  },
  ItemView:{
      flexDirection:'row',
      justifyContent:'space-between',
     // marginTop:5,
      borderBottomWidth:0.5,
      padding:8,
      width:'89%',
      alignSelf:'center',
      marginBottom:10
  },
  DropStyle:{
      backgroundColor:'white',
      marginTop:5,
      width:'90%',
      borderRadius:10
  },
  NotesView:{
      width:'90%',
      height:80,
      backgroundColor:'white',
      borderRadius:10,
      marginTop:5
  },
  DealButton:{
      width:'40%',
      height:50,
      backgroundColor:'green',
      marginTop:20,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:10
  }
});
