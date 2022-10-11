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
export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            CategoryArray:[],
            ProductArray:[],
            SelectCategory:'Select Category',
            category_id:'',
            SelectProduct:'Select Product',
            Product_id:'',
            imagePick:[],
            UserID:'',
            Days:'',
            active:false,
            user_Type:''
        }
    }

    displayData = async ()=>{  
      console.log('chalaaa')
      try{  
        let user = await AsyncStorage.getItem('user');  
        let UserID = await AsyncStorage.getItem('UserID');  
        console.log('user type',user)
        this.setState({user_Type:user})
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

    CategoryFunCall(){
      let url= api.baseURL;
      fetch( url+'wb/get_advertisement_category', {
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
            this.setState({CategoryArray:responseData.data})
          }
          
          })
         .catch((err) => { console.log(err); });
    }
    selectCategoryFun(item){
        this.setState({CategoryArray:[]})
        this.setState({SelectCategory:item.category_name})
        this.setState({category_id:item.category_id})
    }
    ProductFunCall(){
      console.log('User idddd ',this.state.UserID)
      let url= api.baseURL;
      fetch( url+'wb/get_advertisement_product', {
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
            this.setState({ProductArray:responseData.data})
          }
          
          })
         .catch((err) => { console.log(err); });
       // this.setState({ProductArray:[1,2,3,4]})
    }
    selectProductFun(item){
        this.setState({ProductArray:[]})
        this.setState({SelectProduct:item.product_title})
        this.setState({Product_id:item.p_id})
    }
    // ChoseImageFun(){
    //        // console.log("value ",value)
    //         var options = {
    //           title: 'Select Image',
    //           customButtons: [
    //             { 
    //               name: 'customOptionKey', 
    //               title: 'Choose file from Custom Option' 
    //             },
    //           ],
    //           storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //           },
    //         };
    //        //console.log("image picker",ImagePicker)
    //        launchImageLibrary(options, res => {
    //           console.log('Response = ', res);
        
    //           if (res.didCancel) {
    //             console.log('User cancelled image picker');
    //           } else if (res.error) {
    //             console.log('ImagePicker Error: ', res.error);
    //           } else if (res.customButton) {
    //             console.log('User tapped custom button: ', res.customButton);
    //             alert(res.customButton);
    //           } else {
    //             let source = res;
    //             imageName = res.fileName;
    //             console.log('image name',res)
    //             //this.state.ImageDoc.push(res.uri)
    //             this.state.imagePick.push({Imgname:imageName})
    //             this.setState({imagePick:this.state.imagePick})
    //           }
    //           console.log('add images',this.state.imagePick)
    //         });
    // }
    // DeletItem(itemm){
    //     //console.log("delet function call",item)
    //     const filteredData = this.state.imagePick.filter(item => item.Imgname !== itemm);
    //     this.setState({ imagePick: filteredData });
    //   }
      SubmitProcess(){
        if(this.props.itemData !=undefined){
          //this.state.category_id = this.props.itemData.category_id
          this.state.Product_id = this.props.itemData.p_id
        }
        console.log('dataaaaa ',this.state.category_id,this.state.Product_id,this.state.UserID)
        this.setState({active:true})
        this.setState({ErrorShow:''})
        let url= api.baseURL;
        fetch( url+'wb/add_advertisement', {
          method: 'POST',
          headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          },
          body:JSON.stringify({user_id:this.state.UserID,ad_category:this.state.category_id,days:this.state.Days,p_id:this.state.Product_id})
        }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          this.setState({active:false})
          if(responseData.status=='200'){
            alert(responseData.message)
            if(this.props.itemData !=undefined){
              Actions.drawerMenu()
            }
            this.setState({Days:''})
            this.setState({SelectProduct:'Select Product'})
            this.setState({category_id:''})
            this.setState({Product_id:''})
            this.setState({SelectCategory:'Select Category'})
            this.props.navigation.navigate('Advertisement_List')
            //this.setState({ProductArray:responseData.data})
          }
          else{
            this.setState({ErrorShow:responseData.message})
          }
          })
         .catch((err) => { console.log(err); });
      }
    render(){
      console.log('recive data',this.props.itemData)
      var But_Visible = false
      if(this.props.itemData !=undefined){
        //this.state.SelectCategory = this.props.itemData.category_name
        this.state.SelectProduct = this.props.itemData.title
        But_Visible = true
      }
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6',width:'100%'}}>
            <ScrollView>
                <View style={{flex:1,marginLeft:20,marginTop:20,width:'100%'}}>
                   <View style={{flexDirection:'row',width:'100%'}}>
                        <TouchableOpacity style={{width:25,height:20}}  onPress={()=>Actions.drawerMenu()}>
                            <Image style={{width:25,height:20}}
                                source={require('../../Images/Digital__Design_99-512.png')} />
                        </TouchableOpacity>
                        <View style={{alignItems:'center',width:'80%'}}>
                            <Text style={{fontSize:16,fontWeight:'bold'}}>Add Advertisement</Text>
                        </View>
                   </View>
                  <View style={{marginTop:20}}>
                     <Text style={styles.Header_Text}>Category</Text>
                     <TouchableOpacity  style={[styles.InputView,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}
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
                                <TouchableOpacity style={{width:'85%',flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,padding:5}} onPress={()=>this.selectCategoryFun(item)}>
                                    <Text style={{fontSize:14}}>{item.category_name}</Text>
                                    <Text style={{fontSize:14}}>{item.charge}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                         />
                     </View>
                  </View>
                  {this.state.user_Type =='Vender'?
                  <View style={{marginTop:20}}>
                  <Text style={styles.Header_Text}>Product</Text>
                  <TouchableOpacity disabled={But_Visible} style={[styles.InputView,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}
                     onPress={()=>this.ProductFunCall()} >
                      <Text style={{fontSize:14}}>{this.state.SelectProduct}</Text>
                      <Image style={{width:15,height:8}}
                         source={require('../Menu_images/Drop_Down-512.png')}  />
                  </TouchableOpacity>
                  <View>
                      <FlatList
                         data={this.state.ProductArray}
                         renderItem={({item})=>
                         <View>
                             <TouchableOpacity style={{width:'85%',borderBottomWidth:1,padding:5}} onPress={()=>this.selectProductFun(item)}>
                                 <Text style={{fontSize:14}}>{item.product_title}</Text>
                             </TouchableOpacity>
                         </View>
                     }
                      />
                  </View>
               </View>
                  :null}
                  <View style={styles.ViewStyle}>
                     <Text style={styles.Header_Text}>Days</Text>
                     <TextInput style={styles.InputView}
                        placeholder='Enter Your Days'
                        defaultValue={this.state.Days}
                        keyboardType={'numeric'}
                        onChangeText={(text)=>this.setState({Days:text})}  />
                  </View>
                  {/* <View style={styles.ViewStyle}>
                     <Text style={styles.Header_Text}>Advertisement Image</Text>
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
                  </View> */}
                 {this.state.active?
                  <View style={{marginTop:10}}>
                    <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                 :null}
                  <TouchableOpacity style={styles.ButtonView} onPress={()=>this.SubmitProcess()}>
                    <Text style={{fontSize:15,color:'white',fontWeight:'600'}}>Add</Text>
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