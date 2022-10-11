import React, {Component} from 'react';
import {Button, View, Text, Image, TouchableOpacity} from 'react-native';
import RNPgReactNativeSdk from 'react-native-pg-react-native-sdk';
//import styles from './App.style';
//import {startPayment} from './WEBCHECKOUT';

const WEB = 'WEB';
const UPI = 'UPI';
const BASE_RESPONSE_TEXT = 'Response or error will show here.';

const apiKey = '87846acedc53d27751936950664878'; // put your apiKey here
const apiSecret = 'c290f767e9179f43792d09048d99f68a31229db8'; // put your apiSecret here

const env = 'TEST'; // use 'TEST or 'PROD'


export default class App extends Component {
    
  constructor() {
    super();

    this.state = {
      responseText: BASE_RESPONSE_TEXT,
      upiAppArray: [],
    };
  }

  componentDidMount() {
    this._getApps();
  }

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
        style={styles.round_icon_buttons}
        onPress={() => this._startCheckout(UPI, id)}>
        <Image style={styles.upi_image} source={{uri: icon}} />
        <Text style={styles.upi_icons_text}> {appName} </Text>
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
          <Text key="no_upi_error" style={styles.upi_app_not_found}>
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
      orderAmount: '1',
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
              orderAmount: '1',
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
      console.log(result);
      try {
        let output = '';
        JSON.parse(result, function (key, value) {
          if (key !== '') {
            output = output + key + ' : ' + value + '\n';
          }
          // Do something with the result
        });
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

  render() {
    return (
      <View //style={styles.container}
      >
        <View //style={styles.button}
        >
          <Button onPress={() => this._startCheckout(WEB, null)} title={WEB} />
        </View>
        <View //style={styles.button}
        >
          <Button onPress={() => this._startCheckout(UPI, null)} title={UPI} />
        </View>
        <View //style={styles.upi_icon_containers}
        >{this.state.upiAppArray}</View>
        <Text //style={styles.response_text}
        > {this.state.responseText} </Text>
      </View>
    );
  }
}
