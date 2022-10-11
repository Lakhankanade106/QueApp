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
  ActivityIndicator,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker/src/index';
import api from '../Config/api'

export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            ImagesData:[],
            ProductTitle:'',
            Price:'',
            GstPrsentege:'',
            Description:'',
            UserID:'',
            Category:'Selected Item',
            SubCategory:'Selected Item',
            CategoryArry:[],
            cat_id:'',
            SubCategoryArry:[],
            sub_cat_id:'',
            ImageDoc:[],
            Address:'',
            View_Product:false,
            ErrorShow:'',
            Activity:false,
            weight:''
        }
    }
    displayData = async ()=>{  
        console.log('chalaaa')
        try{  
          let user = await AsyncStorage.getItem('user');  
          let UserID = await AsyncStorage.getItem('UserID');  
          //console.log('useriddddd',UserID)
          
          this.setState({UserID:UserID})
          this.GetDataApi()
          
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
      CategoryApiFun(){
        let url= api.baseURL;
        fetch( url+'wb/category', {
           method: 'POST',
           headers: { 
           'Accept': 'application/json', 
           'Content-Type': 'application/json',
           },
          // body:JSON.stringify({user_id:this.state.UserID})
         }).then((response) => response.json())
           .then((responseData) =>
            { console.log("responsessss: " + JSON.stringify(responseData));
            if(responseData.status=='200'){
                this.setState({CategoryArry:responseData.data})
            }
            
            })
           .catch((err) => { console.log(err); });
      }
      SelectCatFun(item){
        this.setState({Category:item.cat_name})
        this.setState({cat_id:item.cat_id})
        this.setState({CategoryArry:[]})
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

      SelectSubCate(item){
        this.setState({SubCategory:item.sub_cat_name})
        this.setState({sub_cat_id:item.sub_cat_id})
        this.setState({SubCategoryArry:[]})
      }
      GetDataApi(){
        //console.log('items data',this.props.ItemData)
        // this.setState({ImageData:[],Address:this.props.ItemData.address})
        // this.setState({View_Product:this.props.ViewProduct})
        //   this.setState({ImagesData:this.props.ItemData.images})
        //   this.setState({ProductTitle:this.props.ItemData.title,Price:this.props.ItemData.price})
        //   this.setState({ Category:this.props.ItemData.cat_name,SubCategory:this.props.ItemData.sub_cat_name})
        //   this.setState({GstPrsentege:this.props.ItemData.gst, Description:this.props.ItemData.description})
        //   this.setState({sub_cat_id:this.props.ItemData.sub_cat_id,cat_id:this.props.ItemData.cat_id})
        this.setState({View_Product:this.props.ViewProduct})
        let url= api.baseURL;
          fetch( url+'wb/view_product', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json',
             //"Content-Disposition": 'multipart/form-data'
             //'Content-Length': data.length 
             },
             body:JSON.stringify({user_id:this.state.UserID,p_id:this.props.ItemData.p_id})
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("response Catgory: " + JSON.stringify(responseData));
              //this.setState({Activity:false})
              console.log('dataaaaa ',responseData.data[0])
              if(responseData.status=='200'){
                //this.setState({SubCategoryArry:responseData.data})
                  this.setState({ImageData:[],Address:responseData.data[0].address})
                
                this.setState({ImagesData:responseData.data[0].images})
                this.setState({ProductTitle:responseData.data[0].title,Price:responseData.data[0].price})
                this.setState({ Category:responseData.data[0].cat_name,SubCategory:responseData.data[0].sub_cat_name})
                this.setState({GstPrsentege:responseData.data[0].gst, Description:responseData.data[0].description})
                this.setState({sub_cat_id:responseData.data[0].sub_cat_id,cat_id:responseData.data[0].cat_id})
                this.setState({weight:responseData.data[0].weight})
              }
              else{
                this.setState({ErrorShow:responseData.message})
              }
              })
             .catch((err) => { console.log(err); });
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
           // this.state.imagePick.push({Imgname:imageName})
           this.state.ImagesData.push({image:res.uri})
            this.setState({imagePick:this.state.imagePick})
          }
         // console.log('add images',this.state.imagePick)
        });
      }
    //   guidGenerator() {
    //     var S4 = function() {
    //        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    //     };
        
    //     const uniqe_id= (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    //     console.log('unique id  ',uniqe_id)
    // }
    // GetDataApi(){
    //     //console.log('itms data',this.props.ItemData.images)
    //     let url= api.baseURL;
    //     //https://apmczon.in/project/wb/update_product
    //   fetch( url+'wb/update_product', {
    //      method: 'POST',
    //      headers: { 
    //      'Accept': 'application/json', 
    //      'Content-Type': 'application/json',
    //      },
    //      body:JSON.stringify({user_id:this.state.UserID,
    //         title:this.state.ProductTitle,
    //         category_id:this.state.cat_id,
    //         sub_category_id:this.state.sub_cat_id,
    //         price:this.state.Price,
    //         p_id:this.props.ItemData.p_id,
    //         gst:this.state.GstPrsentege,
    //         description:this.state.Description})
    //    }).then((response) => response.json())
    //      .then((responseData) =>
    //       { console.log("responsessss: " + JSON.stringify(responseData));
    //       if(responseData.status=='200'){
    //         this.setState({ProductList:responseData.data})
    //       }
    //       })
    //      .catch((err) => { console.log(err); });
    // }

    UpdateProductApi(){
        this.setState({ErrorShow:''})
        this.setState({Activity:true})
        console.log('Prodct title',this.state.Address)
        this.setState({Activity:true})
        this.setState({ErrorShow:''})
        const formData = new FormData()
        for (let i = 0; i < this.state.ImagesData.length; i++)
            {
              console.log('imgassss', this.state.ImagesData[i].image)
                var photo={
                    uri:this.state.ImagesData[i].image,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                }
                console.log('Photosssss ',photo)
                formData.append('images[]',photo)
        }
        formData.append('user_id',this.state.UserID)
        formData.append('title',this.state.ProductTitle)
        formData.append('category_id',this.state.cat_id)
        formData.append('sub_category_id',this.state.sub_cat_id)
        formData.append('price',this.state.Price)
        formData.append('gst',this.state.GstPrsentege)
        formData.append('description',this.state.Description)
        formData.append('p_id',this.props.ItemData.p_id)
        formData.append('address',this.state.Address)
        formData.append('weight',this.state.weight)
        let url= api.baseURL;
          fetch( url+'wb/update_product', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'multipart/form-data',
            // "Content-Disposition": 'multipart/form-data'
             //'Content-Length': data.length 
             },
             body:formData
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("response: " + JSON.stringify(responseData));
              this.setState({Activity:false})
              if(responseData.status=='200'){
                //this.setState({userType:responseData.data})
                alert('Your Product Seccessfuly Update')
                Actions.pop()
                // this.setState({Category:'Select Category'})
                // this.setState({SubCategory:'Select Sub Category'})
                // this.setState({QtyType:'Select Qty type'})
                // this.setState({ProductName:'',Gst:'',Qty:'',imagePick:[],Price:'',cat_id:'',address:'',Description:'',ErrorShow:'',})
    
              }
              else{
                this.setState({ErrorShow:responseData.message})
              }
              })
             .catch((err) => { console.log(err); });
      }
      createTwoButtonAlert (item){
      Alert.alert(
        "Alert",
        "Are you Sure you want to delet Image",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.Delet_Prod_Image_Api(item) }
        ]
      );}
      Delet_Prod_Image_Api(items){
        this.setState({Activity:true})
        console.log('images data ',items)
        if(items.image_id ==undefined){
          console.log('if conditon chali')
          const filteredData = this.state.ImagesData.filter(item => item.image !== items.image);
          this.setState({ ImagesData: filteredData });
          this.setState({Activity:false})
        }
        else{
          console.log('Else condtion chali')
          let url= api.baseURL;
          fetch( url+'wb/delete_prodimage', {
             method: 'POST',
             headers: { 
             'Accept': 'application/json', 
             'Content-Type': 'application/json',
             //"Content-Disposition": 'multipart/form-data'
             //'Content-Length': data.length 
             },
             body:JSON.stringify({p_id:items.product_id,imageid:items.image_id})
           }).then((response) => response.json())
             .then((responseData) =>
              { console.log("response Catgory: " + JSON.stringify(responseData));
              this.setState({Activity:false})
              if(responseData.status=='200'){
                //this.setState({SubCategoryArry:responseData.data})
                this.GetDataApi()
              }
              else{
                this.setState({ErrorShow:responseData.message})
              }
              })
             .catch((err) => { console.log(err); });
        }
        
        
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
                            <TouchableOpacity style={styles.ButtonStyle} disabled={this.state.View_Product?false:true} onPress={()=>this.CategoryApiFun()}>
                                <Text style={{fontSize:16,fontWeight:'600'}}>{this.state.Category}</Text>
                                <Image style={{width:15,height:15}}
                                    source={require('../Menu_images/Drop_Down-512.png')}
                                />
                            </TouchableOpacity>
                            <View>
                                <FlatList style={styles.DropView}
                                    data={this.state.CategoryArry}
                                    renderItem={({item})=>
                                    <View>
                                        <TouchableOpacity style={styles.ItemView} onPress={()=>this.SelectCatFun(item)} >
                                            <Text style={styles.Font_Text} >{item.cat_name}</Text>
                                            <View style={{borderWidth:1,borderColor:item.cat_id === this.state.cat_id ? "green" :'Black',width:20,height:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                                                <View style={{backgroundColor: item.cat_id === this.state.cat_id ? "green" :'white',width:10,height:10,borderRadius:5}}></View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                } />
                            </View>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Sub Category</Text>
                            <TouchableOpacity style={styles.ButtonStyle} disabled={this.state.View_Product?false:true} onPress={()=>this.SubCategoryApiFun()}>
                                <Text style={{fontSize:16,fontWeight:'600'}}>{this.state.SubCategory}</Text>
                                <Image style={{width:15,height:15}}
                                    source={require('../Menu_images/Drop_Down-512.png')}
                                />
                            </TouchableOpacity>
                            <View>
                                <FlatList style={styles.DropView}
                                    data={this.state.SubCategoryArry}
                                    renderItem={({item})=>
                                    <View>
                                        <TouchableOpacity style={styles.ItemView} onPress={()=>this.SelectSubCate(item)} >
                                            <Text style={styles.Font_Text} >{item.sub_cat_name}</Text>
                                            <View style={{borderWidth:1,borderColor:item.sub_cat_id === this.state.sub_cat_id ? "green" :'Black',width:20,height:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                                                <View style={{backgroundColor: item.sub_cat_id === this.state.sub_cat_id ? "green" :'white',width:10,height:10,borderRadius:5}}></View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                } />
                            </View>
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
                            <Text style={styles.TextHeader}>GST %</Text>
                            <TextInput style={styles.TextInpute}
                                placeholder='GST %'
                                keyboardType='numeric'
                                defaultValue={this.state.GstPrsentege}
                                editable={this.state.View_Product?true:false} 
                                onChangeText={(text)=>this.setState({GstPrsentege:text})}
                            />
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Weight</Text>
                            <TextInput style={styles.TextInpute}
                                placeholder='Product Title'
                                defaultValue={this.state.weight}
                                keyboardType ={'numeric'}
                                editable={this.state.View_Product?true:false} 
                                onChangeText={(text)=>this.setState({weight:text})}
                            />
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Address</Text>
                            <TextInput style={styles.TextInpute}
                                placeholder='Product Title'
                                defaultValue={this.state.Address}
                                editable={this.state.View_Product?true:false} 
                                onChangeText={(text)=>this.setState({Address:text})}
                            />
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Product Description</Text>
                            <TextInput style={[styles.TextInpute,{height:150}]}
                                placeholder='Text'
                                multiline={true}
                                defaultValue={this.state.Description}
                                editable={this.state.View_Product?true:false} 
                                onChangeText={(text)=>this.setState({Description:text})}
                            />
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={styles.TextHeader}>Images</Text>
                           <FlatList horizontal={true} style={{marginTop:10}}
                            data={this.state.ImagesData}
                            renderItem={({item})=>
                            <View style={{marginLeft:10}}>
                                <Image style={{height:100,width:100,borderRadius:20}} resizeMode='cover'
                                source={{uri:item.image}}
                                />
                                {this.state.View_Product == true?
                                <View style={{position:'absolute'}} >
                                  <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={()=>this.createTwoButtonAlert(item)}>
                                    <Text style={{fontSize:20,fontWeight:'600',color:'red'}}>X</Text>
                                  </TouchableOpacity>
                                </View>
                                :null}
                                
                            </View>
                        }
                           />
                        </View>
                        {this.state.View_Product ==true?
                        <View>
                          <View style={{marginTop:10,borderWidth:1,borderRadius:10,flexDirection:'row',width:'60%',alignItems:'center',height:40}}>
                            <TouchableOpacity style={{backgroundColor:'grey',borderRadius:10,height:30,alignItems:'center',justifyContent:'center',marginLeft:10}}
                                onPress={()=>this.SelectImage()} >
                                <Text>  Choose File  </Text>
                            </TouchableOpacity>
                            <Text style={{marginLeft:10}}>No File Chosen</Text>
                        </View>
                        {this.state.Activity?
                           <ActivityIndicator style={{marginTop:10}} size="large" color="#00ff00" />
                        :null}
                        {this.state.ErrorShow?
                        <Text style={{alignSelf:'center',fontSize:14,color:'red',marginTop:10}}>{this.state.ErrorShow}</Text>
                        :null}
                        <View style={{marginTop:10}}>
                            <TouchableOpacity style={{width:'50%',alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#00A952'}}
                                onPress={()=>this.UpdateProductApi()} >
                                <Text style={{fontSize:16,fontWeight:'600',color:'white'}}>Update</Text>
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
  