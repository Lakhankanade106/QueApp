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
    PanResponder } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import {authenticator} from "./authenticator";
import calicon from "../../assets/images/arrow.png";
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
        };
    
        //this._loadClient = this._loadClient.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.checkKey = this.checkKey.bind(this);
        this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
        this.logout = this.logout.bind(this);
        this.animatedValue = new Animated.Value(0)
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

        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    }
    updateUser = (user, db) => {
        
         db.collection("users").findOne({ phone: this.state.userid }).then((result) => {
            this._storeData(result);
            this.setState({loading:false})
            if (result != null){
                console.log('user', result)
                this.setState({
                    ...this.state,
                    ...{ user: result },
                    });
                    var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
                var appts= {};
             
                appts = this.state.user.appointments[datetoken];
                Actions.refresh({key:'Home'})
                this.state.listData = appts
                this.setState({listData: this.state.user.appointments[datetoken]})
              
                
            }else {
                console.log('user:-', result)
            }
            
        }).catch((error) => console.log('update eoor:------',error));
    }

    UNSAFE_componentWillMount() {
       // console.log('home page=====', this.props.navigation.state.params)
        AsyncStorage.getItem('userId').then((token) => {
             console.log('usertoken',token)
           // var value = JSON.parse(token)
            if ((token !== null) && (token != undefined)) {
                this.setState({isLoading:false})
                this.setState({userid:token})
                this.reloadClient()
            }else {
                this.setState({isLoading:false})
                console.log('-:User Not Found:-')
            }
          }).catch((err)=> {
            console.log('error:- ', err)
          })
        //this.reloadClient()
        //this._retrieveData()
    }

    UNSAFE_componentWillReceiveProps(prp){
        console.log('rescieve proprs:----------', prp)
         

        //this.updateUser('user', this.state.db)
    }
    reloadClient = () =>{
        this.setState({loading:true})
        var client;
        try {
            client = Stitch.defaultAppClient;

        } catch (error) {

            client = Stitch.initializeDefaultAppClient(appId);
        }

        const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");

        const db = mongoClient.db("que");
        const users = db.collection("users");
        this.updateUser(users, db)
        this.setState({ client: client, db: db });
        
        try {
            if (client.isLoggedIn) {
                console.log('user login')
                return;
            }
        } catch (error) {
            console.log('try catch error:- ',error);
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
    // async componentDidMount() {

    //     this.refreshData();
     
    // }
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
        
            if (value !== null) {
            // Our data is fetched successfully 
              
                this.setState({
                    ...this.state,
                    ...{ user: JSON.parse(value), loading: false },
                });
                var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
                var appts= {};
                appts = this.state.user.appointments[datetoken];

                this.state.listData = appts
                this.setState({listData: this.state.listData})

            }
        } catch (error) {
            return false;
        }
    }
        
    logout() {
        this.state.client.auth.logout();
        AsyncStorage.clear();
        const { navigate } = this.props.navigation;
        Actions.GetStart({type:'reset'})

    }
    onActionPressed = () => {

    };
    
    onCashOutButtonPressed = () => {

    };
    
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
            Actions.MyAccount()
            // const {navigate} = this.props.navigation;
            // navigate(item, this.state);
        }else if (item == "Home"){
            Actions.Home()
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
    
  
    updateAnimation(prop, value) {

       return(
        Animated.spring(prop, {
            toValue: value,
            friction: 10,
           
        })
       )
        
      }
    
    render() {
    
        var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
        var newData = {}
        var cls = this;
        //console.log('user Detail: 888888 ', this.state.user)
        try {
          
            newData = this.state.user.appointments[datetoken]
            //console.log(newData)
            //this.setState({listData:this.state.user.appointments[datetoken]})
    
        } catch(e) {
            console.log('eoror:90----', e)
          
        }
        const animationStyle = value => {
            let bbb = (value == -276) ? "ok":"isfalse"
            console.log(bbb)
            let nnn = Object.values(value)
            let ddd = Object.values(nnn)
            console.log('value:- ', ddd[2])
            var vall = 0
            if (this.state.isUpdateSideMenu){
                vall = ddd[2]
                console.log('run true----', vall)
            }else {
                vall = -1
            }
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
                isMyAccountOpen={false}
                isSettingOpen={true}
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
                                <Svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 26.27 26.217">
                                    <Path id="Path_7" data-name="Path 7" d="M11.314,3.318c3.592-.018,7.184,0,10.776-.013.483,0,.967,0,1.45.007a16.135,16.135,0,0,1,2.865.131A5.608,5.608,0,0,1,30.7,8.782q-.009,7.138,0,14.276a9.058,9.058,0,0,1-.135,2.18,5.656,5.656,0,0,1-5.254,4.284q-7.865-.008-15.729,0A5.673,5.673,0,0,1,5.9,27.755a5.915,5.915,0,0,1-1.172-1.934,7.136,7.136,0,0,1-.3-2.64q.009-6.443,0-12.886a20.673,20.673,0,0,1,.083-2.617A5.571,5.571,0,0,1,6.831,4.262,5.283,5.283,0,0,1,9.65,3.327c.555-.006,1.109,0,1.664-.008M14.97,8.86a5.8,5.8,0,0,0-4.995,5.057q0,2.483,0,4.967a5.773,5.773,0,0,0,3.938,4.841,9.6,9.6,0,0,0,2.745.3,4.853,4.853,0,0,0,1.386-.105,1.92,1.92,0,0,0,.559-3.492A5.16,5.16,0,0,0,15.9,20.1a2.208,2.208,0,0,1-1.059-.167,2.04,2.04,0,0,1-1.025-1.613q.009-1.9.005-3.8a1.9,1.9,0,0,1,1.832-1.834q1.893,0,3.785,0a1.819,1.819,0,0,1,1.8,1.849,7.888,7.888,0,0,0,.175,2.617A1.819,1.819,0,0,0,22.9,18.3a1.929,1.929,0,0,0,2.134-1.22A9.867,9.867,0,0,0,25,13.205a5.73,5.73,0,0,0-5.315-4.356c-1.572.018-3.145,0-4.718.011m7.716,11.33a2.079,2.079,0,0,0-1.436,1.734,1.765,1.765,0,0,0,.245,1.033,1.884,1.884,0,0,0,1.175.958,1.94,1.94,0,0,0,2.393-2.461A1.968,1.968,0,0,0,22.686,20.189Z" transform="translate(-4.43 -3.305)" fill="rgb(53,22,88)"/>
                                
                                </Svg>
                            </View>
                            <View style={{flex:1, alignItems:'flex-end', marginRight:20,  height:40}}>
                                <TouchableOpacity onPress={() => this.toggleMenu()} >
                                    
                                    <Image source={require('../../assets/images/menu.png')} style={{height:30, width:50, tintColor:'rgb(53,22,88)'}} resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
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