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
  Share,
  ActivityIndicator
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker/src/index';
import { FlatList } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import MapView,{Marker} from 'react-native-maps';
import DataStore from './Config/Storage'
import api from './Config/api'
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
        //VenderArry:[],
        //ProductArry:[],
        SelVender:'Select Vendor',
        SelProduct:'Select Product',
        GetData :'',
        count:1,
        EditValue:false,
        firstname:'',
        lastname:'',
        document_type:'',
        gst_number:'',
        document_number:'',
        gender:'',
        dob:'',
        address:'',
        city:'',
        state:'',
        company_name:'',
        lat:'',
        long:'',
        accholder_name:'',
        bank_name:'',
        acc_number:'',
        ifsc_code:'',
        DockType:[],
        ErrorShow:'',
        transporter_ofc_address:'',
        active_service_area:'',
        Document_id:'',
        company_logo:'',
        image_path:'No File Chosen',
       // Qr_image:'',
        QR_image:'',
        QR_image_path:'No File Chosen'
    }
  }
  // DropButton(value){
  //     switch(value){
  //         case 'Vendor':{
  //           this.setState({VenderArry:[{title:'Lakhan kanade'},{title:'Lucky kanade'}]})
  //           break;
  //         }
  //         case 'Product':{
  //             this.setState({ProductArry:[{title:'Select Vendor'}]})
  //             break;
  //         }
  //     }
      
  // }

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
        // this.setState({company_logo:source.uri})
        // this.setState({image_path:source.fileName})
        switch(value){
          case 1:{
            console.log('1 case chala',source)
            let source = res;
            this.setState({company_logo:source.uri})
            this.setState({image_path:source.fileName})
            break;
          }
          case 2:{
            console.log('2 case chala',source)
            let source = res;
            this.setState({QR_image:source.uri})
            this.setState({QR_image_path:source.fileName})
            break;
          }
          // case 3:{
          //   console.log('2 case chala',source)
          //   let source = res;
          //  // this.state.OtheDocImg.push(source.uri)
          //   //this.state.OtheDocName.push(source.fileName)
          //  // this.setState({OtheDocImg:this.state.OtheDocImg})
          //   this.setState({QR_image:source.uri})
          //   break;
          // }
        }
        
      }
    });
  }
  
  componentDidMount(){
      this.ProfileUserApi()
  }
  ProfileUserApi(){
    let url= api.baseURL;
      fetch( url+'wb/user_profile', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:DataStore.OrderScreenId})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            this.setState({GetData:responseData.data[0]})
            console.log('Get Dataaa  ',this.state.GetData)
            this.UpdateVaribleFun()
          }
          
          })
         .catch((err) => { console.log(err); });
  }
  UpdateVaribleFun(){
    this.setState({firstname:this.state.GetData.firstname})
    this.setState({accholder_name:this.state.GetData.account_holder_name})
    //this.setState({lastname:this.state.GetData.lastname})
    this.setState({email:this.state.GetData.email})
    this.setState({mobile:this.state.GetData.mobile})
    this.setState({user_type:this.state.GetData.user_type})
    this.setState({document_type:this.state.GetData.document_type})
    this.setState({gst_number:this.state.GetData.gst_number})
    this.setState({document_number:this.state.GetData.document_number})
    this.setState({lat:this.state.GetData.lat})
    this.setState({long:this.state.GetData.long})
    this.setState({dob:this.state.GetData.dob})
    this.setState({address:this.state.GetData.address})
    this.setState({city:this.state.GetData.city})
    this.setState({state:this.state.GetData.state})
    this.setState({company_name:this.state.GetData.company_name})
    this.setState({bank_name:this.state.GetData.bank_name})
    this.setState({acc_number:this.state.GetData.account_number})
    this.setState({ifsc_code:this.state.GetData.ifsc_code})
    this.setState({active_service_area:this.state.GetData.active_service_area})
    this.setState({transporter_ofc_address:this.state.GetData.transporter_ofc_address})
    this.setState({company_logo:this.state.GetData.company_logo})
    this.setState({QR_image:this.state.GetData.qr_code})
    this.setState({Document_id:this.state.GetData.document_id})
    if(this.state.EditValue ==false){
     // this.state.gender = this.state.GetData.gender
      this.setState({gender:this.state.GetData.gender})
    }
    //this.state.firstname = this.state.GetData.firstname
      //this.state.lastname = this.state.GetData.lastname
      //this.state.email = this.state.GetData.email
     // this.state.mobile = this.state.GetData.mobile
      //this.state.user_type = this.state.GetData.user_type
      //this.state.document_type = this.state.GetData.document_type
      //this.state.gst_number = this.state.GetData.gst_number
      //this.state.document_number = this.state.GetData.document_number
      //this.state.lat = this.state.GetData.lat
      //this.state.long = this.state.GetData.long
      //this.state.dob = this.state.GetData.dob
      //this.state.address = this.state.GetData.address
      //this.state.city = this.state.GetData.city
      //this.state.state = this.state.GetData.state
      //this.state.company_name = this.state.GetData.company_name
      //this.state.accholderName = this.state.GetData.accholder_name
      //this.state.bank_name = this.state.GetData.bank_name
      //this.state.acc_number = this.state.GetData.acc_number
      //this.state.ifsc_code = this.state.GetData.ifsc_code
      
  }
//   componentWillReceiveProps(){
//     this.ProfileUserApi()
//   }
  // getSnapshotBeforeUpdate(){
  //   //this.ProfileUserApi(); 
  // }

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
        'https://apmczon.in/registration?code='+this.state.GetData.code,
         // url:'https://apmczon.in/registration?code='+this.state.GetData.code
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  UpdateProfileApi(){
    this.setState({ErrorShow:''})
    this.setState({Activity:true})
    let QR_image={
      uri:this.state.QR_image,
      type: 'image/jpeg',
      name: 'photo.jpg',
    }
   const Photo={
      uri:this.state.company_logo,
      type: 'image/jpeg',
      name: 'photo.jpg',
    }
    let url= api.baseURL;
    console.log('getttting data',QR_image)
    // const body=JSON.stringify({user_id:DataStore.OrderScreenId,
    //   firstname:this.state.firstname,
    //   //lastname:this.state.lastname,
    //   document_type:this.state.Document_id,
    //   gst_number:this.state.gst_number,
    //   document_number:this.state.document_number,
    //   gender:this.state.gender,
    //   dob:this.state.dob,
    //   address:this.state.address,
    //   city:this.state.city,
    //   state:this.state.state,
    //   company_name:this.state.company_name,
    //   lat:this.state.lat,
    //   long:this.state.long,
    //   accholder_name:this.state.accholder_name,
    //   bank_name:this.state.bank_name,
    //   acc_number:this.state.acc_number,
    //   ifsc_code:this.state.ifsc_code,
    //   active_service_area:this.state.active_service_area,
    //   transporter_ofc_address:this.state.transporter_ofc_address,
    //   images:Photo
    // })
    const formData = new FormData()
    formData.append('user_id',DataStore.OrderScreenId)
    formData.append('firstname',this.state.firstname)
    formData.append('document_type',this.state.Document_id)
    formData.append('document_number',this.state.document_number)
    formData.append('gst_number',this.state.gst_number)
    formData.append('gender',this.state.gender)
    formData.append('dob',this.state.dob)
    formData.append('address',this.state.address)
    formData.append('city',this.state.city)
    formData.append('state',this.state.state)
    formData.append('company_name',this.state.company_name)
    formData.append('lat',this.state.lat)
    formData.append('long',this.state.long)
    formData.append('accholder_name',this.state.accholder_name)
    formData.append('bank_name',this.state.bank_name)
    formData.append('acc_number',this.state.acc_number)
    formData.append('ifsc_code',this.state.ifsc_code)
    formData.append('active_service_area',this.state.active_service_area)
    formData.append('transporter_office_address',this.state.transporter_ofc_address)
    formData.append('images',Photo)
    formData.append('qrimages',QR_image)
      fetch( url+'wb/edit_profile', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'multipart/form-data'
         //'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:formData
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          this.setState({Activity:false})
          if(responseData.status=='200'){
            //this.setState({GetData:responseData.data[0]})
            //this.setState({})
            DataStore.company_logo = responseData.data.company_logo
            this.setState({EditValue:false})
          }
          else{
            this.setState({ErrorShow:responseData.message})
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
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            this.setState({DockType:responseData.data})
          }
          
          })
         .catch((err) => { console.log(err); });
  }
  DocTypeSelect(item){
    this.setState({DockType:''})
    this.setState({document_type:item.cat_name})
    this.setState({Document_id:item.id})
  }
  render(){
    console.log('Edit otpin',DataStore.UserId)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <ScrollView>
            <View style={{flex:1,marginLeft:20,marginTop:20}}>
              <View style={{marginBottom:20}}>
                <Text style={{alignSelf:'center',fontSize:20,fontWeight:'700'}}>Profile</Text>
              </View>
                <Text style={styles.Header_Text}>If Add Any Partner Share Link</Text>
                <View >    
                    <View style={{marginTop:10,width:'90%',backgroundColor:'white',borderRadius:10,}}>
                         <Text style={{marginLeft:10}}>https://apmczon.in/registration?code={this.state.GetData.code}</Text>
                         
                    </View>
                    <TouchableOpacity style={styles.ButtonView} onPress={()=>this.onShare()}>
                        <Text style={{color:'white',fontWeight:'600',fontSize:15}}>Share Link</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Full name</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Full name'
                      defaultValue={this.state.firstname}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({firstname:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.firstname}</Text>
                    </View> */}
                </View>
                {/* <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Last name</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Last name'
                      defaultValue={this.state.lastname}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({lastname:text})}
                    />
                    
                </View> */}
                {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.lastname}</Text>
                    </View> */}
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Email</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Email'
                      defaultValue={this.state.email}
                      editable={false}
                      onChangeText={(text)=>this.setState({email:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.email}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Mobile</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Mobile'
                      defaultValue={this.state.mobile}
                      editable={false}
                      onChangeText={(text)=>this.setState({mobile:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.mobile}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>User Type</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter User Type'
                      defaultValue={this.state.user_type}
                      editable={false}
                      onChangeText={(text)=>this.setState({user_type:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.user_type}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Document type</Text>
                    <View >
                      <TouchableOpacity disabled={this.state.EditValue?false:true} style={[styles.TextView,{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}]} onPress={()=>this.DocumentTypeApi()} >
                        <Text style={styles.Font_Text}>{this.state.document_type}</Text>
                        <Image style={{width:15,height:10,right:-30}}
                          source={require('../Images/Drop_icone.png')} />
                      </TouchableOpacity>
                    </View>
                    <FlatList style={{backgroundColor:'white',marginTop:5,width:'90%'}}
                      data={this.state.DockType}
                      renderItem={({item})=>
                        <TouchableOpacity style={styles.DropDown} onPress={()=>this.DocTypeSelect(item)} >
                          <Text style={styles.Font_Text}>{item.cat_name}</Text>
                        </TouchableOpacity>} />
                    {/* <TextInput style={styles.TextView}
                      placeholder='Enter Document type'
                      defaultValue={this.state.document_type}
                      editable={false}
                      onChangeText={(text)=>this.setState({document_type:text})}
                    /> */}
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.document_type}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>(Food license OR Union Registration no. OR any other document) Number</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter document Number'
                      defaultValue={this.state.document_number}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({document_number:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.document_number}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>GST Number</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter GST Number'
                      defaultValue={this.state.gst_number}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({AccountNugst_numbermber:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.gst_number}</Text>
                    </View> */}
                </View>
                
                
                {/* <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>D.O.B</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter DOB'
                      defaultValue={this.state.dob}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({dob:text})}
                    />
                    //<View style={styles.TextView}>
                      //   <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    //</View>
                </View> */}
                {/* <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Gender</Text>
                    <View style={{flexDirection:'row',marginLeft:20,marginTop:10,alignItems:'center'}}>
                      <TouchableOpacity style={{flexDirection:'row'}} disabled={this.state.EditValue?false:true} onPress={()=>this.setState({gender:'Male'})}>
                        <View style={{borderWidth:1,height:15,width:15,borderRadius:10,backgroundColor:this.state.gender =='Male'?'green':'white'}}></View>
                        <Text style={{marginLeft:5,fontSize:14,fontWeight:'600'}}>Male</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flexDirection:'row',marginLeft:40}} disabled={this.state.EditValue?false:true} onPress={()=>this.setState({gender:'Female'})}>
                        <View style={{borderWidth:1,height:15,width:15,borderRadius:10,backgroundColor:this.state.gender =='Female'?'green':'white'}}></View>
                        <Text style={{marginLeft:5,fontSize:14,fontWeight:'600'}}>Female</Text>
                      </TouchableOpacity>
                    </View>
                    <TextInput style={styles.TextView}
                      placeholder='Gender'
                      //defaultValue={this.state.GetData.long}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({AccountNumber:text})}
                    />
                    <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    </View>
                </View> */}
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Address</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Address'
                      defaultValue={this.state.address}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({address:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    </View> */}
                </View>
                {this.state.GetData.user_type =='Transporter'?
                <View>
                  <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Transporter Office Address</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Address'
                      defaultValue={this.state.transporter_ofc_address}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({transporter_ofc_address:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Active Service area</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Address'
                      defaultValue={this.state.active_service_area}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({active_service_area:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    </View> */}
                </View>
                </View>
                :null}
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>City</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter City'
                      defaultValue={this.state.city}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({city:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>State</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter State'
                      defaultValue={this.state.state}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({state:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Company Name</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Company Name'
                      defaultValue={this.state.company_name}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({company_name:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                  <Text style={styles.Header_Text}>Company Logo</Text>
                  <Image style={{width:80,height:80,marginTop:5,borderRadius:10}}
                     source={{uri:this.state.company_logo}}
                  />
                  <View style={{flexDirection:'row',marginTop:10,marginBottom:15,alignItems:'center'}}>
                    <TouchableOpacity disabled={this.state.EditValue?false:true}  onPress={()=>this.SelectImage(1)} style={{borderWidth:1,width:120,height:30,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:14,fontWeight:'600'}}>Choose File</Text>
                    </TouchableOpacity>
                    <Text style={{marginLeft:5,width:'80%'}}>{this.state.image_path}</Text>
                  </View>
                </View>
                <View style={{marginTop:10}}>
                  <Text style={styles.Header_Text}>QR Code</Text>
                  <Image style={{width:80,height:80,marginTop:5,borderRadius:10}}
                     source={{uri:this.state.QR_image}}
                  />
                  <View style={{flexDirection:'row',marginTop:10,marginBottom:15,alignItems:'center'}}>
                    <TouchableOpacity disabled={this.state.EditValue?false:true}  onPress={()=>this.SelectImage(2)} style={{borderWidth:1,width:120,height:30,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:14,fontWeight:'600'}}>Choose File</Text>
                    </TouchableOpacity>
                    <Text style={{marginLeft:5,width:'80%'}}>{this.state.QR_image_path}</Text>
                  </View>
                </View>
                {/* <View style={{marginTop:10}}>
                  <Text style={styles.Header_Text}>QR Code</Text>
                  <View  style={{flexDirection:'row',alignItems:'center'}}>
                  <Image style={{width:80,height:80,marginTop:10,marginLeft:20}}
                    source={{uri:this.state.QR_image}}
                  />
                    {this.state.EditValue?
                    <TouchableOpacity style={{borderWidth:0.5,borderRadius:5,alignItems:'center',justifyContent:'center',marginTop:10 ,height:35,width:100}}
                      onPress={()=>this.SelectImage(2)}  >
                      <Text style={{fontSize:13,fontWeight:'500'}}>Choose File</Text>
                    </TouchableOpacity>
                    :null}
                  
                  {this.state.QR_image ==''?
                  <Text style={{alignItems:'center',marginTop:10,fontSize:14,marginLeft:10,justifyContent:'center'}}>No File Choosen</Text>
                  :
                  <Image style={{width:50,height:50,marginTop:10,marginLeft:20}}
                    source={{uri:this.state.QR_image}}
                  />
                  }
                  
                </View>
                </View> */}
                
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Latitude</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Account Number'
                      defaultValue={this.state.lat}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({lat:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.lat}</Text>
                    </View> */}
                </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Longitude</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Account Number'
                      defaultValue={this.state.long}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({long:text})}
                    />
                    {/* <View style={styles.TextView}>
                         <Text style={styles.Font_Text}>{this.state.GetData.long}</Text>
                    </View> */}
                </View>
                <View style={{width:'85%',alignSelf:'center',borderRadius:10,alignItems:'center',justifyContent:'center',height:40,borderWidth:1,marginTop:20}}>
                  <Text style={{fontSize:16,fontWeight:'600'}}>Bank Details</Text>
                </View>
                <View style={{marginTop:20}}>
                    <Text style={styles.Header_Text}>Account Holder Name</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Account Holder Name'
                      defaultValue={this.state.accholder_name}
                      editable={this.state.EditValue}
                      onChangeText={(text1)=>this.setState({accholder_name:text1})}
                    />
                  </View>
                  <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Bank Name</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Bank Name'
                      defaultValue={this.state.bank_name}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({bank_name:text})}
                    />
                  </View>
                  <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Account Number</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter Account Number'
                      defaultValue={this.state.acc_number}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({acc_number:text})}
                    />
                  </View>
                  <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>IFSC Code</Text>
                    <TextInput style={styles.TextView}
                      placeholder='Enter IFSC Code'
                      defaultValue={this.state.ifsc_code}
                      editable={this.state.EditValue}
                      onChangeText={(text)=>this.setState({ifsc_code:text})}
                    />
                  </View>
                <View style={{marginTop:10}}>
                    <Text style={styles.Header_Text}>Map</Text>
                    <TouchableOpacity //onPress={()=>this.props.navigation.navigate('map',{Openmap:'TrackLocation'})}
                    >
                        <MapView style={styles.MapStyle}
                            mapType={Platform.OS == "android" ? "none" : "standard"}
                            initialRegion={{
                            latitude: 22.719820107991737,
                            longitude: 75.8211978729248,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}/>
                    </TouchableOpacity>
                </View>
                
                <View style={{}}>
                  
                  <Text style={{alignSelf:'center',marginTop:10,fontSize:14,fontWeight:'600',color:'red'}}>{this.state.ErrorShow}</Text>
                  {this.state.EditValue ==false?
                  <View style={{flexDirection:'row',marginTop:20}}>
                    <TouchableOpacity style={{backgroundColor:'#00A952',width:'30%',justifyContent:'center',alignItems:'center',height:45}} onPress={()=>Actions.pop()} >
                      <Text style={{fontSize:14,fontWeight:'600',color:'white'}}>Back</Text>
                    </TouchableOpacity>
                    
                    {DataStore.UserId == DataStore.OrderScreenId ?
                      <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',width:'40%',backgroundColor:'#2B84CE',height:45,marginLeft:10,alignItems:'center'}} onPress={()=>this.setState({EditValue:true})}>
                        <Image style={{width:20,height:20,tintColor:'white'}}
                          source={require('../Images/EditIconApmc.png')}
                        />
                        <Text style={{marginLeft:10,color:'white',fontSize:14,fontWeight:'600'}}>Edit Profile</Text>
                      </TouchableOpacity>
                    :null}
                  </View>
                  :null}
                  {this.state.Activity?
                  <ActivityIndicator size="large" color="#00ff00" />
                  :null}
                  {this.state.EditValue?
                  <TouchableOpacity style={{width:'40%',height:45,marginTop:20,alignItems:'center',borderRadius:10,justifyContent:'center',backgroundColor:'#00A952'}} onPress={()=>this.UpdateProfileApi()} >
                    <Text style={{fontSize:14,fontWeight:'600',color:'white'}}>Update</Text>
                  </TouchableOpacity>
                  :null}
                </View>
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
    color:'black',
    marginLeft:10,
  },
  Font_Text:{
  fontSize:15,
  marginLeft:10
  },
  TextView:{
      fontSize:15,
      marginTop:10,
      width:'90%',
      height:40,
      justifyContent:'center',
      backgroundColor:'white',
      padding:5,
      borderRadius:10,
      paddingLeft:10,
      fontWeight:'500',
      color:'black'
  },
  ButtonView:{
      alignSelf:'center',
      alignItems:'center',
      justifyContent:'center',
      width:'30%',
      height:40,
      marginTop:20,
      backgroundColor:'green',
      borderRadius:10
  },
  MapStyle:{
    width:'90%',
    height:200,
    alignSelf:'center',
    marginTop:20,
  },
  InputeView:{
    width:'85%',
    height:40,
    borderWidth:1,
    borderRadius:10,
    paddingLeft:10,
    marginTop:5,
    alignSelf:'center'
  }
});
