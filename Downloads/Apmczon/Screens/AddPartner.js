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
  AsyncStorage,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import ImagePicker from 'react-native-image-picker';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker/src/index';
import DocumentPicker from 'react-native-document-picker';
import { Marker } from 'react-native-maps';
import api from './Config/api'
import DataStore  from  './Config/Storage'


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      userType:[],
      DockType:[],
      user:{name:'User Type'},
      UserID:'',
      Document:{cat_name:'Document Type'},
      RagiImage:{
        url:'',
        name:'No File Choosen',
        type:''
      },
      IDProff:{
        url:'',
        name:'No File Choosen',
        type:''
      },
      GSTNumber:'',
      RagiNumber:'',
      latitude:'',
      longitude:'',
      //IdProffImage:'',
      //DocUpload:'',
     // IdCardUpload:'',
      //RegiCardUplad:''
      IdCardImg:[],
      IdCardName:[],
      OtheDocImg:[],
      OtheDocName:[],
      Activity:false,
      ErrorShow:'',
      address:'',
      city:'',
      state:'',
      company_name:'',
      accholder_name:'',
      bank_name:'',
      ifsc_code:'',
      acc_number:'',
      QR_image:''
    }
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let UserID = await AsyncStorage.getItem('UserID'); 
      console.log('user iddddddd',UserID) 
      this.setState({UserID:UserID})
      
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  }  
  componentDidMount(){
    console.log('api call',api)
    
    this.displayData()
  }
  UserTypeApi(){
    let url= api.baseURL;
      fetch( url+'wb/user_types', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
       }).then((response) => response.json())
         .then((responseData) =>
          { //console.log("response: " + responseData);
          if(responseData.status=='200'){
            this.setState({userType:responseData.data})
          }
          
          })
         .catch((err) => { console.log(err); });
  }
  DocumentTypeApi(){
    let url= api.baseURL;
      fetch( url+'wb/document_types', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
       }).then((response) => response.json())
         .then((responseData) =>
          { //console.log("response: " + responseData);
          if(responseData.status=='200'){
            this.setState({DockType:responseData.data})
          }
          
          })
         .catch((err) => { console.log(err); });
  }
  
  UserSelect(item){
    this.setState({user:item})
    this.setState({userType:[]})
  }
  DocSelect(item){
    console.log('item data',item)
    this.setState({Document:item})
    this.setState({DockType:[]})
  }
  SelectImage(value){
    console.log("value ",value)
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
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };
   console.log("image picker",ImagePicker)
   launchImageLibrary(options, res => {
     // console.log('Response = ', res);

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
        this.setState({
          ImageDoc: source,
        });
        console.log('image name',source)
        switch(value){
          case 1:{
            console.log('1 case chala',source)
            let source = res;
            this.state.IdCardImg.push(source.uri)
            this.state.IdCardName.push(source.fileName)
            this.setState({IdCardImg:this.state.IdCardImg})
            this.setState({IdCardName:this.state.IdCardName})
            break;
          }
          case 2:{
            console.log('2 case chala',source)
            let source = res;
            this.state.OtheDocImg.push(source.uri)
            this.state.OtheDocName.push(source.fileName)
            this.setState({OtheDocImg:this.state.OtheDocImg})
            this.setState({OtheDocName:this.state.OtheDocName})
            break;
          }
          case 3:{
            console.log('2 case chala',source)
            let source = res;
           // this.state.OtheDocImg.push(source.uri)
            //this.state.OtheDocName.push(source.fileName)
           // this.setState({OtheDocImg:this.state.OtheDocImg})
            this.setState({QR_image:source.uri})
            break;
          }
        }
      }
    });
  }
  LoginAPIProcesss(data){
    console.log('api data',api.baseURL)
    console.log('Dataaaaa ',data)
    this.setState({ErrorShow:''})
    this.setState({Activity:true})
    let body = JSON.stringify({email_mobile:data.Mobile_no,password:data.Password,device_id:'123456'})
    let url= api.baseURL;
      fetch( url+'wb/login', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: body
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Login: " + JSON.stringify(responseData));
         // AsyncStorage.setItem('UserID',responseData.data.id);
         this.setState({Activity:false})
         if(responseData.status == '201'){
          this.setState({ErrorShow:responseData.message})
          }
          if (responseData.status=='201'&& responseData.data.mobile !=null){
            //AsyncStorage.setItem('UserID',responseData.data.id);
            AsyncStorage.setItem('Mobile',responseData.data.mobile)
            Actions.OTP()
          }
          
          else {
            console.log(responseData.data.step)
            DataStore.userType = responseData.data.user_type
            AsyncStorage.setItem('is_driver',responseData.driver[0].is_driver);
            DataStore.company_logo = responseData.data.company_logo
            if(responseData.data.step=='1'){
             // Storage.UserId = responseData.data.id
              Actions.AddPartner()
              // if(responseData.driver[0].is_driver ==1){
              //   console.log('if condition chali')
              //   Actions.drawerMenu()
                
              // }
              // else{
              //   console.log('Else condtion  chali ')
              // //  AsyncStorage.setItem('UserID',responseData.data.id);
              //   Actions.AddPartner()
              // }
              
            }
            else if(responseData.data.step=='2' && responseData.driver[0].is_driver ==1){
            
                AsyncStorage.setItem('UserID',responseData.data.id);
                Actions.drawerMenu()
              
            }
            else{
              if(responseData.data.user_type == '3')
              {
                  AsyncStorage.setItem('UserID',responseData.data.id);
                  AsyncStorage.setItem('user','Shop');
                  Actions.drawerMenu()
               
              }
             else if(responseData.data.user_type == '4')
              {
                
                  AsyncStorage.setItem('UserID',responseData.data.id);
                  AsyncStorage.setItem('user','Broker');
                  Actions.drawerMenu()
                
              }
              else if(responseData.data.user_type == '5')
              {
                  AsyncStorage.setItem('UserID',responseData.data.id);
                  AsyncStorage.setItem('user','Transpoter');
                  Actions.drawerMenu()
               
              }
              else if(responseData.data.user_type == '6')
              {
                  AsyncStorage.setItem('UserID',responseData.data.id);
                  AsyncStorage.setItem('user','Vender');
                  Actions.drawerMenu()
                
              }
             // Actions.drawerMenu()
            }
          }
          })
         .catch((err) => { console.log(err); });
  }
  
  SubmiProcess(){
    console.log('user id ',DataStore.UserId)
    this.setState({Activity:true})
    this.setState({ErrorShow:''})
    let QR_image={
      uri:this.state.QR_image,
      type: 'image/jpeg',
      name: 'photo.jpg',
    }
     const formData = new FormData()
    for (let i = 0; i < this.state.IdCardImg.length; i++)
        {
            var photo={
                uri:this.state.IdCardImg[i],
                type: 'image/jpeg',
                name: 'photo.jpg',
            }
            formData.append('documents[]',photo)
        }
        for (let i = 0; i < this.state.OtheDocImg.length; i++)
        {
            var photo={
                uri:this.state.OtheDocImg[i],
                type: 'image/jpeg',
                name: 'photo.jpg',
            }
            formData.append('other_documents[]',photo)
        }
        formData.append('user_id',DataStore.UserId)
        formData.append('user_type_id',this.state.user.id)
        formData.append('document_type_id',this.state.Document.id)
        formData.append('gst_number',this.state.GSTNumber)
        formData.append('document_number',this.state.RagiNumber)
        formData.append('lat',this.state.latitude)
        formData.append('long',this.state.longitude)
        formData.append('address',this.state.address)
        formData.append('city',this.state.city)
        formData.append('state',this.state.state)
        formData.append('company_name',this.state.company_name)
        formData.append('accholder_name',this.state.accholder_name)
        formData.append('bank_name',this.state.bank_name)
        formData.append('ifsc_code',this.state.ifsc_code)
        formData.append('acc_number',this.state.acc_number)
        formData.append('qrimages',QR_image)
        let url= api.baseURL;
        fetch( url+'wb/secondStep', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         //'Content-Type': 'application/json',
         //"Content-Disposition": 'multipart/form-data'
         'Content-Type': 'multipart/form-data'
         //'Content-Length': data.length 
         },
         body:formData
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response1111: " + JSON.stringify(responseData));
          //alert('responced',JSON.stringify(responseData))
          this.setState({Activity:false})
          if(responseData.status == 200){
            let data={
              Mobile_no:responseData.data.mobile,
              Password:responseData.data.password
            }
            this.LoginAPIProcesss(data)
           // this.props.navigation.navigate('drawerMenu')
          }else{
            this.setState({ErrorShow:responseData.message})
          }
          
          })
         .catch((err) => { console.log(err); });
  }
  render(){
    
    if(this.props.setLocaion != undefined){
    //  console.log('recive dataaaa',typeof(String(this.props.setLocaion.latitude)))
      this.state.latitude = String(this.props.setLocaion.latitude);
      this.state.longitude = String(this.props.setLocaion.longitude);
    }
   // console.log('render value',this.state.latitude)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <ScrollView>
            <View style={{flex:1}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:15,marginLeft:15,marginTop:10}}>
                  <TouchableOpacity onPress={()=>Actions.pop()}>
                    <Image style={{width:25,height:25,tintColor:'#707B7C'}}
                      source={require('../Images/Digital__Design_99-512.png')} />
                  </TouchableOpacity>
                  {/* <TouchableOpacity>
                    <Text style={{fontSize:18,color:'#707B7C'}}>Skip</Text>
                  </TouchableOpacity> */}
                </View>
                <View>
                  <Text style={styles.Header_Text}>Be a Partner</Text>
                </View>
                <View style={styles.Text_Discription}>
                  <Text style={styles.Font_Text}>Fill this information and Be a pert of us!</Text>
                </View>
                <View style={{marginTop:20}} >
                  <TouchableOpacity style={styles.Input_View} onPress={()=>this.UserTypeApi()}>
                      <Text style={styles.Font_Text}>{this.state.user.name}</Text>
                      <Image style={{width:15,height:10,right:-30}}
                        source={require('../Images/Drop_icone.png')} />
                  </TouchableOpacity>
                </View>
                <FlatList style={{backgroundColor:'white',marginTop:5,alignSelf:'center',width:'80%'}}
                data={this.state.userType}
                renderItem={({item})=>
                <TouchableOpacity style={styles.DropDown} onPress={()=>this.UserSelect(item)} >
                    <Text style={styles.Font_Text}>{item.name}</Text>
                </TouchableOpacity>} />
                <View >
                  <TouchableOpacity style={styles.Input_View} onPress={()=>this.DocumentTypeApi()} >
                      <Text style={styles.Font_Text}>{this.state.Document.cat_name} </Text>
                      <Image style={{width:15,height:10,right:-30}}
                        source={require('../Images/Drop_icone.png')} />
                  </TouchableOpacity>
                </View>
                <FlatList style={{backgroundColor:'white',marginTop:5,alignSelf:'center',width:'80%'}}
                  data={this.state.DockType}
                  renderItem={({item})=>
                  <TouchableOpacity style={styles.DropDown} onPress={()=>this.DocSelect(item)} >
                    <Text style={styles.Font_Text}>{item.cat_name}</Text>
                  </TouchableOpacity>} />
                <View style={styles.Input_View} >
                  <TextInput style={styles.Font_Text}
                    placeholder='GST Number'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({GSTNumber:text})} />
                </View>
                <View style={{alignItems:'center',marginTop:20,padding:10,backgroundColor:'#E5E4E7'}}>
                  <Text style={styles.Font_Text}>Document( Aadhaar card OR PAN card photo )</Text>
                  <View style={styles.DocFiles_Style}>
                    <TouchableOpacity style={styles.ChoosFileStyle} onPress={()=>this.SelectImage(1)} >
                      <Text style={{fontSize:14,color:'white',fontWeight:'500'}}>Choosen Files</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList style={{marginBottom:10}}
                        data={this.state.IdCardName}
                        renderItem={({item})=>
                        <Text style={[styles.Font_Text]}>{item}</Text>}  />
                </View>
                <View style={{width:'90%',alignItems:'center',alignSelf:'center',marginTop:20}}>
                  <Text style={styles.Font_Text}>(Food license OR Union Registration no. OR any other document) Number</Text>
                </View>
                <View style={styles.Input_View}>
                  <TextInput style={styles.Font_Text}
                    placeholder='Number'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({RagiNumber:text})} />
                </View>
                <View style={{alignItems:'center',marginTop:20,padding:10,backgroundColor:'#E5E4E7'}}>
                  <Text style={styles.Font_Text}>(Food license OR Union Registration no. OR any other document) Number</Text>
                  <View style={styles.DocFiles_Style}>
                    <TouchableOpacity style={styles.ChoosFileStyle} onPress={()=>this.SelectImage(2)} >
                      <Text style={{fontSize:14,color:'white',fontWeight:'500'}}>Choosen Files</Text>
                    </TouchableOpacity>
                    {/* <View style={{width:'60%'}}>
                      <Text style={styles.Font_Text}> {this.state.RagiImage.name}</Text>
                    </View> */}
                  </View>
                  <FlatList style={{marginBottom:10}}
                        data={this.state.OtheDocName}
                        renderItem={({item})=>
                        <Text style={[styles.Font_Text]}>{item}</Text>}  />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >Address</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    //defaultValue={this.state.latitude}
                    defaultValue={this.state.address}
                    placeholder='Address...'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({address:text})} />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >City</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    //defaultValue={this.state.latitude}
                    defaultValue={this.state.city}
                    placeholder='City...'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({city:text})} />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >State</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    //defaultValue={this.state.latitude}
                    defaultValue={this.state.state}
                    placeholder='State...'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({state:text})} />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >Company Name</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    //defaultValue={this.state.latitude}
                    defaultValue={this.state.company_name}
                    placeholder='Company Name'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({company_name:text})} />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >Account Holder Name</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    //defaultValue={this.state.latitude}
                    defaultValue={this.state.accholder_name}
                    placeholder='Account Holder Name....'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({accholder_name:text})} />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >Bank Name</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    //defaultValue={this.state.latitude}
                    defaultValue={this.state.bank_name}
                    placeholder='Bank Name....'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({bank_name:text})} />
                </View>
                
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >Account Number</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    //defaultValue={this.state.latitude}
                    defaultValue={this.state.acc_number}
                    placeholder='Account Number....'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({acc_number:text})} />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >IFSC Code</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    defaultValue={this.state.ifsc_code}
                    placeholder='IFSC Code'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({ifsc_code:text})} />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >QR Code</Text>
                <View  style={{flexDirection:'row',alignItems:'center'}}>
                  <TouchableOpacity style={{borderWidth:0.5,borderRadius:5,alignItems:'center',justifyContent:'center',marginLeft:40,marginTop:10 ,height:35,width:100}}
                    onPress={()=>this.SelectImage(3)}  >
                    <Text style={{fontSize:13,fontWeight:'500'}}>Choose File</Text>
                  </TouchableOpacity>
                  {this.state.QR_image ==''?
                  <Text style={{alignItems:'center',marginTop:10,fontSize:14,marginLeft:10,justifyContent:'center'}}>No File Choosen</Text>
                  :
                  <Image style={{width:50,height:50,marginTop:10,marginLeft:20}}
                    source={{uri:this.state.QR_image}}
                  />
                  }
                  
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >Latitude</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    defaultValue={this.state.latitude}
                    placeholder='Enter Longitude'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({latitude:text})} />
                </View>
                <Text style={{fontSize:16,color:'#707B7C',marginLeft:40,marginTop:20}} >Longitude</Text>
                <View >
                  <TextInput style={styles.DirctionView}
                    defaultValue={this.state.longitude}
                    placeholder='Enter Longitude'
                    placeholderTextColor='#707B7C'
                    onChangeText={(text)=>this.setState({longitude:text})} />
                </View>
                <View>
               <TouchableOpacity>
                  <MapView style={styles.MapStyle}
                    initialRegion={{
                    latitude: 22.69065687147905,
                    longitude: 75.82152758970477,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                 }}
                   onPress={()=>this.props.navigation.navigate('map',{Openmap:'SelectLocation'})}
                >
                </MapView>
               </TouchableOpacity>
                </View>
                <View>
                {this.state.Activity?
                  <ActivityIndicator size="large" color="#00ff00" />
                :null}
                  {this.state.ErrorShow?
                  <Text style={{fontSize:14,alignSelf:'center',marginTop:8,color:'red',fontWeight:'500'}}>{this.state.ErrorShow}</Text>
                  :null}
                  <TouchableOpacity style={styles.Login_Button} onPress={()=>this.SubmiProcess()}>
                    <Text style={{fontSize:17,color:'white',fontWeight:'500'}}>Submit</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        
    </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  Header_Text:{
    fontSize:25,
    fontWeight:'500',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:30,
    color:'#424949'
  },
  Text_Discription:{
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    marginTop:30,
  },
  Font_Text:{
    fontSize:14,
    color:'#707B7C'
  },
  // Button_View:{
  //   justifyContent:'center',
  //   alignItems:'center',
  //   alignSelf:'center',
  //   borderBottomWidth:1
  // },
  Input_View:{
    width:'85%',
    height:45,
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'space-around',
    borderRadius:15,
    backgroundColor:'white',
    marginTop:15,
    flexDirection:'row',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  Login_Button:{
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    width:'85%',
    height:50,
    borderRadius:20,
    backgroundColor:'#DC8A33',
    marginTop:15,
    marginBottom:10
  },
  DropDown:{
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:5,
    //padding:5,
    width:'80%',
    //height:30,
    marginBottom:5,
    backgroundColor:'white',
    //borderRadius:10,
    //shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 0.5
    // },
    // shadowRadius: 2,
    // shadowOpacity: 0.2,
  },
  DocFiles_Style:{
    width:'100%',
    padding:10,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    flexDirection:'row'
  },
  ChoosFileStyle:{
    backgroundColor:'green',
    padding:10,
    borderRadius:10
  },
  DirctionView:{
    width:'85%',
    height:45,
    borderRadius:15,
    justifyContent:'center',
    alignSelf:'center',
    backgroundColor:'white',
    fontSize:14,
    paddingLeft:15,
    marginTop:10
  },
  MapStyle:{
    width:'90%',
    height:200,
    alignSelf:'center',
    marginTop:20,
  }
  
});
