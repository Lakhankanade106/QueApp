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
  ActivityIndicator,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from './Config/api'
import Storage from '../Screens/Config/Storage'

export default class app extends Component{
    constructor(props){
        super(props)
        this.state={
            TrangectionArry:[1,2],
            BrokerArray:[],
            TranspoterArray:[],
            Broker:'Select Broker Type',
            Transpoter:'Select Transpoter Type',
            UserID:'',
            BrokerId:'',
            TranspotId:'',
            CartList:[],
            CartListTotal:[],
            Qty:'',
            QtyItem:'',
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
        let url= api.baseURL;
        fetch( url+'wb/mycart', {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
        //'Content-Length': data.length 
        },
        body:JSON.stringify({user_id:this.state.UserID})
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
    TransporterDropdonw(){
        console.log('User Id',this.state.UserID)
        this.setState({BrokerArray:[]})
        let url= api.baseURL;
         fetch( url+'wb/mytransporter', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            this.setState({TranspoterArray:responseData.data})
          }
          
          })
         .catch((err) => { console.log(err); });
        
       
    }
    BrokerDropDown(){
        this.setState({TranspoterArray:[]})
        console.log('User Id',this.state.UserID)
        let url= api.baseURL;
         fetch( url+'wb/mybroker', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            this.setState({BrokerArray:responseData.data})
           
          }
          
          })
         .catch((err) => { console.log(err); });
        
        
    }
    SalectBroker(item){
        console.log("selectedddd",item.company_name)
        this.setState({BrokerId:item.broker_id})
        this.setState({Broker:item.firstname+' '+item.lastname})
        this.setState({BrokerArray:[]})
    }
    SelectTransporter(item){
      console.log('Transporter ',item)
        this.setState({Transpoter:item.firstname+' '+item.lastname})
        this.setState({TranspotId:item.transporter_id})
        this.setState({TranspoterArray:[]})
    }
    CheckOuteFun(){
        let url= api.baseURL;
        this.setState({Activity:true})
        this.setState({ErrorShow:''})
         fetch( url+'wb/checkout', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID,broker_id:this.state.BrokerId,transporter_id:this.state.TranspotId})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Check out: " + JSON.stringify(responseData));
          this.setState({Activity:false})
          if(responseData.status=='200'){
            //this.setState({BrokerArray:responseData.data})
           Actions.MyOrders()
          }
          else{
            this.setState({ErrorShow:responseData.message})
          }
          
          })
         .catch((err) => { console.log(err); });
    }

    UpdateQuti(text,item){
      //this.setState({Qty:text,QtyItem:item})
      console.log('texttt and item',text,item)
      let url= api.baseURL;
         fetch( url+'wb/update_cart', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID,p_id:item.p_id,qty:text})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({BrokerArray:responseData.data})
            this.componentDidMount()
           
          }
          
          })
         .catch((err) => { console.log(err); });
    }

    createTwoButtonAlert  (item){
    Alert.alert(
      "Alert",
      "Are you sure you want to Remove Item",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.DeletProduct(item) }
      ]
    );}

    DeletProduct(item){
      console.log('itemmmssss',item)
      let url= api.baseURL;
         fetch( url+'wb/delete_cart', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID,p_id:item.p_id})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({BrokerArray:responseData.data})
            this.componentDidMount()
           
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
                    <View style={{flexDirection:'row',width:'100%',borderWidth:0.5,paddingBottom:10,paddingTop:10,marginTop:15,justifyContent:'space-around'}}>
                        <Text style={styles.Header_Text}>Image</Text>
                        <Text style={[styles.Header_Text,{width:80}]}>Product</Text>
                        <Text style={styles.Header_Text}>Price</Text>
                        <Text style={styles.Header_Text}>Quantity</Text>
                        <Text style={styles.Header_Text}>Amount</Text>
                        <Text style={styles.Header_Text}>Remove</Text>
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
                                <TextInput style={{borderWidth:1,width:40,height:30,padding:2,alignSelf:'center'}}
                                    placeholder=''
                                    defaultValue={item.qty}
                                    onChangeText={(text)=>this.UpdateQuti(text,item)} />
                                <Text style={{marginLeft:5,fontSize:14}}>{item.qty_type} ({item.weight})</Text>
                            </View>
                            <Text style={styles.itemStyle}>{item.price}</Text>
                            <TouchableOpacity style={{borderWidth:1,padding:5,backgroundColor:'red',alignSelf:'center',justifyContent:'center',alignItems:'center'}} onPress={()=>this.createTwoButtonAlert(item)}>
                                <Text style={{color:'white',alignItems:'center',alignSelf:'center',justifyContent:'center'}}>Remove</Text>
                            </TouchableOpacity>
                            <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                                {/* <TextInputgst
                                    placeholder='0%'
                                    onChangeText={()=>this.setState({})} /> */}
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
                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
                    <View style={{width:'45%'}}>
                        <Text>Select Broker</Text>
                        <TouchableOpacity style={{borderWidth:1,borderRadius:5,marginTop:8,height:30,alignItems:'center',justifyContent:'center'}}
                            onPress={()=>this.BrokerDropDown()}  >
                            <Text>{this.state.Broker}</Text>
                        </TouchableOpacity>
                        <View style={{}}>
                             <FlatList 
                                data={this.state.BrokerArray}
                                renderItem={({item})=>
                                <View style={{}}>
                                    <TouchableOpacity style={{borderWidth:1,marginTop:5,padding:5,borderRadius:5}}
                                        onPress={()=>this.SalectBroker(item)}  >
                                        <Text>{item.firstname+' '+item.lastname}</Text>
                                   </TouchableOpacity>
                                </View>  }  />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text>Select Transporter</Text>
                        <TouchableOpacity style={{borderWidth:1,borderRadius:5,marginTop:8,height:30,alignItems:'center',justifyContent:'center'}}
                            onPress={()=>this.TransporterDropdonw()} >
                            <Text>{this.state.Transpoter}</Text>
                        </TouchableOpacity>
                        <View style={{}}>
                             <FlatList 
                                data={this.state.TranspoterArray}
                                renderItem={({item})=>
                                <View style={{}}>
                                    <TouchableOpacity style={{borderWidth:1,marginTop:5,padding:5,borderRadius:5}}
                                        onPress={()=>this.SelectTransporter(item)} >
                                        <Text>{item.firstname+' '+item.lastname}</Text>
                                   </TouchableOpacity>
                                </View>  }  />
                        </View>
                    </View>
                </View>
                <Text style={{color:'red',fontSize:15,alignSelf:'center',marginTop:10}}>{this.state.ErrorShow}</Text>
                {this.state.Activity?
                <ActivityIndicator size="large" color="#00ff00" />
                :null}
                <View style={{alignSelf:'flex-end',marginTop:20,marginRight:15}}>
                    <TouchableOpacity style={{backgroundColor:'red',padding:10}} onPress={()=>this.CheckOuteFun()}>
                        <Text style={{color:'white'}}>CHECKOUT</Text>
                    </TouchableOpacity>
                </View>
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