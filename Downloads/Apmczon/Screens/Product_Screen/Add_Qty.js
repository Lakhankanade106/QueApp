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
  AsyncStorage,
  ActivityIndicator
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
            AddQty:'',
            Activity:false,
            ErrorShow:''
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
        this.setState({ErrorShow:''})
        this.setState({Activity:true})
        console.log('Prodct title',this.state.AddQty)
        this.setState({Activity:true})
        this.setState({ErrorShow:''})
        
        let url= api.baseURL;
          fetch( url+'wb/add_qty', {
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
                //this.setState({userType:responseData.data})
                alert('Your Seccessfuly Add Qty')
                this.props.navigation.navigate('List')
                //Actions.List()
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
                        <View style={{marginLeft:10,marginTop:10}}>
                            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>Actions.pop()}>
                                <Image style={{width:20,height:20}}
                                    source={require('../Menu_images/Digital__Design_99-512.png')}
                                />
                                <Text style={{fontSize:16,marginLeft:10}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={styles.TextHeader}>Category</Text>
                            <TouchableOpacity style={styles.ButtonStyle} disabled={this.state.View_Product?false:true} >
                                <Text style={{}}>{this.state.Category}</Text>
                                <Image style={{width:10,height:10}}
                                    source={require('../Menu_images/Drop_Down-512.png')}
                                />
                            </TouchableOpacity>
                           
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Sub Category</Text>
                            <TouchableOpacity style={styles.ButtonStyle} disabled={this.state.View_Product?false:true} >
                                <Text style={{}}>{this.state.SubCategory}</Text>
                                <Image style={{width:10,height:10}}
                                    source={require('../Menu_images/Drop_Down-512.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Product Title</Text>
                            <TextInput style={styles.TextInpute}
                                placeholder='Product Title'
                                defaultValue={this.state.ProductTitle}
                                editable={this.state.View_Product?true:false} 
                                onChangeText={(text)=>this.setState({ProductTitle:text})}
                            />
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Price</Text>
                            <TextInput style={styles.TextInpute}
                                placeholder='Price'
                                keyboardType='numeric'
                                defaultValue={this.state.Price}
                                editable={this.state.View_Product?true:false} 
                                onChangeText={(text)=>this.setState({Price:text})}
                            />
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Current Qty</Text>
                            <TextInput style={styles.TextInpute}
                                placeholder='Qty ...'
                                keyboardType='numeric'
                                defaultValue={this.state.qty}
                                editable={this.state.View_Product?true:false} 
                                onChangeText={(text)=>this.setState({qty:text})}
                            />
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Add Qty</Text>
                            <TextInput style={styles.TextInpute}
                                placeholder='Product Qty'
                                keyboardType='numeric'
                               // defaultValue={this.state.qty}
                                onChangeText={(text)=>this.setState({AddQty:text})}
                            />
                        </View>
                        {this.state.Activity?
                           <ActivityIndicator style={{marginTop:10}} size="large" color="#00ff00" />
                        :null}
                        {this.state.ErrorShow?
                          <Text style={{fontSize:14,fontWeight:'500',color:'red',marginTop:10,alignSelf:'center'}}>{this.state.ErrorShow}</Text>
                        :null}
                        <View style={{marginTop:10}}>
                            <TouchableOpacity disabled={this.state.Activity} style={{width:'50%',alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#00A952'}}
                                onPress={()=>this.Add_Qty()} >
                                <Text style={{fontSize:16,fontWeight:'600',color:'white'}}>Add Qty</Text>
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
  