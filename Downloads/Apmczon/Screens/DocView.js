/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
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
  Platform,
  Linking,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from './Config/api'
import Storage from './Config/Storage'
//import  { WebView }  from 'react-native-webview';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      LoginType:1,
      UserID:'',
      ProductView:[],
      Download:'',
      modalVisible: false,
      broker_fee_shop:'',
      broker_fee_vendor:'',
      itemsData:'',
      Cancel_Od_Visible:false,
      shop_id:'',
      order_no:'',
      reason:'',
      Activity:false,
      is_driver:''
    }
  }

  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let user = await AsyncStorage.getItem('user');  
      let UserID = await AsyncStorage.getItem('UserID');
      let is_driver = await AsyncStorage.getItem('is_driver')  
      this.setState({is_driver:is_driver})
      console.log('useriddddd',is_driver)
      
      this.setState({UserID:UserID})
      this.GetProductList()
      
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
  GetProductList(){
   // console.log('order number',this.state.UserID)
    let url= api.baseURL;
      fetch( url+'wb/view_more', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({user_id:this.state.UserID,order_no:Storage.OrderNumber})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            this.setState({ProductView:responseData.data})
          }
          
          })
         .catch((err) => { console.log(err); });
  }
  DocDownload(item){
    console.log('user id',item.other_id)
    
    console.log('vendr id',item.vendor_id)
    console.log('order id',item.order_no)
    let url= api.baseURL;
    fetch( url+'wb/download_bill', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       'Content-Type': 'application/json',
       },
       body:JSON.stringify({user_id:item.other_id,order_no:item.order_no,vendor_id:item.vendor_id})
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("responsessss: " + JSON.stringify(responseData));
        if(responseData.status=='200'){
          this.setState({Download:responseData.data})
          const Download = Linking.openURL(this.state.Download)
          //this.DoundloadFun()
        }
        
        })
       .catch((err) => { console.log(err); });
  }

  DoundloadFun(){
    const Download = Linking.openURL(this.state.Download)
   // Linking.addEventListener('url', this.handleUrl);
    console.log('recivdededd',Download)
    const { config, fs } = RNFetchBlob;

    let PictureDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
    let options = {
    fileCache: true,
    addAndroidDownloads : {
      useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
      notification : false,
      path:  PictureDir + "/me_", // this is the path where your downloaded file will live in
      description : 'Downloading pdf.'
   }
}

config(options).fetch('POST',this.state.Download.url ).then((res) => {
  //console.log('download res',res)
}) ;
  }

  ViewDocFun(item){
    console.log('itemssss',item)
    this.props.navigation.navigate('ProductView',{'order_no':item.order_no,'vendor_id':item.other_id})
   // this.setState({order_no:item.order_no})
    //this.setState({vendor_id:item.vendor_id})
  }

  Broker_FeeProcess(item){
    console.log('broker free process',item)
    this.setState({itemsData:item})
    this.setState({modalVisible:true})
  }
  Broker_FeeApi(){
    console.log(' itsmsss dataa ',this.state.itemsData)
    this.setState({Activity:true})
    this.setState({ErrorShow:''})
    //const item = this.state.itemsData;
    let url= api.baseURL;
    const formData = new FormData()
    formData.append('broker_id',this.state.UserID)
    formData.append('order_no',this.state.itemsData.order_no)
    formData.append('vendor_id',this.state.itemsData.vendor_id)
    formData.append('transporter_id',this.state.itemsData.transporter_id)
    formData.append('broker_fee_shop',this.state.broker_fee_shop)
    formData.append('broker_fee_vendor',this.state.broker_fee_vendor)
    fetch( url+'wb/add_broker_fee', {
       method: 'POST',
       headers: { 
       'Accept': 'application/json', 
       //'Content-Type': 'application/json',
       'Content-Type': 'multipart/form-data'
       },
       body:formData
     }).then((response) => response.json())
       .then((responseData) =>
        { console.log("responsessss: " + JSON.stringify({responseData}));
        this.setState({Activity:false})
        if(responseData.status=='200'){
          //this.setState({BankingArray:responseData.data})
          this.setState({modalVisible:false})
          this.GetProductList()
         // Actions.MyOrders()
        }
        else{
          this.setState({ErrorShow:responseData.message})
        }
        
        })
       .catch((err) => { console.log(err); });
  }

  Left_Order_Vendor_Fun(item){
    console.log('Left order vendor',item)
    let url= api.baseURL;
      fetch( url+'wb/left_order_by_vendor', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({vendor_id:this.state.UserID,order_no:item.order_no})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({ProductView:responseData.data})
            this.componentDidMount()
          }
          
          })
         .catch((err) => { console.log(err); });

  }
  Cancel_Order_Fun(item){
    console.log('Cancel item',item)
    this.setState({shop_id:item.other_id})
    this.setState({order_no:item.order_no})
    this.setState({Cancel_Od_Visible:true})
  }
  createTwoButtonAlert (){
  Alert.alert(
    "Alert Title",
    "Are you Sure you want to Delete Order",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => this.Cancel_Order_Api() }
    ]
  );}
  Cancel_Order_Api(){
    console.log('user id ',this.state.UserID),
    console.log('shop id ',this.state.shop_id)
    console.log('order_no ',this.state.order_no)
    console.log('reason ',this.state.reason)
    let url= api.baseURL;
      fetch( url+'wb/cancel_order_by_vendor', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({user_id:this.state.UserID,shop_id:this.state.shop_id,order_no:this.state.order_no,reason:this.state.reason})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({ProductView:responseData.data})
            this.setState({Cancel_Od_Visible:false})
            this.props.navigation.navigate('Cancel_Order')
            //this.componentDidMount()
          }
          
          })
         .catch((err) => { console.log(err); });
  }

  render(){
     // console.log('storageee',this.state.Download)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
      <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
            <TouchableOpacity style={{width:25,height:20,marginLeft:20,marginBottom:10}} onPress={()=>Actions.pop()}>
                <Image style={{width:25,height:20}}
                    source={require('../Images/Digital__Design_99-512.png')} />
            </TouchableOpacity>
            {/* <View style={{alignItems:'center',width:'80%'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Order Details</Text>
            </View> */}
        </View>
        <ScrollView horizontal={true}>
            <View style={{flex:1}}>
              {/* <View>
              <Pdf
                    source={{uri:this.state.Download.url}}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    onPressLink={(uri)=>{
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf}/>
              </View> */}
                <View style={{flexDirection:'row',width:'100%',borderWidth:0.5,paddingBottom:10,paddingTop:10,justifyContent:'space-around'}}>
                  <Text style={[styles.Header_Text,{width:40}]}>#</Text>
                  <Text style={styles.Header_Text}>Order Number</Text>
                  <Text style={styles.Header_Text}>Order Amount</Text>
                  <Text style={styles.Header_Text}>Vendor</Text>
                  <Text style={styles.Header_Text}>Vendor Status</Text>
                  <Text style={styles.Header_Text}>Transport Status</Text>
                  <Text style={[styles.Header_Text,{width:100}]}>Broker Status</Text>
                  <Text style={styles.Header_Text}>Action</Text>
                </View>
                <View style={{width:'100%'}}>
                  <FlatList
                      data={this.state.ProductView}
                      renderItem={({item,index})=>
                    //   <View style={{borderBottomWidth:0.5,width:'100%',marginTop:5}}>
                        <View style={{flexDirection:'row',borderBottomWidth:0.5,width:'100%',paddingBottom:10,paddingTop:10,justifyContent:'space-around',marginRight:20}}>
                  <Text style={[styles.Header_Text,{width:40}]}>{index+1}</Text>
                  <Text style={styles.Header_Text}>{item.order_no}</Text>
                  <Text  style={styles.Header_Text}>{item.orderamount}</Text>
                  <Text style={styles.Header_Text}>{item.vendor}</Text>

                  {/*============= Vendor Status =======*/}
                  {item.vendor_status =='left_order_by_vendor_form'?
                  <View>
                    <TouchableOpacity  style={{backgroundColor:'#2B84CE',borderRadius:5,width:80,height:40,alignItems:'center',justifyContent:'center'}}
                      onPress={()=> this.Left_Order_Vendor_Fun(item) } >
                      <Text style={{fontSize:15,color:'white',fontWeight:'500'}}>Left Order</Text>
                  </TouchableOpacity>
                  <TouchableOpacity  style={{backgroundColor:'red',borderRadius:5,width:80,height:35,marginTop:5,alignItems:'center',justifyContent:'center'}}
                      onPress={()=> this.Cancel_Order_Fun(item) } >
                       <Image style={{width:15,height:15}}
                       source={require('../Images/CloseIcone.png')}
                    />
                  </TouchableOpacity>
                  {/* <TouchableOpacity>
                    <Image style={{width:15,height:15}}
                       source={require('../Images/CloseIcone.png')}
                    />
                  </TouchableOpacity> */}
                  </View>
                  :null}
                  {item.vendor_status !='left_order_by_vendor_form'?
                    <Text style={styles.Header_Text}>{item.vendor_status}</Text>
                 :null}

                 {/* <TouchableOpacity disabled={item.vendor_status =='left_order_by_vendor_form'?false:true} >
                   <Text style={styles.Header_Text}>{item.vendor_status}</Text>
                 </TouchableOpacity> */}

                 {/* ======= Transport Status ===== */}
                 {item.transport_status == 'left_order_by_transport_form'?
                 <TouchableOpacity disabled={item.transport_status =='left_order_by_transport_form'?false:true} style={{backgroundColor:'#2B84CE',borderRadius:5,width:80,height:40,alignItems:'center',justifyContent:'center'}}
                    onPress={()=>this.props.navigation.navigate('Order_Asign',{items_data:item})} >
                    <Text style={{fontSize:15,color:'white',fontWeight:'500'}}>Left Order</Text>
                 </TouchableOpacity>
                 :null}
                 {item.transport_status !='left_order_by_transport_form'?
                    <Text style={styles.Header_Text}>{item.transport_status}</Text>
                 :null}
                  
                  {item.broker_status == 'true'?
                    <TouchableOpacity style={{width:100,height:30,alignItems:'center',backgroundColor:'#2B83CD',justifyContent:'center',borderWidth:0.5}}
                      onPress={()=>this.Broker_FeeProcess(item)} >
                      <Text style={{color:'white',fontSize:16}}>Broker fee</Text>
                    </TouchableOpacity>
                  :null}
                  {item.broker_status != 'true'?
                  <Text style={[styles.Header_Text,{width:100}]}>{item.broker_status}</Text>
                  :null}
                  {/* <TouchableOpacity disabled={item.broker_status =='left_order_by_transport_form'?false:true}>
                    <Text style={styles.Header_Text}>{item.broker_status}</Text>
                  </TouchableOpacity> */}
                  <View style={styles.Header_Text}>
                  {this.state.is_driver !=1?
                  <TouchableOpacity style={styles.ButtonView} onPress={()=>this.ViewDocFun(item)} >
                    <Image style={{width:20,height:20}}
                      source={require('./Menu_images/document-icon-vector-27.jpg')} />
                  </TouchableOpacity>
                  :null}
                  <TouchableOpacity style={styles.ButtonView} onPress={()=>this.DocDownload(item)}>
                    <Image style={{width:20,height:20}}
                      source={require('../Images/Downloadvc.png')} />
                  </TouchableOpacity>
                  </View>
                </View>
                    //   </View>
                    }
                  />
                </View>
                <Modal
                    animationType="slide"
                    //transparent={true}
                    visible={this.state.modalVisible}
                    >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <View>
                          <Text style={{marginBottom:5,fontSize:16,fontWeight:'600'}}>Broker fees for shop</Text>
                          <TextInput style={{width:'90%',padding:5,borderWidth:1}}
                              placeholder='Enter your fee...'
                              keyboardType='numeric'
                               onChangeText={(text)=>this.setState({broker_fee_shop:text})}
                               //multiline={true}
                          />
                        </View>
                        <View style={{marginTop:15}}>
                          <Text style={{marginBottom:5,fontSize:16,fontWeight:'600'}}>Broker fees for Vendor</Text>
                          {/* <View style={{width:'90%',justifyContent:'center',height:30,borderWidth:1,marginTop:5}}>
                            <Text style={{marginLeft:10}}>Amount</Text>
                          </View> */}
                          <TextInput style={{width:'90%',padding:5,borderWidth:1}}
                              placeholder='Enter your fee...'
                              keyboardType='numeric'
                               onChangeText={(text)=>this.setState({broker_fee_vendor:text})}
                               //multiline={true}
                          />
                        </View>
                        {this.state.Activity?<ActivityIndicator style={{marginTop:10}} size="large" color="#00ff00" /> :null}
                        <View style={{flexDirection:'row',marginTop:20}}>
                          <TouchableOpacity disabled={this.state.Activity} style={{width:'40%',height:40,alignItems:'center',justifyContent:'center',backgroundColor:'#2B83CD'}}
                            onPress={()=>this.setState({modalVisible:false,ErrorShow:''})}  >
                            <Text style={{fontSize:15,color:'white'}}>Back</Text>
                          </TouchableOpacity>
                          <TouchableOpacity disabled={this.state.Activity} style={{width:'40%',marginLeft:20,height:40,alignItems:'center',justifyContent:'center',backgroundColor:'green'}}
                            onPress={()=>this.Broker_FeeApi()}  >
                            <Text style={{fontSize:15,color:'white'}}>Submit</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={{fontSize:16,marginTop:5,color:'red',fontWeight:'500'}}>{this.state.ErrorShow}</Text>
                      </View>
                    </View>
                  </Modal>

                  {/* for the Cancel Order by vendore */}

                  <Modal
                    animationType="slide"
                    //transparent={true}
                    visible={this.state.Cancel_Od_Visible}
                    >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <View>
                          <Text style={{marginBottom:5,fontSize:16,fontWeight:'600'}}>Reason :</Text>
                          <TextInput style={{width:'90%',height:250,padding:5,borderWidth:1}}
                              placeholder='Enter your fee...'
                              //keyboardType='numeric'
                               onChangeText={(text)=>this.setState({reason:text})}
                               multiline={true}
                          />
                        </View>
                        <View style={{flexDirection:'row',marginTop:20}}>
                          <TouchableOpacity style={{width:'40%',height:40,alignItems:'center',justifyContent:'center',backgroundColor:'#2B83CD'}}
                            onPress={()=>this.setState({Cancel_Od_Visible:false,ErrorShow:''})}  >
                            <Text style={{fontSize:15,color:'white'}}>Back</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{width:'40%',marginLeft:20,height:40,alignItems:'center',justifyContent:'center',backgroundColor:'green'}}
                            onPress={()=>this.createTwoButtonAlert()}  >
                            <Text style={{fontSize:15,color:'white'}}>Submit</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={{fontSize:16,marginTop:5,color:'red',fontWeight:'500'}}>{this.state.ErrorShow}</Text>
                      </View>
                    </View>
                  </Modal>
                  
                
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
    color:'#424949',
    width:80,
    marginLeft:15,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center'
  },
  Font_Text:{
    fontSize:18,
    color:'#707B7C'
  },
  ButtonView:{
    width:30,
    borderRadius:5,
   marginTop:5,
    height:30,
    backgroundColor:'green',
   // backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center'
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
},
pdf: {
    flex:1,
    width:'60%',
    height:100
},
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  alignSelf:'center',
  width:'80%'
},
modalView: {
  backgroundColor: "white",
  borderRadius: 20,
  padding: 35,
  width:'100%',
  //alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
  // Button_View:{
  //   justifyContent:'center',
  //   alignItems:'center',
  //   alignSelf:'center',
  //   borderBottomWidth:1
  // },
  
});
