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
            ReviewData:[],
            UserID:''

        }
    }
    displayData = async ()=>{  
        console.log('chalaaa')
        try{  
          let user = await AsyncStorage.getItem('user');  
          let UserID = await AsyncStorage.getItem('UserID');  
          this.setState({UserID:UserID})
          this.getApiData()
        }  
        catch(error){  
          alert(error)  
        }  
      }  
    componentDidMount(){
        this.displayData()
    }
    getApiData(){
        this.setState({ErrorShow:''})
        let url= api.baseURL;
      fetch( url+'wb/review_list', {
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
            this.setState({ReviewData:responseData.data})
            //Actions.ReviewList()
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
                    <View style={{marginLeft:10,marginTop:10,marginBottom:15}}>
                        <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>Actions.pop()}>
                            <Image style={{width:20,height:20}}
                                source={require('../Screens/Menu_images/Digital__Design_99-512.png')}
                            />
                            <Text style={{fontSize:16,marginLeft:10}}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View>
                            <View style={{flexDirection:'row',borderWidth:1,padding:5}}>
                                <Text style={[styles.Header_Text,{width:40}]}>#</Text>
                                <Text style={styles.Header_Text}>First Namer</Text>
                                <Text style={styles.Header_Text}>Last Name</Text>
                                <Text style={styles.Header_Text}>Mobile</Text>
                                <Text style={[styles.Header_Text,{width:150}]}>Message</Text>
                                <Text style={styles.Header_Text}>Date</Text>
                            </View>
                            <View style={{marginTop:10}}>
                                <FlatList
                                  data={this.state.ReviewData}
                                  renderItem={({item,index})=>
                                  <View style={{flexDirection:'row',borderBottomWidth:0.5,padding:5}}>
                                      <Text style={[styles.Header_Text,{width:40}]}>{index+1}</Text>
                                      <Text style={styles.Header_Text}>{item.firstname}</Text>
                                      <Text style={styles.Header_Text}>{item.lastname}</Text>
                                      <Text style={styles.Header_Text}>{item.mobile}</Text>
                                      <Text style={[styles.Header_Text,{width:150}]}>{item.msg}</Text>
                                      <Text style={styles.Header_Text}>{item.created_date}</Text>
                                  </View>
                                }
                                />
                            </View>
                        </View>
                    </ScrollView>
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
      alignSelf:'center',
      alignItems:'center',
      justifyContent:'center'
    },
  });