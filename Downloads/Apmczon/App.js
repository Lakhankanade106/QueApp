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
  AsyncStorage
} from 'react-native';

import { Router, Scene,Drawer,DefaultRenderer } from 'react-native-router-flux';
import Login from './Screens/Login';
//import Signup from './Screens/Signup';
import OTP from './Screens/Otp';
import Registration from './Screens/Registration';
import AddPartner from './Screens/AddPartner';
import Product from './Screens/Product';
import List from './Screens/Product_Screen/List';
import ProductDeal from './Screens/Product_Screen/ProductDeal';
import AddDeal from './Screens/Product_Screen/AddDeal';
import ADProduct from './Screens/Product_Screen/ADProduct';
import imagess from './Images/side-menu-icon.png';
import Menu from './Screens/Menu_Screen/Menu';
import AddAmount from './Screens/Wallet_Screen/AddAmount';
import Enventory from './Screens/Wallet_Screen/Enventory';
import Orders from './Screens/Orders_Screen/Orders';
import MyOrders from './Screens/Orders_Screen/My_Orders';
import AddStaff from './Screens/Staff/AddStaff';
import StaffList from './Screens/Staff/StaffList';
import VahicalAdd from './Screens/Vahicales_Screen/VahicalAdd';
import VahicalList from './Screens/Vahicales_Screen/VahicalList';
import Profile from './Screens/Profile';
import ForgotPass from './Screens/ForgotPassword';
import RozerPay from './Screens/RozerPay'
import map from './Screens/map'
import AddCard from './Screens/AddCard'
import PartnerList from './Screens/Partners/PartnersList'
import DocView from './Screens/DocView';
import EditVahical from './Screens/Vahicales_Screen/EditVahical';
import Review from './Screens/Review';
import ReviewList from './Screens/ReviewList.js';
import ProductEdit from './Screens/Product_Screen/ProductEdit.js'
import Add_Category from './Screens/Product_Screen/Add_Category'
import Add_Subcategory from './Screens/Product_Screen/Add_Subcategory'
import OrderShow from './Screens/Orders_Screen/OrderShow'
import ProductView from './Screens/Orders_Screen/ProductView.js'
import OrderStatus from './Screens/Orders_Screen/OrderStatus'
import StaffDtails from './Screens/Staff/StaffDetails.js'
import Add_Qty from './Screens/Product_Screen/Add_Qty'
import Qty_History from './Screens/Product_Screen/Qty_History'
import Add_partner from './Screens/Partners/Add_Partner'
import Order_Asign from './Screens/Orders_Screen/Order_Asign'
import Add_Signature from './Screens/Orders_Screen/Add_Signatur.js'
import Recive_Charges from './Screens/OrderRecive/Recive_Charges.js'

import Show_image from './Screens/Orders_Screen/Show_image'
import Payment_Testing from './Screens/Wallet_Screen/Payment_Testing'

// Advertisement pages  ======
import Advertisement_Add from './Screens/Advertisement/Advertisement_Add'
import Advertisement_List from './Screens/Advertisement/Advertisement_List'

// Cancel Orderss ========
import Cancel_Order from './Screens/Cancel_Orders/Cancel_Order'
import Cancellation_Charges from './Screens/Cancel_Orders/cancellation_Charges'

// Order Recive Status =========
import ReciveStatus from './Screens/OrderRecive/ReciveStatus'

// Help ======
import Form from './Screens/Help/Form'

// Banking =====
import Banking_list from './Screens/Banking/Banking_list'

import Geolocation from './Screens/GeoLocation'
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      isVisible : true,
    }
  }
  // Hide_Splash_Screen=()=>{  
  //   this.setState({   
  //     isVisible : false   
  //   });  
  // }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let user = await AsyncStorage.getItem('user');  
      let UserID = await AsyncStorage.getItem('UserID');
      console.log('Displaydata kaam kar raha he')
      this.setState({UserID:UserID}) 
     // this.getDataFun() 
    }  
    catch(error){  
      alert(error)  
    }  
  } 


  componentDidMount(){  
    
    var that = this;  
    setTimeout(function(){  
      that.setState({isVisible:false}) 
    }, 2000);  
    this.displayData()
   }
    Splash_Screen() {
      return( 
        <View style={styles.SplashScreen_ChildView}>  
              <Image source={require('./Images/Splace_Screen.png')}  
           style={{width:'100%', height: '100%' }} />  
       </View>  
      )  
     }
     DrawerIconStyle(){
       return(
         <View>
           <Text>lucky</Text>
           <Image style={{width:25,height:20}}
           source={require('./Images/side-menu-icon.png')} />
         </View>
       )
     }  
  render(){
    if(this.state.isVisible){
      return(
        <View style={styles.SplashScreen_RootView} >
          {  
           (this.state.isVisible === true) ? this.Splash_Screen() : null  
           }  
        </View>
      )
    }
    //const state = this.props.navigationState;
  return (
    <Router hideNavBar={true} > 
    <Scene key="Geolocation"   >
      {this.state.UserID !=null?
      <Drawer style={styles.DrawerStyle}
          key="drawerMenu"
          contentComponent={Menu}
          drawerWidth={250}
          drawerPosition='left'
          openDrawerOffset={5}
          hideNavBar={true}
          drawerImage={imagess}
          leftButtonIconStyle={{ width:25,height:25,tintColor:'black' }}
          navigationBarStyle={{ backgroundColor: '#F9F6F6', opacity: 0.65,height:40 }}
      >
        <Scene key ='Payment_Testing' component={Payment_Testing}/>
        <Scene key="Product" component={Product} />
        <Scene key="ADProduct" component={ADProduct} />
        {/* <Scene key="List" component={List} /> */}
        <Scene key='ProductDeal' component={ProductDeal}/>
        <Scene key='AddDeal' component={AddDeal}/>
        <Scene key="AddAmount" component={AddAmount} />
        {/* <Scene key="Enventory" component={Enventory} /> */}
        <Scene key="Orders" component={Orders} />
        <Scene key="MyOrders" component={MyOrders} />
        {/* <Scene key="AddStaff" component={AddStaff}/>
        <Scene key="StaffList" component={StaffList}/> */}
        <Scene key="VahicalAdd" component={VahicalAdd}/>
        {/* <Scene key='VahicalList' component={VahicalList}/> */}
        {/* <Scene key='EditVahical' component={EditVahical}/> */}
        {/* <Scene key='Profile' component={Profile}/> */}
        <Scene key='AddCard' component={AddCard}/>
        {/* <Scene key='PartnerList' component={PartnerList}/> */}
        {/* <Scene key='Add_partner' component={Add_partner}/> */}
        {/* <Scene key='Review' component={Review}/> */}
      </Drawer>
      : <Scene key="Login" component={Login} title="Login" hideNavBar={true}/>}

      {/* <Scene key="RozerPay" component={RozerPay} title="RozerPay" hideNavBar={true}/> */}
        <Scene key="Login" component={Login} title="Login" hideNavBar={true}/>
      {/* <Scene key="Signup" component={Signup} title="Signup" hideNavBar={true}/> */}
      <Scene key="OTP" component={OTP} title="OTP" hideNavBar={true}/>
      <Scene key="Registration" component={Registration} title="Registration" hideNavBar={true}/>
      {/* <Scene key="AddPartner" component={AddPartner} title="AddPartner" hideNavBar={true}/> */}
      {/* <Scene key='Product' component={Product} title='Addproduct' hideNavBar={true}/> */}
      <Scene key='ForgotPass' component={ForgotPass} title='ForgotPass' hideNavBar={true} />
      <Scene key='Geolocation' component={Geolocation} title='Geolocation' hideNavBar={true} />
      <Scene key='map' component={map} title='map' hideNavBar={true} />
      <Scene key="AddPartner" component={AddPartner} title="AddPartner" hideNavBar={true}/>
      <Scene key="Review" component={Review} title="Review" hideNavBar={true}/>
      <Scene key="ReviewList" component={ReviewList} title="ReviewList" hideNavBar={true}/>
      <Scene key="ProductEdit" component={ProductEdit} title="ProductEdit" hideNavBar={true}/>
      <Scene key="Advertisement_Add" component={Advertisement_Add} title="Advertisement_Add" hideNavBar={true}/>
      <Scene key="Advertisement_List" component={Advertisement_List} title="Advertisement_List" hideNavBar={true}/>
      <Scene key="ReciveStatus" component={ReciveStatus} title="ReciveStatus" hideNavBar={true}/>
      <Scene key="Cancel_Order" component={Cancel_Order} title="Cancel_Order" hideNavBar={true}/>
      <Scene key="Form" component={Form} title="Form" hideNavBar={true}/>
      <Scene key="Add_Category" component={Add_Category} title="Add_Category" hideNavBar={true}/>
      <Scene key="Add_Subcategory" component={Add_Subcategory} title="Add_Subcategory" hideNavBar={true}/>
      <Scene key="Banking_list" component={Banking_list} title="Banking_list" hideNavBar={true}/>
      <Scene key="OrderShow" component={OrderShow} title="OrderShow" hideNavBar={true}/>
      <Scene key="ProductView" component={ProductView} title="ProductView" hideNavBar={true}/>
      <Scene key="OrderStatus" component={OrderStatus} title="OrderStatus" hideNavBar={true}/>
      <Scene key="DocView" component={DocView} title="DocView" hideNavBar={true}/>
      <Scene key="StaffDtails" component={StaffDtails} title="StaffDtails" hideNavBar={true}/>
      <Scene key="Add_Qty" component={Add_Qty} title="Add_Qty" hideNavBar={true}/>
      <Scene key="Qty_History" component={Qty_History} title="Qty_History" hideNavBar={true}/>
      <Scene key="Cancellation_Charges" component={Cancellation_Charges} title="Cancellation_Charges" hideNavBar={true}/>
      <Scene key="Add_partner" component={Add_partner} title="Add_partner" hideNavBar={true}/>
      <Scene key="PartnerList" component={PartnerList} title="PartnerList" hideNavBar={true}/>
      <Scene key="AddStaff" component={AddStaff} title="AddStaff" hideNavBar={true}/>
      <Scene key="StaffList" component={StaffList} title="StaffList" hideNavBar={true}/>
      <Scene key="Order_Asign" component={Order_Asign} title="Order_Asign" hideNavBar={true}/>
      <Scene key='VahicalList' component={VahicalList} title='VahicalList' hideNavBar={true}/>
      <Scene key='EditVahical' component={EditVahical} title='EditVahical' hideNavBar={true}/>
      <Scene key='Add_Signature' component={Add_Signature} title='Add_Signature' hideNavBar={true}/>
      <Scene key='Recive_Charges' component={Recive_Charges} title='Recive_Charges' hideNavBar={true}/>
      <Scene key='Show_image' component={Show_image} title='Show_image' hideNavBar={true}/>
      <Scene key='List' component={List} title='List' hideNavBar={true}/>
      <Scene key='Profile' component={Profile} title='Profile' hideNavBar={true}/>
      <Scene key ='Enventory' component={Enventory} title = 'Enventory' hideNavBar={true}/>
      <Drawer style={styles.DrawerStyle}
        key="drawerMenu"
        contentComponent={Menu}
        drawerWidth={250}
        drawerPosition='left'
        openDrawerOffset={5}
        hideNavBar={true}
        drawerImage={imagess}
        leftButtonIconStyle={{ width:25,height:25,tintColor:'black' }}
        navigationBarStyle={{ backgroundColor: '#F9F6F6', opacity: 0.65,height:40 }}
      >
        {/* <Scene key ='Payment_Testing' component={Payment_Testing}/> */}
        <Scene key="Product" component={Product} />
        <Scene key="ADProduct" component={ADProduct} />
        {/* <Scene key="List" component={List} /> */}
        <Scene key='ProductDeal' component={ProductDeal}/>
        <Scene key='AddDeal' component={AddDeal}/>
        <Scene key="AddAmount" component={AddAmount} />
        {/* <Scene key="Enventory" component={Enventory} /> */}
        <Scene key="Orders" component={Orders} />
        <Scene key="MyOrders" component={MyOrders} />
        {/* <Scene key="AddStaff" component={AddStaff}/>
        <Scene key="StaffList" component={StaffList}/> */}
        <Scene key="VahicalAdd" component={VahicalAdd}/>
        {/* <Scene key='VahicalList' component={VahicalList}/> */}
        {/* <Scene key='EditVahical' component={EditVahical}/> */}
        {/* <Scene key='Profile' component={Profile}/> */}
        <Scene key='AddCard' component={AddCard}/>
        {/* <Scene key='PartnerList' component={PartnerList}/> */}
        {/* <Scene key='Add_partner' component={Add_partner}/> */}
        {/* <Scene key='Review' component={Review}/> */}
      </Drawer>
    </Scene>
  </Router>
  );
  }
};

const styles = StyleSheet.create({
  SplashScreen_RootView:  
  {  
      justifyContent: 'center',  
      flex:1,   
      position: 'absolute',  
      width: '100%',  
      height: '100%',
        
    },  
 
  SplashScreen_ChildView:  
  {  
      justifyContent: 'center',  
      alignItems: 'center',  
      flex:1,  
  },
  DrawerStyle:{
  }
  
 
});
