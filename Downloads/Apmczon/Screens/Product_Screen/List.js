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
  RefreshControl,
  Alert
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
      ProductList:[],
      UpdateValue:0,
      refreshing: false,
      State_Update:''
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
      fetch( url+'wb/products_list', {
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
            this.setState({ProductList:responseData.data})
            this.setState({State_Update:''})
          }
          })
         .catch((err) => { console.log(err); });
  }

  createTwoButtonAlert (item){
    Alert.alert(
      "Alert",
      "Are you Sure you want to delet Product",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.DelProject(item) }
      ]
    );}
  DelProject(item){
    console.log('itssssss',item.p_id)
    let url= api.baseURL;
      fetch( url+'wb/delete_product', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({user_id:this.state.UserID,p_id:item.p_id})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
           // this.setState({ProductList:responseData.data})
           this.GetProductList()
          }
          })
         .catch((err) => { console.log(err); });
  }
  _onRefresh() {
    this.setState({refreshing: true});
    this.componentDidMount()
    setTimeout(() => {this.setState({refreshing: false})}, 1000)
  }
  // componentWillReceiveProps(props) {
  //   console.log('props ',props)
  //   // const { refresh, id } = this.props;
  //   // if (props.refresh !== refresh) {
  //   //   this.fetchShoes(id)
  //   //     .then(this.refreshShoeList)
  //   // }
  // }

  // getSnapshotBeforeUpdate(props,state){
  //   this.setState({State_Update:this.props.navigation.state})
  //   if(this.props.navigation.state!= this.state.State_Update)
  //   {
  //    this.GetProductList();
  //   }
  //   return this.state.State_Update;
  // }
  componentDidUpdate = ()=>{
    //this.getSnapshotBeforeUpdate();
    // let state = 
    // if()
    // const state =this.sta
    // this.setState({State_Update:this.props.navigation.state})
    // if(this.props.navigation.state!= this.state.State_Update)
    // {
    //  this.GetProductList();
    // }
    // return this.state.State_Update;
  }

  // componentWillUnmount(){
  //   this.getCompaniesList();
  // }

  render(){
    console.log('Refresh   ',this.props.navigation.state)
    // const MyRefresh = this.props.Refresh
    // if(this.props.Refresh ==true){
    //   this._onRefresh()
    //   this.setState({})
    // }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6',width:'100%'}}>
      <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
        <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.drawerMenu()}>
          <Image style={{width:25,height:20}}
            source={require('../../Images/Digital__Design_99-512.png')} />
        </TouchableOpacity>
          <View style={{alignItems:'center',width:'80%'}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>Product List</Text>
          </View>
      </View>
        <ScrollView horizontal={true} style={{flex:1}}>
            <View style={{flex:1}}>
                <View style={{flexDirection:'row',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                  <Text style={[styles.Header_Text,{width:20,marginLeft:5}]}>#</Text>
                  <Text style={[styles.Header_Text,{width:100}]}>Category</Text>
                  <Text style={[styles.Header_Text,{width:100}]}>Sub Category</Text>
                  <Text style={[styles.Header_Text,{width:100}]}>Title</Text>
                  <Text style={[styles.Header_Text,{width:80}]}>Current Qty</Text>
                  <Text style={[styles.Header_Text,{width:250}]}>Action</Text>
                </View>
                <View style={{flex:1}}>
                  <FlatList
                     refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                      />
                    }
                      data={this.state.ProductList}
                      renderItem={({item,index})=>
                      <View style={{borderBottomWidth:0.5,marginTop:5}}>
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                          <Text style={{width:20,marginLeft:5}}>{index+1}</Text>
                          <Text style={{width:100}}>{item.cat_name}</Text>
                          <Text style={{width:100}}>{item.sub_cat_name}</Text>
                          <Text style={{width:100}}>{item.title}</Text>
                          <Text style={{width:80}}>{item.qty}</Text>
                          <View>
                          <View style={{flexDirection:'row',width:280,alignItems:'center',justifyContent:'space-around'}}>
                            <TouchableOpacity style={[styles.ButtonView,{backgroundColor:'#00A4B6'}]} onPress={()=>this.props.navigation.navigate('ProductEdit',{ItemData:item,ViewProduct:true})}>
                              <Image style={{width:20,height:20}}
                                source={require('../Menu_images/Edit.png')} />
                                {/* <Text style={{fontSize:10}}>Edit</Text> */}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ButtonView,{backgroundColor:'green'}]} onPress={()=>this.props.navigation.navigate('ProductEdit',{ItemData:item,ViewProduct:false})}>
                              <Image style={{width:20,height:20}}
                                source={require('../Menu_images/document-icon-vector-27.jpg')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ButtonView,{backgroundColor:'red'}]} onPress={()=>this.createTwoButtonAlert(item)} >
                              <Image style={{width:15,height:15}} resizeMode='contain'
                                source={require('../../Images/CloseIcone.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ButtonView,{backgroundColor:'#2B84CE'}]} onPress={()=>this.props.navigation.navigate('Add_Qty',{ItemData:item,})}>
                              <Image style={{width:20,height:20}} resizeMode='contain'
                                source={require('../Menu_images/add-57.png')} />
                            </TouchableOpacity>
                          </View>
                          <View style={{flexDirection:'row',marginTop:5,justifyContent:'space-around',marginBottom:5}}>
                            <TouchableOpacity style={[styles.ButtonView,{flexDirection:'row',backgroundColor:'green'}]} onPress={()=> this.props.navigation.navigate('Qty_History',{ItemData:item,})}>
                              <Image style={{width:10,height:10}}
                                source={require('../Menu_images/add-57.png')} />
                              <Image style={{width:20,height:20}}
                                source={require('../Menu_images/document-icon-vector-27.jpg')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'green',borderRadius:5,padding:5,alignItems:'center',justifyContent:'center',height:35}} onPress={()=> this.props.navigation.navigate('Advertisement_Add',{itemData:item})}>
                              <Text style={{color:'white'}}>Add To Advertisement</Text>
                            </TouchableOpacity>
                          </View>
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
    width:55,
    borderRadius:5,
    height:35,
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
