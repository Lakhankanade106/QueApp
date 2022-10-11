import React,{useState} from "react"
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
    AsyncStorage,
    ScrollView,
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
        this.state = { appointment: { sms: true }, db: {}, userid:"" };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateUser = this.updateUser.bind(this);

    }

    componentDidMount() {
     // console.log('new appointment:- =====', this.props.db)
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
             // console.log('-:User Not Found:-')
          }
        }).catch((err)=> {
         // console.log('error:- ', err)
        })

        this.setState(
            { ...this.state, ...this.props.navigation.state.params },
            function () {
            this.updateUser();
            }
        );
    
    }

    updateUser() {
        var db = this.state.db;
        var users = db.collection("users");
        var a = users.findOne({ phone: this.state.userid }).then((result) => {

            this.setState({ ...this.state, ...{ user: result } });
        });
    }
    onSavePressed = () => {

        if (this.fieldsValid(this.state.appointment)) {

            //console.log(this.state.appointment)
            //lets delete the old apt
            var db = this.state.db;

            var users = db.collection("users");
            var appts = {};
            
            if (typeof this.state.user.appointments !== "undefined") {
                
              appts = this.state.user["appointments"];
            
            }
           // console.log(this.state.slot);

            var sl = this.state.slot.split("-");
           // console.log(sl);

            delete appts[sl[0]][sl[1]];


            var a = moment(this.state.appointment.date).format("YYYYMMD");
            var t = moment(this.state.appointment.date).format("HHmm");


            var day = {};

            if (typeof appts[a] !== "undefined") {
                
                day = appts[a];
            }

            if(typeof day[t] !== "undefined" && ! day[t]['phone'] == this.state.appointment.phone) {

                var c = day[t];
                var s = this.state;
                s.error = "This time conflicts with " + c.name + "'s appointment";
                this.setState(s);

                return;

            }
            day[t] = this.state.appointment;
            appts[a] = day;
            var up = { "$set": { appointments: appts }};
            
            users.updateOne({ phone: this.state.userid },up ).then(result=>console.log(result));

            
            Actions.pop({type:'refresh'})
    
        }
        return;
    };
    onCancelPressed = () => {
       // console.log("cancel pressed");
        Actions.pop()
        
    };

    onSelectDate = () => {
       // console.log('date button pressed');
        this.datePicker.onPressDate();
    }

    fieldsValid(appointment) {
       // console.log(appointment);
        var s = this.state;
        s.error = false;
        var cansubmit = true;

        if (!this.validPhoneNumber(appointment.phone)) {
            s.error = "A valid phone number is required";
            cansubmit = false;
        } else if (appointment.name.length < 2) {
            s.error = "Please enter a valid name";
            cansubmit = false;
        } else if (!appointment.date) {
            s.error = "Please choose a date and time for appointment";
            cansubmit = false;
        } else if (!appointment.service) {
            s.error = "Please enter a brief service description";
            cansubmit = false;
        }

        this.setState(s);
        return cansubmit;
    }
    roundDate(date) {
        var ROUNDING = 30 * 60 * 1000; /*ms*/
        start = moment(date);
        start = moment(Math.ceil(+start / ROUNDING) * ROUNDING);
       // console.log(start);
        return moment(date).format("YYYY-MM-DD");;
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
          <View style={RSStyle.viewFlex}>
            <ScrollView contentContainerStyle={{flexGrow:1}} style={{backgroundColor:RSColor.BackColor, borderTopRightRadius:40, borderTopLeftRadius:40,marginTop:30, paddingBottom:20}} >
              <View style={RSStyle.appointBackView}>
                <View style={RSStyle.appointHeader}>
                  <View style={RSStyle.viewFlex}>
                    <Text style={RSStyle.appointHeaderText}>Edit Appointment</Text>
                  </View>
                  <TouchableOpacity style={RSStyle.appointCloseBUtton} onPress={() => this.onCancelPressed()}>
                    <SvgXml width="35" height="35" xml={RSIcon.IC_Close_SVG} />

                      {/* <Text style={{color:'white', fontWeight:'bold'}}>X</Text> */}
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
                            paddingLeft:10
                          },
                          placeholderText:{
                            color:'white',
                            fontSize:20,
                            alignSelf:'flex-start',
                            paddingLeft:10
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
                            paddingLeft:10
                          },
                          placeholderText:{
                            color:'white',
                            fontSize:20,
                            alignSelf:'flex-start',
                            paddingLeft:10
                          }  
                        }}
                        onDateChange={(dd) => {
                          var s = this.state.appointment;
                          var n = this.roundTime(dd);
                        
                          var newDate = this.roundDate(this.state.appointment.date)
                          
                          s.date = newDate+' '+n

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
                    defaultValue={this.state.appointment.name}
                    placeholderTextColor="gray"
                    autoCorrect={false}
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
                    autoCorrect={false}
                    defaultValue={this.state.appointment.phone}
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
                    defaultValue={this.state.appointment.service}
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
                      <Text style={{fontSize:20, color:'white', }}>Save</Text>
                  </TouchableOpacity>
              </LinearGradient>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}