import React from "react"
import { Image, 
    Animated,
    Dimensions,
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    SafeAreaView,
    StatusBar,
    Easing,
    FlatList,
    ActivityIndicator,
    PanResponder,
    } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import {authenticator} from "./authenticator";
import calicon from "../../assets/images/arrow.png";
//import stripe from 'tipsi-stripe';

import {
    Stitch,
    RemoteMongoClient,
    UserPasswordCredential,
    AnonymousCredential,
    FunctionAuthProvider,
    FunctionCredential,
    RemoteDeleteResult
} from "mongodb-stitch-react-native-sdk"; 
import moment from "moment";
import "moment-timezone";
import DatePicker from "react-native-datepicker";
import { AsyncStorage } from "react-native";
import SideMenu from "react-native-side-menu";
import Swipeout from 'react-native-swipeout';
import Menu from "./SideMenu/Menu";
import RSStyle from '../Style/Style';
import RSIcon from '../Style/RSIcon';

import {Actions} from 'react-native-router-flux'
import { WebView } from 'react-native-webview';
import RSServer from '../Server/RSServer';
import RSColor from "../Style/RSColor";
import Svg ,{Circle,
    Ellipse,
    G,
    Path,
    Defs,
    ClipPath,} from 'react-native-svg';
//rgb(53, 22, 88)
const appId = "que-eblub";
const height1 = Dimensions.get('window').height
const width1 = Dimensions.get('window').width
import stripe from 'tipsi-stripe'
stripe.setOptions({
    publishableKey: 'pk_test_z3G9ScaBTy411Bpkuw89LsPL',
    // merchantId: 'MERCHANT_ID', // Optional
    // androidPayMode: 'test', // Android only
})
//const STRIPE_SECRET_KEY = 'sk_test_YozA5Cbz8agfZBUs1dGnt3hv';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        const position = new Animated.ValueXY();

        this.offset = 0;
     
        this.toggleMenu = this.toggleMenu.bind(this);
        this.state = {
            isNewAppointShow:false,
            isOpen: false,
            loading: false,
            selectedItem: "About",
            menuImageTranslateX: new Animated.Value(-1),
            menuImageOpacity: new Animated.Value(-1),
            logomarkImageTranslateX: new Animated.Value(-1),
            logomarkImageOpacity: new Animated.Value(-1),
            user: {},
            appointments: {
                date: new Date(), //"dddd MMMM DD, Y"
            },
            linkUrl:'',
            account_id:'',
           
        };

        this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
        this.logout = this.logout.bind(this);
        this.animatedValue = new Animated.Value(0)
    }
    
    UNSAFE_componentWillMount() {

       console.log('monogo:-----------')
        
      
        AsyncStorage.getItem('userId').then((token) => {
             console.log('usertoken',token)
            
            if ((token !== null) && (token != undefined)) {
                this.setState({isLoading:false})
                this.setState({userid:token})
                
            }else {
                this.setState({isLoading:false})
                console.log('-:User Not Found:-')
            }
        }).catch((err)=> {
            console.log('error:- ', err)
        })
        //this.createAccoutAPI()
        try {
            AsyncStorage.getItem('acc_id').then((token) => {
                console.log('use_token:- ', token)
                if (token == null){
                    this.createAccoutAPI()
                }else if( token == undefined) {
                    this.createAccoutAPI()
                }else {
                    this.updateAccount(token)
                   // this.createAccoutAPI()
                }
               
            }).catch((err) => {
                console.log('error:- ', err)
            })
        } catch (er) {
            console.log("error:- ", er)
           
        }
        // AsyncStorage.getItem('acc_id').then((token) => {
        //     //console.log('usertoken:- ', token)

        //     if ((token != null) && (token != undefined)) {
        //          this.updateAccount(token)
        //     } else {
        //         this.setState({ isLoading: false })
        //         this.createAccoutAPI()
        //         console.log('-:User Not Found:-')
        //     }
        // }).catch((err) => {
        //     console.log('error:- ', err)
        // })
      
    }
    createAccoutAPI = () => {
        console.log("------------------------------------")
        console.log('create account')
        fetch("https://api.stripe.com/v1/accounts", {
            method: "POST",
            headers: new Headers({
                'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "type=standard"

        })
            .then(res => res.text())
            .then((data) => {

                console.log(data)
                let dta = JSON.parse(data)
                this.state.linkUrl = dta["url"]
                
                if (dta["id"] == null){

                }else {
                    AsyncStorage.setItem('acc_id', dta["id"]);
                }
               
                this.acountLinkAPI(dta["id"]);

                this.setState({ linkUrl: dta["url"] })

            }).catch((er) => {
                console.log('error:- ', er)
            })
    }
    acountLinkAPI = (id) => {
    
        console.log('account link')
        let refresh_url = 'https://webhooks.mongodb-realm.com/api/client/v2.0/app/que-eblub/service/StripePayment/incoming_webhook/refresh';
        let return_url = 'https://webhooks.mongodb-realm.com/api/client/v2.0/app/que-eblub/service/StripePayment/incoming_webhook/return';
        const data = "account=" + id + "&refresh_url=" + refresh_url + "&return_url=" + return_url + "&type=account_onboarding" + "&collect=eventually_due"
        console.log(data)
        fetch("https://api.stripe.com/v1/account_links", {
            method: "POST",
            headers: new Headers({
                'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: data,

        })
            .then(res => res.text())
            .then((data) => {

                console.log("account data ",data)
                let dta = JSON.parse(data)
                // this.state.linkUrl = dta["url"]

                // if (dta["url"] != null){

                // }
                // this.setState({ linkUrl: dta["url"] })

            }).catch((er) => {
                console.log("account data ", data)
                console.log('error:- ', er)
            })
    }
    updateAccount = (id) => {
        console.log('update account')
        let refresh_url = 'https://webhooks.mongodb-realm.com/api/client/v2.0/app/que-eblub/service/StripePayment/incoming_webhook/refresh';
        let return_url = 'https://webhooks.mongodb-realm.com/api/client/v2.0/app/que-eblub/service/StripePayment/incoming_webhook/return';
        const data = "account=" + id + "&refresh_url=" + refresh_url + "&return_url=" + return_url + "&type=onboarding"
        console.log(data)
        fetch("https://api.stripe.com/v1/account_links", {
            method: "POST",
            headers: new Headers({
                'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: data,

        })
            .then(res => res.text())
            .then((data) => {

                //console.log('dta:- ',data['error'])
                 let dta = JSON.parse(data)
                console.log('dta:- ', dta)
                this.state.linkUrl = dta["url"]
                this.setState({ linkUrl: dta["url"] })

            }).catch((er) => {
                console.log('error:- ', er)
            })
    }
    reloadClient = () => {
        console.log('load client')
        this.setState({ loading: true })
        var client;
        try {
            client = Stitch.defaultAppClient;

        } catch (error) {

            client = Stitch.initializeDefaultAppClient(appId);
        }

        const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");

        const db = mongoClient.db("que");
        const users = db.collection("users");
        //this.updateUser(users, db)
        Stitch.defaultAppClient.callFunction("createStripeAccount").then((res) => {
            console.log('response mongodb get:- ', res)
        }).catch((er) => {
            console.log('eror:-= ', er)
        })
        this.setState({ client: client, db: db });

        try {
            if (client.isLoggedIn) {
                console.log('user login')
                return;
            }
        } catch (error) {
            console.log('try catch error:- ', error);
        }
    }

    async _storeData(user) {

        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    }
    
        
    logout() {
        this.state.client.auth.logout();
        AsyncStorage.clear();
        const { navigate } = this.props.navigation;
        Actions.GetStart({type:'reset'})
    }

    startAnimationOne() {
        // Set animation initial values to all animated properties
        this.state.logomarkImageTranslateX.setValue(0);
        this.state.logomarkImageOpacity.setValue(0);
        this.state.menuImageTranslateX.setValue(0);
        this.state.menuImageOpacity.setValue(0);
        console.log('side animateion')
        // Configure animation and trigger
        Animated.parallel([
            Animated.parallel([
            Animated.timing(this.state.logomarkImageTranslateX, {
                duration: 1000,
                easing: Easing.bezier(0.42, 0, 0.58, 1),
                toValue: 1,
            }),
            Animated.timing(this.state.logomarkImageOpacity, {
                duration: 1000,
                easing: Easing.bezier(0.42, 0, 0.58, 1),
                toValue: 1,
            }),
            ]),
            Animated.parallel([
            Animated.timing(this.state.menuImageTranslateX, {
                duration: 1000,
                easing: Easing.bezier(0.42, 0, 0.58, 1),
                toValue: 1,
            }),
            Animated.timing(this.state.menuImageOpacity, {
                duration: 1000,
                easing: Easing.bezier(0.42, 0, 0.58, 1),
                toValue: 1,
            }),
            ]),
        ]).start();
    }
    onMenuItemSelected(item) {
        this.setState({
            isOpen: false,
            selectedItem: item,
        });
        
        if (item == "Logout") {
            this.logout();
        } else if (item == "Home"){
            Actions.push('Home')
            // const {navigate} = this.props.navigation;
            // navigate(item, this.state);
        }else if (item == "Setting"){
            Actions.push('Settings')
        }
    }
    toggleMenu() {
        this.setState({
            isOpen: !this.state.isOpen,
            isUpdateSideMenu:true,
        });
    }
        
    updateMenuState(isOpen) {
        this.startAnimationOne()
        this.setState({ isOpen });
    }

    updateAnimation(prop, value) {
       return(
            Animated.spring(prop, {
                toValue: value,
                friction: 10,
            })
        )
    }

    stripeAccount = () => {
        console.log('-----------------------')
        
        const params = {
            // mandatory
            number: '4242424242424242',
            expMonth: 11,
            expYear: 21,
            cvc: '223',
            // optional
            name: 'Test User',
            currency: 'usd',
            addressLine1: '123 Test Street',
            addressLine2: 'Apt. 5',
            addressCity: 'Test City',
            addressState: 'Test State',
            addressCountry: 'Test Country',
            addressZip: '55555',                    
        }
        const token = stripe.createTokenWithCard(params).then((dd) => {
            console.log(dd)
        })
    }
    Stripe_card (){
        const options = {
            smsAutofillDisabled: true,
            requiredBillingAddressFields: 'zip', // or 'full'
            theme
        };
        return(
            stripe.paymentRequestWithCardForm(options)
                .then(response => {
                    console.log("response",response)
                    // Get the token from the response, and send to your server
                })
                .catch(error => {
                    console.log("payment request error",error)
                    // Handle error
                })
        )
    }
    onWebViewStateChange(navState) {
        console.log('----------on web view state change', navState)
        try {
            if (navState == undefined){
                console.log('--------')
            }else if (navState.url.includes('?code=')) {
                console.log('app state:- ', navState)
                this.props.setCode(navState.url.split('?code=')[1]);
                this.props.onToggleVisibleRegisterModal(false);
                this.onSuccess();
            }else {
                console.log('bhai y wala cl rha h ', navState['title'])
                if (navState['canGoBack']){
                    Actions.push('Home')
                }else {
                    console.log('abhi nhi cla bhai if else hi cl rha h')
                }
            }
        } catch (error) {
        
            console.log('error:- ',error)
        }
    }
    async onSuccess() {
        try {
            this.props.setIsLoading(true);

            const { data: { stripeAccountId } } = await api.createAccount(props.code());
            console.log('xzczxcxz:- ',stripeAccountId)
            //await this.props.editProfile({ stripeAccountId });

            //this.props.setIsLoading(false);
            //this.props.getData();
        } catch (err) {
            //.props.setIsLoading(false);
            alertError(err);
        }
    }
    // async onSuccess() {
    //     try {
    //         this.props.setIsLoading(true);

    //         const { data: { stripeAccountId } } = await api.createAccount(props.code());
    //         await this.props.editProfile({ stripeAccountId });

    //         this.props.setIsLoading(false);
    //         this.props.getData();
    //     } catch (err) {
    //         this.props.setIsLoading(false);
    //         alertError(err);
    //     }
    // }
    onsms = (DATA) => {
        console.log(DATA)
    }
    render() {
    
        //const STRIPE_URL = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://stripe.com/connect/default/oauth/test&client_id=ca_HmC7ykr9O5ThkfGyX8HQcUxx2SbqAWhc';
        console.log(this.state.linkUrl)
        const animationStyle = value => {
            
            return {
                transform: [{
                    scale: value.interpolate({
                    inputRange: [-150, 0],
                    outputRange: [0.85, 1]
                    }),

                },{translateX:value}],
                
                right: value,
                borderRadius:this.state.isOpen ?40:0,

              
           };
         };
     
        const menu = (
            <Menu onItemSelected={this.onMenuItemSelected} 
                isHomeOpen={false}
                isMyAccountOpen={true}
                isNew_MyAccount={false}
                isSettingOpen={false}
                onPress={()=> this.toggleMenu()}/>
        );

        return (
            <View style={{flex:1, backgroundColor:RSColor.BackColor}}>
                <SideMenu

                    menu={menu}
                    animationFunction={(prop, value) => this.updateAnimation(prop, value)}
                    autoClosing={true}
                    menuPosition={"right"}
                    bounceBackOnOverdraw={false}
                    isOpen={this.state.isOpen}
                    onChange={(isOpen) => this.updateMenuState(isOpen)}
                    animationStyle={animationStyle}>
                
                    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
                        <StatusBar barStyle="dark-content"/>
                        <View style={{flex:1, marginTop:15}}>
                            <View style={styles.container}>
                                
                                <View style={{flex:1, marginLeft:20,  height:40}}>
                                    {/* <Image source={require('../../assets/images/logo.png')} style={{height:40, width:40, tintColor:'rgb(53,22,88)'}}/> */}
                                    <Svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 26.27 26.217">
                                        <Path id="Path_7" data-name="Path 7" d="M11.314,3.318c3.592-.018,7.184,0,10.776-.013.483,0,.967,0,1.45.007a16.135,16.135,0,0,1,2.865.131A5.608,5.608,0,0,1,30.7,8.782q-.009,7.138,0,14.276a9.058,9.058,0,0,1-.135,2.18,5.656,5.656,0,0,1-5.254,4.284q-7.865-.008-15.729,0A5.673,5.673,0,0,1,5.9,27.755a5.915,5.915,0,0,1-1.172-1.934,7.136,7.136,0,0,1-.3-2.64q.009-6.443,0-12.886a20.673,20.673,0,0,1,.083-2.617A5.571,5.571,0,0,1,6.831,4.262,5.283,5.283,0,0,1,9.65,3.327c.555-.006,1.109,0,1.664-.008M14.97,8.86a5.8,5.8,0,0,0-4.995,5.057q0,2.483,0,4.967a5.773,5.773,0,0,0,3.938,4.841,9.6,9.6,0,0,0,2.745.3,4.853,4.853,0,0,0,1.386-.105,1.92,1.92,0,0,0,.559-3.492A5.16,5.16,0,0,0,15.9,20.1a2.208,2.208,0,0,1-1.059-.167,2.04,2.04,0,0,1-1.025-1.613q.009-1.9.005-3.8a1.9,1.9,0,0,1,1.832-1.834q1.893,0,3.785,0a1.819,1.819,0,0,1,1.8,1.849,7.888,7.888,0,0,0,.175,2.617A1.819,1.819,0,0,0,22.9,18.3a1.929,1.929,0,0,0,2.134-1.22A9.867,9.867,0,0,0,25,13.205a5.73,5.73,0,0,0-5.315-4.356c-1.572.018-3.145,0-4.718.011m7.716,11.33a2.079,2.079,0,0,0-1.436,1.734,1.765,1.765,0,0,0,.245,1.033,1.884,1.884,0,0,0,1.175.958,1.94,1.94,0,0,0,2.393-2.461A1.968,1.968,0,0,0,22.686,20.189Z" transform="translate(-4.43 -3.305)" fill="rgb(53,22,88)"/>
                                    
                                    </Svg>
                                </View>
                                <View style={{flex:1, alignItems:'flex-end', marginRight:20,  height:40}}>
                                    <TouchableOpacity onPress={() => this.toggleMenu()} >
                                        
                                        <Image source={require('../../assets/images/menu.png')} style={{height:20, width:30, tintColor:'rgb(53,22,88)'}} resizeMode="contain" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <WebView
                                source={{ uri: this.state.linkUrl }}
                                startInLoadingState
                                scalesPageToFit
                                javaScriptEnabled
                                bounces={false}
                                onNavigationStateChange={(navState) => this.onWebViewStateChange(navState)}
                                javaScriptEnabledAndroid
                                onFileDownload={this.onsms()}
                                
                            />
                        </View>
                    </SafeAreaView>
                </SideMenu>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        marginTop:20,
       
        height:40,
        width:width1,
        //marginTop:20,
      
    },
    balanceText:{
        fontSize:55,
        alignSelf:'center',
        color:'rgb(53,22,88)',
        fontWeight:'bold',
        marginTop:25,
        fontFamily:'Poppins'
    },
    cashOutView:{
        height:40,
        width:130,
        borderRadius:10,
        alignSelf:'center',
        marginTop:15,
    },
    AgendaView:{
        backgroundColor:'rgb(53,22,88)',
        flex:1,
        marginTop:20,
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        width:width1,
    },
    ListView:{
        flex:1,
        marginTop:20,
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        width:width1,
        backgroundColor:'white',
    },
    agendaText:{
        color:'white',
        fontSize:30,
        fontWeight:'bold',
        fontFamily:'Poppins'
    },
    newappointmentButton:{
        height:35,
        width:35,
        borderRadius:20,
        borderColor:'rgb(225,180,204)',
        borderWidth:2,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-end',
        right:60,
        position:'absolute'
    },
    newappointmentButtonImage:{
        height:18,
        width:18,
        tintColor:'rgb(225,180,204)'
    }
})