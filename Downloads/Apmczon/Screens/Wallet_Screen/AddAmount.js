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
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import RazorpayCheckout from 'react-native-razorpay'
import api from '../Config/api'
import AllInOneSDKManager from 'paytm_allinone_react-native';
import RNPgReactNativeSdk from 'react-native-pg-react-native-sdk';
import Storage from '../Config/Storage'

import {startPayment} from './WEBCHECKOUT';
import { Wallet_List_Fun } from './Wal_Fun_Api';

const WEB = 'WEB';
const UPI = 'UPI';
const BASE_RESPONSE_TEXT = 'Response or error will show here.';

const apiKey = '87846acedc53d27751936950664878'; // put your apiKey here
const apiSecret = 'c290f767e9179f43792d09048d99f68a31229db8'; // put your apiSecret here

const env = 'TEST'; // use 'TEST or 'PROD'
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      LoginType:1,
      UserID:'',
      Amount:'',
      userDetial:'',
      responseText: BASE_RESPONSE_TEXT,
      upiAppArray: [],
    }
  }
  // Cash free Api 
  changeResponseText = (message) => {
    this.setState({
      responseText: message,
    });
  };

  changeUPIArray = (array) => {
    this.setState({
      upiAppArray: array,
    });
  };

  getFormattedIcon(appName, icon, id) {
    return (
      <TouchableOpacity
        key={id}
        //style={styles.round_icon_buttons}
        onPress={() => this._startCheckout(UPI, id)}>
        <Image style={styles.upi_image} source={{uri: icon}} />
        <Text //style={styles.upi_icons_text}
        > {appName} </Text>
      </TouchableOpacity>
    );
  }

  setApps(obj) {
    let array = [];
    obj.forEach(function (item) {
      console.log(item.id);
      let iconString = item.icon;
      let icon = RNPgReactNativeSdk.getIconString(iconString);
      let button = this.getFormattedIcon(item.displayName, icon, item.id);
      array.push(button);
    }, this);
    this.changeUPIArray(array);
  }

  _getApps() {
    RNPgReactNativeSdk.getUPIApps()
      .then((result) => {
        let obj = JSON.parse(result);
        this.setApps(obj);
      })
      .catch((error) => {
        this.changeUPIArray([
          <Text key="no_upi_error" //style={styles.upi_app_not_found}
          >
            {' '}
            {error.message}{' '}
          </Text>,
        ]);
      });
  }

  async _createOrderWithToken() {
    let orderId;
    let tokenUrl;

    if (env === 'TEST') {
      tokenUrl = 'https://test.cashfree.com/api/v2/cftoken/order'; //for TEST
    } else {
      tokenUrl = 'https://api.cashfree.com/api/v2/cftoken/order'; //for PROD
    }

    orderId = 'Order' + parseInt(100000000 * Math.random(), 10);
    let orderApiMap = {
      orderId: orderId,
      orderAmount: this.state.Amount,
      orderCurrency: 'INR',
    };

    const postParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': apiKey,
        'x-client-secret': apiSecret,
      },
      body: JSON.stringify(orderApiMap),
    };
    return new Promise((resolve, reject) => {
      let cfToken;
      fetch(tokenUrl, postParams)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // console.log("data" + data);
          if (data.status === 'ERROR') {
            console.log(
              `Error (code: ${data.subCode}, message: ${data.message})`,
            );
            console.log(
              'Please check the apiKey and apiSecret credentials and the environment',
            );
            return;
          }
          try {
            cfToken = data.cftoken;
            console.log('Token is : ' + data.cftoken);
            // console.log('data is : ' + JSON.stringify(data));
            let map = {
              orderId: orderId,
              orderAmount: this.state.Amount,
              tokenData: cfToken,
              orderCurrency: 'INR',
            };
            return resolve(map);
          } catch (error) {
            console.log('THE ERROR IS ' + data);
            return reject(data);
          }
        });
    });
  }

  async _startCheckout(mode, appId) {
    this.validateCreds();
    console.log('_startCheckout invoked ' + mode + '  ' + appId);

    let responseHandler = (result) => {
      this.changeResponseText(result);
      console.log(' result ',JSON.parse(result));
      let result1 = JSON.parse(result)
      if(result1.txStatus =='SUCCESS'){
        let Trajection_data ={
          amount:result1.orderAmount,
          Trajection_id: result1.referenceId,
        }
        this.AddAmountApi(Trajection_data)
      }
      else{
        alert(result1.txStatus)
      }
      try {
        let output = '';
        JSON.parse(result, function (key, value) {
          if (key !== '') {
            output = output + key + ' : ' + value + '\n';
          }
          // Do something with the result
        });
        //console.log('out pute ',typeof(output))
        this.changeResponseText(output);
      } catch (error) {
        //
      }
    };

    try {
      this.changeResponseText(BASE_RESPONSE_TEXT);
      let map = await this._createOrderWithToken();
      startPayment(apiKey, map, mode, appId, env, responseHandler);
    } catch (error) {
      this.changeResponseText(error);
    }
  }

  validateCreds() {
    if (apiKey.includes('app id here')) {
      console.log('please set the apiKey variable');
    }
    if (apiSecret.includes('app secret here')) {
      console.log('please set the apiSecret variable');
    }
  }


// Server Api  (data base)

  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let UserID = await AsyncStorage.getItem('UserID');  
      this.setState({UserID:UserID})
      this.userDatilesFun()
      console.log('user id',UserID)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  } 

  componentDidMount(){
    this.displayData()
    this._getApps();
  }

  userDatilesFun(){
    console.log('user id',this.state.UserID)
    let url= api.baseURL;
      fetch( url+'wb/user_profile', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            this.setState({userDetial:responseData.data[0]})
            Storage.CashFree.customerName = responseData.data[0].firstname
            Storage.CashFree.customerEmail = responseData.data[0].email
            Storage.CashFree.customerPhone = responseData.data[0].mobile
            console.log('storage data ',typeof(responseData.data[0].mobile))
          }
          
          })
         .catch((err) => { console.log(err); });
  }

  // PaymentMethod(){
  //   console.log('user Mobile no.',this.state.userDetial.mobile)
  //   console.log('user Mobile no.',this.state.userDetial.email)
  //   var options = {
  //     description: 'Credits towards consultation',
  //     image: 'https://i.imgur.com/3g7nmJC.png',
  //     currency: 'INR',
  //     key: 'rzp_test_Bo1RuWPh41E1tj',//'rzp_test_Y9apPOtuq7TvFt', // Your api key
  //     amount: this.state.Amount+'00',
  //     name: 'APMC',
  //     remember_customer:true,
  //     prefill: {
  //        email:'',
  //        contact:'',
  //       name: ''
  //     },
  //     theme: {color: '#F37254'}
  //   }
  //   RazorpayCheckout.open(options).then((data) => {
  //     // handle success
  //     console.log('RazorpayCheckout data',data)
  //     this.AddAmountApi(data.razorpay_payment_id)
  //    // alert(`Success: ${data.razorpay_payment_id}`);
  //   }).catch((error) => {
  //     // handle failure
  //     console.log('error razorpay',error)
  //    // alert(`Error: ${error.code} | ${error.description}`);
  //   });
  
  // }

  AddAmountApi(Trajection_data){
    console.log('amounnntttfffffffff',Trajection_data)
    let url= api.baseURL;
    body = JSON.stringify({user_id:this.state.UserID,
        amount:Trajection_data.amount,
        razorpay_payment_id:Trajection_data.Trajection_id
    })
      fetch( url+'wb/add_wallet_amount_success', {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
       // "Content-Disposition": 'multipart/form-data'
        //'Content-Type': 'multipart/form-data'
        //'Content-Length': data.length 
        },
        body:body
      }).then((response) => response.json())
        .then((responseData) =>
         { console.log("response1111: " + JSON.stringify(responseData));
         //this.setState({Activity:false})
         if(responseData.status == 200){
           Actions.Enventory();
          //Wallet_List_Fun(this.props.navigation)
           //this.props.navigation.navigate('drawerMenu')
         }else{
         }
         
         })
        .catch((err) => { console.log(err); });
  }
  Validation_Fun(){
    if(this.state.Amount !=''){
      //this.PaymentMethod()
      this._startCheckout(WEB, null)
    }else{
      alert('Please Enter Amount')
    }
    
  }
// payTm_Fun(){
//   const r = Math.random() * new Date().getMilliseconds();
//     const token = 'PARCEL' +(1 + Math.floor(r % 2000) + 10000) +'b' + (Math.floor(r % 100000) + 10000);
//   let Details ={
//     orderId: 'OREDRID_98765',
//     mid: 'paytmJcXSqo75925004030318',
//     txnToken: String(token),
//     amount: '50',
//     callbackUrl: '',
//     isStaging: false,
//     restrictAppInvoke: true
//   }
//   AllInOneSDKManager.startTransaction(
//     Details.orderId,
//     Details.mid,
//     Details.txnToken,
//     Details.amount,
//     Details.callbackUrl,
//     Details.isStaging,
//     Details.restrictAppInvoke
// )
// .then((result) => {
//     console.log("result", result);
//     updateUI(result);
// })
// .catch((err) => {
//     handleError(err);
// });
//}
  render(){
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <ScrollView>
            <View style={{flex:1}}>
                <View>
                    <Text style={styles.Header_Text}>Wallet</Text>
                </View>
                <View style={{marginTop:30,marginLeft:20}}>
                    <Text style={styles.Font_Text}>Enter Amount</Text>
                    <TextInput style={styles.Input_View}
                      placeholder='Enter Amount Qty'
                      keyboardType='number-pad'
                      onChangeText={(text)=>this.setState({Amount:text})} />
                </View>
                <View>
                    <TouchableOpacity style={styles.ButonView} onPress={()=>this.Validation_Fun()}>
                        <Text style={styles.Font_Text}>Next</Text>
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
    fontSize:20,
    fontWeight:'500',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:30,
    color:'#424949'
  },
  Font_Text:{
      fontSize:16
  },
  Input_View:{
      width:'80%',
      height:40,
      borderRadius:10,
      backgroundColor:'white',
      marginTop:10,
      padding:10
  },
  ButonView:{
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',
      marginTop:10,
      backgroundColor:'green',
      width:'40%',
      height:40,
      borderRadius:10
  }
  
});
