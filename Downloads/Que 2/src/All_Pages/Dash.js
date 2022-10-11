
import React from "react"
import { Animated, Easing, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView, TextInput, FlatList } from "react-native"
import LinearGradient from 'react-native-linear-gradient'

import calicon from "../../assets/images/date-d8ba22a72f905d22157cd1935e0ae51e.png";
import SideMenu from "react-native-side-menu";
import Menu from "./SideMenu/Menu";
import { AsyncStorage } from "react-native";
import Loader from "./loader";
import {Actions} from 'react-native-router-flux'

import {
  Stitch,
  RemoteMongoClient,
  UserPasswordCredential,
  AnonymousCredential,
  FunctionAuthProvider,
  FunctionCredential,
} from "mongodb-stitch-react-native-sdk"; 
import moment from "moment";
import "moment-timezone";
import DatePicker from "react-native-datepicker";
import { withOrientation, NavigationEvents } from "react-navigation";

const height1 = Dimensions.get('window').height
const width1 = Dimensions.get('window').width
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
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
      client:'',
      db:''
    };

    this._loadClient = this._loadClient.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.checkKey = this.checkKey.bind(this);
    this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
    this.logout = this.logout.bind(this);
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
      })
      .catch((err) => {
        const { navigate } = this.props.navigation;

        navigate("GetStarted");
      });
    }
  async _loadClient() {
    var client;
    try {
      client = await Stitch.defaultAppClient;

    } catch (error) {

      client = await Stitch.initializeDefaultAppClient(appId);
    }

    const mongoClient = client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    
    
    const db = mongoClient.db("que");
    const users = db.collection("users");
    console.log('user:- ', users)
    this.setState({ client: client, db: db });

    try {
      if (client.isLoggedIn) {
        return;
      }
    } catch (error) {
      console.log(error);
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
  async updateUser() {

    await this.state.db
      .collection("users")
      .findOne({ id: this.state.user.id })
      .then((result) => {
          this._storeData(result);

          this.setState({
            ...this.state,
            ...{ user: result },
          });
        })
      .catch((error) => console.log(error));
  }
  async componentDidMount() {

    this.refreshData();
    console.log('------------------------')
    console.log('component did mount-----')
  }
  async refreshData() {
    
    await this._loadClient();
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
      }
    } catch (error) {
      return false;
    }
  }
    
  logout() {
    this.state.client.auth.logout();
    AsyncStorage.clear();
    const { navigate } = this.props.navigation;
    navigate("GetStarted");
  }
  onActionPressed = () => {};
    
  onCashOutButtonPressed = () => {};
    
  onBalancemenuPressed = () => {};
    
  newAppointmentPressed = () => {

    //this.setState({isNewAppointShow: true})

    const { navigate } = this.props.navigation;
  
    navigate("AppointmentCreate",this.state);
    Actions.push("NewAppointment",this.state);
  };
    
  onDateD8ba22a72f905d2Pressed = () => {};
    
  startAnimationOne() {
    // Set animation initial values to all animated properties
    this.state.logomarkImageTranslateX.setValue(0);
    this.state.logomarkImageOpacity.setValue(0);
    this.state.menuImageTranslateX.setValue(0);
    this.state.menuImageOpacity.setValue(0);
  
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
    } else {
      const {navigate} = this.props.navigation;
      navigate(item, this.state);
    }
    
  }
  toggleMenu() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
    
  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  editAppointment(appt, slot) {
    console.log('editing for ' + appt.name);
    const { navigate } = this.props.navigation;

    var p = {
      ...this.state,
      ...{ appointment: appt, slot:moment(appt.date).format("YYYYMMD") + "-"+slot },
    };
    Actions.push("EditAppointment", p);
  
  }
  onDoneClick = () => {
    console.log('done with ------')
     this.state.db
      .collection("users")
      .findOne({ id: this.state.user.id })
      .then((result) => {
          this._storeData(result);

          console.log(result)
        })
      .catch((error) => console.log(error));
  }
  render() {

    var datetoken = moment(this.state.appointments.date).format("YYYYMMD");
    var appts= {};
    var cls = this;
    try {
      
    appts = this.state.user.appointments[datetoken];

    } catch(e) {

    }
   
    console.log(appts)
    const menu = (
      <Menu onItemSelected={this.onMenuItemSelected} />
    );
    const nav = (
      <NavigationEvents
        onDidFocus={() => {this.refreshData();}}
      />
    );
      return(
        <SideMenu
            style={{ backgroundColor: "black" }}
            menu={menu}
            animationFunction={(prop, value) =>
            Animated.spring(prop, {
                toValue: value,
                friction: 20,
            })
            }
            autoClosing={true}
            menuPosition={"right"}
            bounceBackOnOverdraw={false}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenuState(isOpen)}
        >
        {nav}
          <LinearGradient
            start={{
                x: 0.5,
                y: 0,
            }}
            end={{
                x: 0.5,
                y: 1,
            }}
            locations={[0, 1]}
            colors={["rgb(151, 87, 222)", "rgb(228, 181, 203)"]}
            style={styles.viewViewLinearGradient}
          >
              <SafeAreaView style={{flex:1}}>
                <View style={{flex:1}}>
                <View style={{flexDirection:'row', height:30, width:width1, marginTop:15}}>
                  <View style={{flex:1, marginLeft:20}}>
                    <Image source={require('../../assets/images/logo.png')} style={{height:40, width:40}}/>
                  </View>
                  <View style={{flex:1, alignItems:'flex-end', marginRight:20}}>
                    <TouchableOpacity
                    onPress={this.toggleMenu}
                    >
                      {/* <Image source={require('../../assets/images/000000ff@3x.png')}/> */}
                      <Image source={require('../../assets/images/menu.png')} style={{height:30, width:50}} resizeMode="contain"/>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{marginTop:5, alignItems:'flex-start', marginLeft:20}}>
                  <Text style={styles.greetingText}>
                    {this.state.user.username
                      ? "Hey, " + this.state.user.username
                      : "Welcome Back!"}
                    !
                  </Text>
                </View>
                <View pointerEvents="box-none" style={{
                  height:200,
                  width:width1-40,
                  //backgroundColor:'red',
                  marginLeft:20,
                  marginTop:10,
                 // flex:1
                }}>
                  <LinearGradient
                      start={{
                        x: 0.5,
                        y: 0,
                      }}
                      end={{
                        x: 0.5,
                        y: 1,
                      }}
                      locations={[0, 1]}
                      colors={["white", "rgb(228, 181, 203)"]}
                      style={styles.balancecardViewLinearGradient}
                    >
                      <Text style={styles.balanceLabelText}>
                        Balance
                      </Text> 
                      <TouchableOpacity
                        onPress={this.onBalancemenuPressed}
                        style={styles.balancemenuButton}
                      >
                        <Image
                          source={require("./../../assets/images/group-3.png")}
                          style={styles.balancemenuButtonImage}
                        />
                      </TouchableOpacity> 
                      <Text style={styles.balanceText}>
                        {this.state.user.balance
                          ? "$" +
                            this.state.user.balance.toFixed(2)
                          : "$0.00"}
                      </Text>
                      <TouchableOpacity
                        onPress={this.onCashOutButtonPressed}
                        style={styles.cashoutButton}
                      >
                        <Text style={styles.cashoutButtonText}>
                          Cash Out
                        </Text>
                      </TouchableOpacity>
                  </LinearGradient>

                </View>
                <View
                  pointerEvents="box-none"
                  style={{
                    width: 106,
                    
                    top: 20,
                    height: 27,
                    marginLeft: 20,
                    marginBottom: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent:'center',
                    
                  }}
                >
                  <Text style={styles.agendaText}>Agenda</Text>
                  <TouchableOpacity
                    onPress={this.newAppointmentPressed}
                    style={styles.newappointmentButton}
                  >
                    <Image
                      source={require("./../../assets/images/group-10.png")}
                      style={styles.newappointmentButtonImage}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  pointerEvents="box-none"
                  style={{
                    
                    height: 22,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent:'center',
                    marginTop:15,
                    marginLeft:22,
                    marginRight:20,

                  }}
                >
                  <Text style={styles.activedateText}>
                    {moment(
                      this.state.appointments.date
                    ).format("dddd MMMM DD, Y")}
                  </Text> 
                  <View
                    style={{
                      flex: 1,
                      textAlign: "right",
                    }}
                  />

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
                        
                        // right: 0,
                        // marginLeft: 0,
                      },
                      dateInput: {
                        display: "none",
                      },
                    }}
                    onDateChange={(dd) => {
                      this.setState({
                        ...this.state,
                        ...{ appointments: { date: dd } },
                      });
                    }}
                  />
                </View>
                
                <View style={{  flexGrow :1}}>
            {this.state.loading ? 
            <View></View>
              //  <Loader
              //    style={{ position: "absolute", bottom: "20%", width:150 }}
              //  />
             : (typeof appts !== "undefined" &&
               Object.keys(appts).length > 0 ? 
               <View style={{flex:1, marginTop:10}}>

                <FlatList
                  data={Object.keys(appts)}
                  
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ width:width1, marginTop:10, flexGrow:1}}
                  renderItem={({item}) => 
                  <TouchableOpacity onPress={() =>
                    cls.editAppointment(
                      appts[item],
                      item
                    )
                  }>
                      <View style={styles.appointmentView}>
                        <View pointerEvents="box-none"
                          style={ styles.appointmentViewInner }>
                          <View style={styles.timeTextView} >
                            <Text style={styles.timeText}>
                              {moment(
                                appts[item]["date"]
                              ).format("H:mm A")}
                            </Text>
                          </View>
                          <Text style={styles.descriptionText}>
                            {appts[item]["service"]}
                          </Text>
                          <View style={styles.dividerView} />
                        </View>
                        <Text style={styles.nameText}>
                          {appts[item].name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                }
                keyExtractor={item => item.name}
              />  
               </View>
               : (
                    <Text style={styles.noAppointments}>
                      No Appointments
                    </Text>
                  )
              )}
                </View>
                <View style={{justifyContent:'center', alignItems:'center', marginTop:10, marginBottom:10 }}>
                  <TouchableOpacity style={{height:30, width:100, backgroundColor:'rgb(187, 130, 213)', borderRadius:20, justifyContent:'center', alignItems:'center'}} onPress={() => this.setState({isNewAppointShow:true})}>
                    <Image source={require('../../assets/images/arrow.png')} style={{height:20, width:30, transform: [{ rotate: '180deg'}]}}/>
                  </TouchableOpacity>
                  
                </View>
                </View>
              </SafeAreaView>
              {this.state.isNewAppointShow?
              
                  <View style={styles.popAppoiment}> 
                  <View style={{flexDirection:'row', marginTop:15, marginLeft:20}}>
                      <Text style={styles.appointText}>New Appointment</Text>
                      <TouchableOpacity style={styles.appointCancelBTN} onPress={() => this.setState({isNewAppointShow:false})}>
                        <Text style={{color:'gray', fontSize:18}}>Cancel</Text>
                      </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.TextInputCSS}
                    placeholder="Client Name"
                  />
                  <TextInput
                    style={styles.TextInputCSS}
                    placeholder="Phone Number"
                  />
                 <TouchableOpacity style={{marginTop:20, alignSelf:'center'}} onPress={() => this.onDoneClick()}>
                    <Text style={{color:'black', fontSize:18}}>Done</Text>
                  </TouchableOpacity>
            </View>:null}
             
            </LinearGradient>
        </SideMenu>
        )
    }
}

const styles = StyleSheet.create({
    viewViewLinearGradient: {
      backgroundColor: "pink",
      flex: 1,
    },
    greetingText: {
      textTransform: "capitalize",
      color: "white",
     // fontFamily: "Poppins-Medium",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "center",
      backgroundColor: "transparent",
      marginLeft: 0,
      marginTop: 10,
    }, 
    balancecardViewLinearGradient: {
      borderRadius: 15,
      shadowColor: "rgba(0, 0, 0, 0.16)",
      shadowRadius: 6,
      shadowOpacity: 1,  
      width: width1-40,
      height: 200,
     
    },
    balanceLabelText: {
      backgroundColor: "transparent",
      color: "rgb(61, 7, 119)",
     // fontFamily: "Poppins-Medium",
      fontSize: 18,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      marginLeft:20,
      marginTop:25
    },
    balancemenuButton: {
      backgroundColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      marginTop: 14,
      alignSelf: "flex-end",
      width: 29,
      height: 6,
      position:'absolute',
      right:20,
      top:20
    },
    balancemenuButtonImage: {
      resizeMode: "contain",
    },
    balanceText: {
      color: "rgb(61, 7, 119)",
     // fontFamily: "Poppins-Medium",
      fontSize: 60,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      
      width: "100%",

      marginLeft:10
    },
    cashoutButton: {
      backgroundColor: "rgb(132, 167, 0)",
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      width: 128,
      height: 35,
      marginTop:25,
      marginLeft:20
    },
    cashoutButtonText: {
      color: "white",
      //fontFamily: "Poppins-Medium",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "center",
      textShadowColor: "rgba(0,0,0,0.1)",
      textShadowOffset: { width: 0.5, height: 1 },
      textShadowRadius: 1,
    },
    agendaText: {
      backgroundColor: "transparent",
      color: "white",
      //fontFamily: "Poppins-Medium",
      fontSize: 18,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
    },
    newappointmentButton: {
      backgroundColor: "transparent",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "rgb(241, 215, 231)",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      width: 23,
      height: 23,
      marginLeft: 11,
      //marginBottom: 4,
    },
    newappointmentButtonImage: {
      resizeMode: "contain",
    },
    newappointmentButtonText: {
      color: "black",
     // fontFamily: ".AppleSystemUIFont",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
    },
    activedateText: {
      backgroundColor: "transparent",
      color: "white",
      opacity:0.7,
      //fontFamily: "Poppins-Medium",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
    },
    calendarButtonText: {
      color: "black",
     // fontFamily: ".AppleSystemUIFont",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
    },
    calendarButton: {
      backgroundColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      width: 21,
      height: 19,
      marginBottom: 3,
    },
    calendarButtonImage: {
      resizeMode: "contain",
    },
    morebuttonButton: {
      backgroundColor: "rgb(212, 162, 206)",
      borderRadius: 15.5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      width: 128,
      height: 31,
      marginBottom: 23,
      display: "none"
    },
    morebuttonButtonImage: {
      resizeMode: "contain",
    },
    morebuttonButtonText: {
      color: "black",
      //fontFamily: ".AppleSystemUIFont",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
    },
    appointmentlistScrollView: {
      //backgroundColor: "red",
     
      marginTop:10,
      width:width1,
      height:'100%',
     
     
    },
    appointmentView: {
      backgroundColor: "rgba(228, 181, 203,0.2)",
      borderRadius: 10,
      paddingTop: 10,
      height: 80,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 15,
    },
    noAppointments: {
      color:"white",
      textAlign: "center",
      opacity: 0.5,
      //fontFamily: "Poppins-Medium",
      marginTop: "30%",
  
    },
    appointmentViewInner: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 60,
      alignItems: "flex-start",
    },
    nameText: {
      color: "white",
      //fontFamily: "Poppins-Medium",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      backgroundColor: "transparent",
      position: "absolute",
      alignSelf: "center",
      width: "100%",
      left: 115,
      marginTop: 13,
      top: 0,
    },
    timeTextView: {
      color: "rgba(255,255,255,0.9)",
      //fontFamily: "Poppins-Medium",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "center",
      backgroundColor: "rgba(228, 181, 203,0.2)",
      width: 85,
      position: "absolute",
      borderRadius: 10,
      top: 16,
      left: 15,
      padding: 15,
      borderRadius: 10,
      borderWidth: 0,
    },
    timeText: {
      color: "rgba(255,255,255,0.9)",
     // fontFamily: "Poppins-Medium",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "center",
      backgroundColor: "transparent",
      width: "100%",
      borderRadius: 10,
    },
    descriptionText: {
      color: "rgba(255,255,255,0.6)",
      //fontFamily: "Poppins-Medium",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      backgroundColor: "transparent",
      marginLeft: 115,
      marginTop: 40,
    },
    dividerView: {
      backgroundColor: "white",
      opacity: 0.15,
      alignSelf: "stretch",
      height: 1,
      marginLeft: 0,
      marginTop: 13,
      display: "none",
    },
    topView: {
      backgroundColor: "transparent",
      position: "absolute",
      alignSelf: "center",
      width: "100%",
      top: 0,
      height: "65%",
      alignItems: "flex-start",
    },
    greetingText: {
      textTransform: "capitalize",
      color: "white",
     // fontFamily: "Poppins-Medium",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "center",
      backgroundColor: "transparent",
      marginLeft: 0,
      marginTop: 20,
    },
    popAppoiment:{
      position:'absolute',
      height:300,
      width:width1,
      bottom:0,
      backgroundColor:'white',
      borderTopLeftRadius:30,
      borderTopRightRadius:30,
    },
    appointText:{
      fontSize:18,
      color:'gray'
    }, 
    appointCancelBTN:{
      position:'absolute',
      right:40,
      top:5
    },
    TextInputCSS:{
      height:40,
      backgroundColor:'#E0E0E0',
      marginTop:20,
      width:width1-50,
      marginLeft:25,
      borderRadius:20,
      textAlign:'center',
      paddingLeft:15,
      paddingRight:15,
      fontSize:17

    }
  });
  