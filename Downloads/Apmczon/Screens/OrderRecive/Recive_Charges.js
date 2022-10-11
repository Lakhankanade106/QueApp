import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import api from '../Config/api'
 import Storage from '../Config/Storage'
export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            Received_Data:'',
            ErrorShow:'',
            Activity:false
        }
    }
    displayData = async ()=>{  
        console.log('chalaaa')
        try{  
          let user = await AsyncStorage.getItem('user');  
          let UserID = await AsyncStorage.getItem('UserID');  
          //console.log('useriddddd',UserID)
          
          this.setState({UserID:UserID})
          this.getData()
          
          //console.log('user',user)
          //alert(user);  
        }  
        catch(error){  
          alert(error)  
        }  
      }  
    componentDidMount(){
        this.displayData()
    }

    getData(){
        console.log('user id ',this.props.itemData.order_no)
        let url= api.baseURL;
          fetch( url+'wb/after_signature_final_payment', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json',
             },
             body:JSON.stringify({user_id:this.state.UserID,order_no:this.props.itemData.order_no})
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("responsessss: " + JSON.stringify(responseData));
              if(responseData.status=='200'){
                this.setState({Received_Data:responseData.data[0]})
              }
              else{
                this.setState({ErrorShow:responseData.message})
              }
              })
             .catch((err) => { console.log(err); });
      }
      Pay_Submit(){
          this.setState({Activity:true})
          this.setState({ErrorShow:''})
        let url= api.baseURL;
        fetch( url+'wb/add_signature', {
           method: 'POST',
           headers: { 
           'Accept': 'application/json', 
           'Content-Type': 'application/json',
           },
           body:JSON.stringify({user_id:this.state.UserID,order_no:this.state.Received_Data.order_no})
         }).then((response) => response.json())
           .then((responseData) =>
            { console.log("responsessss: " + JSON.stringify(responseData));
            this.setState({Activity:false})
            if(responseData.status=='200'){
              //this.setState({Received_Data:responseData.data[0]})
              this.props.navigation.pop()
            }
            else{
              this.setState({ErrorShow:responseData.message})
            }
            })
           .catch((err) => { console.log(err); });
      }
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={{width:'90%',alignSelf:'center',flex:1}}>
                    <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                        <TouchableOpacity style={{width:25,height:20}} onPress={()=>this.props.navigation.pop()}>
                            <Image style={{width:25,height:20}}
                                source={require('../../Images/Digital__Design_99-512.png')} />
                        </TouchableOpacity>
                        <View style={{alignItems:'center',width:'80%'}}>
                            <Text style={{fontSize:16,fontWeight:'bold'}}>Received Charges</Text>
                        </View>
                    </View>
                    <Text style={[styles.HederText,{marginTop:20}]}>Order No.</Text>
                    <View style={styles.TextView}>
                        <Text style={styles.StyleText}>{this.state.Received_Data.order_no}</Text>
                    </View>
                    <Text style={styles.HederText}>Broker Charge</Text>
                    <View style={styles.TextView}>
                        <Text style={styles.StyleText}>{this.state.Received_Data.broker_fee} Rs.</Text>
                    </View>
                    <Text style={styles.HederText}>Transporter Charge</Text>
                    <View style={styles.TextView}>
                        <Text style={styles.StyleText}>{this.state.Received_Data.transporter_fee} Rs.</Text>
                    </View>
                    <Text style={styles.HederText}>Total amount</Text>
                    <View style={styles.TextView}>
                        <Text style={styles.StyleText}>{this.state.Received_Data.total} Rs.</Text>
                    </View>
                    {this.state.Activity?
                    <ActivityIndicator style={{marginTop:10}} size="large" color="#00ff00" />
                    :<Text style={{fontSize:14,marginTop:10,color:'red',fontWeight:'600',alignSelf:'center'}}>{this.state.ErrorShow}</Text>}
                    <View style={{marginTop:30}}>
                        <TouchableOpacity style={{width:'60%',backgroundColor:'green',borderRadius:5,height:40,borderWidth:1,justifyContent:'center',alignItems:'center'}}
                            onPress={()=>this.Pay_Submit()} >
                            <Text style={{fontSize:16,color:'white',fontWeight:'bold'}}>Pay & Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    TextView:{width:'100%',
    height:40,
    borderWidth:1,
    justifyContent:'center',
    marginTop:5,
    borderRadius:8
},
StyleText:{
    marginLeft:10
},
HederText:{marginTop:15,fontSize:16,fontWeight:'600'}
    
  });