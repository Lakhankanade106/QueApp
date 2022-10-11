/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeModules,
  NativeEventEmitter,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Storage from '../Screens/Config/Storage'

import RazorpayCheckout from 'react-native-razorpay'

export default class app extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    // componentDidMount(){
    //   this.userDatilesFun();
    // }
    // userDatilesFun(){
    //   console.log('user id',this.state.UserID)
    //   let url= api.baseURL;
    //     fetch( url+'wb/products_list', {
    //        method: 'POST',
    //        headers: { 
    //        'Accept': 'application/json', 
    //        'Content-Type': 'application/json',
    //        //'Content-Length': data.length 
    //        },
    //        body:JSON.stringify({user_id:this.state.UserID})
    //      }).then((response) => response.json())
    //        .then((responseData) =>
    //         { console.log("response: " + JSON.stringify(responseData));
    //         if(responseData.status=='200'){
    //           this.setState({ProductList:responseData.data})
    //         }
            
    //         })
    //        .catch((err) => { console.log(err); });
    // }
    render(){
        return(
            <SafeAreaView>
                <SafeAreaView>
                    <View>
                        <TouchableOpacity
                         onPress={() => {
                            var options = {
                              description: 'Credits towards consultation',
                              image: 'https://i.imgur.com/3g7nmJC.png',
                              currency: 'INR',
                              key: 'rzp_test_Y9apPOtuq7TvFt', // Your api key
                              amount: '5000',
                              // name: 'foo',
                              // prefill: {
                              //   email: 'www.lkanade@gmail.com',
                              //   contact: '9630630309',
                              //   name: 'Razorpay Software'
                              // },
                              // theme: {color: '#F37254'}
                            }
                            RazorpayCheckout.open(options).then((data) => {
                              // handle success
                              alert(`Success: ${data.razorpay_payment_id}`);
                            }).catch((error) => {
                              // handle failure
                              alert(`Error: ${error.code} | ${error.description}`);
                            });
                          }} >
                              <Text>Click Me</Text>

                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </SafeAreaView>
        )
    }
}