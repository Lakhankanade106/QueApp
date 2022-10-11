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
   ActivityIndicator
 } from 'react-native';
 import { Actions } from 'react-native-router-flux';
 import api from '../Config/api'

 export default class App extends Component{
     constructor(props){
         super(props)
         this.state={
            UserID:'',
            name:'',
            mobile:'',
            description:'',
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
         // this.GetProductList()
          
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
     SubmitProcess(){
       this.setState({Activity:true})
       this.setState({ErrorShow:''})
        let url= api.baseURL;
        fetch( url+'wb/help_form', {
           method: 'POST',
           headers: { 
           'Accept': 'application/json', 
           'Content-Type': 'application/json',
           },
           body:JSON.stringify({user_id:this.state.UserID,name:this.state.name,mobile:this.state.mobile,description:this.state.description})
         }).then((response) => response.json())
           .then((responseData) =>
            { console.log("responsessss: " + JSON.stringify(responseData));
            this.setState({Activity:false})
            if(responseData.status=='200'){
                Actions.pop()
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
                 <View>
                    <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                        <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.drawerMenu()}>
                            <Image style={{width:25,height:20}}
                                source={require('../../Images/Digital__Design_99-512.png')} />
                        </TouchableOpacity>
                        <View style={{alignItems:'center',width:'80%'}}>
                            <Text style={{fontSize:16,fontWeight:'bold'}}>Help</Text>
                        </View>
                    </View>
                    <View style={{marginLeft:20,marginTop:20}}>
                        <View>
                            <Text style={styles.Header_Text}>Name</Text>
                            <TextInput style={styles.InputView}
                                placeholder='Name'
                                onChangeText={(text)=>this.setState({name:text})}  />
                        </View>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.Header_Text}>Mobile</Text>
                            <TextInput style={styles.InputView}
                                placeholder='Mobile'
                                keyboardType='numeric'
                                onChangeText={(text)=>this.setState({mobile:text})}  />
                        </View>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.Header_Text}>Description</Text>
                            <TextInput style={[styles.InputView,{height:120}]}
                                placeholder='Description'
                                multiline={true}
                                onChangeText={(text)=>this.setState({description:text})}  />
                        </View>
                        {this.state.Activity?<ActivityIndicator style={{marginTop:10}} size="large" color="#00ff00" />:null}
                        <TouchableOpacity style={styles.ButtonView} disabled={this.state.Activity} onPress={()=>this.SubmitProcess()}>
                            <Text style={{fontSize:15,color:'white',fontWeight:'600'}}>Submit</Text>
                        </TouchableOpacity>
                        <Text style={{marginTop:20,justifyContent:'center',color:'red',fontSize:14,fontWeight:'700',alignSelf:'center'}}>{this.state.ErrorShow}</Text>
                     </View>
                 </View>
             </SafeAreaView>
         )
     }
 }

 const styles = StyleSheet.create({
    Header_Text:{
      fontSize:16,
      fontWeight:'500',
      color:'#424949'
    },
    InputView:{
      width:'85%',
      height:40,
      backgroundColor:'white',
      marginTop:10,
      borderRadius:10,
      padding:10,
      fontSize:14,
      borderWidth:0.5
    },
    ViewStyle:{
      marginTop:15
    },
    ButtonView:{
      width:'35%',
      height:40,
      backgroundColor:'green',
      marginTop:20,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:10
    }  
  });