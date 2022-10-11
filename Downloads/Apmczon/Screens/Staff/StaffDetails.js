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
   FlatList,
   AsyncStorage
 } from 'react-native';
 import { Actions } from 'react-native-router-flux';
 import api from '../Config/api'
 import Storage from '../Config/Storage'
 
 export default class App extends React.Component {
   constructor(props){
     super(props)
     this.state={
         StaffList:[],
         UserID:''
     }
   }
   displayData = async ()=>{  
     console.log('chalaaa')
     try{  
       let user = await AsyncStorage.getItem('user');  
       let UserID = await AsyncStorage.getItem('UserID');  
       //console.log('useriddddd',UserID)
       
       this.setState({UserID:UserID})
       this.GetDataApi()
       //console.log('user',user)
       //alert(user);  
     }  
     catch(error){  
       alert(error)  
     }  
   }  
   GetDataApi(){
       console.log('idd',this.props.id)
     let url= api.baseURL;
       fetch( url+'wb/get_staff_full_details_list', {
          method: 'POST',
          headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          //'Content-Length': data.length 
          },
          body:JSON.stringify({user_id:this.props.id})
        }).then((response) => response.json())
          .then((responseData) =>
           { console.log("responsessss: " + JSON.stringify(responseData));
           if(responseData.status=='200'){
             this.setState({StaffList:responseData.data})
           }
           
           })
          .catch((err) => { console.log(err); });
   }
   componentDidMount(){
     this.displayData()
       //this.setState({TrangectionArry:[1,2,3,4,6]})
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
                <Text style={{fontSize:16,fontWeight:'bold'}}>Staff Details</Text>
            </View>
        </View>
         <ScrollView >
             <View style={{flex:1}}>
               <ScrollView horizontal={true} style={{width:'100%'}} showsHorizontalScrollIndicator={false}>
                 <View style={{width:'100%'}}  >
                 <View style={{flexDirection:'row',borderTopWidth:0.5,borderBottomWidth:0.5,marginTop:15}}>
                   <View style={{width:20,}}>
                      <Text style={styles.Header_Text}>#</Text>
                   </View>
                   <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>Name</Text>
                   </View>
                   {/* <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Gender</Text>
                   </View>
                   <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Date of Birth</Text>
                   </View> */}
                   <View style={{width:150,marginLeft:8,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Address</Text>
                   </View>
                   <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>City</Text>
                   </View>
                   <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>State</Text>
                   </View>
                   <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                      <Text style={styles.Header_Text}>Company Name</Text>
                   </View>
                   <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                   <Text style={styles.Header_Text}>Date</Text>
                   </View>
                 </View>
                 <FlatList 
                     data={this.state.StaffList}
                     renderItem={({item,index})=>
                     <View style={{flexDirection:'row',marginTop:15}}>
                          <View style={{width:20,marginLeft:10}}>
                              <Text>{index+1}</Text>
                          </View>
                          <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                             <Text>{item.staff_name}</Text>
                          </View>
                          {/* <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                             <Text>{item.gender}</Text>
                          </View>
                          <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                             <Text>{item.dob}</Text>
                          </View> */}
                          <View style={{width:150,marginLeft:8,alignItems:'center'}}>
                             <Text>{item.address}</Text>
                          </View>
                          <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                             <Text>{item.city}</Text>
                          </View>
                          <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                             <Text>{item.state}</Text>
                          </View>
                          <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                              <Text>{item.company_name}</Text>
                          </View>
                          <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                             <Text>{item.date}</Text>
                          </View>
                     </View>} />
                 </View>
                 </ScrollView>
                 
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
   
 });
 