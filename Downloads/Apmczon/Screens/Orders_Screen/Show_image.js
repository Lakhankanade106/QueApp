import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

export default class extends Component{
    constructor(props){
        super(props)
        this.state={
          //  Signatur_image:'https://apmczon.in/upload/signature/20210625113600_865461773.jpg'
        }
    }
    componentDidMount(){
       // this.setState({})
    }
    render(){
        console.log(this.props.navigation.state.params)
        return(
            <SafeAreaView>
                <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                    <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>this.props.navigation.pop()}>
                        <Image style={{width:25,height:20}}
                            source={require('../../Images/Digital__Design_99-512.png')} />
                    </TouchableOpacity>
                    <View style={{alignItems:'center',width:'80%'}}>
                        <Text style={{fontSize:16,fontWeight:'bold'}}>Signature </Text>
                    </View>
                </View>
                <View style={{}}>
                    <Image style={{alignSelf:'center',width:'90%',height:'90%'}}
                       source={{uri:this.props.navigation.state.params}}
                    />
                </View>
            </SafeAreaView>
        )
    }
}