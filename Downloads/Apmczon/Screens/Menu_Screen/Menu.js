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
  AsyncStorage,
  Alert,
  NativeModules
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Storage from '../Config/Storage';
import api from '../Config/api';

let balance =''
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      user:'',
      UserId:'',
      is_driver:'',
     // Approved:1
      //balance:''
    }
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let user = await AsyncStorage.getItem('user');
      let UserId = await AsyncStorage.getItem('UserID')
      let is_driver = await AsyncStorage.getItem('is_driver')  
      console.log('user ss',is_driver)
      this.setState({is_driver:is_driver})
      this.setState({UserId:UserId})
      this.setState({user:user})
      this.Belence_Api()
      //this.Approved_Api()
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  }  
  componentDidMount(){
    this.displayData()
  }
  Belence_Api(){
    //https://apmczon.in/wb/user_balance
    let url= api.baseURL;
      fetch( url+'wb/user_balance', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({user_id:this.state.UserId})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({ProductView:responseData.data})
            //Actions.ReviewList()
            balance = responseData.data[0].balance
          }
          else{
              this.setState({ErrorShow:responseData.message})
          }
          
          })
         .catch((err) => { console.log(err); });
  }

  

  LogOutProcess(){
    Alert.alert(
      "Logout",
      "Are you sure You want to Logout",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "No"
        },
        { text: "Yes", onPress: () => this.LogoutFun() }
      ]
    );
  }
  LogoutFun(){
    let url= api.baseURL;
      fetch( url+'wb/logout', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({user_id:this.state.UserId})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({ProductView:responseData.data})
            //Actions.ReviewList()
            AsyncStorage.setItem('is_driver','');
            AsyncStorage.setItem('user','');
            AsyncStorage.setItem('UserID','');
            Actions.Login()
            //NativeModules.DevSettings.reload();
           
          }
          else{
              this.setState({ErrorShow:responseData.message})
          }
          })
         .catch((err) => { console.log(err); });
  }

  Approved_Api(){
    //https://apmczon.in/wb/approved_status
    console.log('Approved Api Call')
    let url= api.baseURL;
      fetch( url+'wb/approved_status', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({user_id:this.state.UserId})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss Approved: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({ProductView:responseData.data})
            //Actions.ReviewList()
            if(responseData.data[0].approved ==0){
              if(Storage.Approved == 0){
                alert('Please Approved you account')
              }
             
            }
            else{
              Storage.Approved = responseData.data[0].approved
             // this.setState({Approved:responseData.data[0].approved})
            }
            
          }
          else{
              this.setState({ErrorShow:responseData.message})
          }
          
          })
         .catch((err) => { console.log(err); });
  }

  render(){
   console.log('user type',Storage.company_logo)
   console.log('user type',this.state.is_driver)
   
   if(this.state.is_driver !=1){
    this.Belence_Api()
   }
   
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <ScrollView>
            <View style={{flex:1}}>
              <View style={{alignItems:'flex-end',marginRight:10,marginTop:10}}>
                <TouchableOpacity onPress={()=>Actions.pop()}>
                  <Image style={{width:20,height:20,tintColor:'red'}}
                    source={require('../../Images/CloseIcone.png')} />
                </TouchableOpacity>
              </View>
              <View style={{alignItems:'center',marginTop:10}}>
                <Image style={{width:160,height:160,borderRadius:80}} resizeMode='cover'
                  source={require('../Menu_images/Home_Icon.png')}
                />
              </View>
              {this.state.is_driver ==1?
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>Actions.drawerMenu()}>
                  <Image style={{width:80,height:80,alignSelf:'center',borderRadius:30,marginTop:20}} resizeMode='cover'
                    source={require('../../Images/TrucDriver_icon.jpeg')} />
                  </TouchableOpacity>
                  <Text style={{marginTop:10,marginLeft:10,fontSize:16,fontWeight:'800',alignSelf:'center'}}>Driver</Text>
              </View>
              :
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>Actions.drawerMenu()}>
                  <Image style={{width:80,height:80,alignSelf:'center',borderRadius:40,marginTop:20}}
                    source={{uri:'https://apmczon.in/upload/company/'+Storage.company_logo}} />
                </TouchableOpacity>
                <View>
                <Text style={{marginTop:10,fontSize:16,fontWeight:'800',alignSelf:'center'}}>Bal : {balance}</Text>
                <Text style={{marginTop:10,fontSize:16,fontWeight:'800',alignSelf:'center'}}>{this.state.user}</Text>
                </View>
              </View>
                }
                
               <View style={{marginLeft:20,marginTop:20}}>
               {this.state.is_driver ==0?
               <View>
                 <TouchableOpacity style={styles.Button_Style} onPress={()=>Actions.drawerMenu()} > 
                    <View >
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/Home.png')} />
                    </View>
                    <Text style={styles.Button_Text}>Home</Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Storage.OrderScreenId = this.state.UserId,Storage.EditOption =false,Actions.Profile()}}} >
                    <View >
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/Home.png')} />
                    </View>
                    <Text style={styles.Button_Text}>My Profile</Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.AddCard()}}} >
                    <View >
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/Home.png')} />
                    </View>
                    <Text style={styles.Button_Text}>My Cart</Text>
                  </TouchableOpacity >
                  

                  {/*============= Wallet Screen ==========================*/}
                  <View>
                    <Text style={styles.HeaderText}>Wallet</Text>
                  </View>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                    }else{Actions.AddAmount()}}}>
                    <Image style={{width:30,height:30,tintColor:'#DC8A33'}}
                      source={require('../Menu_images/Add_Amount.png')} />
                    <Text style={styles.Button_Text}>Add Amount</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                    }else{Actions.Enventory()}}} >
                    <Image style={{width:30,height:30,tintColor:'blue'}}
                      source={require('../Menu_images/List_icon.png')} />
                    <Text style={styles.Button_Text}> Payment History</Text>
                  </TouchableOpacity>

      {/*============= Products Screen ===================================*/}
                  {this.state.user =='Vender' || this.state.user == 'Broker'?
                  <View>
                    <View >
                    <Text style={styles.HeaderText}>Products</Text>
                  </View>
                  {this.state.user == 'Vender' ?
                  <View>
                    <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                      this.Approved_Api()
                    }else{Actions.ADProduct()}}} >
                    <View >
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/add-57.png')} />
                    </View>
                    <Text style={styles.Button_Text}>Add</Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.List()}}}>
                    <View style={{}}>
                      <Image style={{width:30,height:30,tintColor:'blue'}}
                        source={require('../Menu_images/List_icon.png')} />
                    </View>
                    <Text style={styles.Button_Text}>List</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.Add_Category()}}}>
                    <View style={{}}>
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/add-57.png')} />
                    </View>
                    <Text style={styles.Button_Text}>Add Category</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.Add_Subcategory()}}}>
                    <View style={{}}>
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/add-57.png')} />
                    </View>
                    <Text style={styles.Button_Text}>Add Subcategory</Text>
                  </TouchableOpacity>
                  </View>:null}
                  
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.ProductDeal()}}}>
                    <View style={{}}>
                      <Image style={{width:30,height:30,tintColor:'blue'}}
                        source={require('../Menu_images/List_icon.png')} />
                    </View>
                    
                    {this.state.user=='Vender'?
                    <Text style={styles.Button_Text}>Deal with Brokers</Text>
                    :<Text style={styles.Button_Text}>Deal with Vendor</Text>}
                  </TouchableOpacity>
                  
                  {this.state.user =='Broker'?
                  <View>
                    <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                      this.Approved_Api()
                    }else{Actions.AddDeal()}}}>
                    <View style={{}}>
                      <Image style={{width:30,height:30,tintColor:'blue'}}
                        source={require('../Menu_images/List_icon.png')} />
                    </View>
                    <Text style={styles.Button_Text}>Add Deal</Text>
                  </TouchableOpacity>
                  </View>:null}
                  
                  </View>:null}

      
               </View>
               :null}
                  

      {/*============= Orders Screen ===================================*/}
                  <View>
                    <Text style={styles.HeaderText}>Orders</Text>
                  </View>
                  {this.state.user =='Vender' || this.state.user =='Broker' || this.state.user =='Transpoter'||this.state.is_driver ==1?
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.Orders()}}} >
                  <Image style={{width:25,height:25,}}
                    source={require('../../Images/Digital__Design_99-512.png')} />
                    {this.state.user =='Vender' || this.state.is_driver==1 ?
                    <Text style={styles.Button_Text}>Orders</Text>
                    :null}
                    {this.state.user =='Broker'|| this.state.user =='Transpoter'?
                    <Text style={styles.Button_Text}>My Under Orders</Text>
                    :null}
                  
                </TouchableOpacity>:null}
                {this.state.is_driver !=1?
                <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                  this.Approved_Api()
                }else{Actions.MyOrders()}}}>
                <Image style={{width:30,height:30,tintColor:'#DC8A33', transform: [{ rotate: '180deg'}]}}
                  source={require('../../Images/Digital__Design_99-512.png')} />
                <Text style={styles.Button_Text}>My Orders</Text>
              </TouchableOpacity>
                :null}

       {this.state.is_driver ==0?
       <View>
          {/*============= Staff Screen ==============================*/}
          {this.state.user =='Transpoter'?
                 <View>
                   <View>
                    <Text style={styles.HeaderText}>Staff</Text>
                  </View>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.AddStaff()}}} >
                    <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                      source={require('../Menu_images/add-57.png')} />
                    <Text style={styles.Button_Text}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.StaffList()}}}>
                    <Image style={{width:30,height:30,tintColor:'blue'}}
                      source={require('../Menu_images/List_icon.png')} />
                    <Text style={styles.Button_Text}>List</Text>
                  </TouchableOpacity>
                 </View>
                 :null}

          {/*============= Partners Screen =========================*/}
                  <View>
                    <Text style={styles.HeaderText}>Partners</Text>
                  </View>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.Add_partner()}}} >
                    <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                      source={require('../Menu_images/add-57.png')}  />
                    <Text style={styles.Button_Text}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.PartnerList()}}} >
                    <Image style={{width:30,height:30,tintColor:'blue'}}
                      source={require('../Menu_images/List_icon.png')}  />
                    <Text style={styles.Button_Text}>List</Text>
                  </TouchableOpacity>

         {/*======================== Vahicales  =================================*/}         
                  {this.state.user =='Transpoter'?
                  <View>
                    <View>
                    <Text style={styles.HeaderText}>Vahicales</Text>
                  </View>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.VahicalAdd()}}}>
                    <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                      source={require('../Menu_images/add-57.png')}  />
                    <Text style={styles.Button_Text}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.VahicalList()}}}>
                    <Image style={{width:30,height:30,tintColor:'blue'}}
                      source={require('../Menu_images/List_icon.png')} />
                    <Text style={styles.Button_Text}>List</Text>
                  </TouchableOpacity>
                  </View>:null}
            {/*======================== Advertisement  =================================*/}       
                 {this.state.user =='Vender'?
                 <View>
                 <View>
                    <Text style={styles.HeaderText}>Advertisement</Text>
                 </View>
                 <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                   this.Approved_Api()
                 }else{Actions.Advertisement_Add()}}}>
                   <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                     source={require('../Menu_images/add-57.png')}  />
                   <Text style={styles.Button_Text}>Add</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved == 0){
                   this.Approved_Api()
                 }else{Actions.Advertisement_List()}}}>
                   <Image style={{width:30,height:30,tintColor:'blue'}}
                     source={require('../Menu_images/List_icon.png')} />
                     <Text style={styles.Button_Text}>List</Text>
                 </TouchableOpacity>
               </View>
                 :null}
                  

            {/*======================== Banking  =================================*/} 
                 {this.state.user != 'Shop'?
                  <View>
                    <View>
                      <Text style={styles.HeaderText}>Banking</Text>
                    </View>
                  {/* <TouchableOpacity style={styles.Button_Style} onPress={()=>Actions.Advertisement_Add()}>
                    <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                      source={require('../Menu_images/add-57.png')}  />
                    <Text style={styles.Button_Text}>Add</Text>
                  </TouchableOpacity> */}
                      <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                        this.Approved_Api()
                      }else{Actions.Banking_list()}}}>
                        <Image style={{width:30,height:30,tintColor:'blue'}}
                          source={require('../Menu_images/List_icon.png')} />
                          <Text style={styles.Button_Text}>List</Text>
                      </TouchableOpacity>
                </View>
                 :null}

          {/*======================== Order Receive Status  =================================*/}       
                  <View>
                    <View>
                       <Text style={styles.HeaderText}>Order Receive Status</Text>
                    </View>
                    <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                      this.Approved_Api()
                    }else{Actions.ReciveStatus()}}}>
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/List_icon.png')}  />
                      <Text style={styles.Button_Text}>List</Text>
                    </TouchableOpacity>
                  </View>

          {/*======================== Cancel Orders  =================================*/}       
                  <View>
                    <View>
                       <Text style={styles.HeaderText}>Cancel Orderss</Text>
                    </View>
                    <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                      this.Approved_Api()
                    }else{Actions.Cancel_Order()}}}>
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/List_icon.png')}  />
                      <Text style={styles.Button_Text}>List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                      this.Approved_Api()
                    }else{Actions.Cancellation_Charges()}}}>
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/List_icon.png')}  />
                      <Text style={styles.Button_Text}>Cancellation Charges</Text>
                    </TouchableOpacity>
                  </View>

          {/*======================== Help  =================================*/}       
                  <View>
                    <View>
                       <Text style={styles.HeaderText}>Help</Text>
                    </View>
                    <TouchableOpacity style={styles.Button_Style} onPress={()=>Actions.Form()}>
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/List_icon.png')}  />
                      <Text style={styles.Button_Text}>Form</Text>
                    </TouchableOpacity>
                  </View>
       </View>
       :null}

       {/* ==================== Review =================== */}
                  <Text style={styles.HeaderText}>Review</Text>
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.Review()}}} >
                    <View >
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/Home.png')} />
                    </View>
                    <Text style={styles.Button_Text}>Review</Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>{if(Storage.Approved ==0){
                    this.Approved_Api()
                  }else{Actions.ReviewList()}}} >
                    <View >
                      <Image style={{width:25,height:25,tintColor:'#DC8A33'}}
                        source={require('../Menu_images/Home.png')} />
                    </View>
                    <Text style={styles.Button_Text}>Review List</Text>
                  </TouchableOpacity >

        {/*================================ Logout  =============== */}
                  <TouchableOpacity style={styles.Button_Style} onPress={()=>this.LogOutProcess()}>
                    <Image style={{width:30,height:30,tintColor:'red'}}
                      source={require('../Menu_images/Digital__Design_99-512.png')}  />
                    <Text style={styles.Button_Text}>Logout</Text>
                  </TouchableOpacity>
                </View>              
            </View>
        </ScrollView>
    </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  Button_Style:{
    alignItems:'center',
    flexDirection:'row',
    marginTop:10,
    marginBottom:10
  },
  HeaderText:{
    fontSize:18,
    fontWeight:'700',
    marginTop:10
  },
  Button_Text:{
    fontSize:16,
    fontWeight:'500',
    marginLeft:20
  },
});
