/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react';
import {
  
  Image,
  StyleSheet,
  PixelRatio,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  AsyncStorage
} from 'react-native';

//-------------------Pages----------------------------
//import GetStart from './src/All_Pages/GetStart';
import GetStart from './src/All_Pages/GetStart/GetStart';
import Login from './src/All_Pages/EnterPhoneNumber/Login';
import ConfirmCode from './src/All_Pages/EnterPhoneNumber/ConfirmCode';
import UserName from './src/All_Pages/EnterPhoneNumber/UserName';
import EditAppoint from './src/All_Pages/EditAppoint';

import Setting from './src/All_Pages/Setting';
import Home from './src/All_Pages/Home';
import MyAccount from './src/All_Pages/MyAccount';
import New_MyAccount from './src/All_Pages/New_MyAccout';
import Settings from './src/All_Pages/Settings';

import NewAppoint from './src/All_Pages/NewAppoint.js';
import AllAppoint from './src/All_Pages/AllAppoint.js';
import Save_Account from './src/All_Pages/Save_Account';


//--------------Other library--------------
import { Router, Scene, Actions, Drawer, Modal } from 'react-native-router-flux'
import {
  Stitch,
  RemoteMongoClient,
  UserPasswordCredential,
  AnonymousCredential,
  FunctionAuthProvider,
  FunctionCredential,
  RemoteDeleteResult
} from "mongodb-stitch-react-native-sdk"; 
export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isInitial:false
    };
  }

  UNSAFE_componentWillMount() {
  
    console.log('reroo')
    
    this.setState({isLoading:true})
    AsyncStorage.getItem('isUserLogin').then((token) => {
      console.log('usertoken',token)
      //var value = JSON.parse(token)
      if (token !== null) {
        
        console.log("values",token)
        if (token == true){
          //this.reloadClient()
          this.setState({isInitial:false})
          this.setState({isLoading:false})

        }else {
          this.setState({isInitial:true})
          this.setState({isLoading:false})
        }
      }else {
        this.setState({isLoading:false})
        //console.log('-:User Not Found:-')
      }
    }).catch((err)=> {
      console.log('error:- ', err)
    })
  }
  
  reloadClient = () =>{
    
    var client;
    try {
        client = Stitch.defaultAppClient;

    } catch (error) {

        client = Stitch.initializeDefaultAppClient(appId);
    }

    const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");

    const db = mongoClient.db("que");
    const users = db.collection("users");



    let newDict = {client:client, db:db}
    AsyncStorage.setItem('mongo', newDict)
    
    try {
        if (client.isLoggedIn) {
           // console.log('user login')
            return;
        }
    } catch (error) {
        //console.log('try catch error:- ',error);
    }
}
  render() {
    
    if (this.state.isLoading) {
      return (
        <View style={{flex:1}}></View>
      );
    } else {
      return (
        <Router>
          <Modal>
            <Scene key="root" hideNavBar >
              <Scene key="GetStart" component={GetStart} initial={!this.state.isInitial} swipeEnabled={false}  hideNavBar />
              <Scene key="Login" component={Login} initial={false} hideNavBar swipeEnabled={false}/>
              <Scene key="ConfirmCode" component={ConfirmCode} initial={false} hideNavBar swipeEnabled={false}/>
              <Scene key="UserName" component={UserName} initial={false} hideNavBar swipeEnabled={false}/>
              <Scene key="Setting" component={Setting} initial={false} hideNavBar swipeEnabled={false}/>
              <Scene key="Home" component={Home} initial={this.state.isInitial} swipeEnabled={false} hideNavBar/>
              <Scene key="MyAccount" component={MyAccount} swipeEnabled={false} hideNavBar/>
              <Scene key="New_MyAccount" component={New_MyAccount} swipeEnabled={false} hideNavBar/>
              <Scene key="Settings" component={Settings} swipeEnabled={false} hideNavBar/>
              <Scene key='Save_Account' component={Save_Account} swipeEnabled={false} hideNavBar/>
            </Scene>
            <Scene key="NewAppoint" component={NewAppoint} direction="vertical" initial={false} hideNavBar />
            <Scene key="EditAppoint" component={EditAppoint} initial={false} hideNavBar />
            <Scene key="AllAppoint" component={AllAppoint} initial={false} hideNavBar />
          </Modal>
        </Router>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },


});
