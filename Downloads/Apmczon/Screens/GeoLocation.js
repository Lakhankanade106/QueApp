// import React, { useState, useEffect, Component } from "react";
// import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
// import Geolocation from '@react-native-community/geolocation';
// //import Geolocation from 'react-native-geolocation-service';
// import MapView from 'react-native-maps';
// import { Marker } from 'react-native-maps';
// import { ScrollView } from "react-native-gesture-handler";

// export default class app extends Component{
//     constructor(props){
//         super(props)
//         this.state={
//                 // latitude: 37.78825,
//                 // longitude: -122.4324,
//                 // latitudeDelta: 0.0922,
//                 // longitudeDelta: 0.0421,
//                 Coodinat:{}
//         }
//     }
//     componentDidMount(){
//        // Geolocation.getCurrentPosition(info => {console.log(info),this.setState({Coodinat:info.coords})});
//        // Geolocation.watchPosition(info=>console.log("Whatch Posion",info))
//        Geolocation.watchPosition(
//         position => {
//           const { coordinate, routeCoordinates, distanceTravelled } =   this.state;
//           const { latitude, longitude } = position.coords;
          
//           const newCoordinate = {
//             latitude,
//             longitude
//           };
//           if (Platform.OS === "android") {
//         if (this.marker) {
//           this.marker._component.animateMarkerToCoordinate(
//             newCoordinate,
//             500
//           );
//          }
//        } else {
//          coordinate.timing(newCoordinate).start();
//        }
//        this.setState({
//          latitude,
//          longitude,
//          routeCoordinates: routeCoordinates.concat([newCoordinate]),
//          distanceTravelled:
//          distanceTravelled + this.calcDistance(newCoordinate),
//          prevLatLng: newCoordinate
//        });
//      },
//      error => console.log(error),
//      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//   );
//     //    Geolocation.getCurrentPosition(
//     //     (position) => {
//     //       console.log(position);
//     //       this.setState({Coodinat:position.coords})
//     //     },
//     //     (error) => {
//     //       // See error code charts below.
//     //       console.log(error.code, error.message);
//     //     },
//     //     { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
//     // );
//     //    if (hasLocationPermission) {
//     //     Geolocation.getCurrentPosition(
//     //         (position) => {
//     //           console.log(position);
//     //         },
//     //         (error) => {
//     //           // See error code charts below.
//     //           console.log(error.code, error.message);
//     //         },
//     //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     //     );
//     //   }
//     }
//     onRegionChange(region) {
//         this.setState({ region });
//       }
//     render(){
//         console.log('coodinatesss',this.state.Coodinat)
//         return(
//             <SafeAreaView style={{flex:1}}>
//                     <View style={{}}>
//                     {/* <View style={StyleSheet.absoluteFillObject}>
//                         <MapView style={StyleSheet.absoluteFillObject} />
//                         <View style={{ position: 'absolute', top: 100, left: 50 }}/>
//                     </View> */}
//                     <MapView  style={{height:'100%',width:'100%'}}
//                         initialRegion={
//                             {
//                                      latitude:     this.state.Coodinat.latitude,
//                                      longitude: this.state.Coodinat.longitude,
//                                      //latitudeDelta: 0.0922,
//                                      //longitudeDelta: 0.0421,
//                                  }
//                                 }
//                     >
//                     {/* {this.state.markers.map((marker, index) => ( */}
//                     <Marker
//                         // key={index}
//                         // coordinate={marker.latlng}
//                         // title={marker.title}
//                         // description={marker.description}
//                         coordinate={{ latitude : this.state.Coodinat.latitude, longitude : this.state.Coodinat.longitude }}
//                         image={require('../Images/Icon_Arrow.png')}
//                     />
//          {/* ))} */}
//               </MapView>
//                     </View>
//             </SafeAreaView>
//         )
//     }
// }
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.welcome}>☆Geolocation example☆</Text>
// //       <Text style={styles.instructions}>STATUS: {status}</Text>
// //       <Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
// //       <Text style={styles.instructions}>{message}</Text>
// //       <Button title="Press" onPress={() => getGeolocation()} />
// //       {/* <MapView style={{flex:1,borderWidth:1,width:'100%'}}
// //         initialRegion={{
// //         latitude: 37.785834,
// //         longitude: -122.406417,
// //         latitudeDelta: 0.0922,
// //         longitudeDelta: 0.0421,
// //     }}
// //   /> */}
// //   <MapView
// //   region={this.state.region}
// //   onRegionChange={this.onRegionChange}
// // >
// //   {this.state.markers.map((marker, index) => (
// //     <Marker
// //       key={index}
// //       coordinate={marker.latlng}
// //       title={marker.title}
// //       description={marker.description}
// //     />
// //   ))}
// // </MapView>
// //     </View>
// //   );
// // }
 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5FCFF"
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: "center",
//     margin: 10
//   },
//   instructions: {
//     textAlign: "center",
//     color: "#333333",
//     marginBottom: 5
//   },
//   map: {
//     flex: 1,
//     width:'100%',
//         ...StyleSheet.absoluteFillObject
//   },
// });
import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  SafeAreaView
} from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import PubNubReact from 'pubnub-react';
const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        coordinate: new AnimatedRegion({
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: 0,
          longitudeDelta: 0
        })
      };
  
      this.pubnub = new PubNubReact({
        publishKey: "pub-c-28a24a71-c9bf-4cc2-bbc0-e476b89faa8f",
        subscribeKey: "sub-c-a522fdc4-5a56-11eb-bfb3-7239c411611a"
      });
      this.pubnub.init(this);
    }
  
    componentDidMount() {
      this.watchLocation();
    }
  
    componentDidUpdate(prevProps, prevState) {
      if (this.props.latitude !== prevState.latitude) {
        this.pubnub.publish({
          message: {
            latitude: this.state.latitude,
            longitude: this.state.longitude
          },
          channel: "location"
        });
      }
    }
  
    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }
  
    watchLocation = () => {
      const { coordinate } = this.state;
  
      this.watchID = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
  
          const newCoordinate = {
            latitude,
            longitude
          };
  
          if (Platform.OS === "android") {
            if (this.marker) {
              this.marker._component.animateMarkerToCoordinate(
                newCoordinate,
                500 // 500 is the duration to animate the marker
              );
            }
          } else {
            coordinate.timing(newCoordinate).start();
          }
  
          this.setState({
            latitude,
            longitude
          });
        },
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10
        }
      );
    };
  
    getMapRegion = () => ({
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  
    render() {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <MapView
              style={styles.map}
              showUserLocation
              followUserLocation
              loadingEnabled
              region={this.getMapRegion()}
            >
              <Marker.Animated
                ref={marker => {
                  this.marker = marker;
                }}
                coordinate={this.state.coordinate}
              />
            </MapView>
          </View>
        </SafeAreaView>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
      alignItems: "center"
    },
    map: {
      ...StyleSheet.absoluteFillObject
    }
  });