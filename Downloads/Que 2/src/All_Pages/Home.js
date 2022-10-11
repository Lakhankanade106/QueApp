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
    BackHandler,
    Alert,
    YellowBox,
    PanResponder } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import {authenticator} from "./authenticator";
import calicon from "../../assets/images/arrow.png";
import prompt from 'react-native-prompt-android';
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
import RSIcon from '../Style/RSIcon'
import {Actions} from 'react-native-router-flux'

import RSServer from '../Server/RSServer';
import RSColor from "../Style/RSColor";
import MyAccount from './MyAccount';
import stripe from 'tipsi-stripe'
stripe.setOptions({
    publishableKey: 'pk_test_z3G9ScaBTy411Bpkuw89LsPL',
    // merchantId: 'MERCHANT_ID', // Optional
    // androidPayMode: 'test', // Android only
})
//const STRIPE_SECRET_KEY = 'sk_test_YozA5Cbz8agfZBUs1dGnt3hv';
import Svg ,{Circle,
    Ellipse,
    G,

    Path,
 
    Defs,
    SvgXml,
    ClipPath,} from 'react-native-svg';
//rgb(53, 22, 88)
const appId = "que-eblub";
const height1 = Dimensions.get('window').height
const width1 = Dimensions.get('window').width
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
            user: [],
            appointments: {
                date: new Date(), //"dddd MMMM DD, Y"
            },
            listData:{},
            client:'',
            db:'',
            position, 
            toTop: false, 
            initialPosition:'',
            isDateChange:false,
            userid:'',
            isProp:false,
            isUpdateSideMenu:false,
            CashShow:false,
            Bl_Amount:0,
            Balance_detials:'',
            // new variable
            uniq_id:''
        };
    
        //this._loadClient = this._loadClient.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.checkKey = this.checkKey.bind(this);
        this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
        this.logout = this.logout.bind(this);
        this.animatedValue = new Animated.Value(0)
        BackHandler.addEventListener('hardwareBackPress', this.ExitApp.bind(this));
       // this.ExitApp = this.ExitApp.bind(this)
    }
    
    checkKey(key) {
        const credential = new FunctionCredential({
            key: key,
        });
        var state = this.state;
        Stitch.defaultAppClient.auth.loginWithCredential(credential).then((authedUser) => {
            state.user = authedUser.identities[0];

            this._storeData(state.user);
            this.setState(state, function () {});
            // console.log(
            //     `logged in with custom function auth as user ${authedUser.id}`
            // );
        }).catch((err) => {
            const { navigate } = this.props.navigation;
            navigate("GetStarted");
        });
    }

    async _storeData(user) {
    // console.log("user data 123",user)
        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    }
    updateUser = (user, db) => {
        console.log("update user error",this.state.userid),
        console.log("update user data".db)
        console.log("user data",user)
        
         db.collection("users").findOne({ phone: this.state.userid }).then((result) => {
             console.log("update users",result)
            this._storeData(result);
            this.setState({loading:false})
            if (result != null){
               // console.log('users data', result)
                this.setState({
                    ...this.state,
                    ...{ user: result },
                    });
                    var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
                   // console.log("user data token",this.state.appointments)
                var appts= {};
             
                appts = this.state.user.appointments[datetoken];
               // console.log("list data", this.state.user.appointments)
                Actions.refresh({key:'Home'})
                this.state.listData = appts
                this.setState({listData: this.state.user.appointments[datetoken]})
            
            }else {
                //console.log('user:-', result)
            }
            
        }).catch((error) => console.log('update eoor:------',error));
    }
    //  async _Uniq_id() {

    //      try {
    //          await AsyncStorage.setItem("uniq_id", this.props.uniq_id);
    //          // console.log("store data ",JSON.stringify(user))
    //      } catch (error) {
    //          // Error saving data
    //          console.log(error);
    //      }

    //  }
     showId(){
         try {
             AsyncStorage.getItem('uniq_id').then((token) => {
                 console.log('use_token1233:- ', token)
                 if (token == null) {
                     console.log('no have id')
                 } 
                 else{
                     console.log('uniq id is',token)
                     this.setState({uniq_id:token})
                     //Actions.push("GetStart",{uniq_id:token})
                 }

             }).catch((err) => {
                 console.log('error:- ', err)
             })
         } catch (er) {
             console.log("error:- ", er)

         }
     }
     componentWillUnmount(){
         BackHandler.removeEventListener('hardwareBackPress',this.ExitApp.bind(this))
     }
    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.ExitApp.bind(this));
      //  console.log('mount')
       // console.log('home page=====', this.props.navigation.state.params)
       try {
           AsyncStorage.getItem('isLoginUser').then((token) => {
               console.log('use_token1233333333:- ', token)
               if (token == null) {
                   console.log('no have id')
               } else {
                   console.log('uniq id is', token)
                  
                   //Actions.push("GetStart",{uniq_id:token})
               }

           }).catch((err) => {
               console.log('error123:------ ', err)
           })
       } catch (er) {
           console.log("error:---------- ", er)

       }
       
       
      //console.log('confirm code data',this.props.uniq_id)
    //   if(!this.props.uniq_id==''){
    //       console.log('uniq id chali')
    //       //this._Uniq_id()
    //   }
    //   else{
    //       console.log('uniq id nahi chali')
    //   }
      
     // this.setState({uniq_id:this.props.uniq_id})
     this.showId()
       //console.log("showId chal rahi he")
        AsyncStorage.getItem('userId').then((token) => {
             console.log('usertoken',token)
           // var value = JSON.parse(token)
            if ((token !== null) && (token != undefined)) {
                console.log('if condition is run ',token)
                this.setState({isLoading:false})
                this.setState({userid:token})
                //this.str_doc_acc_cre()
                this.reloadClient()
            }else {
                this.setState({isLoading:false})
                console.log('-:User Not Found:-')
            }
          }).catch((err)=> {
            console.log('error122222:- ', err)
          })
        try {
            AsyncStorage.getItem('acc_id').then((token) => {
                console.log('use_token:- ', token)
                if (token == null) {
                   
                } else if (token == undefined) {
                   
                } else {
                    this.getBalancAPI(token)
                }

            }).catch((err) => {
                console.log('error:- ', err)
            })
        } catch (er) {
            console.log("error:- ", er)

        }
        //this.reloadClient()
        //this._retrieveData(),
        // if(this.state.Bl_Amount == 0){
        //     console.log('user amount is 0')
        // }
        // else{
        //     this.setState({ CashShow: true })
        // }
       
    }
    getBalancAPI = (token) => {
        console.log('GET account')
        let str = "https://api.stripe.com/v1/accounts/"+token
        fetch(str, {
            method: "GET",
            headers: new Headers({
                'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
    
        })
            .then(res => res.text())
            .then((data) => {
                
               // console.log('recive data',data)
                //LET dta = JSON.parse(data)
                
            }).catch((er) => {
               // console.log('error:- ', er)
            })
       // let demo = "https://api.stripe.com/v1/balance/" + token
        let strr = "https://api.stripe.com/v1/balance"
        fetch(strr, {
            method: "GET",
            headers: new Headers({
                'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Stripe-Account': this.state.uniq_id
                

            }),

        })
            .then(res => res.json())
            .then((data) => {

                console.log('recive data', data)
               // alert('$'+data.available[0].amount  )
                this.setState({Balance_detials:data.available[0]})
                Bl_Amount = data.available[0].amount
                this.setState({Bl_Amount:data.available[0].amount})
                if (this.state.Bl_Amount == 0) {
                    console.log('user amount is 0')
                }
                else {
                    this.setState({ CashShow: true })
                }
                console.log('data_show',data_show)
                //this.state.Bl_Amount = data
                //LET dta = JSON.parse(data)

            }).catch((er) => {
                // console.log('error:- ', er)
            })
    }
    UNSAFE_componentWillReceiveProps(prp){
        //console.log('rescieve proprs:----------', prp)
       // console.log('user s data',this.state.db)
      
       console.log("bhai tu kab chalega")

        this.updateUser('user', this.state.db)
    }
    
   
    reloadClient = () =>{
        console.log("reloadClent function is run")
        this.setState({loading:true})
        var client;
        try {
            client = Stitch.defaultAppClient;
             //console.log("try chala lekin kyu chala pataa nahi",client)

        } catch (error) {

            client = Stitch.initializeDefaultAppClient(appId);
           // console.log("try kaa catch chala lekin ye bhi kyu chala pataa nahi",client)
        }

        const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
        console.log("dataaaaaa",this.props.uniq_id)

        const db = mongoClient.db("que");
        const users = db.collection("users");
        
        this.updateUser(users, db)
        console.log("db", db.proxy.service)
       // console.log("mongodb data base", client.coreClient.functionService.requestClient.storage.cachedStorage)
       // console.log('mongodb data base ', db.proxy.service.requestClient.storage.cachedStorage)
        this.setState({ client: client, db: db });
        
        try {
            if (client.isLoggedIn) {
                console.log('user login')
                return;
            }
        } catch (error) {
            //console.log('try catch error:- ',error);
        }
    }
        
    async _storeData(user) {

        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
           // console.log("store data ",JSON.stringify(user))
        } catch (error) {
            // Error saving data
            console.log(error);
        }
        
    }
     async componentDidMount() {
       // BackHandler.addEventListener('hardwareBackPress', this.ExitApp());

        // this.refreshData();
     
     }
    async refreshData() {
    
       // await this._loadClient();
        await this._retrieveData();
    }
     
    onMorebuttonPressed = () => {
        const { navigate } = this.props.navigation;
        navigate("AllAppointments",this.state);
    };

    async _retrieveData() {
        await this.updateUser();
        try {
            const value = await AsyncStorage.getItem("user");
       // console.log("retrivedata",value)
            if (value !== null) {
            // Our data is fetched successfully 
             // console.log("json data ",JSON.parse(value))
                this.setState({
                    ...this.state,
                    ...{ user: JSON.parse(value), loading: false },
                });
                var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
                var appts= {};
                appts = this.state.user.appointments[datetoken];
               // console.log("appts data",appts)

                this.state.listData = appts
                this.setState({listData: this.state.listData})
               // console.log('list data retrivedaa',this.state.listData)

            }
        } catch (error) {
            return false;
        }
    }
        
    logout() {
        console.log("ye kyu error de raha he bhaii",typeof(this.state.client))
        console.log("client data",this.state.client)
        this.state.client.auth.logout();
        AsyncStorage.clear();
        const { navigate } = this.props.navigation;
        Actions.push('GetStart',{type:'reset'});
       // Actions.GetStart({type:'reset'})

    }
    onActionPressed = () => {

    };
    
    onCashOutButtonPressed = () => {
       // alert('function call')
        prompt(
            'Amount',
            'Enter your Amount',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: amount => this.requestPayment(amount) },
            ],
            {
                
                cancelable: false,
                defaultValue: String(this.state.Bl_Amount),
                placeholder: 'placeholder'
            }
        );
        // Alert.prompt(
        //     // String(this.state.Bl_Amount),
        //    '$'+this.state.Bl_Amount,
        //     "Enter your Amount",
        //     [
        //         {
        //             text: "Cancel",
        //             onPress: () => console.log("Cancel Pressed"),
        //             style: "cancel"
        //         },
        //         {
        //             text: "OK",
        //             onPress: (amount) => this.payout_fun(amount)
        //         },
        //         placeholder='say somthing'
        //     ],
           
        // );
        // let str = "https://api.stripe.com/v1/payouts" 
        // fetch(str, {
        //     method: "POST",
        //     headers: new Headers({
        //         'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     }),
        //     body: JSON.stringify({
        //         amount: 0.00,
        //         currency: 'usd'})

        // })
        //     .then(res => res.json())
        //     .then((data) => {

        //          console.log('recive data',data)
        //         //LET dta = JSON.parse(data)

        //     }).catch((er) => {
        //          console.log('error:- ', er)
        //     })

    };
   
    // str_doc_acc_cre(){
    //     //console.log("individual_phone",this.state.userid)
    //     let params = {
            
    //         type: 'custom',
    //         country: 'US',
    //        // email: 'jenny.rosen@example.com',
    //         "capabilities[card_payments][requested]" : true,
    //         "capabilities[transfers][requested]" : true
    //     }
    //     let formBody = [];
    //     for (let property in params) {
    //         let encodedKey = encodeURIComponent(property);
    //         let encodedValue = encodeURIComponent(params[property]);
    //         formBody.push(encodedKey + "=" + encodedValue);
    //     }
    //     formBody = formBody.join("&");
    //     console.log('body data',formBody)

    //     let str = "https://api.stripe.com/v1/accounts"
    //     fetch(str, {
    //             method: "POST",
    //             headers: new Headers({
    //                 'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
    //                 'Content-Type': 'application/x-www-form-urlencoded'
    //             }),
    //             body: formBody,
    //         })
    //         .then(res => res.json())
    //         .then((data) => {
    //            // alert('Transaction Amount  $' + Amount_value + '\n' + data.error.message)
    //             console.log('recive data1', data)
    //             this.setState({uniq_id:data.id})
    //             //LET dta = JSON.parse(data)

    //         }).catch((er) => {
    //             console.log('error:- ', er)
    //         })
    // }
    
    onBalancemenuPressed = () => {

    };
    
    newAppointmentPressed = () => {
        //this.setState({isNewAppointShow: true})
        const { navigate } = this.props.navigation;
        navigate("AppointmentCreate",this.state);
        Actions.push("NewAppointment",{db:this.state.db});
    };
        
    onDateD8ba22a72f905d2Pressed = () => {

    };
        
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
        } else if (item == "MyAccount"){
            Actions.MyAccount({uniq_id:this.state.uniq_id})
            // const {navigate} = this.props.navigation;
            // navigate(item, this.state);
        }else if (item == "Setting"){
            Actions.Settings()
        }
    }
    toggleMenu() {
        this.showId()
        this.setState({
            isOpen: !this.state.isOpen,
            isUpdateSideMenu:true,
        });
     
    }
        
    updateMenuState(isOpen) {
        this.startAnimationOne()
        this.setState({ isOpen });
    }
    
    editAppointment( slot) {

        let ddict = this.state.listData[slot]
        if (ddict !== undefined){
            console.log('editing for ' + ddict.name);
        
            const { navigate } = this.props.navigation;
            console.log(navigate);
            var p = {
                ...this.state,
                ...{ appointment: ddict, slot:moment(ddict.date).format(
            "YYYYMMD") + "-"+slot },
            };
            Actions.push("EditAppoint", p);
        }

    }
    onDeleteClick = (item) => {
        var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
        const query = { status :"verified"};

        var newAppoint = {}
        newAppoint[item] = this.state.listData[item]
        var allAppoint = {}
        allAppoint[datetoken] = item
        let newAp = `appointments.${datetoken}.${item}`
        var up = { '$unset': { [newAp]: 1 }};
            
        console.log('delete:- ', up)
        this.state.db.collection('users').updateOne({ phone: this.state.userid },up ).then(result=>console.log('kk:--- ',result)); 
        this.setState({loading:true})
        this.updateUser("user",this.state.db)
    }
   
    requestPayment = (Amount_value) => {
        return stripe
            .paymentRequestWithCardForm()
            .then(stripeTokenInfo => {
               // console.warn('Token created', { stripeTokenInfo });
                this.payout_fun(stripeTokenInfo,Amount_value)
            })
            .catch(error => {
                console.warn('Payment failed', { error });
            });
            //stripe.paymentRequestWithNativePay
    };
    
    payout_fun(stripeTokenInfo, Amount_value){
        //MyAccount.Login.Stripe_card()
        //MyAccount.    
        console.log("my account page", stripeTokenInfo);
        console.log("Amount_vlue",Amount_value)
        console.log('cashout data', this.state.Balance_detials)
        if(Amount_value==''){
            console.log('if condition is run')
            Amount_value=this.state.Bl_Amount
        }
        console.log('amount value update',Amount_value)
        let params = {amount: Amount_value,
            currency: 'usd', method: 'instant',
            destination: stripeTokenInfo.card.cardId,
            }
        let formBody = [];
        for (let property in params) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        //console.log('body data',formBody)

        let str = "https://api.stripe.com/v1/payouts"
        fetch(str, {
            method: "POST",
            headers: new Headers({
                'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body:formBody,
        })
            .then(res => res.json())
            .then((data) => {
                alert('Transaction Amount  $'+Amount_value+'\n'+data.error.message)
               console.log('recive data', data.error.message)
                //LET dta = JSON.parse(data)

            }).catch((er) => {
                console.log('error:- ', er)
            })
    }
    ExitApp = () => {
        Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
            {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Yes', onPress: () => BackHandler.exitApp()},
            ],
            { cancelable: false });
            return true;
    }
  
    updateAnimation(prop, value) {

       return(
        Animated.spring(prop, {
            toValue: value,
            friction: 10,
           
        })
       )
        
      }
    
    render() {
       // YellowBox.ignoreWarnings(['UNSAFE_componentWillReceiveProps'])
        //YellowBox.ignoreWarnings(['UNSAFE_componentWillMount'])
          
        var datetoken = moment(this.state.appointments.date).format("YYYYMMDD");
       // console.log('user apointment:- ', this.state.user)
        var newData = []
        var cls = this;
       
        try {
     
            this.state.listData = this.state.user.appointments[datetoken]
            newData = this.state.user.appointments[datetoken]
           // console.log("appoint ment data",newData)
            //this.setState({listData:this.state.user.appointments[datetoken]})
    
        } catch(e) {
           // console.log('eoror:90----', e)
          
        }
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
                isHomeOpen={true}
                isMyAccountOpen={false}
                isNew_MyAccount={false}
                isSettingOpen={false}
                onPress={()=> this.toggleMenu()}/>
        );
        console.log("confirm cod in home page",this.state.uniq_id)
       // console.log("list data :====",this.state.listData)
     //alert(this.state.uniq_id)
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
                <View style={{width:width1}}>
                    <Text style={styles.balanceText}>
                            {this.state.user.length > 0 ? (this.state.user !== null ? "$" + this.state.user.balance.toFixed(2) : "$0.00") : '$'+this.state.Bl_Amount+'.00'}
                    </Text>
                    <Text style={{fontSize:17, alignSelf:'center',  color:'rgba(53,22,88, 0.5)',marginTop:0, fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}}>
                        Balance
                    </Text>
                   {this.state.CashShow? <LinearGradient
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
                        style={styles.cashOutView}
                    >
                        <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}}
                        onPress={()=>this.onCashOutButtonPressed()} >
                            <Text style={{fontSize:15, color:'white', fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}}>Cash Out</Text>
                        </TouchableOpacity>
                   </LinearGradient>:null }
                </View>
                <View style={styles.AgendaView}>
                    <View style={{flexDirection:'row', marginTop:20, marginLeft:30, width:width1}}>
                        <Text style={styles.agendaText}>Agenda</Text>
                        <TouchableOpacity style={styles.newappointmentButton} onPress={() =>  Actions.NewAppoint(this.state)}>
             
                            <SvgXml width="32" height="32" xml={RSIcon.IC_Plus_SVG} />

                        </TouchableOpacity>
                    </View>
                    <Animated.View style={RSStyle.draggable}>
                        <View style={styles.ListView} >
                            <TouchableOpacity style={{backgroundColor:'rgba(53,22,88, 0.1)', height:8, width:80, alignSelf:'center', marginTop:10, borderRadius:5}} onPress={() => Actions.push("AllAppoint")}>

                            </TouchableOpacity>

                                <DatePicker
                                    style={{ 
                                        width: "auto",
                                        
                                    }}
                                    date={
                                    this.state.appointments.date
                                        ? this.state.appointments.date
                                        : new Date()
                                    }
                                    iconSource={calicon}
                                    mode="date"
                                    placeholder={moment(this.state.appointments.date).format("dddd MMMM DD, Y")}
                                    format="dddd MMMM DD, Y"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            width: 25,
                                            height: 30,
                                            marginTop:10,
                                            left:10,
                                            marginRight:50,
                                           
                                            tintColor:'rgb(151, 87, 222)',
                                            resizeMode:'contain',
                                            alignSelf:'flex-start'

                                        },
                                        dateInput: {
                                            display: "flex",
                                            
                                            height:50,
                                            borderWidth:0,
                                            marginTop:20,
                                            marginLeft:20,
                                            marginRight:50,
                                            alignItems:'center'
                                            //backgroundColor:'red'
                                        },
                                        dateText:{
                                            color:'rgb(151, 87, 222)',
                                            fontSize:15,
                                            alignSelf:'flex-start',
                                            paddingLeft:10,
                                            fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium'
                                        },
                                        placeholderText:{
                                            color:'rgb(151, 87, 222)',
                                            fontSize:15,
                                            alignSelf:'flex-start',
                                            paddingLeft:10,
                                            fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium'
                                        }
                                    }}
                                    onDateChange={(dd) => {

                                        this.setState({
                                            ...this.state,
                                            ...{ appointments: { date: dd } },
                                            ...{isDateChange:true},
                                        });
                                    }}
                                    
                                />

                            {/* </TouchableOpacity> */}
                            {/* <View style={{ flex:1}}> */}
                            {this.state.loading ? 
                                <View style={{marginTop:'10%'}}>
                                    <ActivityIndicator size="large" color={RSColor.BackColor} />
                                </View>
                           
                                : (typeof newData !== "undefined" &&
                                Object.keys(newData).length > 0 ? 
                                // <View style={{flex:1, marginTop:10}}>

                                    <FlatList
                                        data={Object.keys(newData)}
                                        extraData={this.state}
                                        
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        style={{flex:1}}
                                        contentContainerStyle={{  marginTop:10, flexGrow:1, paddingBottom:20}}
                                        renderItem={({item}) => 
                                        <Swipeout 
                                            
                                        right={[
                                            {
                                            
                                                backgroundColor:'rgb(238, 241, 248)',
                                                onPress: function(){ 
                                                    cls.editAppointment(  item )    
                                                },
                                                component:<View style={{justifyContent:'center', alignItems:'center', flex:1,}}><SvgXml width="20" height="20"  xml={RSIcon.Ic_edit_SVG} /></View>

                                            },
                                            {
                                            
                                                backgroundColor:'red',
                                                onPress: function(){ cls.onDeleteClick(item) },
                                                component:<View style={{justifyContent:'center', alignItems:'center', flex:1}}><SvgXml width="20" height="24"  xml={RSIcon.IC_Delete_SVG} /></View>
                                            },
                                            
                                        ]} style={{backgroundColor:'transparent',  width:width1 }}>
                                        <TouchableOpacity style={{height:70, width:width1, }}  >
                                            <View style={RSStyle.appointmentView}>
                                                <View pointerEvents="box-none" style={ RSStyle.appointmentViewInner }>
                                                
                                                    <Text style={{color:'gray', fontSize:15, fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}}>
                                                    {moment(
                                                        newData[item]["date"]
                                                    ).format("h:mm A")}
                                                    </Text>

                                                </View>
                                                <View style={{justifyContent:'center', marginLeft:20, flex:1}}>
                                                    <View style={{flex:1, justifyContent:'center'}}>
                                                        <Text style={{fontSize:18, fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}}>
                                                            {newData[item].name}
                                                        </Text>
                                                    </View>
                                                    
                                                    <Text style={[RSStyle.descriptionText, {flex:1, color:'#787878', fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}]}>
                                                        {newData[item]["service"]}
                                                    </Text>
                                                </View>
                                                {/* <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                                                    <Text>$30</Text>
                                                </View> */}
                                                
                                            </View>
                                            <View style={{backgroundColor:'#E8E8E8', height:1, marginLeft:30}}/>
                                        </TouchableOpacity>
                                        </Swipeout>
                                        }
                                        keyExtractor={item => item.name}
                                    />  
                            
                            : (
                                <Text style={[RSStyle.noAppointText, {color:'gray', fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}]}>
                                No Appointments
                                </Text>
                                )
                            )}
                        {/* </View> */}
                        
                        </View>
                    </Animated.View>
                </View>
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
        fontSize:42,
        alignSelf:'center',
        color:'rgb(53,22,88)',
        
        marginTop:25,
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium'
    },
    cashOutView:{
        height:36,
        width:126,
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
        fontSize:24,
  
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium'
    },
    newappointmentButton:{
        height:35,
        width:35,
        borderRadius:20,
        //borderColor:'rgb(225,180,204)',
        //borderWidth:2,
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