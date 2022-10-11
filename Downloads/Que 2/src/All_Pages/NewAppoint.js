import React,{useState} from "react"
import { Image, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    SafeAreaView,
    StatusBar,
    AsyncStorage,
    ScrollView,
    Alert,
    Switch } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import {Actions} from 'react-native-router-flux'
import DatePicker from "react-native-datepicker";
import RSStyle from '../Style/Style';
import RSColor from "../Style/RSColor";
import RSIcon from '../Style/RSIcon';
import calicon from "../../assets/images/arrow.png";
import moment from "moment";
import "moment-timezone";
import {SvgXml} from 'react-native-svg'
export default class GetStarted extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      appointment: { 
        sms: true, 
        date: new Date().now 
      }, 
      db: {} ,
      userid:'',
      user:{}
    };
    //this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
}

  UNSAFE_componentWillMount() {
    //console.log('new appointment:- =====', this.props.db)
    this.setState({db:this.props.db})
      AsyncStorage.getItem('userId').then((token) => {
           // console.log('usertoken:ihisdf:-',token)
          // var value = JSON.parse(token)
          if ((token !== null) && (token != undefined)) {
              this.setState({isLoading:false})
              this.setState({userid:token})
              this.updateUser()
          }else {
              this.setState({isLoading:false})
            //  console.log('-:User Not Found:-')
          }
        }).catch((err)=> {
         // console.log('error:- ', err)
        })
    this.setState(
        { ...this.state, ...this.props.navigation.state.params },
        
        
    );

  }
  componentWillUnmount(){
   // console.log('unmounted:------')
    Actions.refresh({key:'Home'})
  }
  updateUser() {
    var db = this.state.db;
    var users = db.collection("users");
   // console.log('---------',this.state.user.id)
    var a = users.findOne({ phone: this.state.userid }).then((result) => {
    //  console.log('result:- ', result)
        this.setState({ ...this.state, ...{ user: result } });
        });
      //  console.log(a)
  }
  onSavePressed = () => {

   // console.log('appointment:- ',this.state.user)
    if (this.fieldsValid(this.state.appointment)) {
      var db = this.state.db;

      var users = db.collection("users");
      var appts = {};
      
     // console.log("post db users");
      if(this.state.user != null){
       // console.log('if condition run')
        if ((this.state.user.appointments != undefined) && (this.state.user.appointments != null)) {
        //  console.log('user ull')
        appts = this.state.user["appointments"];

      }
      }
     
      var a = moment(this.state.appointment.date).format("YYYYMMDD");
      var t = moment(this.state.appointment.date).format("HHmm");
     // console.log('a:- '+a+' t: - ',t)
      var day = {};

      this.state.appointment['dateKey'] = a
      this.state.appointment['timeKey'] = t
      if (typeof appts[a] !== "undefined") {
        //  console.log('appts a undefined');
        day = appts[a];
      }

     // console.log('day:- ',day);
      if(typeof day[t] !== "undefined") {

        var c  = day[t];
        
        var s = this.state;
        s.error = "This time conflicts with " + c.name + "'s appointment";
        this.setState(s);
      //  console.log(s.error);

        return;

      }
      day[t] = this.state.appointment;
      appts[a] = day;
      //console.log('day:------------- ',this.state.appointment)
      var up = { "$set": { appointments: appts }};
      users.updateOne({ phone: this.state.userid },up ).then(result=>{
        //console.log('useris update:- ', result)
      }).catch((er)=> {
       // console.log('new eror:- ', er)
      });

      const { navigate } = this.props.navigation;

      //navigate("Dashboard");
      //Actions.popTo('Home',{type:'refresh'})
      setTimeout(()=> Actions.refresh({key:'Home'}), 1000) 
      Actions.refresh({ "key": "Home" })   //
      Actions.pop({ type: 'reset' })      //
      //Actions.popTo('Home', {type:'refresh'}); 
    
    }
    return;
  };
  onCancelPressed = () => {

    Actions.pop()
  };

  onSelectDate = () => {

    this.datePicker.onPressDate();
  }

  fieldsValid(appointment) {
    //console.log('appointement detilas',appointment);
   // console.log('appoitment date',this.state.appointment)
    var s = this.state;
   // console.log("fieldsValid",s)
    s.error = false;
    var cansubmit = true;

    if (!this.validPhoneNumber(appointment.phone)) {
        s.error = "A valid phone number is required";
        alert(s.error)
        cansubmit = false;
    } else if (!appointment.name) {         //appointment.name.length<2
        s.error = "Please enter a valid name";
        alert(s.error)
        cansubmit = false;
    } else if (!appointment.date) {
        s.error = "Please choose a date and time for appointment";
        alert(s.error)
        cansubmit = false;
    } else if (!appointment.service) {
        s.error = "Please enter a brief service description";
        alert(s.error)
        cansubmit = false;
    }
    

    this.setState(s);
    return cansubmit;
  }
  roundDate(date) {

    // var ROUNDING = 30 * 60 * 1000; /*ms*/
    // start = moment(date);
    // start = moment(Math.ceil(+start / ROUNDING) * ROUNDING);
    // console.log('satrt date:- ',start);
    // console.log('date:- ', date)
    // var a = moment(date).format("YYYYMMD");
    // var t = moment(date).format("HHmm");
    // console.log('a:- '+a+' t: - ',t)
    return moment(date).format("YYYY-MM-DD");
  }
  roundTime(date) {
  
   // console.log(date);
    return date;
  }
  validPhoneNumber(inputtxt) {
    var phoneno = /^\d{10}$/;
    if (typeof inputtxt == "undefined") {
        return false;
    }
    if (inputtxt.match(phoneno)) {
        
        return true;
    } else {

        return false;
    }
  } 
  render() {
    
    return(
        
      <SafeAreaView style={RSStyle.viewFlex}>
        <StatusBar barStyle="dark-content"/>
        <View style={[RSStyle.viewFlex,{marginTop:30}]}>
          <ScrollView contentContainerStyle={{flexGrow:1}} style={{backgroundColor:RSColor.BackColor, borderTopRightRadius:40, borderTopLeftRadius:40}} >
            <View style={RSStyle.appointBackView}>
              <View style={RSStyle.appointHeader}>
                <View style={RSStyle.viewFlex}>
                  <Text style={RSStyle.appointHeaderText}>New Appointment</Text>
                </View>
                <TouchableOpacity style={RSStyle.appointCloseBUtton} onPress={() => this.onCancelPressed()}>
                  <SvgXml width="35" height="35" xml={RSIcon.IC_Close_SVG} />

                </TouchableOpacity>
              </View>
              <View style={RSStyle.appointFieldView}>
                <View style={RSStyle.viewFlexDirectionRow}>
                    <View style={RSStyle.viewFlex}> 
                      <Text style={RSStyle.appointPlaceHolder}>Date</Text>
                      <DatePicker
                        style={{ width: "auto", 
                        marginTop:10,
                        borderRadius:10 }}
                        iconSource={calicon}
                        minDate={new Date()}
                        mode="date"
                        placeholder={moment(this.state.appointment.date).format("MMM-DD")}
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        ref={(datePicker) => (this.datePicker = datePicker)}
                        customStyles={{
                            dateIcon: {
                              width: 21,
                              height: 19,
                              position: "absolute",
                              
                              right: 30,
                            
                              marginLeft: 0,
                            },
                            dateInput: {
                              display: "flex",
                                borderRadius:10,
                                height:50,
                                marginRight:20

                            },
                            dateText:{
                              color:'white',
                              fontSize:20,
                              alignSelf:'flex-start',
                              paddingLeft:10,
                              fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'
                            },
                            placeholderText:{
                              color:'white',
                              fontSize:20,
                              alignSelf:'flex-start',
                              paddingLeft:10,
                              fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'
                            }
                        }}
                        onDateChange={(dd) => {
                            var s = this.state.appointment;
                
                            var n = this.roundDate(dd);

                            s.date = n;

                            this.setState({
                            ...this.state,
                            ...{ appointment: s },
                            });
                        }}
                        />
                    </View>
                    <View style={RSStyle.viewFlex}> 
                      <Text style={RSStyle.appointPlaceHolder}>Time</Text>
                      <DatePicker
                        style={{ width: "auto", 
                        marginTop:10,
                        borderRadius:10 }}
                    
                        minDate={new Date()}
                        mode="time"
                        placeholder={moment(this.state.appointment.date).format("hh:mm A")}
                        iconSource={calicon}
                        format="HH:mm"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        ref={(datePicker) => (this.datePicker = datePicker)}
                        customStyles={{
                            dateIcon: {
                              width: 21,
                              height: 19,
                              position: "absolute",
                              right:10
                            },
                            dateInput: {
                              display: "flex",
                                borderRadius:10,
                                height:50,
                            },
                            dateText:{
                              color:'white',
                              fontSize:20,
                              alignSelf:'flex-start',
                              paddingLeft:10,
                              fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'
                            },
                            placeholderText:{
                              color:'white',
                              fontSize:20,
                              alignSelf:'flex-start',
                              paddingLeft:10,
                              fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'
                            }
                            
                        }}
                        onDateChange={(dd) => {
                            var s = this.state.appointment;
                            var n = this.roundTime(dd);
                            s.date = this.roundDate(this.state.appointment.date) +' '+ n;
                            console.log(s)
                            this.setState({
                            ...this.state,
                            ...{ appointment: s },
                            });
                        }}
                        />
                    </View>
                </View>
                <Text style={RSStyle.appointPlaceHolder}>Client Name</Text>
                <TextInput
                  placeholder="Howard Gordon"
                  placeholderTextColor="gray"
                  autoCorrect={true}
                  style={RSStyle.appointInput}
                  onChangeText={(value) => {
                    var s = this.state.appointment;
                    s.name = value;
                    this.setState({
                    ...this.state,
                    ...{ appointment: s },
                    });
                }}
                />
                <Text style={RSStyle.appointPlaceHolder}>Phone Number</Text>
                <TextInput
                  placeholder="179-046-0896"
                  placeholderTextColor="gray"
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  style={RSStyle.appointInput}
                  onChangeText={(value) => {
                    var s = this.state.appointment;
                    s.phone = value;
                    this.setState({
                    ...this.state,
                    ...{ appointment: s },
                    });
                }}
                />
                <Text style={RSStyle.appointPlaceHolder}>Description of services</Text>
                <TextInput
                  autoCorrect={false}
                  style={RSStyle.appointInput}
                  onChangeText={(value) => {
                    var s = this.state.appointment;
                    s.service = value;
                    this.setState({
                    ...this.state,
                    ...{ appointment: s },
                    });
                }}
                />
                <View style={RSStyle.viewFlexDirectionRow}>
                  <View style={RSStyle.viewFlex}>
                    <Text style={RSStyle.appointPlaceHolder}>Send Text Message for deposite?</Text>
                  </View>
                  <View style={[RSStyle.viewFlex, RSStyle.viewFlexDirectionRow, {justifyContent:'flex-end', paddingRight:10}]}>
                    <Text style={[RSStyle.appointPlaceHolder, {color:this.state.appointment.sms?'gray':'white'}]}>No</Text>
                    <Switch
                      trackColor={{ false: "white", true: "rgb(151, 87, 222)" }}
                      thumbColor={'white'}
                      ios_backgroundColor="#3e3e3e"
                      value={this.state.appointment.sms}
                      onValueChange={(value) => {
                        var s = this.state.appointment;
                        s.sms = value;
                        this.setState({
                            ...this.state,
                            ...{ appointment: s },
                        });
                        }}
                      style={RSStyle.appointSwitch}
                    />
                    <Text style={[RSStyle.appointPlaceHolder, {color:this.state.appointment.sms?'white':'gray'}]}>Yes</Text>
                  </View>
                </View>

                
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
                    style={RSStyle.appointSaveButton}
                >
                  <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => this.onSavePressed()}>
                      <Text style={{fontSize:20, color:'white', fontWeight:'bold', fontFamily:'Poppins'}}>Save</Text>
                  </TouchableOpacity>
              </LinearGradient>
            </View>
            
          </ScrollView>
          </View>
      </SafeAreaView>

    )
  }
}