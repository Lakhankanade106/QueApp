import React, { Component } from 'react';
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
  ActivityIndicator,
  Alert,
  
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from '../Config/api'

export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            userTypeArry:[],
            UserID:'',
            UserType:'Select User Type',
            user_type_id:'',
            Partner_list_Array:[],
            MyProps:''
        }
    }
    componentDidMount(){
        this.displayData()
    }
    displayData = async ()=>{  
      console.log('chalaaa')
      try{  
        let UserID = await AsyncStorage.getItem('UserID');  
        this.setState({UserID:UserID})
       // this.GetDataFun()
       this.setState({MyProps:this.props.navigation.state.key})
        console.log('user id',UserID)
        //alert(user);  
      }  
      catch(error){  
        alert(error)  
      }  
    } 
    UserTypeFun(){
        let url= api.baseURL;
        fetch( url+'wb/partner_user_types', {
            method: 'POST',
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json',
             // "Content-Disposition": 'multipart/form-data'
              //'Content-Type': 'multipart/form-data'
              //'Content-Length': data.length 
              },
              body:JSON.stringify({user_id:this.state.UserID})
            }).then((response) => response.json())
              .then((responseData) =>
               { console.log("response1111: " + JSON.stringify(responseData));
               //this.setState({Activity:false})
               if(responseData.status == 200){
                 this.setState({userTypeArry:responseData.data})
                 //this.props.navigation.navigate('drawerMenu')
               }else{
               }
               })
              .catch((err) => { console.log(err); });
    }

    Select_UserType_Fun(item){
        this.setState({UserType:item.user_type})
        this.setState({user_type_id:item.user_type_id})
        this.setState({userTypeArry:[]})
        this.Partner_list_Api(item.user_type_id);
    }

    Partner_list_Api(user_type_id){
        console.log('user type',user_type_id)
        let url= api.baseURL;
        fetch( url+'wb/get_user_partner', {
            method: 'POST',
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json',
             // "Content-Disposition": 'multipart/form-data'
              //'Content-Type': 'multipart/form-data'
              //'Content-Length': data.length 
              },
              body:JSON.stringify({user_id:this.state.UserID,usertype_id:user_type_id})
            }).then((response) => response.json())
              .then((responseData) =>
               { console.log("response1111: " + JSON.stringify(responseData));
               //this.setState({Activity:false})
               if(responseData.status == 200){
                 this.setState({Partner_list_Array:responseData.data})
                 //this.props.navigation.navigate('drawerMenu')
               }else{
               }
               })
              .catch((err) => { console.log(err); });
    }
    reloadFun(){
      window.location.reload(false);
    }
    Add_Partner_Api(item){
        console.log('itemsss ',item)
        let url= api.baseURL;
        fetch( url+'wb/add_partner', {
            method: 'POST',
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json',
             // "Content-Disposition": 'multipart/form-data'
              //'Content-Type': 'multipart/form-data'
              //'Content-Length': data.length 
              },
              body:JSON.stringify({user_id:this.state.UserID,usertype_id:this.state.user_type_id,other_id:item.other_id})
            }).then((response) => response.json())
              .then((responseData) =>
               { console.log("response1111: " + JSON.stringify(responseData));
               //this.setState({Activity:false})
               if(responseData.status == 200){
                // this.setState({Partner_list_Array:responseData.data})
                console.log('or kit?',this.props.navigation.state.key)
                
                alert(responseData.message)
                //Actions.PartnerList()
                 this.props.navigation.navigate('PartnerList')
               }else{
               }
               })
              .catch((err) => { console.log(err); });
    }
    getSnapshotBeforeUpdate(){
      if(this.props.navigation.state.key != this.state.MyProps){
        console.log('or kitnaa chalega?',this.props.navigation.state.key)
        this.componentDidMount()
      }
      else{
        console.log('or kitnaa chalega else?',this.props.navigation.state.key)
      //  this.componentDidMount()
      }
     // console.log('props',this.props.navigation.state.key)
      //this.displayData()
   }
    render(){
      
        return(
            <SafeAreaView>
                 <View style={{marginLeft:20,marginTop:10}}>
                    <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>Actions.pop()}>
                        <Image style={{width:20,height:20}}
                            source={require('../Menu_images/Digital__Design_99-512.png')}
                        />
                        <Text style={{fontSize:16,marginLeft:10}}>Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:10}}>
                    <TouchableOpacity style={{width:'90%',borderRadius:10,height:40,flexDirection:'row',alignItems:'center',justifyContent:'space-between',alignSelf:'center',borderWidth:1}}
                        onPress={()=>this.UserTypeFun()} >
                        <Text style={{marginLeft:20,fontSize:14,fontWeight:'600'}}>{this.state.UserType}</Text>
                        <Image style={{width:10,height:10,marginRight:10}}
                            source={require('../Menu_images/Drop_Down-512.png')}
                        />
                    </TouchableOpacity>
                    <View style={{marginTop:10}}>
                        <FlatList
                            data={this.state.userTypeArry}
                            renderItem={({item})=>
                            <View>
                                <TouchableOpacity style={{width:'90%',marginTop:3,alignSelf:'center',borderWidth:1,height:30,borderRadius:5,alignItems:'center',justifyContent:'center'}}
                                    onPress={()=>this.Select_UserType_Fun(item)} >
                                    <Text>{item.user_type}</Text>
                                </TouchableOpacity>
                            </View>
                         }
                            />
                    </View>
                    {this.state.Partner_list_Array !=''?
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                        <View style={{flex:1}}>
                            <View style={{flexDirection:'row',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                                <Text style={[styles.Header_Text,{width:20,marginLeft:10}]}>#</Text>
                                <Text style={styles.Header_Text}>First Name</Text>
                                <Text style={[styles.Header_Text]}>Last Name</Text>
                                <Text style={styles.Header_Text}>Mobile</Text>
                                <Text style={[styles.Header_Text,{width:150}]}>Email</Text>
                                <Text style={[styles.Header_Text,{marginRight:10}]}>Action</Text>
                            </View>
                            <FlatList 
                                data={this.state.Partner_list_Array}
                                renderItem={({item,index})=>
                                <View style={{flexDirection:'row',marginTop:15,borderBottomWidth:0.5,justifyContent:'space-around'}}>
                                    <Text style={[styles.Header_Text,{width:20,marginLeft:10}]}>{index+1}</Text>
                                    <Text style={styles.Header_Text}>{item.firstname}</Text>
                                    <Text style={[styles.Header_Text]}>{item.lastname}</Text>
                                    <Text style={styles.Header_Text}>{item.mobile}</Text>
                                    <Text style={[styles.Header_Text,{width:150}]}>{item.email}</Text>
                                    <View style={{width:100}}>
                                        <TouchableOpacity style={{borderWidth:1,backgroundColor:'green',width:80,alignItems:'center',marginBottom:5,justifyContent:'center',height:40}}
                                            onPress={()=>this.Add_Partner_Api(item)} >
                                            <Text style={{marginRight:10,fontSize:16,fontWeight:'500',color:'white'}}>Add</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>} />
                        </View>
                    </ScrollView>
                    :null}
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    Header_Text:{
      fontSize:16,
      fontWeight:'500',
      color:'#424949',
      width:100,
      marginLeft:15,
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
      justifyContent:'center'
    }
    // Button_View:{
    //   justifyContent:'center',
    //   alignItems:'center',
    //   alignSelf:'center',
    //   borderBottomWidth:1
    // },
    
  });