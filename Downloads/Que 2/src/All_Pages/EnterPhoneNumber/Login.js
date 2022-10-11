import React from "react"
import { Image, 
    Platform,
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    SafeAreaView,
    StatusBar,
    Alert } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import {Actions} from 'react-native-router-flux'
import {
    Stitch,
    RemoteMongoClient,
    UserPasswordCredential,
    AnonymousCredential,
    UserPasswordAuthProviderClient,
  } from "mongodb-stitch-react-native-sdk";
import Svg ,{Path, Stop, SvgXml} from 'react-native-svg';
import AsyncStorage from '@react-native-community/async-storage';

import RSStyle from '../../Style/Style'
import RSColor from "../../Style/RSColor";
import RSIcon from '../../Style/RSIcon'

const appId = "que-eblub";
export default class GetStarted extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            header: null,
            headerLeft: null,
            headerRight: null,
        };
    };
    
    constructor(props) {
        super(props);

        this.state = {

            error: false,
            client:'',
            db:{},
        };
        this._loadClient = this._loadClient.bind(this);
        this.onSendcodebtnPressed = this.onSendcodebtnPressed.bind(this);
    }
    async _retrieveData() {

        try {
            const value = await AsyncStorage.getItem("user");
            //console.log('user login:- ',value);
            if (value !== null) {
                // Our data is fetched successfully
               // console.log('value:--- ',value);

                // const { navigate } = this.props.navigation;
                //Actions.push('Home', { user: JSON.parse(value) })
                // navigate("Dashboard", { user: JSON.parse(value) });
            }else {
                //console.log('-:User Not Found:-')
            }
        } catch (error) {
            //console.log('user not logged in ');
            //console.log(error);
            // Error retrieving data
            return false;
        }
    };
    async componentDidMount() {
        // await !this._retrieveData();
        this._loadClient();
    }
    requestCode(phone) {
        //console.log("request code for:-  " + phone);
        Stitch.defaultAppClient.callFunction("sendVerificationCode", [phone])
            .then((result) => {
                
            //console.log('result:- ',result.code.E);
            
            if((result.code.E != null) && (result.code.E != undefined)){
                let nn = JSON.parse(result.code.E)
                alert(nn.message)
            }else {
                var s = this.state;
                s.error = false;
                try {
                    AsyncStorage.setItem("Storage", phone);
                    // console.log("store data ",JSON.stringify(user))
                } catch (error) {
                    // Error saving data
                   // console.log(error);
                }
                Actions.push('ConfirmCode', s)
            }// Output: 7
            
        }).catch(jjj => {
            //console.log('require error:- ',jjj)
        });
    }
    
    validPhoneNumber(inputtxt) {
        var phoneno = /^\d{10}$/;
        var phone = /^[0]?[+]\d{12}$/;
        if (typeof inputtxt == "undefined") {
           // console.log("undefined");
            return false;
        }
        if (inputtxt.match(phoneno) || inputtxt.match(phone)) {
           // console.log("return true");
            return true;
        } else {
           // console.log("return false");
            return false;
        }
    }
    async signup(email, password) {
        const emailPasswordClient = this.state.client.auth.getProviderClient(
        UserPasswordAuthProviderClient.factory);
        
        var s = emailPasswordClient.registerWithEmail(email, password).then(() => {
            return true;
        }).catch((err) => {
            return err;
        });
        return s;
    }
    async _loadClient() {
        var client;
        try {
            client = await Stitch.defaultAppClient;
        }catch(error) {
            client = await Stitch.initializeDefaultAppClient(appId);
        }

        //this.setState({ client });
        const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");

        const db = mongoClient.db("que");
        const users = db.collection("users");
        //this.updateUser(users, db)
        this.setState({ client: client, db: db });
        try {
            if (client.isLoggedIn) {
                const { navigate } = this.props.navigation;
                var s = this.state;
                s.error = false;
                Actions.push("ConfirmCode", s);
                
                return;
            }else {
                //console.log('not go to another page in ')
            }
        } catch (error) {
           // console.log(error);
        }
        this.state.client.auth.loginWithCredential(new AnonymousCredential())
        .then((user) => {
           // console.log(`Successfully logged in as user ${user.id}`);
            //this.setState({ currentUserId: user.id });
            //Actions.push('Home', user)
            //this.setState({currentUserId: client.auth.user.id, });
        }).catch((err) => {
           // console.log(`Failed to log in anonymously: ${err}`);
            this.setState({ currentUserId: undefined });
        });

    }
    async onSendcodebtnPressed() {
        //validate phone number
        var a = this.state;
        if (this.validPhoneNumber(this.state.phone)) {

            this.state.db.collection("users").findOne({ phone: this.state.phone }).then((result) => {
                //console.log('phone:- ', result)
                if (result == null){
                    this.requestCode(this.state.phone);
                }else {
                    this.requestCode(this.state.phone);
                }
            })
  
        } else {
            this.setState({
            ...this.state,
            ...{
                error: "Didnt Receive Code"
            },
            });
        }
    }
    render() {
        return(
            <View style={RSStyle.backgroundView}>
                <SafeAreaView style={{flex:1}}>
                    <StatusBar barStyle="light-content"/>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={RSStyle.backButton} onPress={() => Actions.pop()}>
                            
                            <Image source={RSIcon.IC_left} style={{height:30, width:40, tintColor:'white'}} resizeMode="contain"/>

                        </TouchableOpacity>
                        <View style={[RSStyle.logoMargin, {marginTop:'20%'}]}>
                            {/* <Image source={RSIcon.IC_logo} style={{height:64, width:64}} resizeMode="contain"/> */}
                            <SvgXml width="64" height="64" xml={RSIcon.IC_Logo_SVG} />
                        </View>
                        <View style={{marginTop:70}}>
                            <Text style={[RSStyle.textSlogn,{color:'white'}]}>Enter your phone number</Text>
                        </View>

                        <TextInput 
                            placeholder="179-046-0896"
                            placeholderTextColor="rgba(80, 55, 116, 1)"
                            style={[RSStyle.inputPhone, { textAlignVertical: 'center', paddingTop: 0, paddingBottom: 0,}]}
                            ref="phone_number"
                            onChangeText={(text) => {
                                var s = this.state;
                                s.phone = text;
                                this.setState(s);
                            }}
                            autoCorrect={false}
                        />
                        {this.state.error ? (
                            <Text style={RSStyle.errorText}>
                                {this.state.error}
                            </Text>
                            ) : null}
                    </View>
                    <LinearGradient
                        start={{
                            x: 0,
                            y: 0.7,
                        }}
                        end={{
                            x: 0.8,
                            y: 0.8,
                        }}
                        locations={[0, 1]}
                        colors={["rgb(151, 87, 222)", "rgb(228, 181, 203)"]}
                        style={[RSStyle.startButton]}
                    >
                        <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => this.onSendcodebtnPressed()}>
                            <Text style={{fontSize:20, color:'white', fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium',}}>Send Code</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </SafeAreaView>
            </View>
        )
    }
}