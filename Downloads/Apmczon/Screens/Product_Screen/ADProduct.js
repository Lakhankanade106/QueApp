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
  Alert,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FlatList } from 'react-native-gesture-handler';
import { Value } from 'react-native-reanimated';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker/src/index';
import api from '../Config/api'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      CategoryArry:[],
      SubCategoryArry:[],
      Category:'Select Category',
      SubCategory:'Select Sub Category',
      QtyType:'Select Qty type',
      QtyArray:[],
      imagePick:[],
      ProductName:'',
      Price:'',
      Gst:'',
      Qty:'',
      Description:'',
      ErrorShow:'',
      ImageDoc:[],
      UserId:'',
      Activity:false,
      cat_id:'',
      address:'',
      weight:'',
      Qty_Ty_Id:''
    }
  }
  CategoryApiFun(){
    let url= api.baseURL;
      fetch( url+'wb/category', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //"Content-Disposition": 'multipart/form-data'
         //'Content-Length': data.length 
         },
         //body:formData
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response: " + JSON.stringify(responseData));
          this.setState({Activity:false})
          if(responseData.status=='200'){
            //this.setState({userType:responseData.data})
            this.setState({CategoryArry:responseData.data})
          }
          else{
            this.setState({ErrorShow:responseData.message})
          }
          })
         .catch((err) => { console.log(err); });
  }
  SubCategoryApiFun(){
    let url= api.baseURL;
      fetch( url+'wb/subcategory', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //"Content-Disposition": 'multipart/form-data'
         //'Content-Length': data.length 
         },
         body:JSON.stringify({category_id:this.state.cat_id})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Catgory: " + JSON.stringify(responseData));
          this.setState({Activity:false})
          if(responseData.status=='200'){
            this.setState({SubCategoryArry:responseData.data})
          }
          else{
            this.setState({ErrorShow:responseData.message})
          }
          })
         .catch((err) => { console.log(err); });
  }

  QtyTypeApiFun(){
    let url= api.baseURL;
      fetch( url+'wb/qty_type', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         'Content-Type': 'application/json',
         //"Content-Disposition": 'multipart/form-data'
         //'Content-Length': data.length 
         },
         //body:JSON.stringify({category_id:this.state.cat_id})
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Qty: " + JSON.stringify(responseData));
          this.setState({Activity:false})
          if(responseData.status=='200'){
            //this.setState({SubCategoryArry:responseData.data})
            this.setState({QtyArray:responseData.data})
          }
          else{
            this.setState({ErrorShow:responseData.message})
          }
          })
         .catch((err) => { console.log(err); });
  }

  // CategoryFunc(Value){
  //   switch(Value){
  //     case 'Category':
  //       {
  //         data=[{title: 'Category 1',},{title: 'Category 2',},{title: 'Category 3',},{title:'Category 5'}]
          
  //         this.CategoryApiFun()
  //         break;
  //       }
  //     case 'Sub Category':{
  //       data=[{title:'Sub Category 1',},{title:'Sub Category 2',},{title:'Sub Category 3',},{title:'Sub Category 5'}]
  //       this.setState({SubCategoryArry:data})
  //       break;
  //     }
  //     case 'QtyType':{
  //       data=[{title: 'Kg',},{title: 'Ltr',},{title: 'Mtr',},{title:'Box'},{title:'Beg'},{title:'Caret'},{title:'Tin'}]
  //       this.setState({QtyArray:data})
  //     }
  //   }
    
  // }

  displayData = async ()=>{  
    console.log('chalaaa')
    try{  
      let UserID = await AsyncStorage.getItem('UserID');  
      this.setState({UserID:UserID})
      console.log('user id',UserID)
      //alert(user);  
    }  
    catch(error){  
      alert(error)  
    }  
  } 

  componentDidMount(){
    this.displayData()
  }

  SelectFun(Value,item){
    console.log('item',item)
    switch(Value){
      case 'Category':
        {
          this.setState({Category:item.cat_name})
          this.setState({cat_id:item.cat_id})
          this.setState({CategoryArry:[]})
          break;
        }
      case 'Sub Category':
        {
          console.log("Sub categry id ",item.sub_cat_id)
          this.setState({SubCategory:item.sub_cat_name})
          this.setState({sub_cat_id:item.sub_cat_id})
          this.setState({SubCategoryArry:[]})
          break;
        }
      case 'Check':
        {
          this.setState({QtyType:item.name})
          this.setState({Qty_Ty_Id:item.id})
          this.setState({QtyArray:[]})
        }
    }
  }
  SelectImage(value){
    console.log("value ",value)
    var options = {
      title: 'Select Image',
      customButtons: [
        { 
          name: 'customOptionKey', 
          title: 'Choose file from Custom Option' 
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
   //console.log("image picker",ImagePicker)
   launchImageLibrary(options, res => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        imageName = res.fileName;
        console.log('image name',res)
        this.state.ImageDoc.push(res.uri)
        this.state.imagePick.push({Imgname:imageName})
        this.setState({imagePick:this.state.imagePick})
      }
      console.log('add images',this.state.imagePick)
    });
  }
  DeletItem(itemm){
    this.setState({Activity:true})
    console.log("delet function call",itemm)
    const filteredData = this.state.imagePick.filter(item => item.Imgname !== itemm);
    this.setState({ imagePick: filteredData });
    this.setState({Activity:false})
  }

  // SubimtProcess(){
  //   Category = this.state.Category;
  //   SubCategory = this.state.SubCategory;
  //   ProductName = this.state.ProductName;
  //   Price = this.state.Price;
  //   Gst = this.state.Gst;
  //   Qty = this.state.Qty;
  //   QtyType = this.state.QtyType;
  //   console.log('checket ',SubCategory, Category,QtyType )
  //   if(Category ==='Select Category'&& SubCategory ==='Select Sub Category'&& QtyType ==='Select Qty type'){
  //    // console.log('if condition chali')
  //     this.setState({ErrorShow:'Please Select Category , Sub Category and Qty Type'})
  //   }
  //   else{
  //    // console.log('else condition chali')
  //     if(ProductName ==''&& Price ==''&& Gst==''&& Qty ==''){
  //       this.setState({ErrorShow:'Please Fille ALL Field'})
  //     }
  //     else{
  //       if(this.state.imagePick.length == 0){
  //         this.setState({ErrorShow:'Please Choice Your Image File'})
  //       }
  //       else{
  //         this.setState({ErrorShow:''})
  //         this.AddProductApi()
  //        // alert('Your Product Seccessfuly Add')
  //       }
  //     }
  //   }
  // }

  AddProductApi(){
   
    console.log('QtyType  ',this.state.Qty_Ty_Id)
    console.log('Prodct title',this.state.cat_id+' sub Category '+ this.state.sub_cat_id)
    this.setState({Activity:true})
    this.setState({ErrorShow:''})
    const formData = new FormData()
    for (let i = 0; i < this.state.ImageDoc.length; i++)
        {
            var photo={
                uri:this.state.ImageDoc[i],
                type: 'image/jpeg',
                name: 'photo.jpg',
            }
            console.log('Photosss  ',photo)
            formData.append('images[]',photo)
    }
    console.log('Form dataa ',formData)
    formData.append('user_id',this.state.UserID)
    formData.append('title',this.state.ProductName)
    formData.append('category_id',this.state.cat_id)
    formData.append('sub_category_id',this.state.sub_cat_id)
    formData.append('price',this.state.Price)
    formData.append('gst',this.state.Gst)
    formData.append('description',this.state.Description)
    formData.append('qty',this.state.Qty)
    formData.append('qty_type',this.state.Qty_Ty_Id)
    formData.append('address',this.state.address)
    formData.append('weight',this.state.weight)
    let url= api.baseURL;
      fetch( url+'wb/add_product', {
         method: 'POST',
         headers: { 
         'Accept': 'application/json', 
         "Content-Type": 'multipart/form-data'
        // 'Content-Type': 'application/json',
         //'Content-Length': data.length 
         },
         body:formData
       }).then((response) => response.json())
         .then((responseData) =>
          { console.log("response Add Category: " + JSON.stringify(responseData));
          this.setState({Activity:false})
          if(responseData.status=='200'){
            //this.setState({userType:responseData.data})
            alert('Your Product Seccessfuly Add')
            this.setState({Category:'Select Category'})
            this.setState({SubCategory:'Select Sub Category'})
            this.setState({QtyType:'Select Qty type'})
            this.setState({ProductName:'',Gst:'',Qty:'',imagePick:[],Price:'',cat_id:'',address:'',Description:'',ErrorShow:'',})
            Actions.List()

          }
          else{
            this.setState({ErrorShow:responseData.message})
          }
          })
         .catch((err) => { console.log(err); });
  }
  render(){
    ///console.log('image doc',this.state.UserId)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F9F6F6'}}>
        <ScrollView>
            <View style={{flex:1}}>
              <View style={{marginTop:10}}>
                <Text style={styles.Header_Text}>Category</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.Input_View} onPress={()=>this.CategoryApiFun()}>
                  <Text style={styles.Font_Text}>{this.state.Category}</Text>
                  <View>
                    <Image style={{width:15,height:10}}
                      source={require('../Menu_images/Drop_icone.png')} />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <FlatList style={styles.DropView}
                data={this.state.CategoryArry}
                renderItem={({item})=>
                  <View>
                    <TouchableOpacity style={styles.ItemView} onPress={()=>this.SelectFun('Category',item)}>
                      <Text style={styles.Font_Text}>{item.cat_name}</Text>
                      <View style={{borderWidth:1,borderColor:item.cat_name === this.state.Category ? "green" :'Black',width:20,height:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                        <View style={{backgroundColor: item.cat_name === this.state.Category ? "green" :'white',width:10,height:10,borderRadius:5}}></View>
                      </View>
                    </TouchableOpacity>
                  </View>
                } />
              </View>
              <View>
                <Text style={styles.Header_Text}>Sub Category</Text>
              </View>
              <TouchableOpacity style={styles.Input_View} onPress={()=>this.SubCategoryApiFun()}>
                  <Text style={styles.Font_Text}>{this.state.SubCategory}</Text>
                  <View>
                    <Image style={{width:15,height:10}}
                      source={require('../Menu_images/Drop_icone.png')} />
                  </View>
                </TouchableOpacity>
                <View>
                <FlatList style={styles.DropView}
                data={this.state.SubCategoryArry}
                renderItem={({item})=>
                  <View>
                    <TouchableOpacity style={styles.ItemView} onPress={()=>this.SelectFun("Sub Category",item)} >
                      <Text style={styles.Font_Text} >{item.sub_cat_name}</Text>
                      <View style={{borderWidth:1,borderColor:item.sub_cat_name === this.state.SubCategory ? "green" :'Black',width:20,height:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                        <View style={{backgroundColor: item.sub_cat_name === this.state.SubCategory ? "green" :'white',width:10,height:10,borderRadius:5}}></View>
                      </View>
                    </TouchableOpacity>
                  </View>
                } />
              </View>
              <View>
                <Text style={styles.Header_Text}>Product Title</Text>
              </View>
              <View>
                <TextInput style={styles.Input_View}
                  placeholder='Product Title'
                  defaultValue={this.state.ProductName}
                  onChangeText={(text)=>this.setState({ProductName:text})}  />
              </View>
              <View>
                <Text style={styles.Header_Text}>Price</Text>
              </View>
              <View>
                <TextInput style={styles.Input_View}
                  placeholder='Product Price'
                  defaultValue={this.state.Price}
                  keyboardType='numeric'
                  onChangeText={(text)=>this.setState({Price:text})} />
              </View>
              <View>
                <Text style={styles.Header_Text}>GST</Text>
              </View>
              <View>
                <TextInput style={styles.Input_View}
                  placeholder='GST %'
                  defaultValue={this.state.Gst}
                  keyboardType='numeric'
                  onChangeText={(text)=>this.setState({Gst:text})}  />
              </View>
              <View>
                <Text style={styles.Header_Text}>Qty</Text>
              </View>
              <View>
                <TextInput style={styles.Input_View}
                  placeholder='Product Qty'
                  defaultValue={this.state.Qty}
                  keyboardType='numeric'
                  onChangeText={(text)=>this.setState({Qty:text})} />
              </View>
              <View>
                <Text style={styles.Header_Text}>Qty type</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.Input_View} onPress={()=>this.QtyTypeApiFun()}>
                  <Text style={styles.Font_Text}>{this.state.QtyType} </Text>
                  <Image style={{width:15,height:10}}
                    source={require('../Menu_images/Drop_icone.png')}  />
                </TouchableOpacity>
              </View>
              <View>
                <FlatList style={styles.DropView}
                  data={this.state.QtyArray}
                  renderItem={({item})=>
                  <View>
                    <TouchableOpacity style={styles.ItemView} onPress={()=>this.SelectFun('Check',item)}>
                      <Text style={styles.Font_Text}>{item.name}</Text>
                      <View style={{borderWidth:1,borderColor:item.name === this.state.QtyType ? "green" :'Black',width:20,height:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                        <View style={{backgroundColor: item.name === this.state.QtyType ? "green" :'white',width:10,height:10,borderRadius:5}}></View>
                      </View>
                    </TouchableOpacity>
                  </View>} />
              </View>

              <View>
                <Text style={styles.Header_Text}>Weight</Text>
              </View>
              <View>
                <TextInput style={styles.Input_View}
                  placeholder='Weight......'
                  defaultValue={this.state.weight}
                  keyboardType='numeric'
                  onChangeText={(text)=>this.setState({weight:text})} />
              </View>

              <View>
                <Text style={styles.Header_Text}>Address</Text>
              </View>
              <View>
                <TextInput style={styles.Input_View}
                  placeholder='Address......'
                  defaultValue={this.state.address}
                 // keyboardType='numeric'
                  onChangeText={(text)=>this.setState({address:text})} />
              </View>
              <View>
                <Text style={styles.Header_Text}>Product Description</Text>
              </View>
              <View>
                <TextInput style={styles.DiscriptionInput}
                  placeholder='Product Description'
                  defaultValue={this.state.Description}
                  multiline={true}
                  onChangeText={(text)=>this.setState({Description:text})} />
              </View>
              <View>
                <Text style={styles.Header_Text}>Images</Text>
              </View>
              <View style={{}}>
                <TouchableOpacity style={styles.FileButton} onPress={()=>this.SelectImage()} >
                  <Text style={styles.Font_Text}>Choose file</Text>
                </TouchableOpacity>
                <FlatList style={{marginTop:5}}
                  data={this.state.imagePick}
                  renderItem={({item})=>
                  <View style={{width:'90%',flexDirection:'row',borderRadius:10,marginTop:5,paddingLeft:10,paddingRight:5,justifyContent:'space-between',alignItems:'center',alignSelf:'center',borderWidth:0.5,alignItems:'center'}}>
                    <Text>{item.Imgname}</Text>
                    <TouchableOpacity onPress={()=>this.DeletItem(item.Imgname)}>
                      <Text style={{fontSize:30,fontWeight:'500',transform: [{ rotate: '40deg'}]}}>+</Text>
                    </TouchableOpacity>
                  </View> }  />
              </View>
              {this.state.Activity?
              <ActivityIndicator size="large" color="#00ff00" />
              :null}
              <View>
                <Text style={{fontSize:14,color:'red',alignSelf:'center',marginTop:10}}>{this.state.ErrorShow} </Text>
                <TouchableOpacity style={styles.SubMitButton} onPress={()=>this.AddProductApi()} >
                  <Text style={{fontSize:18,fontWeight:'500',color:'white'}}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  Header_Text:{
    fontSize:17,
    fontWeight:'500',
    color:'#424949',
    marginLeft:30,
    marginTop:10
  },
  
  Font_Text:{
    fontSize:15,
    color:'black'
  },
  Input_View:{
    width:'90%',
    height:50,
    padding:10,
    paddingLeft:20,
    justifyContent:'space-between',
    alignItems:'center',
    borderRadius:10,
    borderWidth:1,
    backgroundColor:'white',
    marginTop:10,
    marginLeft:20,
    flexDirection:'row',
    fontWeight:'400',
    color:'black'
  },
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
  DiscriptionInput:{
    width:'90%',
    height:100,
    padding:10,
    justifyContent:'space-around',
    alignItems:'center',
    borderRadius:10,
    borderWidth:1,
    backgroundColor:'white',
    marginTop:10,
    marginLeft:20,
  },
  CheckPoint:{
    backgroundColor:'green',width:10,height:10,borderRadius:5
  },
  FileButton:{
    borderWidth:1,
    marginLeft:20,
    width:'30%',
    height:40,
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
    borderRadius:10
  },
  SubMitButton:{
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'center',
    width:'90%',
    height:50,
    borderRadius:20,
    backgroundColor:'green',
    marginTop:20
  }
  
});
