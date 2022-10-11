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
    Platform } from "react-native"

import calicon from "../../assets/images/arrow.png";
import {
    Stitch,
    RemoteMongoClient,
    FunctionCredential,

} from "mongodb-stitch-react-native-sdk"; 
import moment from "moment";
import "moment-timezone";
import DatePicker from "react-native-datepicker";
import { AsyncStorage } from "react-native";

import Swipeout from 'react-native-swipeout';
import RSStyle from '../Style/Style';
import RSIcon from '../Style/RSIcon';

import {Actions} from 'react-native-router-flux'
import {SvgXml} from 'react-native-svg'
import RSServer from '../Server/RSServer';
import RSColor from "../Style/RSColor";

const RServer = new RSServer()
//rgb(53, 22, 88)
const appId = "que-eblub";
const height1 = Dimensions.get('window').height
const width1 = Dimensions.get('window').width
export default class Login extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            isNewAppointShow:false,
            isOpen: false,
            loading: false,
            selectedItem: "About",
            
            user: {},
            appointments: {
                date: new Date(), //"dddd MMMM DD, Y"
            },
            listData:[],
            client:'',
            db:'',
            isSearch: false,
            allArray:[],
            isDateChange:false,
            userid:""
 
        };
    
        //this._loadClient = this._loadClient.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.checkKey = this.checkKey.bind(this);
 
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
            console.log(
                `logged in with custom function auth as user ${authedUser.id}`
            );
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
        //console.log('userupdate id : - ',  this.props.text.id)
         db.collection("users").findOne({ phone: this.state.userid }).then((result) => {
            this._storeData(result);
            
            this.setState({loading:false})
            if (result !== null){
                this.setState({
                    ...this.state,
                    ...{ user: result },
                    });
                    var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
                var appts= {};
             
                appts = this.state.user.appointments[datetoken];

                this.state.listData = appts
                this.setState({listData: this.state.user.appointments[datetoken]})
                this.setState({allArray:this.state.user.appointments[datetoken]})
                console.log('adding data')
                console.log('ser -', this.state.listData )
            }else {
                console.log('user', result)
            }
            
        }).catch((error) => console.log('update eoor:------',error));
    }

    UNSAFE_componentWillMount() {
        console.log('home page=====')
        //this.setState({db:this.props.db})
      AsyncStorage.getItem('userId').then((token) => {
            console.log('usertoken:ihisdf:-',token)
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
        
        //this._retrieveData()
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
                console.log('adding data')
                
               
            }
        } catch (error) {
            return false;
        }
    }

    newAppointmentPressed = () => {
        //this.setState({isNewAppointShow: true})
        const { navigate } = this.props.navigation;
        navigate("AppointmentCreate",this.state);
        Actions.push("NewAppointment",this.state);
    };
        
    updateMenuState(isOpen) {
        this.setState({ isOpen });
    }
    
    editAppointment( slot) {

        console.log('click edit')
        let ddict = slot
        if (ddict !== undefined){
            console.log('editing for ' + ddict.name);
        
            const { navigate } = this.props.navigation;
            console.log(navigate);
            var p = {
                ...this.state,
                ...{ appointment: ddict, slot:moment(ddict.date).format(
            "YYYYMMD") + "-"+slot.timeKey },
            };
            Actions.push("EditAppoint", p);
        }
        
    
    }
    onDeleteClick = (item) => {
        var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
        const query = { status :"verified"};
        // this.state.db.collection("users").deleteOne(query)
        // .then(result => {
        //     console.log(`Deleted ${result.deletedCount} item.`)
        // }).catch(err => console.error(`Delete failed with error: ${err}`))
        var newAppoint = {}
        newAppoint[item] = this.state.listData[item]
        var allAppoint = {}
        allAppoint[datetoken]
       var up = { "$lt": { appointments: allAppoint }};
            
       this.state.db.collection("users").deleteOne({appointments: allAppoint} ).then(result=>console.log(result));
       
    }
    
    searchText = (e) => {

        console.log('ed :- ', e)
        var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
        let text = e.toLowerCase()
        let fullList = Object.values(this.state.listData);
        let filteredList = fullList.filter((item) => { // search from a full list, and not from a previous search results list
            // console.log("=====================")
            // console.log('item:- ', item.name.toLowerCase().match(text))
            if(item.name.toLowerCase().match(text))
                return item;
        })
        console.log('fullList', filteredList)
        if (!text || text === '') {
            console.log('text empty, or text not')
            this.setState({
                listData: this.state.user.appointments[datetoken],
                noData:false,
            })
        } else if (!filteredList.length) {
            console.log('text empty, or text not')
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noData: true
            })
        }
        else if (Array.isArray(filteredList)) {
            this.setState({
                noData: false,
                listData: filteredList
            })
        }
        
    }
    render() {
        console.log(this.pan)
       
        var datetoken = moment(this.state.appointments.date).format("YYYYMMDD");
        var newData = {}
        var cls = this;
        console.log('user Detail: 888888 ', this.state.user)
        try {
            this.state.listData = this.state.user.appointments[datetoken]
            if (this.state.isDateChange){
                this.state.listData = this.state.user.appointments[datetoken]
                this.setState({isDateChange:false})
            }
            
            console.log(newData)
            //this.setState({listData:this.state.user.appointments[datetoken]})
    
        } catch(e) {
            console.log('eoror:90----', e)
        }
     

        return (
           
            <SafeAreaView style={{flex:1, backgroundColor:'rgb(238, 241, 248)'}}>
                <StatusBar barStyle="dark-content"/>
                
                    <Animated.View style={[RSStyle.draggable, { height1 }] }>
                        
                        
                        <View style={styles.ListView} >
                            <TouchableOpacity style={{backgroundColor:'rgba(53,22,88, 0.1)', height:8, width:80, alignSelf:'center', marginTop:10, borderRadius:5}}>

                            </TouchableOpacity>

                            {
                                this.state.isSearch ? 
                                <View style={RSStyle.appointHeader}>
                                    <View style={RSStyle.searchbarView}>
                                        <Image source={require('../../assets/images/search.png')} style={{transform:[{rotate:'270deg'}], height:25, width:25, tintColor:'gray'}}/>
                                        <View style={{height:'100%',width:'100%', paddingLeft:10, justifyContent:'center',  flex:1}}>
                                            <TextInput
                                                style={{height:'100%', fontSize:17, fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}}
                                                placeholder="Search"
                                                onChangeText={(a) => this.searchText(a)}
                                                clearButtonMode="always"
                                            />
                                        </View>
                                        {/* <TouchableOpacity style={{height:30, width:30, justifyContent:'center', alignItems:'center', backgroundColor:'gray', borderRadius:20, marginRight:10 }}>
                                            <Text style={{color:'white'}}>X</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                               :
                                <View style={RSStyle.appointHeader}>
                                    <View style={RSStyle.viewFlex}>
                                        <Text style={[RSStyle.appointHeaderText, {color:'black'}]}>All Appointment</Text>
                                    </View>
                                    <TouchableOpacity style={{height:40, width:40, justifyContent:'center', alignItems:'center'}} onPress={() => this.setState({isSearch:true})}>
                                        <Image source={require('../../assets/images/search.png')} style={{transform:[{rotate:'270deg'}], height:30, width:30}}/>
                                    </TouchableOpacity>
                                </View>
                            }
                            
                            <TouchableOpacity style={RSStyle.dateButton}>
                                <Text style={RSStyle.dateFont}>
                                    {moment(this.state.appointments.date).format("dddd MMMM DD, Y")}
                                </Text> 

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
                                    placeholder="select date"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            width: 21,
                                            height: 19,
                                            tintColor:"rgb(151, 87, 222)",
                                            left:10
                                        },
                                        dateInput: {
                                            display: "none",
                                            fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'
                                        },
                                    }}
                                    onDateChange={(dd) => {
                                    this.setState({
                                        ...this.state,
                                        ...{ appointments: { date: dd } },
                                        ...{ isDateChange:true},
                                    });
                                    }}
                                    
                                />

                            </TouchableOpacity>
                            <View style={{ width:width1,flex:1, bottom:0}}>
                            {this.state.loading ? 
                                <View style={{marginTop:'40%'}}>
                                    <ActivityIndicator size="large" color={RSColor.BackColor} />
                                </View>
                                //  <Loader
                                //    style={{ position: "absolute", bottom: "20%", width:150 }}
                                //  />
                                : (typeof this.state.listData !== "undefined" &&
                                Object.keys(this.state.listData).length > 0 ? 
                                <View style={{flexGrow:1, marginTop:10}}>

                                    <FlatList
                                        data={Object.values(this.state.listData)}
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        style={{flexGrow:1}}
                                        contentContainerStyle={{ marginTop:10, flexGrow:1}}
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
                                            
                                        ]} style={{backgroundColor:'transparent'}}>
                                        <TouchableOpacity style={{height:80, width:width1}} onPress={() =>
                                            cls.editAppointment(
                                            this.state.listData['timeKey'],
                                            item
                                            )
                                        }>
                                            <View style={RSStyle.appointmentView}>
                                                <View pointerEvents="box-none" style={ RSStyle.appointmentViewInner }>
                                                
                                                    <Text style={{color:'gray', fontSize:15, fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}}>
                                                    {moment(
                                                        item["date"]
                                                    ).format("H:mm A")}
                                                    </Text>

                                                </View>
                                                <View style={{justifyContent:'center', marginLeft:20}}>
                                                    <View style={{flex:1, justifyContent:'center'}}>
                                                        <Text style={{fontSize:18, fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                    
                                                    <Text style={[RSStyle.descriptionText, {flex:1, color:'#787878'}]}>
                                                        {item["service"]}
                                                    </Text>
                                                </View>
                                                <View>
                                                
                                                </View>
                                                
                                            </View>
                                            <View style={{backgroundColor:'#E8E8E8', height:1, marginLeft:30}}/>
                                        </TouchableOpacity>
                                        </Swipeout>
                                        }
                                        keyExtractor={item => item.name}
                                    />  
                            </View>
                            : (
                                <Text style={[RSStyle.noAppointText, {color:'gray'}]}>
                                No Appointments
                                </Text>
                                )
                            )}
                        </View>
                        
                    </View>
                </Animated.View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        
        flexDirection:'row',
        marginTop:20,
    },
    balanceText:{
        fontSize:55,
        alignSelf:'center',
        color:'rgb(53,22,88)',
       
        marginTop:25,
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
        height:'100%',
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
        fontWeight:'bold'
    },
    newappointmentButton:{
        height:35,
        width:35,
        borderRadius:20,
        borderColor:'white',
        borderWidth:2,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-end',
        right:60,
        position:'absolute'
    },
    newappointmentButtonImage:{
        height:20,
        width:20,
        tintColor:'white'
    }
})