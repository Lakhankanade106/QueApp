import {
    Alert,
    AsyncStorage,
} from 'react-native';
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

import {Actions} from 'react-native-router-flux'
const appId = "que-eblub";

export default class RSServer {
    
    FBSignUp = (fullname, email, password) => {
        return new Promise((resolve) => {

        });
    
    }
    GetUserDetail = (id) => {
        return new Promise((resolve) => {
        
            this.LoadUser(id).then((users)=>{
                console.log(users)
                users.myUser.findOne({ id: id }).then((result) => {
                    this._storeData(result);
                    console.log('update user:-------', result)
                    if (result !== null){
                        resolve(result)
                        console.log('ser -', result)
                    }else {
                        console.log('user', result)
                    }
                    
                }).catch((error) => console.log('update eoor:------',error));
            })
            
        });
    }
    LoadUser = (id) => {
       
        return new Promise((resolve) => {
            
            var client;
            try {
                client = Stitch.defaultAppClient;

            } catch (error) {

                client = Stitch.initializeDefaultAppClient(appId);
            }
            
            const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
            
            const db = mongoClient.db("que");
            const users = db.collection("users");
           
        
            console.log('00000000000000000000000000000000000', id)
            console.log('----------------------------')
            console.log(db)
            console.log(users)
            console.log('----------------------------')
            var res ;
        
            let dict = {
                mydb:db,
                myClient: client,
                myUser: users,
           
            }
            resolve(dict)
            
            try {
                if (client.isLoggedIn) {
                    console.log('user login')
                    return;
                }
            } catch (error) {
                console.log('try catch error:- ',error);
            }
        });
      
    }
    
    
}