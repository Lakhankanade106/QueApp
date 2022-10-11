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
import { Actions } from 'react-native-router-flux';
import api from '../Config/api'
//import Storage from '../Screens/Config/Storage'

export default class app extends Component{
    constructor(props){
        super(props)
        this.state={
            UserID:'',
            CartList:[],
            CartListTotal:[],
            ErrorShow:'',
            Activity:false
        }
    }
    displayData = async ()=>{  
        console.log('chalaaa')
        try{  
          let user = await AsyncStorage.getItem('user');  
          let UserID = await AsyncStorage.getItem('UserID');
          this.setState({UserID:UserID}) 
          this.getDataFun() 
         // console.log('useriddddd',UserID)
          
          
          
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
      getDataFun(){
        console.log('View order number',this.props.order_no)
        console.log('Vendor id ',this.props.vendor_id)
        console.log('user id ',this.state.UserID)
        let url= api.baseURL;
        fetch( url+'wb/order_product_details', {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        //'Content-Length': data.length 
        },
        body:JSON.stringify({user_id:this.state.UserID,order_no:this.props.order_no,other_id:this.props.vendor_id})
      }).then((response) => response.json())
        .then((responseData) =>
         { console.log("responseseafadsjflaksfasdlkfj: " + JSON.stringify(responseData));
         if(responseData.status=='200'){
           this.setState({CartList:responseData.data})
           this.setState({CartListTotal:responseData.total})
         }
         
         })
        .catch((err) => { console.log(err); });
      }
    

    render(){
      console.log('responce dataaaaaa',typeof(this.state.CartList))
        return(
            <SafeAreaView>
                <ScrollView>
                <View style={{flex:1}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                <View style={{alignSelf:'center',width:'100%'}}>
                    <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                        <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.pop()}>
                             <Image style={{width:25,height:20}}
                                source={require('../../Images/Digital__Design_99-512.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',width:'100%',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                        <Text style={styles.Header_Text}>Image</Text>
                        <Text style={[styles.Header_Text,{width:80}]}>Product</Text>
                        <Text style={styles.Header_Text}>Price</Text>
                        <Text style={styles.Header_Text}>Quantity</Text>
                        <Text style={styles.Header_Text}>Amount</Text>
                        {/* <Text style={styles.Header_Text}>Remove</Text> */}
                        <Text style={styles.Header_Text}>GST</Text>
                        <Text style={styles.Header_Text}>GST Amt</Text>
                        <Text style={styles.Header_Text}>Total</Text>
                    </View>
                    <FlatList 
                        data={this.state.CartList}
                        renderItem={({item})=>
                        <View style={{flexDirection:'row',marginTop:5,alignItems:'center',justifyContent:'space-around'}}>
                            <View style={styles.itemStyle}>
                            <Image style={{width:50,height:50}}
                                //source={require('../Images/IndiaFlag.png')}
                                source={{uri:item.images[0].image}}
                                 />
                            </View>
                            <Text style={[styles.itemStyle,{width:80}]}>{item.title}</Text>
                            <Text style={styles.itemStyle}>{item.price}</Text>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',alignSelf:'center',alignItems:'center'}}>
                                <Text style={{marginLeft:5,fontSize:14}}>{item.qty}</Text>
                            </View>
                            <Text style={styles.itemStyle}>{item.price}</Text>
                           
                            <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                                <Text style={styles.itemStyle}>{item.gst}</Text>
                            </View>
                            <Text style={styles.itemStyle}>{item.gst_amt}</Text>
                            <Text>{item.total}</Text>
                        </View>} />
                </View>
                </ScrollView>
                {this.state.CartList == ''?
                <View style={{marginTop:40,alignSelf:'center'}}>
                  <Text style={{fontSize:16,fontWeight:'bold'}}>Data is not Found</Text>
                </View>
                :null}
                {this.state.CartList != ''?
                <View>
                     <View style={{width:'60%',marginTop:40,marginRight:20,alignSelf:'flex-end'}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={styles.AllBox}>
                                <Text style={styles.BoxText}>Broker Fees</Text>
                            </View>
                            <View style={styles.AllBox}>
                                <Text style={styles.BoxText}>{this.state.CartListTotal.broker_fees}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={styles.AllBox}>
                                <Text style={styles.BoxText}>Transporter Fees</Text>
                            </View>
                        <View style={styles.AllBox}>
                            <Text style={styles.BoxText}>{this.state.CartListTotal.transporter_fees}</Text>
                        </View>
                    </View>
                    </View>

                  <View style={{width:'60%',marginTop:40,marginRight:20,alignSelf:'flex-end'}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={styles.AllBox}>
                          <Text style={styles.BoxText}>Subtotal</Text>
                        </View>
                        <View style={styles.AllBox}>
                            <Text style={styles.BoxText}>{this.state.CartListTotal.subtotal}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={styles.AllBox}>
                          <Text style={styles.BoxText}>GST</Text>
                        </View>
                        <View style={styles.AllBox}>
                            <Text style={styles.BoxText}>{this.state.CartListTotal.totalgst_amt}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={styles.AllBox}>
                          <Text style={styles.BoxText}>Grand Total</Text>
                        </View>
                        <View style={styles.AllBox}>
                            <Text style={styles.BoxText}>{this.state.CartListTotal.grandtotal}</Text>
                        </View>
                    </View>
                </View>
                
                <Text style={{color:'red',fontSize:15,alignSelf:'center',marginTop:10}}>{this.state.ErrorShow}</Text>
                {this.state.Activity?
                <ActivityIndicator size="large" color="#00ff00" />
                :null}
                {/* <View style={{alignSelf:'flex-end',marginTop:20,marginRight:15}}>
                    <TouchableOpacity style={{backgroundColor:'red',padding:10}} onPress={()=>this.CheckOuteFun()}>
                        <Text style={{color:'white'}}>CHECKOUT</Text>
                    </TouchableOpacity>
                </View> */}
                </View>
                :null}
                
            </View>
            </ScrollView>
        </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    Header_Text:{
      fontSize:16,
      fontWeight:'500',
      color:'#424949',
      marginLeft:20,
      marginRight:10
    },
    itemStyle:{
        //marginLeft:20,
        //marginRight:10
        alignSelf:'center',
        justifyContent:'center',
    },
    Font_Text:{
      fontSize:18,
      color:'#707B7C'
    },
    ButtonView:{
      width:70,
      borderRadius:15,
      height:40,
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'center'
    },
    AllBox:{
        borderWidth:1,width:'50%',height:40,alignSelf:'center',justifyContent:'center'
    },
    BoxText:{
        marginLeft:5
    }
    // Button_View:{
    //   justifyContent:'center',
    //   alignItems:'center',
    //   alignSelf:'center',
    //   borderBottomWidth:1
    // },
    
  });