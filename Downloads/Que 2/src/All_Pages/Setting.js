//
//  Settings
//  que
//
//  Created by Maiko.
//  Copyright © 2018 que. All rights reserved.
//

import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View,TextInput } from "react-native"
import { AsyncStorage } from "react-native";
//import Loader from "../loader";
import LinearGradient from 'react-native-linear-gradient'
import {Actions} from 'react-native-router-flux'
import {
  Stitch,
  RemoteMongoClient,
  UserPasswordCredential,
  AnonymousCredential,
  FunctionAuthProvider,
  FunctionCredential,
} from "mongodb-stitch-react-native-sdk";
import moment from "moment";
import "moment-timezone";
import DatePicker from "react-native-datepicker";
import { withOrientation, NavigationEvents } from "react-navigation";
const appId = "que-eblub";
export default class Settings extends React.Component {
    static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
        header: null,
        headerLeft: null,
        headerRight: null,
    };
    };

    constructor(props) {
        super(props);
        this.state = {
            user: { username: "" },
        };
        this._loadClient = this._loadClient.bind(this);
        this._retrieveData = this._retrieveData.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.onSubjectChanged = this.onSubjectChanged.bind(this);
}
    async _loadClient() {
    var client;
    try {
        client = await Stitch.defaultAppClient;
    } catch (error) {
        client = await Stitch.initializeDefaultAppClient(appId);
    }

    const mongoClient = client.getServiceClient(
        RemoteMongoClient.factory,
        "mongodb-atlas"
    );

    const db = mongoClient.db("que");
    const users = db.collection("users");

    this.setState({
        ...this.state,
        ...{ client: client, db: db },
    });

    try {
        if (client.isLoggedIn) {
        return;
        }
    } catch (error) {
        console.log(error);
    }
    }

    async _storeData(user) {
    try {
        await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
        // Error saving data
        console.log(error);
    }
    }
    async onSubjectChanged(text) {
    var error = false;
    if (text.length > 3) {
        await this.state.db
        .collection("users")
        .findOne({
            username: text,
        })
        .then((result) => {
            console.log(typeof result);
            console.log(result);
            if (result !== null) {
            error = "Username Unavailable";
            }
        });
    } else {
        error = "Username must be at least 3 characters";
    }
    this.setState({
        ...this.state,
        ...{ error: error },
    });
    }
    onCancelPressed = () => {
        console.log("cancel pressed");
        const { navigate } = this.props.navigation;
        Actions.pop()
        // navigate("Dashboard");
    };

    async updateUser() {
    await this.state.db
        .collection("users")
        .findOne({
        id:
            typeof this.state.user !== "undefined"
            ? this.state.user.id
            : "",
        })
        .then((result) => {
        this._storeData(result);

        this.setState({
            ...this.state,
            ...{ user: result },
        });
        })
        .catch((error) => console.log(error));
    }
    async componentDidMount() {
        this.setState({
            ...this.state,
            ...this.props.navigation.state.params,
        });
        await this.refreshData();
        }
        async refreshData() {
        await this._loadClient();
        await this._retrieveData();
    }

    onUpdateUsername() {}

    onSavePressed = () => {
        const { navigate } = this.props.navigation;
        Actions.push('Home')
        //navigate("Dashboard");
    };
    async _retrieveData() {
    await this.updateUser();
        try {
            const value = await AsyncStorage.getItem("user");

            if (value !== null) {
            // Our data is fetched successfully

            this.setState({
                ...this.state,
                ...{ user: JSON.parse(value), loading: false },
            });
            }
        } catch (error) {
            return false;
        }
    }
    render() {
    return (
        <LinearGradient
        start={{
            x: 0.5,
            y: 0,
        }}
        end={{
            x: 0.5,
            y: 1,
        }}
        locations={[0, 1]}
        colors={["rgb(151, 87, 222)", "rgb(228, 181, 203)"]}
        style={styles.viewViewLinearGradient}
        >
        <View style={styles.viewView}>
            <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 55,
                bottom: 32,
                alignItems: "center",
            }}
            >
            <Text style={styles.settingsText}>Settings</Text>
            {this.state.error ? (
                <Text style={styles.errorText}>
                {this.state.error}
                </Text>
            ) : null}
            <Text style={styles.labelText}>Username</Text>
            <TextInput
                autoCorrect={false}
                placeholder="i.e. Jan Smith"
                onChangeText={this.onSubjectChanged}
                defaultValue={this.state.user.username}
                style={styles.textInput}
            />
    
            <Text style={styles.labelText}>
                Required Deposit Amount
            </Text>
            <TextInput
                autoCorrect={false}
                placeholder="$20"
                onChangeText={this.onSubjectChanged}
                defaultValue={this.state.user.deposit ? this.state.user.deposit.toFixed(2) : "$10.00"}
                style={styles.textInput}
            />

            <View style={styles.bottomButtons}>
                <TouchableOpacity
                onPress={this.onSavePressed}
                style={styles.SaveButton}
                >
                <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={this.onCancelPressed}
                style={styles.cancelButton}
                >
                <Text style={styles.cancelButtonText}>
                    Cancel
                </Text>
                </TouchableOpacity>
            </View>
            </View>
            <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                alignSelf: "center",
                width: 170,
                top: 226,
                bottom: 105,
                alignItems: "center",
            }}
            ></View>
        </View>
        </LinearGradient>
    );
    }
}

const styles = StyleSheet.create({
  labelText: {
    color: "white",
   // fontFamily: "Poppins-Regular",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "transparent",
    marginTop: 29,
  },
  textInput: {
    color: "rgb(17, 0, 43)",
    //fontFamily: "Poppins-Regular",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 19,
    padding: 0,
    width: 310,
    height: 38,
    marginTop: 15,
    marginBottom: 20,
  },
  viewViewLinearGradient: {
    flex: 1,
  },
  viewView: {
    width: "100%",
    height: "100%",
  },
  settingsText: {
    backgroundColor: "transparent",
    color: "white",
    //fontFamily: "Poppins-Regular",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    marginLeft: 6,
  },
  accountInformationText: {
    backgroundColor: "transparent",
    color: "white",
    //fontFamily: "Poppins-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    width: 227,
    marginLeft: 8,
    marginTop: 63,
  },
  cancelButtonText: {
	  color: "white",
  
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  errorText: {
    backgroundColor: "#F5B200",
    borderRadius: 20,
    color: "white",

    fontSize: 14,
    textAlign: "center",
    width: "100%",
    marginTop: 20,
    padding: 10,
  },
  gButton: {
    backgroundColor: "white",
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    height: 38,
    alignSelf: "center",
    width: 248,
  },
  bottomButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    alignSelf: "center",
    width: 248,
    position: "absolute",
    bottom: 0,
  },
  
  SaveButton: {
    backgroundColor: "white",
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    alignSelf: "center",
    width: 248,
    position: "absolute",
   bottom:50,
    height: 38,
  },
  buttonText: {
    color: "rgb(212, 162, 206)",
   // fontFamily: "Poppins-Regular",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  SaveButtonImage: {
    resizeMode: "contain",
    marginRight: 10,
  },
});
