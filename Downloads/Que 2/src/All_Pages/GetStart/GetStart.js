import React from "react"
import { Image, 
    Animated,
    Dimensions,
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    SafeAreaView,
    StatusBar,
    AsyncStorage,
    ImageBackground,
    Platform } from "react-native"
import LinearGradient1 from 'react-native-linear-gradient'
import {Actions} from 'react-native-router-flux'

import RSStyle from '../../Style/Style'
import RSIcon from '../../Style/RSIcon'
import Svg ,{Path, Stop, LinearGradient, SvgXml} from 'react-native-svg';
export default class GetStarted extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
        }
    }
   
    render() {
       // const Logo = require('../../../assets/images/logomark-pink.svg')
        return(
            <View style={RSStyle.backgroundView}>
                <SafeAreaView style={{flex:1}}>
                    <StatusBar barStyle="light-content"/>
                    <View style={[RSStyle.logoMargin]}>
                    
                        {/* <Image source={RSIcon.IC_logo} style={{height:100, width:100}} resizeMode="contain"/> */}
                        <SvgXml width="100" height="100" xml={RSIcon.IC_Logo_SVG} />

                        <Image source={RSIcon.IC_appName} style={{height:70, width:200, marginTop:10}} resizeMode="contain"/>
                    </View>
                    <Text style={[RSStyle.textSlogn,{marginTop:40}]}>The Best Appointment</Text>
                    <Text style={[RSStyle.textSlogn,{marginTop:5}]}>Setting Experience Ever</Text>
                    <LinearGradient1
                        start={{
                            x: 0,
                            y: 0.7,
                        }}
                        end={{
                            x: 0.8,
                            y: 0.8,
                        }}
                        locations={[0.3, 1]}
                        colors={["rgb(154, 90, 221)", "rgb(228, 181, 203)"]}
                        style={[RSStyle.startButton,{position:'absolute', bottom:5}]}>
                        <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => Actions.Login()}>
                            <Text style={{fontSize:20, color:'white',  fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium',}}>Get Started</Text>
                        </TouchableOpacity>
                    </LinearGradient1>
                </SafeAreaView>
            </View>
        )
    }
}