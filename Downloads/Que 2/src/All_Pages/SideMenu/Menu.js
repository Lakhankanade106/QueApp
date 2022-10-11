import React from "react";
import PropTypes from "prop-types";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform
} from "react-native";
import {SvgXml} from 'react-native-svg'
//import Logo from "../../assets/images/logo.svg";
import LinearGradient from 'react-native-linear-gradient'
import RSIcon from '../../Style/RSIcon'
const window = Dimensions.get("window");
const styles = StyleSheet.create({
  menu: {
    flex: 1,
    fontFamily: "Poppins",
    width: window.width,
    height: window.height,
    backgroundColor: "rgb(53, 22, 88)",
    padding: 20,
    paddingLeft:'30%'
    
  },
  logoContainer: {
      marginTop:'20%',
      marginBottom:30,
      width:'100%',
      height:70,
      backgroundColor:'red'
      //height:40, width:100

  },
 
  name: {
    position: "absolute",
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 20,
    color: "white",
    fontFamily:Platform.OS == 'ios'?"Poppins-Medium":'PoppinsMedium',
    paddingTop: 25,
    marginBottom: "5%",
    
  },
  viewViewLinearGradient: {
    backgroundColor: "pink",
    flex: 1,
  },
});

export default function Menu({ onItemSelected, onPress, isHomeOpen, isMyAccountOpen,isNew_MyAccount, isSettingOpen }) {

  return (
   <View style={{flex:1, backgroundColor:'red'}}>

   
    <ScrollView scrollsToTop={false} style={styles.menu} bounces={false}>
      <TouchableOpacity style={{
        height:35,
        width:35,
        borderRadius:20,
        //borderColor:'rgb(225,180,204)',
        //borderWidth:2,
        justifyContent:'center',
        alignItems:'center',
        marginTop:15,
        //alignSelf:'flex-end',
        marginLeft:'40%'
    }} onPress={() =>  onPress()}>
         <SvgXml width="35" height="35" xml={RSIcon.IC_Close_SVG} />

      </TouchableOpacity>
      <Text style={{color:'white',fontSize:35, marginTop:'20%', marginBottom:'20%',fontFamily:Platform.OS == 'ios'?"Poppins-Medium":'PoppinsMedium',}}>Menu</Text>
      

      <Text onPress={() => onItemSelected("Home")} style={[styles.item, {color:isHomeOpen?'white':"rgb(112, 92, 140)"}]}>
        Home
      </Text>
      <Text onPress={() => onItemSelected("MyAccount")} style={[styles.item, {color:isMyAccountOpen?'white':"rgb(112, 92, 140)"}]}>
        My Account
      </Text>
      {/* <Text onPress={() => onItemSelected("New_MyAccount")} style={[styles.item, {color:isNew_MyAccount?'white':"rgb(112, 92, 140)"}]}>
        New_MyAccount
      </Text> */}
      {/* <Text onPress={() => onItemSelected("StorHours")} style={styles.item}>
        Stor Hours
      </Text> */}
      <Text onPress={() => onItemSelected("Setting")} style={[styles.item, , {color:isSettingOpen?'white':"rgb(112, 92, 140)"}]}>
        Settings
      </Text>

      {/* <Text onPress={() => onItemSelected("Support")} style={styles.item}>
        Support
      </Text> */}

      <Text onPress={() => onItemSelected("Logout")} style={[styles.item, {marginTop:70, color:"rgb(112, 92, 140)"}]}>
        Logout
      </Text>
    </ScrollView>
    
</View>

  );
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
  onPress:PropTypes.func.isRequired,
  isHomeOpen:PropTypes.bool,
  isMyAccountOpen:PropTypes.bool,
  isNew_MyAccount: PropTypes.bool,
  isSettingOpen:PropTypes.bool,
};
