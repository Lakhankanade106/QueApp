import React from "react"
import { Image, 

    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    SafeAreaView,
    StatusBar,
    AsyncStorage } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import {Actions} from 'react-native-router-flux'
import {
    Stitch,
    RemoteMongoClient,
    UserPasswordCredential,
    AnonymousCredential,
    UserPasswordAuthProviderClient,
    
  } from "mongodb-stitch-react-native-sdk";

import RSStyle from '../../Style/Style'
import RSColor from "../../Style/RSColor";
import RSIcon from '../../Style/RSIcon'

const appId = "que-eblub";
export default class GetStarted extends React.Component {
    static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
        header: null,
        headerLeft: null,
        headerRight: null,
    };
    };

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            client:''
        };
        
    }
        
    render() {
        return(
            <View style={RSStyle.backgroundView}>
                <SafeAreaView style={{flex:1}}>
                    <StatusBar barStyle="light-content"/>
                    <TouchableOpacity style={RSStyle.backButton} onPress={() => Actions.pop()}>
                    <Image source={RSIcon.IC_left} style={{height:30, width:40, tintColor:'white'}} resizeMode="contain"/>

                    </TouchableOpacity>
                    <View style={[RSStyle.logoMargin, {marginTop:'20%'}]}>
                        <Image source={RSIcon.IC_logo} style={{height:60, width:60}} resizeMode="contain"/>
                       
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={[RSStyle.textSlogn, {color:'white', fontSize:25, }]}>Enter a Username</Text>
                        <Text style={RSStyle.textSlogn}>Make it easy for your clients to</Text>
                        <Text style={[RSStyle.textSlogn, {marginTop:3}]}>remember, as they'll use this to</Text>
                        <Text style={[RSStyle.textSlogn, , {marginTop:3}]}>book you.</Text>
                    </View>
                    
                    <TextInput 
                        placeholder="Username"
                        placeholderTextColor="rgba(151, 87, 222, 0.5)"
                        style={RSStyle.inputPhone}
                        ref="phone_number"
                        onChangeText={(text) => {
                            var s = this.state;
                            s.phone = text;
                            this.setState(s);
                        }}
                        autoCorrect={false}
                    />
                     {this.state.error ? (
                        <Text style={RSStyle.errorText}>
                            {this.state.error}
                        </Text>
                        ) : null}
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
                        style={RSStyle.startButton}
                    >
                        <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => Actions.push('Home')}>
                            <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>Save</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </SafeAreaView>
                
            </View>
        )
    }
}