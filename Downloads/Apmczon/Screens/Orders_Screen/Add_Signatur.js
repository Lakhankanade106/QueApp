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
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from '../Config/api'
import Storage from '../Config/Storage'
import SignatureCapture from 'react-native-signature-capture';
import ImagePicker from 'react-native-image-picker';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker/src/index';

export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            UserID:'',
            Image_path:'',
            Activity:false,
            myImage:''
        }
    }
    displayData = async ()=>{  
        console.log('chalaaa')
        try{  
          let user = await AsyncStorage.getItem('user');  
          let UserID = await AsyncStorage.getItem('UserID');  
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
    saveSign() {
       const Save_iamge= this.refs["sign"].saveImage();
       console.log('order_no Save sign image , ',Save_iamge)
       
    }

    resetSign() {
        const ResetImage = this.refs["sign"].resetImage();
        console.log('Reset Image ',ResetImage)
    }
    DriverImage_APi_Call(image_path){
        this.setState({Activity:true})
        this.setState({myImage:'data:image/png;base64,'+image_path,})
        //alert(result.pathName)
        console.log('user iddd image pathh ','data:image/png;base64,'+image_path)
       // console.log(result);
        const formData = new FormData()
        let url= api.baseURL;
        //'content://media/external_primary/images/media/3161'
        var photo={
            uri:'data:image/png;base64,'+image_path,
            type: 'image/jpeg',
            name: 'photo.jpg' 
            //width: 500,
            //height: 500,
        }
        //formData.append('images',photo)
       // console.log('photosss  ',photo)
        formData.append('driver_id',this.state.UserID)
        formData.append('order_no',this.props.order_no)

       const Imagesss = JSON.stringify({
            images: 'data:image/png;base64,'+image_path
          }) 
          formData.append('images',Imagesss)
        // formData.append('user_id',1)
        // formData.append('passport_number',12233454)
        // formData.append('documents[]',photo)
         
       fetch( url+'wb/add_screenshot_by_driver',{
          method: 'POST',
          headers: { 
            Accept: "application/json",
          'Content-Type': "multipart/form-data"
          //'Content-Type': 'application/json',
         // 'Content-Type': 'multipart/form-data'
          //'Content-Length': data.length 
          },
          body:  formData
        }).then((response) => response.json())
          .then((responseData) =>
           { console.log("responsessss Add Signature : " +JSON.stringify(responseData));
          // this.setState({Image_path:result.pathName})
          this.setState({Activity:false})
          //alert('responce')
           if(responseData.status=='200'){
             //this.setState({TrangectionArry:responseData.data})
             Actions.drawerMenu()
           }
           else{
               alert(responseData.message)
           }
           
           })
          .catch((err) => { console.log(err); });
    }

    _onSaveEvent = (result)=> {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        //var that = this
        console.log('imagesssssss ',result)
       //this.setState({})
       this.DriverImage_APi_Call(result.encoded)
       //this.DriverImage_APi_Call()
        
       
    }
    _onDragEvent() {
         // This callback will be called when the user enters signature
        console.log("dragged");
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
            //this.state.IdCardImg.push(source.uri)
            this.setState({my_image:source.uri})
            this.DriverImage_APi_Call(source.uri)
            
          }
        });
      }
    render(){
      
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={{ flex: 1}}>
                    <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                        <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.pop()}>
                            <Image style={{width:25,height:20}}
                                source={require('../../Images/Digital__Design_99-512.png')} />
                        </TouchableOpacity>
                    <View style={{alignItems:'center',width:'80%'}}>
                        <Text style={{alignItems:"center",fontSize:20,fontWeight:'600',alignSelf:'center',justifyContent:"center"}}>Signature Capture Extended </Text>
                    </View>
                </View>
                <SignatureCapture
                    style={[{flex:1,marginTop:20,borderWidth:2},styles.signature]}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    maxSize={500}
                   // backgroundColor="#ff00ff"
                    strokeColor="black"
                    minStrokeWidth={4}
                    maxStrokeWidth={4}
                    viewMode={"portrait"}
                    />

                <View style={{  flexDirection: "row" }}>
                    <TouchableOpacity style={styles.buttonStyle}
                        onPress={() => { this.saveSign() } } >
                        <Text>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle}
                        onPress={() => { this.resetSign() } } >
                        <Text>Reset</Text>
                    </TouchableOpacity>

                </View>
                {this.state.Activity?
                <View style={{flex:1,height:'100%',position:'absolute',alignSelf:'center',justifyContent:'center'}}>
                     <ActivityIndicator style={{}} size="large" color="#00ff00" />
                </View>
                :null}
                

            </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
        //height:750
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    }
});