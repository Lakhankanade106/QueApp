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

export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            DriverArray:[],
            Driver_name:'Select Driver',
            Driver_id:'',
            VehicleArray:[],
           // vehicle_name:'Select Vehicle',
            vehicle_no:'Select Vehicle',
            ProductView:{},
            UserID:'',
            Trans_Fee:'',
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
          this.GetProductList()
          
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

    GetProductList(){
        console.log('order number',this.props.items_data)
        let url= api.baseURL;
          fetch( url+'wb/get_left_order_by_transport_details', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json',
             },
             body:JSON.stringify({vendor_id:this.props.items_data.vendor_id,transporter_id:this.state.UserID,order_no:this.props.items_data.order_no})
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("responsessss: " + JSON.stringify(responseData));
              if(responseData.status=='200'){
                this.setState({ProductView:responseData.data[0]})
              }
              
              })
             .catch((err) => { console.log(err); });
      }
      Vehicle_Fun_Api(){
        console.log('order number',this.state.UserID)
        let url= api.baseURL;
          fetch( url+'wb/vehicle_list', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json',
             },
             body:JSON.stringify({user_id:this.state.UserID,order_no:this.props.order_no})
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("responsessss: " + JSON.stringify(responseData));
              if(responseData.status=='200'){
                this.setState({VehicleArray:responseData.data})
              }
              
              })
             .catch((err) => { console.log(err); });
      }

      Select_Vehicle_Fun(item){
          console.log('vehicle item',item)
          this.setState({VehicleArray:[]})
          this.setState({vehicle_no:item.vehicle_no})
          this.setState({vehicle_no:item.vehicle_no})
      }
     
      Driver_Fun_Api(){
        
        let url= api.baseURL;
          fetch( url+'wb/get_staff_list', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json',
             },
             body:JSON.stringify({user_id:this.state.UserID})
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("responsessss: " + JSON.stringify(responseData));
              if(responseData.status=='200'){
                this.setState({DriverArray:responseData.data})
              }
              
              })
             .catch((err) => { console.log(err); });
      }

      Select_Driver(item){
          console.log('driver items',item)
          this.setState({DriverArray:[]})
          this.setState({Driver_name:item.firstname+' '+item.lastname})
          this.setState({Driver_id:item.id})
          
      }

      SubmitProcess(){
          this.setState({Activity:true})
          this.setState({ErrorShow:''})
        let url= api.baseURL;
          fetch( url+'wb/left_order_by_transport', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json',
             },
             body:JSON.stringify({
                vehicle_no:this.state.vehicle_no,
                transporter_fee:this.state.Trans_Fee,
                vendor_id:this.props.items_data.vendor_id,
                order_no:this.state.ProductView.order_no,
                transporter_id:this.state.UserID,//user id
                driver_id:this.state.Driver_id})
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("responsessss: " + JSON.stringify(responseData));
              this.setState({Activity:false})
              if(responseData.status=='200'){
                //this.setState({ProductView:responseData.data})
                this.componentDidMount()
                this.props.navigation.navigate('Orders')
              }
              else{
                  this.setState({ErrorShow:responseData.message})
              }
              
              })
             .catch((err) => { console.log(err); });
      }
    render(){
       // console.log('View More Api ',this.state.ProductView)
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={{flexDirection:'row',width:'100%',marginTop:10}}>
                    <TouchableOpacity style={{width:25,height:20,marginLeft:20}} onPress={()=>Actions.pop()}>
                        <Image style={{width:25,height:20}}
                            source={require('../../Images/Digital__Design_99-512.png')} />
                    </TouchableOpacity>
                    {/* <View style={{alignItems:'center',width:'80%'}}>
                        <Text style={{fontSize:16,fontWeight:'bold'}}>Add Staff Details</Text>
                    </View> */}
                </View>
                <ScrollView>
                    <View style={{marginLeft:20,flex:1,marginTop:10}}>
                        <Text style={styles.HeaderText}>Order Number</Text>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.TextStyle}>{this.state.ProductView.order_no}</Text>
                        </View>
                        <Text style={styles.HeaderText}>Delevered To Name</Text>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.TextStyle}>{this.state.ProductView.delivered_to_name}</Text>
                        </View>
                        <Text style={styles.HeaderText}>Address</Text>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.TextStyle}>{this.state.ProductView.address}</Text>
                        </View>
                        <Text style={styles.HeaderText}>City</Text>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.TextStyle}>{this.state.ProductView.city}</Text>
                        </View>
                        <Text style={styles.HeaderText}>State</Text>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.TextStyle}>{this.state.ProductView.state}</Text>
                        </View>
                        <Text style={styles.HeaderText}>Mobile Number</Text>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.TextStyle}>{this.state.ProductView.mobile}</Text>
                        </View>
                        <Text style={styles.HeaderText}>Email</Text>
                        <View style={styles.ViewStyle}>
                            <Text style={styles.TextStyle}>{this.state.ProductView.email}</Text>
                        </View>
                        <Text style={styles.HeaderText}>Vehicle</Text>
                        <TouchableOpacity style={[styles.ViewStyle,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]} onPress={()=>this.Vehicle_Fun_Api()}>
                            <Text style={styles.TextStyle}>{this.state.vehicle_no}</Text>
                            <Image style={{width:12,height:10,marginRight:10}}
                               source={require('../Menu_images/Drop_Down-512.png')}
                            />
                        </TouchableOpacity>
                        <View>
                            <FlatList
                                data={this.state.VehicleArray}
                                renderItem={({item})=>
                                <View>
                                    <TouchableOpacity style={styles.DropView} onPress={()=>this.Select_Vehicle_Fun(item)}>
                                        <Text>{item.vehicle_no}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            />
                        </View>
                        <Text style={styles.HeaderText}>Driver</Text>
                        <TouchableOpacity style={[styles.ViewStyle,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}
                            onPress={()=>this.Driver_Fun_Api()} >
                            <Text style={styles.TextStyle}>{this.state.Driver_name}</Text>
                            <Image style={{width:12,height:10,marginRight:10}}
                               source={require('../Menu_images/Drop_Down-512.png')}
                            />
                        </TouchableOpacity>
                        <View>
                            <FlatList
                                data={this.state.DriverArray}
                                renderItem={({item})=>
                                <View>
                                    <TouchableOpacity style={styles.DropView} onPress={()=>this.Select_Driver(item)}>
                                        <Text>{item.firstname} {item.lastname}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            />
                        </View>
                        <Text style={styles.HeaderText}>Transporter fee</Text>
                        <TextInput style={[styles.ViewStyle,{paddingLeft:10}]}
                            placeholder='Enter your fee'
                            onChangeText={(text)=>this.setState({Trans_Fee:text})}
                        />
                        {this.state.ErrorShow?
                        <Text style={{color:'red',marginTop:5,alignSelf:'center',fontWeight:'600'}}>{this.state.ErrorShow}</Text>
                        :null}
                        {this.state.Activity?
                        <ActivityIndicator style={{marginTop:5}} size="large" color="#00ff00" />
                        :null}
                        <View style={{marginTop:15}}>
                            <TouchableOpacity style={{width:'50%',backgroundColor:'green',borderRadius:10,height:50,alignItems:'center',justifyContent:'center'}}
                                onPress={()=>this.SubmitProcess()} >
                                <Text style={{fontSize:15,fontWeight:'500',color:'white'}}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    ViewStyle:{
        width:'90%',
        borderWidth:1,
        height:40,
        justifyContent:'center',
        marginTop:8,
        borderRadius:8
    },
    HeaderText:{
        marginTop:10,
        fontSize:16,
        fontWeight:'600'
    },
    TextStyle:{
        fontSize:14,
        fontWeight:'400',
        marginLeft:10
    },
    DropView:{
        width:'90%',
        height:30,
        alignItems:'center',
        borderRadius:5,
        justifyContent:'center',
        borderWidth:1,
        marginTop:5
    }
})