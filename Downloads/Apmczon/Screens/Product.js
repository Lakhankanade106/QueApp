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
  Slider,
  Dimensions,
  AsyncStorage,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
//import Slider from '@react-native-community/slider';
import api from '../Screens/Config/api'
import Storage from '../Screens/Config/Storage'
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
const numColumns = 2;
import { SliderBox } from "react-native-image-slider-box";
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      LoginType:1,
      Value:0,
      SalerItem:[1,2,3],
      dimensions: {
        window,
        screen
      },
      UserID:'',
      ProductList:[],
      ValueChange:0,
      Categories:[],
      typeCat:'',
      cat_id:'',
      cat_name:'Select Categories',
      ScatName:'Select Sub Categories',
      ScatId:'',
      filterText:'',
      SubCategories:[],
      images: [
        "https://source.unsplash.com/1024x768/?nature",
        "https://source.unsplash.com/1024x768/?water",
        "https://source.unsplash.com/1024x768/?girl",
        "https://source.unsplash.com/1024x768/?tree", // Network image
       // require('./assets/images/girl.jpg'),          // Local image
      ],
      // Header Advertisement
      Header_image:[],
      Header_Vender:[],
      Header_id:[],
      Header_index:0,
      Product_H_id:'',

      // Footer Advertisment
      Footer_images:[],
      Footer_id:[],
      Footer_index:0,
      Footer_vender:[],
      Active:false,
      Limit:0
      //Approved:1
    }
    //const data =this.props 
  }
  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };
  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let user = await AsyncStorage.getItem('user');  
      let UserID = await AsyncStorage.getItem('UserID'); 
      let is_driver = await AsyncStorage.getItem('is_driver') 
      Storage.UserId = UserID
      if(is_driver ==1){
        Actions.Orders()
      }
      else{
        this.setState({UserID:UserID})
      this.FilterFunction()
      
      }
      console.log('useridddddddddddddddd',UserID)
      
      
      //console.log('user',user)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  }  
  componentDidMount() {
    
     // console.log('useriddddd',Storage.UserId)
      this.displayData()
     // this.setState({UserID:UserID})
      
    
    
    Dimensions.addEventListener("change", this.onChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onChange);
  }

  ProductApiCall(){
    console.log('user id',this.state.UserID)
    let url= api.baseURL;
      fetch( url+'wb/products_list', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:JSON.stringify({user_id:this.state.UserID})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Product list: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            this.setState({ProductList:responseData.data})
          }
          
          })
         .catch((err) => { console.log(err); });
  }

  formatData = (dataList,numColumns) => {
    //console.log('datalistttt',dataList.length)
    const totalRows = Math.floor(dataList.length / numColumns)
    let totalLastRow = dataList.length - (totalRows * numColumns)
    //console.log('TotalRows',totalRows)
    //console.log('Totallastrow',totalLastRow)
    while(totalLastRow !== 0 && totalLastRow !== numColumns){
             dataList.push({key:'blank', empty:true})
             totalLastRow++
    } 
    return dataList
  }

  SubCategoriesFun(){
    console.log('cat Id',this.state.cat_id)
    this.setState({ErrorShow:''})
    this.setState({Categories:[]})
    //console.log("eventttt",this.state.Email)
    let body = JSON.stringify({email:this.state.cat_id,})
    let url= api.baseURL;
      fetch( url+'wb/subcategory', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: JSON.stringify({category_id:this.state.cat_id,})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response sub cate: " + JSON.stringify(responseData));
          if(responseData.status =='201'){
            
              this.setState({ErrorShow:responseData.message})
          }
          else{
            //this.setState({typeCat:event})
            this.setState({SubCategories:responseData.data})
          }
          })
         .catch((err) => { console.log(err); });
  }


  CategoriesFun(){
    this.setState({ErrorShow:''})
    this.setState({SubCategories:[]})
    console.log("eventttt",this.state.Email)
    //let body = JSON.stringify({email:this.state.Email,})
    let url= api.baseURL;
      fetch( url+'wb/category', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        //body: body
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          if(responseData.status =='201'){
            
              this.setState({ErrorShow:responseData.message})
          }
          else{
            //this.setState({typeCat:event})
            this.setState({Categories:responseData.data})
          }
          })
         .catch((err) => { console.log(err); });
  }
  FilterFunction(Limit){
    this.setState({Active:true})
    this.setState({ErrorShow:''})
    this.setState({ProductList:''})
    console.log('filter text',this.state.Product_H_id)
    let body = JSON.stringify({search_key:this.state.filterText,
      category_id:this.state.cat_id,
      sub_category_id:this.state.ScatId,
      max:this.state.ValueChange,
      p_id:this.state.Product_H_id,
      limit:Limit
    })
    let url= api.baseURL;
      fetch( url+'wb/all_product_filter', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: body
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Filter api: " + JSON.stringify(responseData));
          this.setState({Active:false})
          if(responseData.status =='201'){
            
              this.setState({ErrorShow:responseData.message})
          }
          else{
            this.Approved_Api()
            for(i=0;i<responseData.header_image.length;i++)
            {
             // console.log('i value',responseData.header_image[i].header_advt_image)
              this.state.Header_image.push(responseData.header_image[i].header_advt_image)
              this.state.Header_Vender.push(responseData.header_image[i].vendor)
              this.state.Header_id.push(responseData.header_image[i].header_pid)
            }
            for(i=0;i<responseData.footer_image.length;i++)
            {
              console.log('footer images',i)
             // console.log('i value',responseData.footer_image[i].footer_advt_image)
              this.state.Footer_images.push(responseData.footer_image[i].footer_advt_image)
              this.state.Footer_vender.push(responseData.footer_image[i].vendor)
              this.state.Footer_id.push(responseData.footer_image[i].footer_pid)
            }
            this.setState({ProductList:responseData.data})
            this.setState({Header_image:this.state.Header_image})
            this.setState({Active:false})
          }
          })
         .catch((err) => { console.log(err); });
  }
  AddToCardFun(item){
    console.log('itemsss',this.state.UserID)
    const body = JSON.stringify({p_id:item.p_id,user_id:this.state.UserID})
    let url= api.baseURL;
      fetch( url+'wb/add_to_cart', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
        body: body
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsesss: " + JSON.stringify(responseData));
          if(responseData.status =='201'){
            
              this.setState({ErrorShow:responseData.message})
          }
          else{
            Actions.AddCard()
          }
          })
         .catch((err) => { console.log(err); });
    
  }

  Approved_Api(){
    //https://apmczon.in/wb/approved_status
    console.log('Approved Api Call',this.state.Limit)
    let url= api.baseURL;
      fetch( url+'wb/approved_status', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         },
         body:JSON.stringify({user_id:this.state.UserID})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("responsessss Approved: " + JSON.stringify(responseData));
          if(responseData.status=='200'){
            //this.setState({ProductView:responseData.data})
            //Actions.ReviewList()
            if(responseData.data[0].approved ==0){
              if(Storage.Approved == 0){
                alert('Please Approved you account')
              }
             
            }
            else{
              Storage.Approved = responseData.data[0].approved
             // this.setState({Approved:responseData.data[0].approved})
            }
            
          }
          else{
              this.setState({ErrorShow:responseData.message})
          }
          
          })
         .catch((err) => { console.log(err); });
  }
  PreViewButton(){
    if (this.state.Limit != 0) {
      this.setState({Limit:this.state.Limit-1})
      this.FilterFunction(this.state.Limit-1)
    }
    
   // console.log('Preview ',this.state.Limit)
  }

  NextButton(){
    //let value = this.state.Limit+1
    this.setState({Limit:this.state.Limit+1})
    this.FilterFunction(this.state.Limit+1)
   // console.log('Limit ',this.state.Limit)
  }
  

  render(){
   // console.log('product list',this.state.Categories)
    //console.log('subCategories',this.state.SubCategories)
    //console.log('header id',this.state.Product_H_id)
    const { dimensions } = this.state;
    //console.log('dimensions',dimensions.window.width +' Hieght '+ dimensions.window.height)
    //console.log('product list',this.state.ProductList.images)
    const ImagePath =''
    // if(ProductList ==[])
    // {
      
    // }
    // else{
    //   ImagePath = ProductList.
    // }
    
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={{flex:1}}>
                <View>
                  <Text style={styles.Header_Text}>Products</Text>
                </View>
                <View style={styles.Text_Discription}>
                  <Text style={styles.Font_Text}>Add Your Products with filter</Text>
                </View>
                <View style={{flexDirection:'row',marginTop:15,alignItems:'center',justifyContent:'space-around'}}>
                    {/* <TouchableOpacity style={{backgroundColor:'#FF8C00',borderRadius:10,alignItems:'center',justifyContent:'center',width:'30%',height:60}}>
                        <Text style={styles.Button_Text}>Select Price</Text>
                    </TouchableOpacity> */}
                    <View style={{width:'45%'}}>
                    <TouchableOpacity style={{backgroundColor:'green',flexDirection:'row',borderRadius:10,alignItems:'center',justifyContent:'center',height:60}} onPress={()=>this.CategoriesFun()}>
                        <View style={{width:'70%'}}>
                          <Text style={styles.Button_Text}>{this.state.cat_name}</Text>
                        </View>
                        <Image style={{width:10,height:10,marginLeft:1}}
                        source={require('../Images/DropDown_icon.png')} />
                    </TouchableOpacity>
                    <FlatList style={{elevation:5,marginTop:5,height:this.state.Categories ==''?0:200}} nestedScrollEnabled={true}
                    data={this.state.Categories}
                    renderItem={({item})=><View style={{flex:1,borderBottomWidth:1,alignSelf:'center',backgroundColor:'white',width:'100%'}}>
                       <View style={{flex:1,alignSelf:'center',marginTop:5,width:'100%'}}>
                         <TouchableOpacity style={styles.ListStyle} onPress={()=>this.setState({cat_id:item.cat_id,cat_name:item.cat_name,Categories:[]})}>
                            <Text style={{fontSize:14}}>{item.cat_name}</Text> 
                         </TouchableOpacity>
                       </View>
                    </View>}  />
                    </View>
                    <View style={{width:'45%'}}>
                    <TouchableOpacity style={{backgroundColor:'#191970',flexDirection:'row',borderRadius:10,alignItems:'center',justifyContent:'center',height:60}} onPress={()=>this.SubCategoriesFun()} >
                        <View style={{width:'70%'}}>
                        <Text style={styles.Button_Text}>{this.state.ScatName}</Text>
                        </View>
                        <Image style={{width:10,height:10,marginLeft:1}}
                        source={require('../Images/Icon_Arrow.png')} />
                    </TouchableOpacity>
                    <FlatList style={{marginTop:5,height:this.state.SubCategories ==''?0:200}} nestedScrollEnabled={true}
                    data={this.state.SubCategories}
                    renderItem={({item})=><View style={{flex:1,alignSelf:'center',width:'100%',borderBottomWidth:1,backgroundColor:'white'}}>
                       <View style={{flex:1,alignSelf:'center',marginTop:5,width:'100%'}}>
                         <TouchableOpacity style={styles.ListStyle} onPress={()=>this.setState({ScatId:item.sub_cat_id,ScatName:item.sub_cat_name,Categories:[],SubCategories:[]})}>
                            <Text style={{fontSize:14}}>{item.sub_cat_name}</Text> 
                         </TouchableOpacity>
                       </View>
                    </View>}/>
                    </View>
                </View>
                
                {/* <View style={{flexDirection:'row',marginTop:15,alignItems:'center',justifyContent:'space-around'}}>
                    <TouchableOpacity style={{backgroundColor:'#FF8C00',borderRadius:10,alignItems:'center',justifyContent:'center',width:'30%',height:60}}>
                        <Text style={styles.Button_Text}>Select Price</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:'green',flexDirection:'row',borderRadius:10,alignItems:'center',justifyContent:'center',width:'45%',height:60}} onPress={()=>this.CategoriesFun('Cate')}>
                        <View style={{width:'70%'}}>
                          <Text style={styles.Button_Text}>{this.state.cat_name}</Text>
                        </View>
                        <Image style={{width:10,height:10,marginLeft:1}}
                        source={require('../Images/DropDown_icon.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:'#191970',flexDirection:'row',borderRadius:10,alignItems:'center',justifyContent:'center',width:'45%',height:60}} onPress={()=>this.CategoriesFun('Sub_Cate')} >
                        <View style={{width:'70%'}}>
                        <Text style={styles.Button_Text}>{this.state.ScatName}</Text>
                        </View>
                        <Image style={{width:10,height:10,marginLeft:1}}
                        source={require('../Images/Icon_Arrow.png')} />
                    </TouchableOpacity>
                </View> */}
                {/* <View>
                  <FlatList
                    data={this.state.Categories}
                    renderItem={({item})=><View style={{flex:1,alignSelf:'center',marginTop:5}}>
                       {this.state.typeCat =='Cate'?
                       <TouchableOpacity onPress={()=>this.setState({cat_id:item.cat_id,cat_name:item.cat_name,Categories:[]})}>
                         <Text style={{fontSize:14}}>{item.cat_name}</Text> 
                       </TouchableOpacity>
                        
                       :null}
                       {this.state.typeCat =='Sub_Cate'?
                       <TouchableOpacity onPress={()=>this.setState({ScatId:item.sub_cat_id,ScatName:item.sub_cat_name,Categories:[]})}>
                         <Text style={{fontSize:14}}>{item.sub_cat_name}</Text> 
                       </TouchableOpacity>
                       :null}
                    </View>}  />
                </View> */}
                <View style={{marginTop:10}}>
                  <SliderBox images={this.state.Header_image}
                    onCurrentImagePressed={index =>{ this.setState({Product_H_id:this.state.Header_id[index]}),this.FilterFunction()}}
                    autoplay
                    circleLoop
                    currentImageEmitter={index => {this.setState({Header_index:index})}} 
                  />
                  <Text style={{alignSelf:'center',marginTop:5,fontSize:16,fontWeight:'600'}}>{this.state.Header_Vender[this.state.Header_index]}</Text>
                </View>
                {/* <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                    <Text style={styles.Font_Text}>0</Text>
                    
                    <Slider
                        style={{width: '70%', height: 60}}
                        minimumValue={0}
                        maximumValue={100000}
                        onValueChange={(value) => this.setState({ValueChange:value })}
                       // minimumTrackTintColor="#FFFFFF"
                        //maximumTrackTintColor="#FF8C00"
                        thumbTintColor='#FF8C00'
                      />
                    <Text style={styles.Font_Text}>{parseInt(this.state.ValueChange)}</Text>
                </View> */}
                <View style={{marginTop:20}}>
                  <TextInput style={{width:'90%',alignSelf:'center',borderWidth:0.5,padding:5,fontSize:15,marginBottom:10,borderRadius:10}}
                    placeholder='Search'
                    onChangeText={(text)=>this.setState({filterText:text})}  />
                  <TouchableOpacity style={styles.FilterButton} onPress={()=>this.FilterFunction()}>
                    <Text style={styles.Font_Text}>Filter</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{alignSelf:'center',marginTop:10,fontSize:15,color:'red'}} >{this.state.ErrorShow}</Text>
               {this.state.Active?
                <View>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
               :null}
                <FlatList style={{marginTop:20}} 
                  data={this.formatData(this.state.ProductList, numColumns)}
                  numColumns ={numColumns}
                  keyExtractor={(item, index) => index.toString()}
                  //data={this.state.ProductList}
                  renderItem={({item,index})=> //console.log('item data',item.images[0].image)
                  {
                    if(item.empty){
                      //console.log('If condition cali',)
                    return <View ></View>
                  }
                  //console.log('Else condition chali',index)
                  return(
                    <View style={{borderWidth:1,alignSelf:'center',width:'80%',flex:1,marginTop:5,marginLeft:5,borderRadius:10}}>
                      <TouchableOpacity style={{width:'100%',alignItems:'center',marginTop:5,justifyContent:'center',flex:1}}>
                        <Image style={{width:'95%',height:150}} resizeMode='cover'
                          source={{uri:item.images[0].image}}  />
                      </TouchableOpacity>
                      <Text style={{marginLeft:10,fontSize:16,marginTop:5}}>{item.title}</Text>
                      <Text style={{marginLeft:10,fontSize:16,marginTop:5}}>Vendor: {item.vendor}</Text>
                      {/* {item.user_type=='Vendor'?
                      <TouchableOpacity style={{marginTop:5}} onPress={()=>this.props.navigation.navigate('Advertisement_Add',{itemData:item})} >
                        <Text style={{marginLeft:10,color:'red',fontSize:16,marginTop:5}}>Add to Advertisement</Text>
                      </TouchableOpacity>
                      :null} */}
                      <View style={{marginLeft:10}}>
                        <Text style={{fontSize:14,marginTop:8,color:'#707B7C'}} numberOfLines={2}>{item.description}</Text>
                      </View>
                      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:10,marginTop:10}}>
                         <Text style={{fontSize:14,color:'red',marginRight:5,marginLeft:5}}>{item.price}/-</Text>
                         <TouchableOpacity style={styles.ItemButton} onPress={()=>{if(Storage.Approved ==0){
                           this.Approved_Api()
                         }else{this.AddToCardFun(item)}
                        }
                         } >
                           <Text style={{fontSize:14,color:'white',fontWeight:'500'}}>Buy Now</Text>
                         </TouchableOpacity>
                       </View>
                    </View>
                  //   <View style={{flexDirection:'row',marginLeft:5,width:'50%',marginRight:5,alignSelf:'center',borderWidth:1,justifyContent:'space-around',marginTop:10}}>
                  //   <View style={styles.ItemView}>
                  //     <TouchableOpacity style={{justifyContent:'center',width:'100%',alignItems:'center',marginTop:5}}>
                  //         <Image style={styles.ItemImageView} resizeMode='cover'
                  //           source={{uri:item.images[0].image}}  />
                  //     </TouchableOpacity>
                  //     <Text style={{fontSize:16,marginTop:5,marginLeft:8}}>{item.title}</Text>
                  //     <View style={{width:'100%'}}>
                  //       <Text style={{fontSize:14,marginTop:8,padding:8,color:'#707B7C'}}>{item.description}</Text>
                  //     </View>
                  //     <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:10}}>
                  //       <Text style={{fontSize:14,color:'red',marginRight:5,marginLeft:5}}>{item.price}/-</Text>
                  //       <TouchableOpacity style={styles.ItemButton} onPress={()=>Actions.AddPartner()} >
                  //         <Text style={{fontSize:14,color:'white',fontWeight:'500'}}>ADD TO CART</Text>
                  //       </TouchableOpacity>
                  //     </View>
                  //   </View>
                    
                  //   {/* <View style={styles.ItemView}>
                  //     <TouchableOpacity style={{justifyContent:'center',alignItems:'center',marginTop:5}}>
                  //       <Image style={styles.ItemImageView} resizeMode='contain'
                  //         source={require('../Images/Cloths_image.jpeg')}  />
                  //     </TouchableOpacity>
                  //     <Text style={{fontSize:16,marginTop:5,marginLeft:8}}>Cloths</Text>
                  //     <View style={{width:'100%'}}>
                  //       <Text style={{fontSize:14,marginTop:8,padding:8,color:'#707B7C'}}>Lorem ipsum is simply dummy text of the printing and</Text>
                  //     </View>
                  //     <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginBottom:10}}>
                  //       <Text style={{fontSize:14,color:'red',marginRight:10,marginLeft:5}}>399/-</Text>
                  //       <TouchableOpacity style={styles.ItemButton} onPress={()=>Actions.AddPartner()} >
                  //         <Text style={{fontSize:15,color:'white',fontWeight:'500'}}>ADD TO CART</Text>
                  //       </TouchableOpacity>
                  //     </View>
                  //   </View> */}
                  // </View>
                  ) 
                }} />

                <View style={{width:'90%',marginTop:20,marginBottom:20,flexDirection:'row',alignSelf:'center',justifyContent:'space-between'}}>
                  <View style={{height:35,width:150}}>
                    {this.state.Limit != 0?
                    <TouchableOpacity  style={{borderWidth:1,borderRadius:5,alignItems:'center',justifyContent:'center',height:35,width:150}}
                      onPress={()=>this.PreViewButton()} >
                      <Text style={{fontSize:14,fontWeight:'600'}}>Preview</Text>
                    </TouchableOpacity>
                  :null}
                  </View>
                  
                  <View>
                    {this.state.ProductList !=''?
                    <TouchableOpacity style={{borderWidth:1,borderRadius:5,alignItems:'center',justifyContent:'center',height:35,width:150}}
                      onPress={()=>this.NextButton()}  >
                      <Text style={{fontSize:14,fontWeight:'600'}}>Next</Text>
                    </TouchableOpacity>
                    :null}
                  </View>
                </View>

                <View style={{marginTop:10}}>
                <SliderBox images={this.state.Footer_images}
                onCurrentImagePressed={index => { this.setState({Product_H_id:this.state.Footer_id[index]}),this.FilterFunction()}}
                autoplay
                circleLoop
                currentImageEmitter={index => this.setState({Footer_index:index})} 
                />
                <Text style={{alignSelf:'center',marginTop:5,fontSize:16,fontWeight:'600'}}>{this.state.Footer_vender[this.state.Footer_index]}</Text>
                </View>
                
            </View>
        </ScrollView>
    </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  Header_Text:{
    fontSize:30,
    fontWeight:'500',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    color:'#424949'
  },
  Text_Discription:{
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    marginTop:20,
  },
  Font_Text:{
    fontSize:18,
    color:'#707B7C'
  },
  Button_Text:{
      fontSize:16,
      color:'white',
      fontWeight:'500'
  },
  FilterButton:{
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    backgroundColor:'white',
    borderRadius:10,
    width:'90%',
    height:50,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5
    },
    shadowRadius: 5,
    shadowOpacity: 0.2
  },
  ItemImageView:{
    width:'100%',
    height:130,
    borderRadius:10,
  },
  ItemButton:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'red',
    padding:8,
    borderRadius:5,
    marginRight:5
  },
  ItemView:{
    width:'50%',
    height:250,
    borderRadius:10,
    shadowColor: '#000000',
    backgroundColor:'white',
    shadowOffset: {
      width: 0,
      height: 0.5
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  }
});
