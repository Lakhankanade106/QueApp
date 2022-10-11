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
    Alert,
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
import MyAccount from '../All_Pages/MyAccount';

import {Actions} from 'react-native-router-flux'
//import { WebView } from 'react-native-webview';
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
import { ScrollView } from "react-native-gesture-handler";
//import console = require("console");
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
            //==============
            contry_data: '',
            contry_sel:"select",
            Busines_data:'',
            Busines_sel:'Business Type',
            indivi_page:false,
            company_page:false,
            non_profit_page:false,
            Gov_ent_page:false,
            userid:'',
            recive_data:'',
            indivi_show_:false,

    //======== individual data variable ================
            individual: {
                company:{
                    first_name:'',
                    last_name:'',
                    D_O_B:{day:'',month:'',year:''},
                    phone: '',
                    ssn_last_4: '',
                    email:'',
                    address: { line1: '', line2: '', postal_code: '', city: '', state: '', country:'United States (US)'},
                }
            },

    //====== company data variables ===============
            company_data:{
                company:{
                     name:'',
                    address: { line1: '', line2: '', postal_code: '', city: '', state: '', country:'United States (US)'},
                     phone:'',
                     tax_id:'',
                     owners:{first_name:'',last_name:'',email:''},
                     representative:{
                     first_name:'',
                     last_name:'',
                     ssn_last_4:'',
                     relationship:{title:''},
                     email:'',
                     phone:'',
                         address: { line1: '', line2: '', postal_code: '', city: '', state: '', country:'United States (US)'},
                     dob:{day:'',month:'',year:''}, 
                    }
                }
            },

    //================== Non profits variable ===================        
            non_profit:{
                company:{
                     name:'',
                    address: { line1: '', line2: '', postal_code: '', city: '', state: '', country:'United States (US)'},
                     phone:'',
                     tax_id:'',
                     representative:{
                     first_name:'',
                     last_name:'',
                     dob:{day:'',month:'',year:''},
                         address: { line1: '', line2: '', postal_code: '', city: '', state: '', country:'United States (US)'},
                     ssn_last_4:'',
                     relationship:{title:''},
                     email:'',
                     phone:''
                   }
                }
            },
    
    //================== Non profits variable =================== 
            Government_entities:{
                company:{
                name:'',
                    address: { line1: '', line2: '', postal_code: '', city: '', state: '', country:'United States (US)'},
                phone:'',
                tax_id:'',
                representative:{
                    first_name:'',
                    last_name:'',
                    dob:{day:'',month:'',year:''},
                    address: { line1: '', line2: '', postal_code: '', city: '', state: '', country:'United States (US)'},
                    ssn_last_4:'',
                    relationship:{title:''},
                    email:'',
                    phone:''
                }
            }
            }
           
        };

        this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
        this.logout = this.logout.bind(this);
        this.animatedValue = new Animated.Value(0)
        //============
       
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

//=========================  New code ============================
// let str = "https://api.stripe.com/v1/accounts/" + this.props.uniq_id
// fetch(str, {
//         method: "GET",
//         headers: new Headers({
//             'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }),

//     })
//     .then(res => res.json())
//     .then((data) => {

//          console.log('recive data2121', data.business_type)
//          switch (data.business_type) {

//              case 'individual':{

//                  console.log('individual function is call')
//                  this.setState({indivi_page:true})
//                  break;
//              }

//              case 'company':
//                  this.setState({company_page:true})
//                  break;

//              case 'non_profit':
//                  this.setState({non_profit_page:true})
//                  break;

//              case 'government_entity':
//                  this.setState({Gov_ent_page:true})
//                  break;
//          }

//         //LET dta = JSON.parse(data)

//     }).catch((er) => {
//          console.log('error:- ', er)
//     })
      
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
                //this.New_Account_update()

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
    // contry data=========
    // Contry_Data(){
    //     console.log("function call")
    //     const data = [{
    //             //id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    //             title: 'United States (US)',
    //         }
    //     ];
    //     this.setState({contry_data:data})
    // }

    // Contry_Select_item(item){
    //     this.setState({contry_sel:item.title})
    //     this.setState({contry_data:''})

    // }
    //========= business type ===
    Business_type() {
        console.log("function call")
        Actions.push('MyAccount.js')
            console.log("else condition is run")
            const data = [{
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                title: 'Individuals and sole proprietorships',
            },
            {
                id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
                title: 'Companies, LLCs, and partnerships',
            },
            {
                id: '58694a0f-3da1-471f-bd96-145571e29d72',
                title: 'Non-profits',
            },
            {
                id: '58694a0f-3da1-471f-bd96-145571e29d75',
                title: 'Government entities'
            }
            ];
            this.setState({
                Busines_data: data
            })
        
       
    }
    Busines_sel_item(item){
         this.setState({Busines_sel:item.title})
        this.setState({Busines_data:''})
        Actions.push('MyAccount')
         switch (item.id) {

             case this.state.Busines_data[0].id:
                 this.setState({company_page:false})
                 this.setState({non_profit_page:false})
                 this.setState({Gov_ent_page:false})
                 this.setState({indivi_page:true})
                 console.log('switch cash run',item.id)
                 break;

             case this.state.Busines_data[1].id:
                 this.setState({indivi_page:false})
                 this.setState({non_profit_page:false})
                 this.setState({Gov_ent_page:false})
                 this.setState({company_page:true})
                 //this.TWO();
                 break;

             case this.state.Busines_data[2].id:
                 this.setState({company_page:false})
                 this.setState({indivi_page:false})
                 this.setState({Gov_ent_page:false})
                 this.setState({non_profit_page:true})
                 //this.THREE();
                 break;

             case this.state.Busines_data[3].id:
                 this.setState({company_page:false})
                 this.setState({indivi_page:false})
                 this.setState({non_profit_page:false})
                 this.setState({Gov_ent_page:true})
                // this.FOUR();
                 break;

             default:
                 //Alert.alert("NUMBER NOT FOUND");

         }

         
    }
    // New_Account_update(){
    //     let str = "https://api.stripe.com/v1/accounts/" + this.props.uniq_id
    //     fetch(str, {
    //             method: "GET",
    //             headers: new Headers({
    //                 'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
    //                 'Content-Type': 'application/x-www-form-urlencoded'
    //             }),

    //         })
    //         .then(res => res.json())
    //         .then((data) => {

    //             console.log('recive data2121', data.individual.first_name)
    //             this.setState({recive_data:data})
    //             switch (data.business_type) {

    //                 case 'individual': {

    //                     console.log('individual function is call')
    //                     this.setState({indivi_show_:true})
    //                     break;
    //                 }

    //                 case 'company':
    //                     this.setState({
    //                         company_page: true
    //                     })
    //                     break;

    //                 case 'non_profit':
    //                     this.setState({
    //                         non_profit_page: true
    //                     })
    //                     break;

    //                 case 'government_entity':
    //                     this.setState({
    //                         Gov_ent_page: true
    //                     })
    //                     break;
    //             }

    //             //LET dta = JSON.parse(data)

    //         }).catch((er) => {
    //             console.log('error:- ', er)
    //         })
    // }
    update_Account(count,params){
       // console.log("data recive",this.props.text)
       console.log("data recive2", this.props.uniq_id)
       console.log("Business type",params)
        switch (count) {

            case 1:
                {
                    //  let params = {
                    //     // type: 'custom',
                    //      business_type: 'individual',
                    //      //individual: this.state.individual,
                    //      "metadata[order_id]" : this.state.individual,
                    //      "individual[first_name]": this.state.individual.company.first_name,
                    //      "individual[last_name]":this.state.individual.company.last_name
                    //      //"company":this.state.individual
                    //  }
                     let formBody = [];
                     for (let property in params) {
                         let encodedKey = encodeURIComponent(property);
                         let encodedValue = encodeURIComponent(params[property]);
                         formBody.push(encodedKey + "=" + encodedValue);
                     }
                     formBody = formBody.join("&");
                    fetch("https://api.stripe.com/v1/accounts/" + this.props.uniq_id, {
                            method: "POST",
                            headers: new Headers({
                                'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }),
                            body: formBody

                        })
                        .then(res => res.json())
                        .then((data) => {
                            if(data.error){
                                alert(data.error.message)
                               // console.log("responce data cath", data)
                            }
                            else{
                                console.log("responce data", data)
                                Actions.push('Home')
                               // console.log("responce data", data)
                            }
                            // try {
                            //     //code blocks
                            //     console.log("responce data", data)
                            // }
                            // catch {
                            //         console.log("responce data cath", data.error.code)
                            // }
                            

                        }).catch((er) => {
                            console.log('error:- ', er)
                        })
                    break;
                }
            case 2:
                {
                  let params = {
                      // type: 'custom',
                      business_type: 'company',
                      //individual: this.state.individual,
                      "metadata[order_id]": this.state.company_data,
                      //"company":this.state.individual
                  }
                  let formBody = [];
                  for (let property in params) {
                      let encodedKey = encodeURIComponent(property);
                      let encodedValue = encodeURIComponent(params[property]);
                      formBody.push(encodedKey + "=" + encodedValue);
                  }
                  formBody = formBody.join("&");
                  fetch("https://api.stripe.com/v1/accounts/" + this.props.uniq_id, {
                          method: "POST",
                          headers: new Headers({
                              'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                              'Content-Type': 'application/x-www-form-urlencoded'
                          }),
                          body: formBody

                      })
                      .then(res => res.json())
                      .then((data) => {
                          console.log("responce data", data)

                      }).catch((er) => {
                          console.log('error:- ', er)
                      })
                  break;
                }
            case 3:
                {
                    {
                        let params = {
                            // type: 'custom',
                            business_type: 'non_profit',
                            //individual: this.state.individual,
                            "metadata[order_id]": this.state.non_profit,
                            //"company":this.state.individual
                        }
                        let formBody = [];
                        for (let property in params) {
                            let encodedKey = encodeURIComponent(property);
                            let encodedValue = encodeURIComponent(params[property]);
                            formBody.push(encodedKey + "=" + encodedValue);
                        }
                        formBody = formBody.join("&");
                        fetch("https://api.stripe.com/v1/accounts/" + this.props.uniq_id, {
                                method: "POST",
                                headers: new Headers({
                                    'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }),
                                body: formBody

                            })
                            .then(res => res.json())
                            .then((data) => {
                                console.log("responce data", data)

                            }).catch((er) => {
                                console.log('error:- ', er)
                            })
                        break;
                    }
                }
            case 4:
                {
                    {
                        let params = {
                            // type: 'custom',
                            business_type: 'government_entity',
                            //individual: this.state.individual,
                            "metadata[order_id]": this.state.Government_entities,
                            //"company":this.state.individual
                        }
                        let formBody = [];
                        for (let property in params) {
                            let encodedKey = encodeURIComponent(property);
                            let encodedValue = encodeURIComponent(params[property]);
                            formBody.push(encodedKey + "=" + encodedValue);
                        }
                        formBody = formBody.join("&");
                        fetch("https://api.stripe.com/v1/accounts/" + this.props.uniq_id, {
                                method: "POST",
                                headers: new Headers({
                                    'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }),
                                body: formBody

                            })
                            .then(res => res.json())
                            .then((data) => {
                                console.log("responce data", data)

                            }).catch((er) => {
                                console.log('error:- ', er)
                            })
                        break;
                    }
                }
        }
    }
    submit_func(param){
        
        
        switch (param) {

            case 1:
                {
                    console.log("you select individuals")
                    const first_name = this.state.individual.company.first_name
                    const last_name = this.state.individual.company.last_name
                    const ssn_last_4 = this.state.individual.company.ssn_last_4
                    const email = this.state.individual.company.email
                    const day = this.state.individual.company.D_O_B.day
                    const month = this.state.individual.company.D_O_B.month
                    const year = this.state.individual.company.D_O_B.year
                    const add1 = this.state.individual.company.address.line1
                    const add2 = this.state.individual.company.address.line2
                    const postal = this.state.individual.company.address.postal_code
                    const city = this.state.individual.company.address.city
                    const stat = this.state.individual.company.address.state
                    const phone = this.state.individual.company.phone
                    const country = this.state.individual.company.address.country

                    this.state.individual.company.phone = this.state.userid
                    this.setState({ individual: this.state.individual })
                    if (first_name == '' || last_name == '' || ssn_last_4 == '' || email == '' || day == '' || month == '' || year == '' || add1 == '' || add2 == '' || postal == '' || city == '' || stat == '') {
                        alert("please filed all text")

                    }
                    else {
                        let params = {
                            // type: 'custom',
                            business_type: 'individual',
                            //individual: this.state.individual,
                            "metadata[order_id]": this.state.individual,
                            "individual[first_name]": first_name,
                            "individual[last_name]": last_name,
                            "individual[phone]":'9630630309',
                            "individual[email]":email,
                            "individual[ssn_last_4]":ssn_last_4,
                            "individual[dob][day]":day,
                            "individual[dob][month]":month,
                            "individual[dob][year]":year,
                            'individual[address][line1]':add1,
                            'individual[address][line2]':add2,
                            'individual[address][postal_code]':postal,
                            'individual[address][city]':city,
                            'individual[address][state]':stat,
                            'individual[address][country]':'US'
                            //"company":this.state.individual
                        }
                        this.update_Account(1, params)
                        //Actions.push("Home")
                    }
                    break;
                }

            case 2:{
                console.log("You select comapnies LLc",this.state.company_data.company)
                console.log('user id phone number',this.state.userid)
                const name = this.state.company_data.company.name
                const tax_id = this.state.company_data.company.tax_id
                const add1 = this.state.company_data.company.address.line1
                const add2 = this.state.company_data.company.address.line2
                const postal = this.state.company_data.company.address.postal_code
                const city = this.state.company_data.company.address.city
                const stat = this.state.company_data.company.address.state

                const first_name =this.state.company_data.company.representative.first_name
                const last_name=this.state.company_data.company.representative.last_name
                const ssn_last_4=this.state.company_data.company.representative.ssn_last_4
                const email=this.state.company_data.company.representative.email
                const title=this.state.company_data.company.representative.relationship.title
                const rep_add1=this.state.company_data.company.representative.address.line1
                const rep_add2=this.state.company_data.company.representative.address.line2
                const rep_post=this.state.company_data.company.representative.address.postal_code
                const rep_city=this.state.company_data.company.representative.address.city
                const rep_stat=this.state.company_data.company.representative.address.state
                const day=this.state.company_data.company.representative.dob.day
                const month=this.state.company_data.company.representative.dob.month
                const year=this.state.company_data.company.representative.dob.year
                const phone = this.state.individual.company.phone
                const country = this.state.individual.company.address.country

                const Ow_fname=this.state.company_data.company.owners.first_name
                const ow_lname=this.state.company_data.company.owners.last_name
                const ow_email=this.state.company_data.company.owners.email

                this.state.company_data.company.phone = this.state.userid
                this.state.company_data.company.representative.phone = this.state.userid
                this.setState({ company_data: this.state.company_data })
                if(name==''||tax_id==''||add1==''||add2==''||postal==''||city==''||stat==''||first_name==''||last_name==''||ssn_last_4==''||
                email==''||title==''||rep_add1==''||rep_add2==''||rep_post==''||rep_city==''||rep_stat==''||day==''||month==''||year==''||Ow_fname==''||ow_lname==''||ow_email=='')
                {
                    alert("please filed all text")
                }
                else{
                     let params = {
                                  business_type: 'individual',
                                  "metadata[order_id]" : this.state.individual,
                                  "company[name]": name,
                                  "company[tax_id]": tax_id,
                                  'company[]': add1,
                                  'company[]': add2,
                                  'company[]': postal,
                                  'company[]': city,
                                  'company[]': stat,
                                  'company[]': 'US',
                                  'company[]': first_name,
                                  'company[]': last_name,
                                  'company[]': ssn_last_4,
                                  'company[]': email,
                                  'company[]': title,
                                  'company[]': rep_add1,
                                  'company[]': rep_add2,
                                  'company[]': rep_city,
                                  'company[]': rep_post,
                                  'company[]': rep_stat,
                                  'company[]': 'US',
                                  'company[]': day,
                                  'company[]': month,
                                  'company[]': year,
                                  'company[]': '9630630309',
                                  'company[]':'US',
                                  'company[]':Ow_fname,
                                  'company[]':ow_lname,
                                  'company[]':ow_email
                              }
                    this.update_Account(2)
                    //Actions.push("Home")
                }
                break;

            }
                
            case 3:{
                console.log("you select non-profits",this.state.non_profit.company)
                console.log("user mobile nonprofit",this.state.userid)
                const name = this.state.non_profit.company.name
                const tax_id = this.state.non_profit.company.tax_id
                const add1 = this.state.non_profit.company.address.line1
                const add2 = this.state.non_profit.company.address.line2
                const postal = this.state.non_profit.company.address.postal_code
                const city = this.state.non_profit.company.address.city
                const stat = this.state.non_profit.company.address.state

                const first_name = this.state.non_profit.company.representative.first_name
                const last_name = this.state.non_profit.company.representative.last_name
                const ssn_last_4 = this.state.non_profit.company.representative.ssn_last_4
                const email = this.state.non_profit.company.representative.email
                const title = this.state.non_profit.company.representative.relationship.title
                const rep_add1 = this.state.non_profit.company.representative.address.line1
                const rep_add2 = this.state.non_profit.company.representative.address.line2
                const rep_post = this.state.non_profit.company.representative.address.postal_code
                const rep_city = this.state.non_profit.company.representative.address.city
                const rep_stat = this.state.non_profit.company.representative.address.state
                const day = this.state.non_profit.company.representative.dob.day
                const month = this.state.non_profit.company.representative.dob.month
                const year = this.state.non_profit.company.representative.dob.year


                this.state.non_profit.company.phone = this.state.userid
                this.state.non_profit.company.representative.phone = this.state.userid
                this.setState({ non_profit: this.state.non_profit })
                if (name == '' || tax_id == '' || add1 == '' || add2 == '' || postal == '' || city == '' || stat == '' || first_name == '' || last_name == '' || ssn_last_4 == '' || email == '' || title == '' ||
                    rep_add1 == '' || rep_add2 == '' || rep_post == '' || rep_city == '' || rep_stat == '' || day == '' || month == '' || year == '' ) {
                    alert("please filed all text")
                }
                else {
                    this.update_Account(3)
                   // Actions.push("Home")
                }
                break;
            }
                
            case 4:{
                
                console.log("user mobile government entities", this.state.userid)
                const name = this.state.Government_entities.company.name
                const tax_id = this.state.Government_entities.company.tax_id
                const add1 = this.state.Government_entities.company.address.line1
                const add2 = this.state.Government_entities.company.address.line2
                const postal = this.state.Government_entities.company.address.postal_code
                const city = this.state.Government_entities.company.address.city
                const stat = this.state.Government_entities.company.address.state

                const first_name = this.state.Government_entities.company.representative.first_name
                const last_name = this.state.Government_entities.company.representative.last_name
                const ssn_last_4 = this.state.Government_entities.company.representative.ssn_last_4
                const email = this.state.Government_entities.company.representative.email
                const title = this.state.Government_entities.company.representative.relationship.title
                const rep_add1 = this.state.Government_entities.company.representative.address.line1
                const rep_add2 = this.state.Government_entities.company.representative.address.line2
                const rep_post = this.state.Government_entities.company.representative.address.postal_code
                const rep_city = this.state.Government_entities.company.representative.address.city
                const rep_stat = this.state.Government_entities.company.representative.address.state
                const day = this.state.Government_entities.company.representative.dob.day
                const month = this.state.Government_entities.company.representative.dob.month
                const year = this.state.Government_entities.company.representative.dob.year

                
                this.state.Government_entities.company.phone = this.state.userid
                this.state.Government_entities.company.representative.phone = this.state.userid
                this.setState({ Government_entities: this.state.Government_entities })
                console.log("you select government entites", this.state.Government_entities.company)
                if (name == '' || tax_id == '' || add1 == '' || add2 == '' || postal == '' || city == '' || stat == '' || first_name == '' || last_name == '' || ssn_last_4 == '' || email == '' || title == '' ||
                    rep_add1 == '' || rep_add2 == '' || rep_post == '' || rep_city == '' || rep_stat == '' || day == '' || month == '' || year == '' ) {
                    alert("please filed all text")
                }
                else {
                    this.update_Account(4)
                   // Actions.push("Home")
                }
                break;
            }
                
        }

       // console.log("company data",this.state.company_data)
        //console.log("individuals data",this.state.individual)
        //console.log("Non profit data", this.state.non_profit)
        //console.log("goverment data",this.state.Government_entities)
        
       // this.setState({company_page:false})
    }
    function_call(){
        console.log('function is call')
        Actions.push("Home")
    }
    
    render() {
       console.log('recive dataasfasdfasdfas',this.state.recive_data)
        //const STRIPE_URL = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://stripe.com/connect/default/oauth/test&client_id=ca_HmC7ykr9O5ThkfGyX8HQcUxx2SbqAWhc';
       // console.log(this.state.linkUrl)
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
     //this.New_Account_update()
       // const menu = (
        //     <Menu onItemSelected={this.onMenuItemSelected} 
        //         isHomeOpen={false}
        //         isMyAccountOpen={true}
        //         isNew_MyAccount={false}
        //         isSettingOpen={false}
        //         onPress={()=> this.toggleMenu()}/>
        // );
       
        return (
            <View style={{flex:1, backgroundColor:RSColor.BackColor}}>
                
                    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
                     <StatusBar barStyle="dark-content"/>
                        <View style={{flex:1, marginTop:15}}>
                           <Text style={{fontSize:35 ,fontWeight:'bold'}}>page is on </Text>
                        </View>
                    </SafeAreaView>
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
    indivi_view:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-evenly'
    },
    Input_view:{
         marginTop: 20,borderWidth:1,height:40, width: '60%'
    },
    input_text:{
        width: '100%', padding: 10, height: 35
    },
    // Input_view:{
    //     width:'60%',
    //     height:35,
    //     borderWidth:1,
    //     marginLeft:10,
    //     padding:5
    // },
    flatList_View:{
        marginLeft: 10,
            width: '60%',
            height: 30,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
    },
    country_text:{
        borderWidth:0.3,
        marginLeft:10,
        width:'75%',
        height:40,
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center'
    },
    Text_view:{
        fontSize:18,
        alignSelf:'center',
        alignItems:'center'
    },
    // company styles
    input_textview:{
        height: 40,
        padding: 10,
        marginLeft: 20,
        marginTop: 10,
        width: '80%',
        borderWidth: 1
    }
})