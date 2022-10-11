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
import Save_Account from '../All_Pages/Save_Account';
import LinearGradient1 from 'react-native-linear-gradient';

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
            client: '',
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
            date_picker:false,
           

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
    Value_Changes(){
    //============    individual ===============================
       // console.log('recive data', this.state.recive_data)
        this.state.individual.company.first_name=this.state.recive_data.individual.first_name
        this.state.individual.company.last_name=this.state.recive_data.individual.last_name
        this.state.individual.company.email=this.state.recive_data.individual.email
        this.state.individual.company.ssn_last_4=this.state.recive_data.individual.dob.year
        this.state.individual.company.phone=this.state.recive_data.individual.phone
        this.state.individual.company.address.city=this.state.recive_data.individual.address.city
        this.state.individual.company.address.line1=this.state.recive_data.individual.address.line1
        this.state.individual.company.address.line2=this.state.recive_data.individual.address.line2
        this.state.individual.company.address.country=this.state.recive_data.individual.address.country
        this.state.individual.company.address.postal_code = this.state.recive_data.individual.address.postal_code
        this.state.individual.company.address.state=this.state.recive_data.individual.address.state
        this.state.individual.company.D_O_B.day=this.state.recive_data.individual.dob.day
        this.state.individual.company.D_O_B.month=this.state.recive_data.individual.dob.month
        this.state.individual.company.D_O_B.year=this.state.recive_data.individual.dob.year
       // console.log('data update',this.state.individual)
        this.setState({Busines_sel:this.state.recive_data.business_type})
        this.setState({individual:this.state.individual})

    //=================== company ==================================
    
    
    }
    Login_func() {
        AsyncStorage.getItem('isUserLogin').then((token) => {
            console.log('usertoken', token)
            //var value = JSON.parse(token)
            if (token == true) {

                console.log("if condition chali",token)
            } else {
                Actions.push("Home")
                console.log("else condtion chali",token)
                //console.log('-:User Not Found:-')
            }
        }).catch((err) => {
            console.log('error:- ', err)
        })
    }
    
    UNSAFE_componentWillMount() {
        this.Login_func()

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
        console.log('conshole home data', this.props.uniq_id)
       let str = "https://api.stripe.com/v1/accounts/" + this.props.uniq_id
        fetch(str, {
        method: "GET",
        headers: new Headers({
            'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
            'Content-Type': 'application/x-www-form-urlencoded'
        }),

    })
    .then(res => res.json())
    .then((data) => {

         console.log('recive data2121', data)
         this.setState({recive_data:data})
         switch (data.business_type) {

             case 'individual':{
                 //Actions.push('Save_Account')

                 console.log('individual function is call')
                 this.setState({recive_data:data})
                 this.setState({indivi_page:true})
                 this.Value_Changes()
                 //this.setState({ indivi_page: true })
                
                 break;
             }

             case 'company':
                 console.log('company function is call')
                 this.setState({company_page:true})
                 this.setState({ Busines_sel: data.business_type })
                 this.state.company_data.company.name =data.company.name
                 this.state.company_data.company.phone=data.company.phone
                 this.state.company_data.company.tax_id='12345'
                 this.state.company_data.company.address.line1=data.company.address.line1
                 this.state.company_data.company.address.line2=data.company.address.line2
                 this.state.company_data.company.address.city=data.company.address.city
                 this.state.company_data.company.address.country=data.company.country
                 this.state.company_data.company.address.postal_code=data.company.address.postal_code
                 this.state.company_data.company.address.state=data.company.address.state
                 this.setState({company_data:this.state.company_data})
                 break;

             case 'non_profit':
                 console.log('non-profit function is call')
                 this.setState({non_profit_page:true})
                 this.setState({ Busines_sel: data.business_type })
                 this.state.non_profit.company.name = data.company.name
                 this.state.non_profit.company.phone = data.company.phone
                 this.state.non_profit.company.tax_id = '12345'
                 this.state.non_profit.company.address.line1 = data.company.address.line1
                 this.state.non_profit.company.address.line2 = data.company.address.line2
                 this.state.non_profit.company.address.city = data.company.address.city
                 this.state.non_profit.company.address.country = data.company.country
                 this.state.non_profit.company.address.postal_code = data.company.address.postal_code
                 this.state.non_profit.company.address.state = data.company.address.state
                 this.setState({non_profit:this.state.non_profit})
                 break;

             case 'government_entity':
                 console.log('Government entity function is call',data.company.position)
                 this.setState({Gov_ent_page:true})
                 this.setState({ Busines_sel: data.business_type })
                 this.state.Government_entities.company.name = data.company.name
                 this.state.Government_entities.company.phone = data.company.phone
                 this.state.Government_entities.company.tax_id = '12345'
                 this.state.Government_entities.company.address.line1 = data.company.address.line1
                 this.state.Government_entities.company.address.line2 = data.company.address.line2
                 this.state.Government_entities.company.address.city = data.company.address.city
                 this.state.Government_entities.company.address.country = data.company.country
                 this.state.Government_entities.company.address.postal_code = data.company.address.postal_code
                 this.state.Government_entities.company.address.state = data.company.address.state
                 this.setState({Government_entities:this.state.Government_entities})
                 break;
         }

        //LET dta = JSON.parse(data)

         }).catch((er) => {
         console.log('error:- ', er)
         })
      
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
       // this.data_functin()
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
                //this.Account_set()
               // this.setState({indivi_page:true})
                this.state.linkUrl = dta["url"]
                this.setState({ linkUrl: dta["url"] })
                //this.New_Account_update()

            }).catch((er) => {
                console.log('error:- ', er)
            })
    }
    
    reloadClient = () => {
        //console.log('load client')
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
          //  console.log('response mongodb get:- ', res)
        }).catch((er) => {
          //  console.log('eror:-= ', er)
        })
       // console.log("client data ",client)
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
          //  console.log(error);
        }
    }
    
        
    logout() {
       // console.log("client data", this.state.client)
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
      //  console.log('side animateion')
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
        //Actions.push('Save_Account')
        //console.log("function call")
        
           // console.log("else condition is run")
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
         switch (item.id) {

             case this.state.Busines_data[0].id:
                 this.setState({company_page:false})
                 this.setState({non_profit_page:false})
                 this.setState({Gov_ent_page:false})
                 this.setState({indivi_page:true})
                 //console.log('switch cash run',item.id)
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
    
    update_Account(count,params){
       // console.log("data recive",this.props.text)
       console.log("data recive2", this.props.uniq_id)
       console.log("Business type",params)
        switch (count) {

            case 1:
                {
                    //============ individual send data api =============
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
                                //console.log("responce data", data)
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
                           // console.log('error:- ', er)
                        })
                    break;
                }
            case 2:
                {
                    //=============== Company form send data api
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
                          if (data.error) {
                              alert(data.error.message)
                             // console.log("responce data cath", data)
                          }
                          else {
                              //console.log("responce data", data)
                              Actions.push('Home')
                              // console.log("responce data", data)
                          }
                          

                      }).catch((er) => {
                         // console.log('error:- ', er)
                      })
                  break;
                }
            case 3:
                {    //==================== non_profit data send api =======================
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
                                if (data.error) {
                                    alert(data.error.message)
                                   // console.log("responce data cath", data)
                                }
                                else {
                                   // console.log("responce data", data)
                                    Actions.push('Home')
                                    // console.log("responce data", data)
                                }

                            }).catch((er) => {
                              //  console.log('error:- ', er)
                            })
                        break;
                    
                }
            case 4:
                {  //======== Goverment entities send api =========================  
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
                                if (data.error) {
                                    alert(data.error.message)
                                   // console.log("responce data cath", data)
                                }
                                else {
                                   // console.log("responce data", data)
                                    Actions.push('Home')
                                    // console.log("responce data", data)
                                }

                            }).catch((er) => {
                               // console.log('error:- ', er)
                            })
                        break;
                    
                }
        }
    }
    submit_func(param){
       // let New_number=this.state.individual.company.phone.split(+1)
        
       // console.log("phone number ",typeof(this.state.individual.company.phone))
        switch (param) {

            case 1:
                {
                   
                   // console.log("you select individuals")
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
                            "individual[phone]":phone,
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
              //  console.log("You select comapnies LLc",this.state.company_data.company)
               // console.log('user id phone number',this.state.userid)
                const name = this.state.company_data.company.name
                const tax_id = this.state.company_data.company.tax_id
                const add1 = this.state.company_data.company.address.line1
                const add2 = this.state.company_data.company.address.line2
                const postal = this.state.company_data.company.address.postal_code
                const city = this.state.company_data.company.address.city
                const stat = this.state.company_data.company.address.state
                const phone = this.state.company_data.company.phone
                const country = this.state.company_data.company.address.country

                //const first_name =this.state.company_data.company.representative.first_name
                //const last_name=this.state.company_data.company.representative.last_name
                //const ssn_last_4=this.state.company_data.company.representative.ssn_last_4
                //const email=this.state.company_data.company.representative.email
                //const title=this.state.company_data.company.representative.relationship.title
                //const rep_add1=this.state.company_data.company.representative.address.line1
                //const rep_add2=this.state.company_data.company.representative.address.line2
                //const rep_post=this.state.company_data.company.representative.address.postal_code
                //const rep_city=this.state.company_data.company.representative.address.city
                //const rep_stat=this.state.company_data.company.representative.address.state
                //const day=this.state.company_data.company.representative.dob.day
                //const month=this.state.company_data.company.representative.dob.month
                //const year=this.state.company_data.company.representative.dob.year
                //const phone = this.state.individual.company.phone
                //const country = this.state.individual.company.address.country

                //const Ow_fname=this.state.company_data.company.owners.first_name
                //const ow_lname=this.state.company_data.company.owners.last_name
                //const ow_email=this.state.company_data.company.owners.email

                this.state.company_data.company.phone = this.state.userid
                this.state.company_data.company.representative.phone = this.state.userid
                this.setState({ company_data: this.state.company_data })
                if(name==''||tax_id==''||add1==''||add2==''||postal==''||city==''||stat==''||phone == '')
                {
                    alert("please filed all text")
                }
                else{
                     let params = {
                                  business_type: 'company',
                                  "metadata[order_id]" : this.state.company_data,
                                  "company[name]": name,
                                  "company[tax_id]": tax_id,
                                  'company[address][line1]': add1,
                                  'company[address][line2]': add2,
                                  'company[address][postal_code]': postal,
                                  'company[address][city]': city,
                                  'company[address][state]': stat,
                                  'company[address][country]': 'US',
                                  'company[phone]':phone
                                //   'representative[first_name]': first_name,
                                //   'representative[last_name]': last_name,
                                //   'representative[ssn_last_4]': ssn_last_4,
                                //   'representative[email]': email,
                                //   'representative[relationship][title]': title,
                                //   'representative[address][line1]': rep_add1,
                                //   'representative[address][line2]': rep_add2,
                                //   'representative[address][city]': rep_city,
                                //   'representative[address][postal_code]': rep_post,
                                //   'representative[address][state]': rep_stat,
                                //   'representative[address][country]': 'US',
                                //   'representative[dob][day]': day,
                                //   'representative[dob][month]': month,
                                //   'representative[dob][year]': year,
                                //   'representative[phone]': '9630630309',
                                //   'owners[first_name]':Ow_fname,
                                //   'owners[last_name]':ow_lname,
                                //   'owners[email]':ow_email
                              }
                    this.update_Account(2,params)
                    //Actions.push("Home")
                }
                break;

            }
                
            case 3:{
                //console.log("you select non-profits",this.state.non_profit.company)
                //console.log("user mobile nonprofit",this.state.userid)
                const name = this.state.non_profit.company.name
                const tax_id = this.state.non_profit.company.tax_id
                const add1 = this.state.non_profit.company.address.line1
                const add2 = this.state.non_profit.company.address.line2
                const postal = this.state.non_profit.company.address.postal_code
                const city = this.state.non_profit.company.address.city
                const stat = this.state.non_profit.company.address.state
                const phone = this.state.non_profit.company.phone
                const country = this.state.non_profit.company.address.country

                //const first_name = this.state.non_profit.company.representative.first_name
                //const last_name = this.state.non_profit.company.representative.last_name
                //const ssn_last_4 = this.state.non_profit.company.representative.ssn_last_4
                //const email = this.state.non_profit.company.representative.email
                //const title = this.state.non_profit.company.representative.relationship.title
                //const rep_add1 = this.state.non_profit.company.representative.address.line1
                //const rep_add2 = this.state.non_profit.company.representative.address.line2
               // const rep_post = this.state.non_profit.company.representative.address.postal_code
                //const rep_city = this.state.non_profit.company.representative.address.city
                //const rep_stat = this.state.non_profit.company.representative.address.state
                //const day = this.state.non_profit.company.representative.dob.day
                //const month = this.state.non_profit.company.representative.dob.month
                //const year = this.state.non_profit.company.representative.dob.year


                this.state.non_profit.company.phone = this.state.userid
                this.state.non_profit.company.representative.phone = this.state.userid
                this.setState({ non_profit: this.state.non_profit })
                if (name == '' || tax_id == '' || add1 == '' || add2 == '' || postal == '' || city == '' || stat == '' || phone=='') {
                    alert("please filed all text")
                }
                else {
                    let params = {
                        business_type: 'non_profit',
                        "metadata[order_id]": this.state.company_data,
                        "company[name]": name,
                        "company[tax_id]": tax_id,
                        'company[address][line1]': add1,
                        'company[address][line2]': add2,
                        'company[address][postal_code]': postal,
                        'company[address][city]': city,
                        'company[address][state]': stat,
                        'company[address][country]': 'US',
                        'company[phone]':phone
                       
                    }
                    
                    this.update_Account(3,params)
                   // Actions.push("Home")
                }
                break;
            }
                
            case 4:{
                
               // console.log("user mobile government entities", this.state.userid)
                const name = this.state.Government_entities.company.name
                const tax_id = this.state.Government_entities.company.tax_id
                const add1 = this.state.Government_entities.company.address.line1
                const add2 = this.state.Government_entities.company.address.line2
                const postal = this.state.Government_entities.company.address.postal_code
                const city = this.state.Government_entities.company.address.city
                const stat = this.state.Government_entities.company.address.state
                const Phone = this.state.Government_entities.company.phone
                const country = this.state.Government_entities.company.address.country

                //const first_name = this.state.Government_entities.company.representative.first_name
                //const last_name = this.state.Government_entities.company.representative.last_name
                //const ssn_last_4 = this.state.Government_entities.company.representative.ssn_last_4
                //const email = this.state.Government_entities.company.representative.email
                //const title = this.state.Government_entities.company.representative.relationship.title
                //const rep_add1 = this.state.Government_entities.company.representative.address.line1
                //const rep_add2 = this.state.Government_entities.company.representative.address.line2
                //const rep_post = this.state.Government_entities.company.representative.address.postal_code
                //const rep_city = this.state.Government_entities.company.representative.address.city
                //const rep_stat = this.state.Government_entities.company.representative.address.state
                //const day = this.state.Government_entities.company.representative.dob.day
                //const month = this.state.Government_entities.company.representative.dob.month
                //const year = this.state.Government_entities.company.representative.dob.year

                
                // this.state.Government_entities.company.phone = this.state.userid
                // this.state.Government_entities.company.representative.phone = this.state.userid
                this.setState({ Government_entities: this.state.Government_entities })
                //console.log("you select government entites", this.state.Government_entities.company)
                if (name == '' || tax_id == '' || add1 == '' || add2 == '' || postal == '' || city == '' || stat == '' || Phone == '' ) {
                    alert("please filed all text")
                }
                else {
                    let params = {
                        business_type: 'government_entity',
                        "metadata[order_id]": this.state.company_data,
                        "company[name]": name,
                        "company[tax_id]": tax_id,
                        'company[address][line1]': add1,
                        'company[address][line2]': add2,
                        'company[address][postal_code]': postal,
                        'company[address][city]': city,
                        'company[address][state]': stat,
                        'company[address][country]': 'US',
                        'company[phone]': Phone

                    }
                    this.update_Account(4,params)
                   // Actions.push("Home")
                }
                break;
            }
            
                
        }

    }  
    render() {
       // console.log("date of birthday", this.state.individual.company.D_O_B)
        let dob = this.state.individual.company.D_O_B.day+'.'+this.state.individual.company.D_O_B.month+'.'+this.state.individual.company.D_O_B.year
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
                
                    <SafeAreaView style={{flex:1, backgroundColor:'rgb(235,240,245)'}}>
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

                     {/* =============================== Form UI ============================ */}
                           <View style={{flex:1,marginTop:20,backgroundColor:'white',borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                               <Text style={{marginTop:20,marginLeft:20,fontWeight:'bold',fontSize:25,marginBottom:20,color:RSColor.BackColor}}>Que requirment for</Text>
                               {/*========= Business type code ==============*/}
                                <View style={{marginRight:10}}>
                                    <Text style={styles.Text_view} >Business</Text>
                                        <TouchableOpacity style={styles.country_text}
                                            onPress={()=>this.Business_type()} >
                                            <Text style={{fontSize:18,alignSelf:'center',color:'rgb(186,184,196)'}}>{this.state.Busines_sel}</Text>
                                        </TouchableOpacity>
                                </View>
                                <View >
                                    <FlatList
                                        data={this.state.Busines_data}
                                        renderItem={({item})=>
                                        <TouchableOpacity style={{marginLeft:40,marginTop:5}}
                                            onPress={()=>this.Busines_sel_item(item)}>
                                            <Text style={{fontSize:18,alignSelf:'center',color:'rgb(186,184,196)'}}>{item.title}</Text>
                                        </TouchableOpacity> }/>
                                </View>
                                {/* ======================= individual code =======================*/}
                                {this.state.indivi_page?
                                    <View style={{marginTop:20,flex:1,marginBottom:10}}>
                                        < ScrollView >
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>First Name</Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                           // placeholder='First Name'
                                                            defaultValue={this.state.individual.company.first_name}
                                                            onChangeText={(text)=>{this.state.individual.company.first_name=text
                                                            //this.setState({individual:this.state.individual})
                                                        }} 
                                                            />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>Last Name</Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                            //placeholder='Last Name'
                                                            defaultValue={this.state.individual.company.last_name}
                                                            onChangeText={(text)=>{this.state.individual.company.last_name=text
                                                            //this.setState({individual:this.state.individual})
                                                            }} />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>Birthday</Text>
                                                    <View >
                                                    <DatePicker style={{ height: 45, width: '90%', alignSelf: 'center',
                                                        marginTop: 5, justifyContent: 'center',}}
                                                            iconSource={calicon}
                                                           // ref={(datePicker) => (this.datePicker = datePicker)}
                                                          //  date={}
                                                            //minDate={new Date()}
                                                            //defaultDate={new Date(2019, 2, 18)}
                                                            mode={"date"}
                                                            placeholder = {dob}
                                                            format="DD-MM-YYYY"
                                                            confirmBtnText="Confirm"
                                                            cancelBtnText="Cancel"
                                                            ref={(datePicker) => (this.datePicker = datePicker)}
                                                            customStyles={{ dateIcon: { width: 21, height: 19, position: "absolute", right: 30, marginLeft: 0},
                                                            dateInput:{borderRadius:10,height:45},
                                                            dateText:{color:'white',fontSize:18,alignSelf:'flex-start',paddingLeft:10,fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'},
                                                            placeholderText:{fontSize:18,color:'black',alignSelf:'flex-start',paddingLeft:10,fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}
                                                        }}
                                                            onDateChange={(dd) => {
                                                                var date = dd.split("-")
                                                                this.state.individual.company.D_O_B.day = date[0];
                                                                this.state.individual.company.D_O_B.month = date[1];
                                                                this.state.individual.company.D_O_B.year = date[2]

                                                            this.setState({company:this.state.company});
                                                        }}
                                                        />
                                                    </View>   
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>Address 1</Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                            //placeholder='Address 1'
                                                            defaultValue={this.state.individual.company.address.line1}
                                                            onChangeText={(text)=>{this.state.individual.company.address.line1=text
                                                                //this.setState({individual:this.state.individual})
                                                                }} />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>Address 2</Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                           // placeholder='Address 2'
                                                            defaultValue={this.state.individual.company.address.line2}
                                                            onChangeText={(text)=>{this.state.individual.company.address.line2=text
                                                                //this.setState({individual:this.state.individual})
                                                                }} />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>Post code</Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                            keyboardType={'numeric'}
                                                            //placeholder='Postel code'
                                                            defaultValue={this.state.individual.company.address.postal_code}
                                                            onChangeText={(text)=>{this.state.individual.company.address.postal_code=text
                                                                //this.setState({individual:this.state.individual})
                                                                }} />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>City</Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                            //placeholder='City'
                                                            defaultValue={this.state.individual.company.address.city}
                                                            onChangeText={(text)=>{this.state.individual.company.address.city=text
                                                                //this.setState({individual:this.state.individual})
                                                                }} />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>State</Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                            //placeholder='State'
                                                            defaultValue={this.state.individual.company.address.state}
                                                            onChangeText={(text)=>{this.state.individual.company.address.state=text
                                                                //this.setState({individual:this.state.individual})
                                                                }} />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>Country</Text>
                                                    <View style={styles.Input_view}>
                                                        {/* <TextInput style={styles.input_text}
                                                                placeholder='Country'
                                                                onChangeText={(text)=>{this.state.individual.company.address.country=text
                                                                     this.setState({individual:this.state.individual})}} /> */}
                                                            <Text style={styles.input_text}>United States (US)</Text>
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>  Phone  </Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                            //placeholder={this.state.userid}
                                                            maxLength={10}
                                                            keyboardType={'numeric'}
                                                            defaultValue={this.state.individual.company.phone}
                                                        onChangeText={(text) => {
                                                            this.state.individual.company.phone = text
                                                                //this.setState({individual:this.state.individual})
                                                            }}
                                                        />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>  Email   </Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                            //placeholder='Email'
                                                            defaultValue={this.state.individual.company.email}
                                                            autoCapitalize={'none'}
                                                            onChangeText={(text)=>{this.state.individual.company.email=text
                                                                //this.setState({individual:this.state.individual})
                                                                }} />
                                                    </View>    
                                            </View>
                                            <View style={styles.indivi_view}>
                                                <Text style={styles.Text_view}>  SSN   </Text>
                                                    <View style={styles.Input_view}>
                                                        <TextInput style={styles.input_text}
                                                            //placeholder='SSN (Last 4)'
                                                            maxLength={4}
                                                            defaultValue={this.state.individual.company.ssn_last_4.toString()}
                                                            onChangeText={(text)=>{this.state.individual.company.ssn_last_4=text
                                                                //this.setState({individual:this.state.individual})
                                                                }} />
                                                    </View>    
                                            </View>
                                            <LinearGradient1
                                                start={{x: 0,y: 0.7,}}
                                                end={{x: 0.8,y: 0.8,}}
                                                locations={[0.3, 1]}
                                                colors={["rgb(154, 90, 221)", "rgb(228, 181, 203)"]}
                                                style={{ bottom:5,width:'90%',height:45,marginTop:20,borderRadius:10,alignSelf:'center',justifyContent:'center'}}>
                                                <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => Actions.submit_func(1)}>
                                                    <Text style={{fontSize:20, color:'white',  fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium',}}>Submit</Text>
                                                </TouchableOpacity>
                                            </LinearGradient1>
                                        </ScrollView>
                                    </View> :null}

{/*============================ company_page ===================================*/}
                                {this.state.company_page ?
                                    <View style={{ marginTop: 20, flex: 1,marginBottom:10 }}>
                                        < ScrollView >
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(186,184,196)' }}>Company Name</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Company Name'
                                                    defaultValue={this.state.company_data.company.name}
                                                    onChangeText={(text) => {
                                                        this.state.company_data.company.name = text
                                                        this.setState({ company_data: this.state.company_data })
                                                    }} />
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20, color: 'rgb(186,184,196)',marginTop:10 }}>Address 1</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Address1'
                                                    defaultValue={this.state.company_data.company.address.line1}
                                                    onChangeText={(text) => {
                                                        this.state.company_data.company.address.line1 = text
                                                        this.setState({ company_data: this.state.company_data })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20, color: 'rgb(186,184,196)',marginTop:10 }}>Address 2</Text>
                                                <TextInput style={styles.input_textview}
                                                   // placeholder='Address2'
                                                    defaultValue={this.state.company_data.company.address.line2}
                                                    onChangeText={(text) => {
                                                        this.state.company_data.company.address.line2 = text
                                                        this.setState({ company_data: this.state.company_data })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20, color: 'rgb(186,184,196)',marginTop:10 }}>Post code</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='40716'
                                                    defaultValue={this.state.company_data.company.address.postal_code}
                                                    onChangeText={(text) => {
                                                        this.state.company_data.company.address.postal_code = text
                                                        this.setState({ company_data: this.state.company_data })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20, color: 'rgb(186,184,196)',marginTop:10 }}>City</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='City'
                                                    defaultValue={this.state.company_data.company.address.city}
                                                    onChangeText={(text) => {
                                                        this.state.company_data.company.address.city = text
                                                        this.setState({ company_data: this.state.company_data })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20, color: 'rgb(186,184,196)',marginTop:10 }}>State</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='State'
                                                    defaultValue={this.state.company_data.company.address.state}
                                                    onChangeText={(text) => {
                                                        this.state.company_data.company.address.state = text
                                                        this.setState({ company_data: this.state.company_data })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20, color: 'rgb(186,184,196)',marginTop:10 }}>Country</Text>
                                                {/* <TextInput style={styles.input_textview}
                                                         placeholder = 'Country'
                                                         onChangeText={(text)=>{this.state.company_data.company.address.country=text
                                                         this.setState({company_data:this.state.company_data})}} /> */}
                                                <View style={styles.Input_view}>
                                                    <Text style={styles.input_text}>United States (US)</Text>
                                                </View>
                                                
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20, color: 'rgb(186,184,196)' }}>Phone Number</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder={this.state.userid}
                                                    defaultValue={this.state.company_data.company.phone}
                                                    keyboardType={'numeric'}
                                                    maxLength={10}
                                                    onChangeText={(text) => {
                                                        this.state.company_data.company.phone = text
                                                        this.setState({ company_data: this.state.company_data })
                                                    }} />
                                                {/* <Text style={styles.input_textview}>{this.state.userid}</Text> */}
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20, color: 'rgb(186,184,196)' }}>Company tax ID</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Text ID'
                                                    defaultValue={this.state.company_data.company.tax_id}
                                                    onChangeText={(text) => {
                                                        this.state.company_data.company.tax_id = text
                                                        this.setState({ company_data: this.state.company_data })
                                                    }} />
                                            </View>

                                            {/*================= Representative Details ===================*/}

                                            {/* <Text style={{fontSize:22,marginLeft:20,marginTop:20}}>Representative</Text> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Name</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'First Name'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.first_name=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Last Name'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.last_name=text
                                    this.setState({company_data:this.state.company_data})}} />
                                </View> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Date of birth</Text>
                                    <View style={{marginLeft:20,marginTop:10,flexDirection:'row',height:40, width: '60%'}}>
                                        <TextInput style={{width: '25%',borderWidth:1, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={2}
                                    placeholder='DD'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.dob.day=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    <TextInput style={{width: '25%',borderWidth:1,marginLeft:10, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={2}
                                    placeholder='MM'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.dob.month=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    <TextInput style={{width: '30%',borderWidth:1,marginLeft:10, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={4}
                                    placeholder='YYYY'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.dob.year=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    </View> */}
                                            {/* <View style={{marginTop:12}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Address</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Address 1'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.address.line1=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Address 2'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.address.line2=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Postel code'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.address.postal_code=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'City'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.address.city=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'State'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.address.state=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    {/* <TextInput style={styles.input_textview}
                                    placeholder = 'Country'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.address.country=text
                                    this.setState({company_data:this.state.company_data})}} /> */}
                                            {/* <Text style={styles.input_textview}>United States (US)</Text> */}
                                            {/* </View> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Tax Information</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'SSN (Last 4)'
                                    maxLength={4}
                                    onChangeText={(text)=>{this.state.company_data.company.representative.ssn_last_4=text
                                    this.setState({company_data:this.state.company_data})}} />
                                   </View>
                                   <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Title at company</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Title'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.relationship.title=text
                                    this.setState({company_data:this.state.company_data})}} />
                                   </View>  */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Email</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Email'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.email=text
                                    this.setState({company_data:this.state.company_data})}} />
                                   </View> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Phone</Text> */}
                                            {/* <TextInput style={styles.input_textview}
                                    placeholder = {this.state.userid}
                                    placeholderTextColor='black'
                                    onChangeText={(text)=>{this.state.company_data.company.representative.phone=this.state.userid
                                    this.setState({company_data:this.state.company_data})}} /> */}
                                            {/* <Text style={styles.input_textview}>{this.state.userid}</Text> */}
                                            {/* </View>  */}

                                            {/*=================== Owners details ======================*/}

                                            {/* <Text style={{fontSize:22,marginLeft:20,marginTop:20}}>Owner</Text> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Name</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'First Name'
                                    onChangeText={(text)=>{this.state.company_data.company.owners.first_name=text
                                    this.setState({company_data:this.state.company_data})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Last Name'
                                    onChangeText={(text)=>{this.state.company_data.company.owners.last_name=text
                                    this.setState({company_data:this.state.company_data})}} />
                                </View> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Email</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Email'
                                    onChangeText={(text)=>{this.state.company_data.company.owners.email=text
                                    this.setState({company_data:this.state.company_data})}} />
                                   </View>
                            </View> */}
                                            <LinearGradient1
                                                start={{x: 0,y: 0.7,}}
                                                end={{x: 0.8,y: 0.8,}}
                                                locations={[0.3, 1]}
                                                colors={["rgb(154, 90, 221)", "rgb(228, 181, 203)"]}
                                                style={{ bottom:5,width:'90%',height:45,marginTop:20,borderRadius:10,alignSelf:'center',justifyContent:'center'}}>
                                                <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => Actions.submit_func(2)}>
                                                    <Text style={{fontSize:20, color:'white',  fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium',}}>Submit</Text>
                                                </TouchableOpacity>
                                            </LinearGradient1>
                                        </ScrollView>
                                    </View> : null}
{/*========================= Non Profit page ==============================*/}

                                {this.state.non_profit_page ?
                                    <View style={{ marginTop: 20, flex: 1,marginBottom:10}}>
                                        < ScrollView >
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(184,186,196)' }}>Company Name</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Company Name'
                                                    defaultValue={this.state.non_profit.company.name}
                                                    onChangeText={(text) => {
                                                        this.state.non_profit.company.name = text
                                                        this.setState({ non_profit: this.state.non_profit })
                                                    }} />
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(184,186,196)' }}>Address 1</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Address1'
                                                    defaultValue={this.state.non_profit.company.address.line1}
                                                    onChangeText={(text) => {
                                                        this.state.non_profit.company.address.line1 = text
                                                        this.setState({ non_profit: this.state.non_profit })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color:'rgb(184,186,196)' }}>Address 2</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Address2'
                                                    defaultValue={this.state.non_profit.company.address.line2}
                                                    onChangeText={(text) => {
                                                        this.state.non_profit.company.address.line2 = text
                                                        this.setState({ non_profit: this.state.non_profit })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color:'rgb(184,186,196)' }}>Post code</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Postel code'
                                                    defaultValue={this.state.non_profit.company.address.postal_code}
                                                    onChangeText={(text) => {
                                                        this.state.non_profit.company.address.postal_code = text
                                                        this.setState({ non_profit: this.state.non_profit })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color:'rgb(184,186,196)' }}>City</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='City'
                                                    defaultValue={this.state.non_profit.company.address.city}
                                                    onChangeText={(text) => {
                                                        this.state.non_profit.company.address.city = text
                                                        this.setState({ non_profit: this.state.non_profit })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color:'rgb(184,186,196)' }}>State</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='State'
                                                    defaultValue={this.state.non_profit.company.address.state}
                                                    onChangeText={(text) => {
                                                        this.state.non_profit.company.address.state = text
                                                        this.setState({ non_profit: this.state.non_profit })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color:'rgb(184,186,196)' }}>Country</Text>
                                                {/* <TextInput style={styles.input_textview}
                                                placeholder = 'Country'
                                                onChangeText={(text)=>{this.state.non_profit.company.address.country=text
                                                this.setState({non_profit:this.state.non_profit})}} /> */}
                                                <View style={styles.Input_view}>
                                                    <Text style={styles.input_text}>United States (US)</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(184,186,196)' }}>Company Phone</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder={this.state.userid}
                                                    defaultValue={this.state.non_profit.company.phone}
                                                    maxLength={10}
                                                    onChangeText={(text) => {
                                                        this.state.non_profit.company.phone = text
                                                        this.setState({ non_profit: this.state.non_profit })
                                                    }} />
                                                {/* <Text style={styles.input_textview}>{this.state.userid}</Text> */}
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(184,186,196)' }}>Company Text id</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Text id'
                                                    defaultValue={this.state.non_profit.company.tax_id}
                                                    onChangeText={(text) => {
                                                        this.state.non_profit.company.tax_id = text
                                                        this.setState({ non_profit: this.state.non_profit })
                                                    }} />
                                            </View>

                                            {/*================= Representative Details ===================*/}

                                            {/* <Text style={{fontSize:22,marginLeft:20,marginTop:20}}>Representative</Text> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Name</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'First Name'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.first_name=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Last Name'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.last_name=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                </View> */}
                                            {/* <View style={{marginTop:10}}> */}
                                            {/* <Text style={{fontSize:18,marginLeft:20}}>Date of birth</Text>
                                    <View style={{marginLeft:20,marginTop:10,flexDirection:'row',height:40, width: '60%'}}>
                                        <TextInput style={{width: '25%',borderWidth:1, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={2}
                                    placeholder='DD'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.dob.day=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                    <TextInput style={{width: '25%',borderWidth:1,marginLeft:10, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={2}
                                    placeholder='MM'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.dob.month=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                    <TextInput style={{width: '30%',borderWidth:1,marginLeft:10, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={4}
                                    placeholder='YYYY'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.dob.year=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                    </View> */}
                                            {/* <View style={{marginTop:12}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Address</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Address 1'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.address.line1=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Address 2'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.address.line2=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Postel code'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.address.postal_code=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'City'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.address.city=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'State'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.address.state=text
                                    this.setState({non_profit:this.state.non_profit})}} /> */}
                                            {/* <TextInput style={styles.input_textview}
                                    placeholder = 'Country'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.address.country=text
                                    this.setState({non_profit:this.state.non_profit})}} /> */}
                                            {/* <Text style={styles.input_textview}>United States (US)</Text>
                                    </View> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Tax Information</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'SSN (Last 4)'
                                    maxLength={4}
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.ssn_last_4=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                   </View>
                                   <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Title at company</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Title'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.relationship.title=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                   </View> 
                                   <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Email</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Email'
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.email=text
                                    this.setState({non_profit:this.state.non_profit})}} />
                                   </View> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Phone</Text> */}
                                            {/* <TextInput style={styles.input_textview}
                                    placeholder = {this.state.userid}
                                    placeholderTextColor='black'
                                    //maxLength={10}
                                    onChangeText={(text)=>{this.state.non_profit.company.representative.phone=this.state.userid
                                    this.setState({non_profit:this.state.non_profit})}} /> */}
                                            {/* <Text style={styles.input_textview}>{this.state.userid}</Text>
                                   </View> 
                                </View> */}
                                            <LinearGradient1
                                                start={{x: 0,y: 0.7,}}
                                                end={{x: 0.8,y: 0.8,}}
                                                locations={[0.3, 1]}
                                                colors={["rgb(154, 90, 221)", "rgb(228, 181, 203)"]}
                                                style={{ bottom:5,width:'90%',height:45,marginTop:20,borderRadius:10,alignSelf:'center',justifyContent:'center'}}>
                                                <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => Actions.submit_func(3)}>
                                                    <Text style={{fontSize:20, color:'white',  fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium',}}>Submit</Text>
                                                </TouchableOpacity>
                                            </LinearGradient1>
                                        </ScrollView>
                                    </View> : null}
{/*========================= Government entities page ==============================*/}

                                {this.state.Gov_ent_page ?
                                    <View style={{ marginTop: 20, flex: 1,marginBottom:10}}>
                                        < ScrollView >
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(184,186,196)' }}>Company Name</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Company Name'
                                                    defaultValue={this.state.Government_entities.company.name}
                                                    onChangeText={(text) => {
                                                        this.state.Government_entities.company.name = text
                                                        this.setState({ Government_entities: this.state.Government_entities })
                                                    }} />
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(184,186,196)' }}>Address 1</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Address1'
                                                    defaultValue={this.state.Government_entities.company.address.line1}
                                                    onChangeText={(text) => {
                                                        this.state.Government_entities.company.address.line1 = text
                                                        this.setState({ Government_entities: this.state.Government_entities })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10, color: 'rgb(184,186,196)' }}>Address 2</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Address2'
                                                    defaultValue={this.state.Government_entities.company.address.line2}
                                                    onChangeText={(text) => {
                                                        this.state.Government_entities.company.address.line2 = text
                                                        this.setState({ Government_entities: this.state.Government_entities })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color: 'rgb(184,186,196)' }}>Post code</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Postel code'
                                                    defaultValue={this.state.Government_entities.company.address.postal_code}
                                                    onChangeText={(text) => {
                                                        this.state.Government_entities.company.address.postal_code = text
                                                        this.setState({ Government_entities: this.state.Government_entities })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color: 'rgb(184,186,196)' }}>City</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='City'
                                                    defaultValue={this.state.Government_entities.company.address.city}
                                                    onChangeText={(text) => {
                                                        this.state.Government_entities.company.address.city = text
                                                        this.setState({ Government_entities: this.state.Government_entities })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color: 'rgb(184,186,196)' }}>State</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='State'
                                                    defaultValue={this.state.Government_entities.company.address.state}
                                                    onChangeText={(text) => {
                                                        this.state.Government_entities.company.address.state = text
                                                        this.setState({ Government_entities: this.state.Government_entities })
                                                    }} />
                                                <Text style={{ fontSize: 18, marginLeft: 20,marginTop:10,color: 'rgb(184,186,196)' }}>Country</Text>
                                                {/* <TextInput style={styles.input_textview}
                                                placeholder = 'Country'
                                                onChangeText={(text)=>{this.state.Government_entities.company.address.country=text
                                                this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                                <View style={styles.Input_view}>
                                                    <Text style={styles.input_text}>United States (US)</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(184,186,196)' }}>Company Phone</Text>
                                                <TextInput style={styles.input_textview}
                                                   // placeholder={this.state.userid}
                                                    defaultValue={this.state.Government_entities.company.phone}
                                                    maxLength={10}
                                                    onChangeText={(text) => {
                                                        this.state.Government_entities.company.phone = text
                                                        this.setState({ Government_entities: this.state.Government_entities })
                                                    }} />
                                                {/* <Text style={styles.input_textview}>{this.state.userid}</Text> */}
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 18, marginLeft: 20,color:'rgb(184,186,196)' }}>Company Text id</Text>
                                                <TextInput style={styles.input_textview}
                                                    //placeholder='Text id'
                                                    defaultValue={this.state.Government_entities.company.tax_id}
                                                    onChangeText={(text) => {
                                                        this.state.Government_entities.company.tax_id = text
                                                        this.setState({ Government_entities: this.state.Government_entities })
                                                    }} />
                                            </View>

                                            {/*================= Representative Details ===================*/}

                                            {/* <Text style={{fontSize:22,marginLeft:20,marginTop:20}}>Representative</Text> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Name</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'First Name'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.first_name=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Last Name'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.last_name=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                </View> */}
                                            {/* <View style={{marginTop:10}}> */}
                                            {/* <Text style={{fontSize:18,marginLeft:20}}>Date of birth</Text>
                                    <View style={{marginLeft:20,marginTop:10,flexDirection:'row',height:40, width: '60%'}}>
                                        <TextInput style={{width: '25%',borderWidth:1, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={2}
                                    placeholder='DD'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.dob.day=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={{width: '25%',borderWidth:1,marginLeft:10, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={2}
                                    placeholder='MM'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.dob.month=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={{width: '30%',borderWidth:1,marginLeft:10, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={4}
                                    placeholder='YYYY'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.dob.year=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    </View> */}
                                            {/* <View style={{marginTop:12}}> */}
                                            {/* <Text style={{fontSize:18,marginLeft:20}}>Address</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Address 1'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.line1=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Address 2'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.line2=text
                                    this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                            {/* <TextInput style={styles.input_textview}
                                    placeholder = 'Postel code'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.postal_code=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'City'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.city=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'State'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.state=text
                                    this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                            {/* <TextInput style={styles.input_textview}
                                    placeholder = 'Country'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.country=text
                                    this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                            {/* <Text style={styles.input_textview}>United States (US)</Text> */}
                                            {/* </View> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Tax Information</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'SSN (Last 4)'
                                    maxLength={4}
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.ssn_last_4=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                   </View>
                                   <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Title at company</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Title'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.relationship.title=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                   </View>  */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Email</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Email'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.email=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                   </View> */}
                                            {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Phone</Text> */}
                                            {/* <TextInput style={styles.input_textview}
                                    placeholder = {this.state.userid}
                                    placeholderTextColor='black'
                                    maxLength={10}
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.phone=this.state.userid
                                    this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                            {/* <Text style={styles.input_textview}>{this.state.userid}</Text>
                                   </View>  */}
                                            {/* </View> */}
                                            <LinearGradient1
                                                start={{x: 0,y: 0.7,}}
                                                end={{x: 0.8,y: 0.8,}}
                                                locations={[0.3, 1]}
                                                colors={["rgb(154, 90, 221)", "rgb(228, 181, 203)"]}
                                                style={{ bottom:5,width:'90%',height:45,marginTop:20,borderRadius:10,alignSelf:'center',justifyContent:'center'}}>
                                                <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => Actions.submit_func(4)}>
                                                    <Text style={{fontSize:20, color:'white',  fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium',}}>Submit</Text>
                                                </TouchableOpacity>
                                            </LinearGradient1>
                                        </ScrollView>
                                    </View> : null}
                            </View>
                            
                            



{/*========================= Government entities page ==============================*/}

                    {this.state.Gov_ent_page12?
                        <View style={{marginTop:20,flex:1,alignContent:'center',padding:10,alignSelf:'center',borderWidth:1,width:'95%'}}>
                            < ScrollView >
                                <Text style={{fontSize:22,alignSelf:'center'}}>Company</Text>
                                    <View style={{marginTop:10}}>
                                        <Text style={{fontSize:18,marginLeft:20}}>Company Name</Text>
                                            <TextInput style={styles.input_textview}
                                                //placeholder='Company Name'
                                                defaultValue={this.state.Government_entities.company.name}
                                                onChangeText={(text)=>{this.state.Government_entities.company.name=text
                                                this.setState({Government_entities:this.state.Government_entities}) }} />
                                    </View>
                                    <View style={{marginTop:10}}>
                                        <Text style={{fontSize:18,marginLeft:20}}>Company Address</Text>
                                            <TextInput style={styles.input_textview}
                                                //placeholder = 'Address1'
                                                defaultValue={this.state.Government_entities.company.address.line1}
                                                onChangeText={(text)=>{this.state.Government_entities.company.address.line1=text
                                                this.setState({Government_entities:this.state.Government_entities})}} />
                                            <TextInput style={styles.input_textview}
                                                //placeholder = 'Address2'
                                                defaultValue={this.state.Government_entities.company.address.line2}
                                                onChangeText={(text)=>{this.state.Government_entities.company.address.line2=text
                                                this.setState({Government_entities:this.state.Government_entities})}} />
                                            <TextInput style={styles.input_textview}
                                                //placeholder = 'Postel code'
                                                defaultValue={this.state.Government_entities.company.address.postal_code}
                                                onChangeText={(text)=>{this.state.Government_entities.company.address.postal_code=text
                                                this.setState({Government_entities:this.state.Government_entities})}} />
                                            <TextInput style={styles.input_textview}
                                                //placeholder = 'City'
                                                defaultValue={this.state.Government_entities.company.address.city}
                                                onChangeText={(text)=>{this.state.Government_entities.company.address.city=text
                                                this.setState({Government_entities:this.state.Government_entities})}} />
                                            <TextInput style={styles.input_textview}
                                                //placeholder = 'State'
                                                defaultValue={this.state.Government_entities.company.address.state}
                                                onChangeText={(text)=>{this.state.Government_entities.company.address.state=text
                                                this.setState({Government_entities:this.state.Government_entities})}} />
                                           {/* <TextInput style={styles.input_textview}
                                                placeholder = 'Country'
                                                onChangeText={(text)=>{this.state.Government_entities.company.address.country=text
                                                this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                            <Text style={styles.input_textview}>United States (US)</Text>
                                    </View>
                                    <View style={{marginTop:10}}>
                                        <Text style={{fontSize:18,marginLeft:20}}>Company Phone</Text>
                                            <TextInput style={styles.input_textview}
                                               // placeholder={this.state.userid}
                                                defaultValue={this.state.Government_entities.company.phone}
                                                maxLength={10}
                                                onChangeText={(text)=>{this.state.Government_entities.company.phone=text
                                                this.setState({Government_entities:this.state.Government_entities}) }} />
                                            {/* <Text style={styles.input_textview}>{this.state.userid}</Text> */}
                                    </View>
                                    <View style={{marginTop:10}}>
                                        <Text style={{fontSize:18,marginLeft:20}}>Company Text id</Text>
                                            <TextInput style={styles.input_textview}
                                                //placeholder='Text id'
                                                defaultValue={this.state.Government_entities.company.tax_id}
                                                onChangeText={(text)=>{this.state.Government_entities.company.tax_id=text
                                                this.setState({Government_entities:this.state.Government_entities}) }} />
                                    </View>
                               
                        {/*================= Representative Details ===================*/}

                                {/* <Text style={{fontSize:22,marginLeft:20,marginTop:20}}>Representative</Text> */}
                                {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Name</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'First Name'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.first_name=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Last Name'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.last_name=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                </View> */}
                            {/* <View style={{marginTop:10}}> */}
                                    {/* <Text style={{fontSize:18,marginLeft:20}}>Date of birth</Text>
                                    <View style={{marginLeft:20,marginTop:10,flexDirection:'row',height:40, width: '60%'}}>
                                        <TextInput style={{width: '25%',borderWidth:1, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={2}
                                    placeholder='DD'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.dob.day=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={{width: '25%',borderWidth:1,marginLeft:10, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={2}
                                    placeholder='MM'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.dob.month=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={{width: '30%',borderWidth:1,marginLeft:10, padding: 10, height: 40}}
                                        keyboardType={'numeric'}
                                        maxLength={4}
                                    placeholder='YYYY'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.dob.year=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    </View> */}
                             {/* <View style={{marginTop:12}}> */}
                                    {/* <Text style={{fontSize:18,marginLeft:20}}>Address</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Address 1'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.line1=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Address 2'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.line2=text
                                    this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                    {/* <TextInput style={styles.input_textview}
                                    placeholder = 'Postel code'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.postal_code=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'City'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.city=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'State'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.state=text
                                    this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                    {/* <TextInput style={styles.input_textview}
                                    placeholder = 'Country'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.address.country=text
                                    this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                    {/* <Text style={styles.input_textview}>United States (US)</Text> */}
                                {/* </View> */}
                                    {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Tax Information</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'SSN (Last 4)'
                                    maxLength={4}
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.ssn_last_4=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                   </View>
                                   <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Title at company</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Title'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.relationship.title=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                   </View>  */}
                                   {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Email</Text>
                                    <TextInput style={styles.input_textview}
                                    placeholder = 'Email'
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.email=text
                                    this.setState({Government_entities:this.state.Government_entities})}} />
                                   </View> */}
                                   {/* <View style={{marginTop:10}}>
                                    <Text style={{fontSize:18,marginLeft:20}}>Phone</Text> */}
                                    {/* <TextInput style={styles.input_textview}
                                    placeholder = {this.state.userid}
                                    placeholderTextColor='black'
                                    maxLength={10}
                                    onChangeText={(text)=>{this.state.Government_entities.company.representative.phone=this.state.userid
                                    this.setState({Government_entities:this.state.Government_entities})}} /> */}
                                    {/* <Text style={styles.input_textview}>{this.state.userid}</Text>
                                   </View>  */}
                                {/* </View> */}
                                <TouchableOpacity style={{width:'85%',height:45,marginTop:40,alignItems:'center',justifyContent:'center',alignSelf:'center',borderWidth:1}}
                                    onPress={()=>this.submit_func(4)}>
                                    <Text style={{fontSize:20,fontWeight:'bold'}}>Submit</Text>
                                </TouchableOpacity>
                        </ScrollView>
                    </View>:null}
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
    text_Header:{
        justifyContent:'center',
        fontSize: 18,
        marginLeft: 20,
    },
    indivi_view:{
    },
    Input_view:{
        borderWidth:1,height:45, width: '90%',alignSelf:'center',
        marginTop: 5, borderRadius: 10, justifyContent: 'center', borderColor:'rgb(186,184,196)'
    },
    input_text:{
        justifyContent:'center',
        padding:10,
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
        width:'92%',
        height:45,
        marginLeft:20,
        borderRadius:10,
        marginTop:10,
        justifyContent:'center',
        alignSelf:'center',
        borderColor:'rgb(184,186,196)'
    },
    Text_view:{
        fontSize:18,
        marginLeft:20,
        marginTop:10,
        color:"rgb(186,184,196)"
    },
    // company styles
    input_textview:{
        height: 45,
        padding: 10,
        marginLeft: 20,
        marginTop: 5,
        width: '90%',
        borderRadius:10,
        borderWidth: 1,
        borderColor:'rgb(186,184,196)'
    }
})