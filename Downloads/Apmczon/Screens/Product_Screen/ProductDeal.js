/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
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
  Alert,
  AsyncStorage,
  Modal
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import api from '../Config/api'

function HomeScreen () {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      ProductDealArray:[],
        UserID:'',
        modalVisible: false,
        regNote:'',
        ProductId:'',
        ErrorShow:'',
        user:''
    }
  }
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let UserID = await AsyncStorage.getItem('UserID'); 
      let user = await AsyncStorage.getItem('user'); 
      this.setState({user:user}) 
      this.setState({UserID:UserID})
      this.GetDataApi()
      console.log('user id',UserID)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  } 
  GetDataApi(){
    let url= api.baseURL;
      fetch( url+'wb/products_deals', {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
       // "Content-Disposition": 'multipart/form-data'
        //'Content-Type': 'multipart/form-data'
        //'Content-Length': data.length 
        },
        body:JSON.stringify({user_id:this.state.UserID})
      }).then((response) => response.json())
        .then((responseData) =>
         { console.log("response1111: " + JSON.stringify(responseData));
         //this.setState({Activity:false})
         if(responseData.status == 200){
           this.setState({ProductDealArray:responseData.data})
           //this.props.navigation.navigate('drawerMenu')
         }else{
         }
         
         })
        .catch((err) => { console.log(err); });
  } 
  componentDidMount(){
    this.displayData()
      
  }
  ApprovalApi(){
    console.log('deal id',this.state.ProductId)
    let url= api.baseURL;
      fetch( url+'wb/approve_deal', {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
       // "Content-Disposition": 'multipart/form-data'
        //'Content-Type': 'multipart/form-data'
        //'Content-Length': data.length 
        },
        body:JSON.stringify({deal_id:this.state.ProductId})
      }).then((response) => response.json())
        .then((responseData) =>
         { console.log("response1111: " + JSON.stringify(responseData));
         //this.setState({Activity:false})
         if(responseData.status == 200){
           this.GetDataApi()
         }else{
         }
         
         })
        .catch((err) => { console.log(err); });
  }
  ApprovalProcess(id){
    this.setState({ProductId:id})
    Alert.alert(
      "Approved",
      "are you sure you want to Approve this",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.ApprovalApi() }
      ],
      { cancelable: false }
    );
  }
  RejectFun(id){
    console.log('reject id',id)
    this.setState({ProductId:id})
    this.setState({modalVisible:!this.state.modalVisible})
  }
  RejectFunApi(){
    let url= api.baseURL;
      fetch( url+'wb/reject_deal', {
        method: 'POST',
        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
       // "Content-Disposition": 'multipart/form-data'
        //'Content-Type': 'multipart/form-data'
        //'Content-Length': data.length 
        },
        body:JSON.stringify({deal_id:this.state.ProductId,reject_msg:this.state.regNote})
      }).then((response) => response.json())
        .then((responseData) =>
         { console.log("response1111: " + JSON.stringify(responseData));
         //this.setState({Activity:false})
         if(responseData.status == 200){
           this.setState({modalVisible:false})
           this.componentDidMount()
           //this.setState({ProductDealArray:responseData.data})
           //this.props.navigation.navigate('drawerMenu')
         }else{
           this.setState({ErrorShow:responseData.message})
         }
         
         })
        .catch((err) => { console.log(err); });
  }

  render(){
    console.log('product array',this.state.user)
  return (
    <SafeAreaView style={{flex:1,width:'100%',backgroundColor:'#F9F6F6'}}>
        <ScrollView>
            <View style={{flex:1,width:'100%'}}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{width:'100%'}}>
                <View style={{flex:1}}>
                <View style={{flexDirection:'row',borderTopWidth:0.5,borderBottomWidth:0.5,marginTop:15}}>
                  <View style={{width:20,}}>
                     <Text style={styles.Header_Text}>#</Text>
                  </View>
                  <View style={{width:70,marginLeft:8,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Product</Text>
                  </View>
                  <View style={{width:70,marginLeft:8,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Product Price</Text>
                  </View>
                  <View style={{width:70,marginLeft:8,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Deal Price</Text>
                  </View>
                  <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                     <Text style={styles.Header_Text}>Deal Description</Text>
                  </View>
                  <View style={{width:70,marginLeft:8,alignItems:'center'}}>
                  <Text style={styles.Header_Text}>Status</Text>
                  </View>
                  <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                    <Text style={styles.Header_Text}>Rejection Msg</Text>
                  </View>
                  <View style={{width:80,marginRight:8,alignItems:'center'}}>
                  <Text style={styles.Header_Text}>Date</Text>
                  </View>
                  {this.state.user !='Broker'?
                  <View style={{width:80,marginRight:8,alignItems:'center'}}>
                  <Text style={styles.Header_Text}>Actions</Text>
                  </View>
                  :null}
                </View>
                <FlatList 
                    data={this.state.ProductDealArray}
                    renderItem={({item,index})=>
                    <View style={{flexDirection:'row',marginTop:15,borderBottomWidth:0.5,padding:10}}>
                         <View style={{width:20,marginLeft:10}}>
                             <Text>{index+1}</Text>
                         </View>
                         <View style={{width:70,marginLeft:8,alignItems:'center'}}>
                            <Text>{item.title}</Text>
                         </View>
                         <View style={{width:70,marginLeft:8,alignItems:'center'}}>
                            <Text>{item.price}</Text>
                         </View>
                         <View style={{width:70,marginLeft:8,alignItems:'center'}}>
                            <Text>{item.deal_price}</Text>
                         </View>
                         <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                             <Text>{item.deal_description}</Text>
                         </View>
                         <View style={{width:70,marginLeft:8,alignItems:'center'}}>
                            <Text>{item.vendor_status}</Text>
                         </View>
                         <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                            <Text>{item.reject_msg}</Text>
                         </View>
                         <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                            <Text>{item.entry_date}</Text>
                         </View>
                         {item.vendor_status =='Pending'  ?
                         <View  style={{marginLeft:8}}>
                           {this.state.user != 'Broker'?
                           <View>
                              <TouchableOpacity style={{width:80,justifyContent:'center',borderRadius:10,alignItems:'center',height:25,backgroundColor:'green'}} onPress={()=>this.ApprovalProcess(item.deal_id)}>
                                <Text>Approved</Text>
                             </TouchableOpacity>
                             <TouchableOpacity style={{width:80,justifyContent:'center',borderRadius:10,alignItems:'center',height:25,marginTop:5,backgroundColor:'red'}} onPress={()=>this.RejectFun(item.deal_id)}>
                                <Text>Reject</Text>
                             </TouchableOpacity>
                            </View>
                           :null}
                        </View>
                         :null}
                    </View>} />
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={this.state.modalVisible}
                      onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      this.setModalVisible(!modalVisible);
                      }}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={{color:'red',alignSelf:'center',fontSize:14}}>{this.state.ErrorShow}</Text>
                          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{fontSize:18,fontWeight:'600'}}>Reject Reason</Text>
                            <TouchableOpacity onPress={()=>this.setState({modalVisible:false})}>
                              <Image style={{width:15,height:15}}
                                source={require('../../Images/CloseIcone.png')}  />
                            </TouchableOpacity>
                          </View>
                          <View style={{width:'100%',height:120,borderWidth:1,marginTop:10,padding:5}}>
                            <TextInput 
                              placeholder='Region'
                              multiline={true}
                              onChangeText={(text)=>this.setState({regNote:text})}
                            />
                          </View>
                          <TouchableOpacity style={{borderWidth:1,borderRadius:5,padding:10,width:100,marginTop:10,alignItems:'center',justifyContent:'center'}}
                             onPress={()=>this.RejectFunApi()} >
                            <Text>Submit</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                     
                    </Modal>
                </View>
                    </ScrollView>
                
            </View>
        </ScrollView>
    </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  Header_Text:{
    fontSize:16,
    fontWeight:'500',
    color:'#424949'
  },
  Font_Text:{
    fontSize:18,
    color:'#707B7C'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    width:'80%'
  }
  
});
