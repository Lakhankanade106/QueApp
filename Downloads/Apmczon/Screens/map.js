//This is an example code to get Geolocation//  
import React from 'react';
//import react in our code. 
import {View, Text,  StyleSheet,TouchableOpacity, Image,Alert ,PermissionsAndroid,Platform, SafeAreaView,BackHandler} from 'react-native';
//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
//import Polyline from '@mapbox/polyline';
import api from './Config/api'

import { Marker,Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

//const origin = {latitude: 37.785834, longitude: -122.406417};
//const destination = {latitude: 22.7196, longitude: 75.8577};
//const GOOGLE_MAPS_APIKEY = 'AIzaSyAQQbzeM5as21zNrUozzAuC5X7MJIfo_Zk';


export default class App extends React.Component {
  state = {
    longitude: 'unknown',//Initial Longitude
    latitude: 'unknown',//Initial Latitude
    coordinate: {
      latitude:18.724296012882693, //22.69065687147905,
      longitude:73.04002607421874 //75.82152758970477,
      },
      markers:[],
      TrackLocation:false,
      SetLocation:false,
      driver_id:'',
      Poli_line_lat:18.724296012882693,
      Poli_line_Long:73.04002607421874
    
    // markers : [
    //   {
    //     latitude: 45.65,
    //     longitude: -78.90,
    //     title: 'Foo Place',
    //     subtitle: '1234 Foo Drive'
    //   }
    // ]
 }
 findCoordinates = () => {
  Geolocation.getCurrentPosition(
    position => {
      console.log(position);
      this.state.coordinate.latitude = position.coords.latitude;
      this.state.coordinate.longitude = position.coords.longitude;
      this.setState({coordinate:this.state.coordinate})
     //this.setState({latitude:position.coords.latitude,longitude: position.coords.longitude,})
     // this.setState({latitude:currentLatitude})
    },

    
    error => console.log(error),
    { enableHighAccuracy: true, timeout: 20000 }
    
  );
 
  
 };

 Tracking(){
   //console.log('SendData ',this.props.SendData)
  const that =this
  setTimeout(() => {that.get_Driver_lat_Long_Api()}, 100000)
}

 get_Driver_lat_Long_Api(){
   console.log('driver idd', this.props.driver_id)
  let url= api.baseURL;
  fetch( url+'wb/get_driver_latlong', {
     method: 'POST',
     headers: { 
     'Accept': 'application/json', 
     'Content-Type': 'application/json',
     //'Content-Length': data.length 
     },
     body:JSON.stringify({driver_id:this.props.driver_id})
   }).then((response) => response.json())
     .then((responseData) =>
      { console.log("Get Driver LatLong: " + JSON.stringify(responseData));
      if(responseData.status=='200'){
        this.state.coordinate.latitude = responseData.data[0].current_lat
        this.state.coordinate.longitude =responseData.data[0].current_long
        this.setState({coordinate:this.state.coordinate})
        this.setState({Poli_line_lat:this.props.SendData[0].u_lat})
        this.setState({Poli_line_Long:this.props.SendData[0].u_long})
        this.Tracking()
       // this.setState({driver_id:responseData.data.driver_id})
       // this.setState({TrangectionArry:responseData.data})
      }
      })
     .catch((err) => { console.log(err); });
 }

 backAction = () => {
  Alert.alert("Alert", "Are you sure you want to go back?", [
    {
      text: "Cancel",
      onPress: () => null,
      style: "cancel"
    },
    { text: "YES", onPress: () => this.props.navigation.pop() }
  ]);
  return true;
};
componentWillUnmount() {
  this.backHandler.remove();
}

 componentDidMount(){
  this.backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    this.backAction
  );
   console.log('recive data',this.props.Openmap)
   console.log('Items dataaaaa  ',this.props.driver_id)
  // const track = 'TrackLocation'
   if(this.props.Openmap == 'TrackLocation')
   {
     this.setState({TrackLocation:true})
     //this.Track_Order_lat_long_Api()
     this.get_Driver_lat_Long_Api()
   }
   if(this.props.Openmap == 'SelectLocation'){
     this.setState({SetLocation:true})
   }
   this.findCoordinates();
   
 }
 show=(e)=>{
   
   console.log('function call',e.nativeEvent.coordinate)
   {this.state.SetLocation?this.setState({coordinate:e.nativeEvent.coordinate}):null}
   
  //this.state.latitude.push(e.nativeEvent.coordinate.latitude)
 
 //this.state.markers.push(this.state.coordinate)
  //this.state.markers[0]=this.state.coordinate;
 
 this.setState({markers: this.state.markers})
 console.log('markers',this.state.markers)
 //console.log(this.state.coordinat.e)
 }
 
 render() {
   const{latitude,longitude} = this.state.coordinate;
   //console.log('latitude ',this.state.Poli_line_lat +' Longitude',this.state.Poli_line_Long)
   
   //console.log('======',latitude)
    return (
       <View style = {styles.container}>
         <MapView style={{width:'100%',height:'100%'}}
        //  camera={{
        //   center: {
        //     latitude: parseFloat(latitude),
        //     longitude: parseFloat(longitude),
        //   }}}
            initialRegion={{
            latitude:parseFloat(latitude) ,
            longitude:parseFloat(longitude),
            latitudeDelta: 20.0922,
            longitudeDelta: 2.0421,
          }}
            showsUserLocation	={true}
            showsMyLocationButton={true}
            moveOnMarkerPress={true}

             onPress={(e)=>{this.setState({coordinate:e.nativeEvent.coordinate}),console.log('GEt Location from Api')}}
              onPress={this.show.bind()}
    >
      {this.state.TrackLocation?
    //   <MapViewDirections
    //   origin={origin}
    //   destination={destination}
    //   apikey={GOOGLE_MAPS_APIKEY}
    // />
      <Polyline
      coordinates={[
      { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
      { latitude: parseFloat(this.state.Poli_line_lat), longitude: parseFloat(this.state.Poli_line_Long) },
    //{ latitude: 37.7665248, longitude: -122.4161628 },
    //{ latitude: 37.7734153, longitude: -122.4577787 },
    //{ latitude: 37.7948605, longitude: -122.4596065 },
    //{ latitude: 37.8025259, longitude: -122.4351431 }
  ]}
  strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
  strokeColors={[
    //'#7F0000',
    //'#00000000', // no color, creates a "long" gradient between the previous and next coordinate
    //'#B24112',
    //'#E5845C',
    //'#238C23',
    //'#7F0000'
  ]}
  strokeWidth={6}
/>
      :null}
      
      {this.state.TrackLocation?
      <View>
        {/* For the Driver Location */}
        <Marker
          coordinate={{latitude:parseFloat(latitude),longitude:parseFloat(longitude)}}
          onPress={(coddinet)=>console.log('marker is run',)}>
          <Image source={require('../Images/truckIcon.png')} style={{height: 35, width:35 }} />
           {/* <Image  source={require('../Images/IndiaFlag.png')} style={{height:18,position:'absolute',width:18,marginLeft:25,marginBottom:10}}/> */}
        </Marker>
        {/* for the user Location */}
        <Marker
          coordinate={{latitude:parseFloat(this.state.Poli_line_lat),longitude:parseFloat(this.state.Poli_line_Long)}}
          onPress={(coddinet)=>console.log('marker is run',)}>
          <Image source={require('../Images/UserLocation.png')} style={{height: 35,tintColor:'green', width:35 }} />
           {/* <Image  source={require('../Images/IndiaFlag.png')} style={{height:18,position:'absolute',width:18,marginLeft:25,marginBottom:10}}/> */}
        </Marker>
      </View>
      :null}
      {this.state.SetLocation?
        <Marker 
          coordinate={{latitude:parseFloat(latitude),longitude:parseFloat(longitude)}}
          onPress={(Location)=>this.props.navigation.navigate('AddPartner',{setLocaion:Location.nativeEvent.coordinate})}>
          <Image source={require('../Images/UserLocation.png')} style={{height: 35, width:35}} />
        </Marker>:null}
    
      {/* onPress={()=>this.props.navigation.navigate('AddPartner',{userLocation:Location.nativeEvent.coordinate})} */}
   {/* {this.state.markers.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
        )} */}

  {/* <MapView.Polyline
    coordinates={[
        {latitude: latitude, longitude:  longitude}, 
        {latitude: this.state.markers.latitude, longitude: this.state.markers.longitude}, 
    ]}
    strokeWidth={4}
   /> */}

      </MapView>
       </View>
    )
//   return(
//     <SafeAreaView style={{flex:1}}>
//       <View style={{borderWidth:2,width:'100%',flex:1}}>
//       <MapView style={{borderWidth:2,flex:1}}
//          initialRegion={{
//                      latitude: 37.8025259 ,
//                      longitude:-122.4351431,
//                      latitudeDelta: 20.0922,
//                      longitudeDelta: 2.0421,
//                    }} >
// 	<Polyline
// 		coordinates={[
// 			{ latitude: 37.8025259, longitude: -122.4351431 },
//       {latitude: 37.8025259, longitude: -122.4351431 }
// 		//	{ latitude: 37.7896386, longitude: -122.421646 },
// 		//	{ latitude: 37.7665248, longitude: -122.4161628 },
// 			//{ latitude: 37.7734153, longitude: -122.4577787 },
// 			//{ latitude: 37.7948605, longitude: -122.4596065 },
// 			//{ latitude: 37.8025259, longitude: -122.4351431 }
// 		]}
// 		strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
// 		strokeColors={[
// 			'#7F0000',
// 			//'#00000000', // no color, creates a "long" gradient between the previous and next coordinate
// 			//'#B24112',
// 			//'#E5845C',
// 			//'#238C23',
// 			//'#7F0000'
// 		]}
// 		strokeWidth={6}
// 	/>
// </MapView>
//       </View>
//     </SafeAreaView>
//   )
 }
}


    //   <Marker/>
    //  key={index}
    //   coordinate={{
    //    latitude:item.latitude,
    //    longitude:item.longitude
        
    //   }}title={"Your Location"}
    // />
      // })}
      
       {/* {!!this.state.latitude && !!this.state.longitude && */}
        {/* <MapView.Marker
        isPreselected={true}
         onPress={ { coordinate: this.state.coords }}
         title={"Your Location"}
       /> */}
    
const styles = StyleSheet.create ({
 container: {
   
    alignItems: 'center',
    justifyContent:'center',
    
    backgroundColor:'white'
 },
 boldText: {
    fontSize: 30,
    color: 'red',
 }
})