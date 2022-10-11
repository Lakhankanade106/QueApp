import React, { Component } from 'react';
import { FlatList } from 'react-native';
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
  AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker/src/index';
import api from '../Config/api'

export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            ProductTitle:'',
            Price:'',
            UserID:'',
            Category:'Selected Item',
            SubCategory:'Selected Item',
            cat_id:'',
            sub_cat_id:'',
            qty:'',
            View_Product:false,
            QtyArray:['UserID','UserID','UserID','UserID']
        }
    }
    displayData = async ()=>{  
        console.log('chalaaa')
        try{  
          let user = await AsyncStorage.getItem('user');  
          let UserID = await AsyncStorage.getItem('UserID');  
          //console.log('useriddddd',UserID)
          
          this.setState({UserID:UserID})
          //this.GetDataApi()
          this.Add_Qty()
          //console.log('user',user)
          //alert(user);  
        }  
        catch(error){  
          alert(error)  
        }  
      }  
      componentDidMount(){
        this.displayData()
        this.UpdateValue()
      }
      
      UpdateValue(){
        console.log('items data',this.props.ItemData)
          this.setState({ProductTitle:this.props.ItemData.title,Price:this.props.ItemData.price})
          this.setState({ Category:this.props.ItemData.cat_name,SubCategory:this.props.ItemData.sub_cat_name})
          this.setState({sub_cat_id:this.props.ItemData.sub_cat_id,cat_id:this.props.ItemData.cat_id})
          this.setState({qty:this.props.ItemData.qty})
       }

      
    Add_Qty(){
    
        console.log('Prodct title',this.props.ItemData)
        this.setState({Activity:true})
        this.setState({ErrorShow:''})
        
        let url= api.baseURL;
          fetch( url+'wb/view_enventory', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json'
             },
             body:JSON.stringify({p_id:this.props.ItemData.p_id,user_id:this.state.UserID,qty:this.state.AddQty})
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("response: " + JSON.stringify(responseData));
              this.setState({Activity:false})
              if(responseData.status=='200'){
                this.setState({QtyArray:responseData.data})
                // alert('Your Seccessfuly Add Qty')
                // Actions.pop()
              }
              else{
                this.setState({ErrorShow:responseData.message})
              }
              })
             .catch((err) => { console.log(err); });
      }
    render(){
        return(
            <SafeAreaView>
                <ScrollView>
                    <View style={{width:'90%',alignSelf:'center'}}>
                        {/* <View style={{marginLeft:10,marginTop:10}}>
                            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>Actions.pop()}>
                                <Image style={{width:20,height:20}}
                                    source={require('../Menu_images/Digital__Design_99-512.png')}
                                />
                                <Text style={{fontSize:16,marginLeft:10}}>Back</Text>
                            </TouchableOpacity>
                        </View> */}
                        <View style={{marginTop:20,flex:1}}>
                            <Text style={styles.TextHeader}>Category</Text>
                            <View style={styles.ButtonStyle} >
                                <Text style={{}}>{this.state.Category}</Text>
                                <Image style={{width:10,height:10}}
                                    source={require('../Menu_images/Drop_Down-512.png')}
                                />
                            </View>
                           
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Sub Category</Text>
                            <View style={styles.ButtonStyle} >
                                <Text style={{}}>{this.state.SubCategory}</Text>
                                <Image style={{width:10,height:10}}
                                    source={require('../Menu_images/Drop_Down-512.png')}
                                />
                            </View>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Product Title</Text>
                            <Text style={styles.TextInpute}>{this.state.ProductTitle}</Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Price</Text>
                            <Text style={styles.TextInpute}>{this.state.Price}</Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Current Qty</Text>
                            <Text style={styles.TextInpute}>{this.state.qty}</Text>
                        </View>
                        <View style={{marginTop:15}}>
                            <View style={{flexDirection:'row',borderTopWidth:1,padding:5,borderBottomWidth:1}}>
                                <View style={{width:20,}}>
                                    <Text style={{fontSize:14,fontWeight:'500'}}>#</Text>
                                </View>
                                <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                                    <Text style={{fontSize:14,fontWeight:'500'}}>Qty</Text>
                                </View>
                                <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                                    <Text style={{fontSize:14,fontWeight:'500'}}>Type</Text>
                                </View>
                                <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                                    <Text style={{fontSize:14,fontWeight:'500'}}>Date</Text>
                                </View>
                            </View>
                            <FlatList
                              data={this.state.QtyArray}
                              renderItem={({item,index})=>
                              <View style={{flexDirection:'row',padding:5}}>
                                <View style={{width:20,}}>
                                    <Text style={styles.Header_Text}>{index+1}</Text>
                                </View>
                                <View style={{width:100,marginLeft:8,alignItems:'center'}}>
                                    <Text style={styles.Header_Text}>{item.qty}</Text>
                                </View>
                                <View style={{width:100,marginLeft:5,alignItems:'center'}}>
                                    <Text style={styles.Header_Text}>{item.qty_type}</Text>
                                </View>
                                <View style={{width:80,marginLeft:8,alignItems:'center'}}>
                                    <Text style={styles.Header_Text}>{item.entry_date}</Text>
                                </View>
                            </View>
                            }
                            />
                        </View>
                        
                        <View style={{marginTop:20}}>
                            <TouchableOpacity style={{width:'50%',alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#00A952'}}
                                onPress={()=>Actions.pop()} >
                                <Text style={{fontSize:16,fontWeight:'600',color:'white'}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    ButtonStyle:{
        width:'90%',
        marginTop:10,
        borderWidth:1,
        justifyContent:'space-around',
        alignItems:'center',
        borderRadius:10,
        height:40,
        flexDirection:'row'
    },
    TextHeader:{
        fontSize:20,fontWeight:'700'
    },
    TextInpute:{
        width:'90%',
        borderWidth:1,
        height:40,
        borderRadius:10,
        padding:10,
        marginTop:10
    } ,
    DropView:{
        alignSelf:'center',
        backgroundColor:'white',
        width:'90%',
        marginTop:5,
        borderRadius:10,
      },
      ItemView:{
        alignItems:'center',
        padding:5,
        alignSelf:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        borderBottomWidth:0.5,
        width:'85%',
        height:40,
        marginBottom:10,
        padding:5,
      },   
  });
  