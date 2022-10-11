import React, { Component } from 'react';
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
  AsyncStorage,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker/src/index';
import api from '../Config/api'
 import Storage from '../Config/Storage'

export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            CategoryArray:[],
           // ProductArray:[],
            SelectCategory:'Select Category',
           // SelectProduct:'Select Product',
            imagePick:[],
            UserID:'',
            category_id:'',
            subcat_name:'',
            imageFileName:'',
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
    CategoryFunCall(){
       // this.setState({CategoryArray:[1,2,3,4]})
        let url= api.baseURL;
      fetch( url+'wb/category', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: JSON.stringify({user_id:this.state.UserID})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status =='201'){
            
              this.setState({ErrorShow:responseData.message})
          }
          else{
            //this.setState({typeCat:event})
            this.setState({CategoryArray:responseData.data})
          }
          })
         .catch((err) => { console.log(err); });
    }
    selectCategoryFun(item){
      console.log('itmsss ',item)
        this.setState({CategoryArray:[]})
        this.setState({SelectCategory:item.cat_name})
        this.setState({category_id:item.cat_id})
    }
    
    ChoseImageFun(){
           // console.log("value ",value)
            var options = {
              title: 'Select Image',
              customButtons: [
                { 
                  name: 'customOptionKey', 
                  title: 'Choose file from Custom Option' 
                },
              ],
              storageOptions: {
                skipBackup: true,
                path: 'images',
              },
            };
           //console.log("image picker",ImagePicker)
           launchImageLibrary(options, res => {
              console.log('Response = ', res);
        
              if (res.didCancel) {
                console.log('User cancelled image picker');
              } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
              } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
              } else {
                let source = res;
                imageName = res.fileName;
                console.log('image name',res)
                //this.state.ImageDoc.push(res.uri)
                this.setState({imageFileName:imageName})
                this.state.imagePick.push({Imgname:imageName})
                this.setState({imagePick:this.state.imagePick})
              }
              console.log('add images',this.state.imagePick)
            });
    }
    DeletItem(itemm){
        //console.log("delet function call",item)
        const filteredData = this.state.imagePick.filter(item => item.Imgname !== itemm);
        this.setState({ imagePick: filteredData });
      }
      SubmitProcess(){
        this.setState({Activity:true})
        this.setState({ErrorShow:''})
        console.log('user idddd',this.state.subcat_name)
        const formData = new FormData()
        formData.append('user_id',this.state.UserID)
        formData.append('category_id',this.state.category_id)
        formData.append('subcat_name',this.state.subcat_name)
        formData.append('images',this.state.imageFileName)
        let url= api.baseURL;
        fetch( url+'wb/subcategory_by_user', {
           method: 'POST',
           headers: { 
           'Accept': 'application/json', 
           //'Content-Type': 'application/json',
           'Content-Type': 'multipart/form-data'
           //'Content-Length': data.length 
           },
          body:formData
         }).then((response) => response.json())
           .then((responseData) =>
            { console.log("response: " + JSON.stringify(responseData));
            this.setState({Activity:false})
            if(responseData.status =='201'){
              
                this.setState({ErrorShow:responseData.message})
            }
            else{
              //this.setState({typeCat:event})
              //console.log('responce data ',responseData)
              this.setState({ErrorShow:''})
              this.setState({subcat_name:''})
              this.setState({SelectCategory:'Select Category'})
              this.setState({imagePick:[]})
              alert(responseData.message)
              //this.setState({CategoryArray:responseData.data})
            }
            })
           .catch((err) => { console.log(err); });
      }
    render(){
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6',width:'100%'}}>
            <ScrollView>
                <View style={{flex:1,marginLeft:20,marginTop:20,width:'100%'}}>
                   <View style={{flexDirection:'row',width:'100%'}}>
                        <TouchableOpacity style={{width:25,height:20}} onPress={()=>Actions.drawerMenu()}>
                            <Image style={{width:25,height:20}}
                                source={require('../../Images/Digital__Design_99-512.png')} />
                        </TouchableOpacity>
                        <View style={{alignItems:'center',width:'80%'}}>
                            <Text style={{fontSize:16,fontWeight:'bold'}}>Add Subcategory</Text>
                        </View>
                   </View>
                  <View style={{marginTop:20}}>
                     <Text style={styles.Header_Text}>Category</Text>
                     <TouchableOpacity style={[styles.InputView,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}
                        onPress={()=>this.CategoryFunCall()} >
                         <Text style={{fontSize:14}}>{this.state.SelectCategory}</Text>
                         <Image style={{width:15,height:8}}
                            source={require('../Menu_images/Drop_Down-512.png')}  />
                     </TouchableOpacity>
                     <View>
                         <FlatList
                            data={this.state.CategoryArray}
                            renderItem={({item})=>
                            <View>
                                <TouchableOpacity style={{width:'85%',borderBottomWidth:1,padding:5}} onPress={()=>this.selectCategoryFun(item)}>
                                    <Text style={{fontSize:14}}>{item.cat_name}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                         />
                     </View>
                  </View>
                  
                  <View style={styles.ViewStyle}>
                     <Text style={styles.Header_Text}>Subcategory</Text>
                     <TextInput style={styles.InputView}
                        placeholder='Add Subcategory'
                        defaultValue={this.state.subcat_name}
                        onChangeText={(text)=>this.setState({subcat_name:text})}  />
                  </View>
                  <View style={styles.ViewStyle}>
                     <Text style={styles.Header_Text}>Brand Image</Text>
                     <TouchableOpacity style={{height:40,width:'40%',backgroundColor:'white',alignItems:'center',justifyContent:'center',marginTop:10}}
                        onPress={()=>this.ChoseImageFun()} >
                         <Text style={{fontSize:14}}>Choose File</Text>
                     </TouchableOpacity>
                  </View>
                  <View style={{width:'90%'}}>
                    <FlatList style={{marginTop:5}}
                        data={this.state.imagePick}
                        renderItem={({item})=>
                        <View style={{width:'100%',flexDirection:'row',borderRadius:10,padding:5,marginTop:5,justifyContent:'space-between',alignItems:'center',alignSelf:'center',borderWidth:0.5,alignItems:'center'}}>
                            <Text style={{width:'90%'}}>{item.Imgname}</Text>
                            <TouchableOpacity onPress={()=>this.DeletItem(item.Imgname)}>
                                <Text style={{fontSize:30,fontWeight:'500',transform: [{ rotate: '40deg'}]}}>+</Text>
                            </TouchableOpacity>
                        </View> }  />
                  </View>
                  {this.state.Activity?
                  <ActivityIndicator style={{marginTop:10}} size="large" color="#00ff00" />
                  :null}
                  <TouchableOpacity style={styles.ButtonView} disabled={this.state.Activity} onPress={()=>this.SubmitProcess()}>
                    <Text style={{fontSize:15,color:'white',fontWeight:'600'}}>Submit</Text>
                  </TouchableOpacity>
                  <Text style={{marginTop:20,justifyContent:'center',color:'red',fontSize:14,fontWeight:'700',alignSelf:'center'}}>{this.state.ErrorShow}</Text>
                </View>
            </ScrollView>
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