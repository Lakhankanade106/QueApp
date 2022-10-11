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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from '../Screens/Config/api'

export default class app extends Component{
    constructor(props){
        super(props)
        this.state={
            MobileNo:'',
            RevieMessage:'',
            UserID:'',
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
      VelidationForm(){
          this.setState({ErrorShow:''})
          const velidetionArray =[]
          if(this.state.MobileNo.length == 11 )
          {
              this.setState({ErrorShow:'The Mobile field must be at least 10 Digit'})
          }
          else if (this.state.RevieMessage.length <= 50){
              this.setState({ErrorShow:'The Message field must be at least 100 characters'})
          }
          else{
              this.SubmitFun()
          }
      }
    SubmitFun(){
        this.setState({ErrorShow:''})
        let url= api.baseURL;
      fetch( url+'wb/add_review', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({user_id:this.state.UserID,msg:this.state.RevieMessage,mobile:this.state.MobileNo})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({ProductView:responseData.data})
            Actions.ReviewList()
          }
          else{
              this.setState({ErrorShow:responseData.message})
          }
          
          })
         .catch((err) => { console.log(err); });
    }
    render(){
        return(
            <SafeAreaView>
                <View style={{width:'90%',alignSelf:'center',marginTop:20}}>
                <View style={{marginBottom:20}}>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>Actions.pop()}>
                  <Image style={{width:20,height:20}}
                  source={require('../Screens/Menu_images/Digital__Design_99-512.png')}
                  />
                  <Text style={{fontSize:16,marginLeft:10}}>Back</Text>
                </TouchableOpacity>
              </View>
                    <Text style={{fontSize:16}}>Mobile NO</Text>
                    <TextInput style={{borderWidth:1,height:40,fontSize:16,width:'80%',padding:10,borderRadius:10,marginTop:10}}
                       placeholder='Enter Your Mobile No.'
                       keyboardType='numeric'
                       maxLength={10}
                       onChangeText={(text)=>this.setState({MobileNo:text})}
                    />
                    <View style={{marginTop:20}}>
                        <Text style={{fontSize:16}}>Message</Text>
                        <TextInput style={{borderWidth:1,fontSize:16,height:100,width:'80%',padding:10,borderRadius:10,marginTop:10}}
                          placeholder='Enter Your Review/Suggestion'
                          multiline={true}
                          onChangeText={(text)=>this.setState({RevieMessage:text})}
                        />
                    </View>
                    <Text style={{marginTop:10,alignSelf:'center',color:'red',fontSize:16,fontWeight:'600'}}>{this.state.ErrorShow}</Text>
                    <View style={{marginTop:20}}>
                        <TouchableOpacity style={{backgroundColor:'#00A952',width:'40%',height:50,alignItems:'center',justifyContent:'center'}} onPress={()=>this.VelidationForm()}>
                            <Text style={{fontSize:16,fontWeight:'800',color:'white'}}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}