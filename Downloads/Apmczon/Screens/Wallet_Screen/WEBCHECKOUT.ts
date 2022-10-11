import RNPgReactNativeSdk from "react-native-pg-react-native-sdk/bridge";
import Storage from '../Config/Storage'


const WEB = 'WEB';
const UPI = 'UPI';

export function startPayment(apiKey: string, map, mode: string, appId: string, env: string, responseHandler) {
  
  const checkout = new Map<string,string>()
  
  checkout.set('orderId', map.orderId);
  checkout.set('orderAmount', map.orderAmount);
  checkout.set('appId', apiKey);
  checkout.set('tokenData', map.tokenData);
  checkout.set('orderCurrency', map.orderCurrency);
  checkout.set('orderNote', 'Test Note');
  checkout.set('customerName', Storage.CashFree.customerName);
  checkout.set('customerPhone', Storage.CashFree.customerPhone);
  checkout.set('customerEmail', Storage.CashFree.customerEmail);
  checkout.set('hideOrderId', 'true');
  checkout.set('color1', '#6002EE');
  checkout.set('color2', '#ffff1f');
  console.log('Check Out ',map.tokenData)
  // let checkoutMap = {
  //   orderId: map.orderId,
  //   orderAmount: map.orderAmount,
  //   appId: apiKey,
  //   tokenData: map.tokenData,
  //   orderCurrency: map.orderCurrency,
  //   orderNote: 'Test Note',
  //   customerName: 'Cashfree User',
  //   customerPhone: '9999999999',
  //   customerEmail: 'cashfree@cashfree.com',
  //   hideOrderId: true,
  //   color1: '#6002EE',
  //   color2: '#ffff1f',
  // };

  if (mode === UPI) {
    if (appId != null) {
      checkout.set('appName', 'appId')
    }
    RNPgReactNativeSdk.startPaymentUPI(checkout, env, responseHandler);
  } else {
    RNPgReactNativeSdk.startPaymentWEB(checkout, env, responseHandler);
  }
}
