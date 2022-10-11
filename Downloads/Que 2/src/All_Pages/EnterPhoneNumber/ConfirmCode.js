import React from "react"
import { Image, 
    Animated,
    Dimensions,
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    SafeAreaView,
    StatusBar,
    AsyncStorage,
    Keyboard,
    ScrollView,
    Alert } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import {Actions} from 'react-native-router-flux'
import {
    Stitch,
    RemoteMongoClient,
    UserPasswordCredential,
    AnonymousCredential,
    UserPasswordAuthProviderClient,
    FunctionCredential,
    CustomAuthProvider
  } from "mongodb-stitch-react-native-sdk";
import Svg ,{Path, Stop, SvgXml} from 'react-native-svg';
import RSStyle from '../../Style/Style'
import RSColor from "../../Style/RSColor";
import RSIcon from '../../Style/RSIcon'
import OTPTextView from './OTPText'

const appId = "que-eblub";
const height1 = Dimensions.get('window').height
const width1 = Dimensions.get('window').width
export default class GetStarted extends React.Component {
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
        this.num1 = React.createRef()
        this.num2 = React.createRef()
        this.num3 = React.createRef()
        this.num4 = React.createRef()
       
        this.state = { 
            error: false, 
            code:'',
            verify_number:'',
            database:'',
            user_key:''
        };
        this.verifyCode = this.verifyCode.bind(this);
        this.verifyPressed = this.verifyPressed.bind(this);
    }
      
    async _storeData(user) {
       // console.log(user);
        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            // Error saving data
           // console.log(error);
        }
    };
   
        
    componentDidMount() {
        this.setState(this.props.navigation.state.params);
        //console.log('params:- ', this.props.navigation.state )
    }
    
    mongo_clint(){
        client = Stitch.defaultAppClient;
       // console.log("phone number ", this.state.verify_number)
        const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
        var db = mongoClient.db("que");
        this.setState({database:db})
        db.collection("users").findOne({
            phone: this.state.verify_number
        }).then((result) => {
            //console.log("bhai phone number wala data mill gaya", result)
            let number_Id = result.uniq_id;
            this.genrate_Id(number_Id)
            //number_Id = result.username

        }).catch((error) => console.log('bhaii phone number ne to error de di eoor:------', error));
    }
     genrate_Id(number_Id) {
         console.log("number id",number_Id)
         
        if(number_Id != undefined){
            //console.log("number id data type",typeof(number_Id))
           console.log("bhai number id wali if conditon chali")
            try {
                AsyncStorage.setItem("uniq_id", number_Id);
                AsyncStorage.setItem("isUserLogin", "true");
                // console.log("store data ",JSON.stringify(user))
            } catch (error) {
                // Error saving data
                //console.log(error);
            }
           
            Actions.push('Home',{type:'reset'});
        }
        else{
            console.log("bhaii number_Id wali else conditon chali")
            let params = {
                type: 'custom',
                country: 'US',
                // email: 'jenny.rosen@example.com',
                "capabilities[card_payments][requested]": true,
                "capabilities[transfers][requested]": true
            }
            let formBody = [];
            for (let property in params) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(params[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            //console.log('body data', formBody)

            let str = "https://api.stripe.com/v1/accounts"
            fetch(str, {
                method: "POST",
                headers: new Headers({
                    'Authorization': 'Bearer sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: formBody,
                })
                .then(res => res.json())
                .then((data) => {
                    // alert('Transaction Amount  $' + Amount_value + '\n' + data.error.message)
                    //console.log('recive data1212121212121', data)
                    this.state.database.collection("users").updateOne({phone:this.state.verify_number},{"$set":{uniq_id:data.id}})
                    .then((result)=> console.log("update result",result))
                    .catch((error) => console.log('bhaii update ne to error de di eoor:------', error));
                    try {
                        //console.log("uniq_id  chali")
                         AsyncStorage.setItem("uniq_id", data.id);
                         AsyncStorage.setItem("isUserLogin", true)
                        // console.log("store data ",JSON.stringify(user))
                    } catch (error) {
                        // Error saving data
                        //console.log(error);
                    }
                    
                    //  try{
                    //      console.log("isLogin user  chala")
                    //      AsyncStorage.setItem("isLoginUser", true)
                    //  }catch(error){
                    //      console.log("error :----",error)
                    //  }
                     Actions.push('Home',{type:'reset',uniq_id:data.id});
                    //  this.setState({
                    //      uniq_id: data.id
                    //  })
                    //LET dta = JSON.parse(data)

                }).catch((er) => {
                      //console.log('error:- ', er)
                  })
        }
         
     }

    verifyCode(phone, code) {
        const credential = new FunctionCredential({
        phone: phone,
        code: code,
        });
        var state = this.state;
       
        Stitch.defaultAppClient.callFunction("verifyCode", [{phone:phone, code:code}])
            .then((result) => {
               // console.log('result:- verify code:- ', result.username); // Output: 7
                this.setState({verify_number:phone})
            let newResult = JSON.parse(result);
            //console.log('result:- verify code:- ',result); // Output: 7
            this.setState({user_key:newResult.user_key})
           // console.log('result:-  ',newResult._id);
            if ((result.error != null) && (result.error != undefined) ){
                alert(result.error.message)
                //AsyncStorage.setItem('userId', result._id)
            }else {
                const credential = new FunctionCredential({
                        phone:phone,
                        code:false
                    });
                Stitch.defaultAppClient.auth.loginWithCredential(credential).then((userLogin)=> {
                    //console.log(userLogin)
                    //AsyncStorage.setItem('isLoginUser', 'true')
                    AsyncStorage.setItem('userId', newResult.phone)
                    this.mongo_clint()
                    
                    //Actions.push('Home',{type:'reset'});
                }).catch((er) => {
                    //console.log("error:- ", er)
                })
            }
        }).catch(jjj => {
           // console.log('verify code',jjj)
        });
        // Stitch.defaultAppClient.auth.loginWithCredential(credential).then((authedUser) => {
        //     console.log("**********------------------")
        //     console.log(authedUser.profile)
        //     console.log("**********------------------")
        //     state.user = JSON.parse(authedUser.identities[0]["id"]);
        
        //     console.log("identities");
        //     console.log(state.user);
        //     this._storeData(state.user);
        //     AsyncStorage.setItem('isLoginUser', 'true')
        //     this.setState(state, function () {
        
        //         var u = state.user;
        //         const { navigate } = this.props.navigation;
        //         var d = "Home";
        //         if(typeof u.username == "undefined") {
        //         d = "UserName";
        //         }else{
        //             AsyncStorage.setItem('isLoginUser', 'true')
        //            // AsyncStorage.setItem('userId', state.user.phone)
        //         }
        //         console.log('-----------')
        //         console.log(typeof u.username + d);
        //         console.log(this.state);
        //         navigate(d, this.state);
        //     });
        //     //AsyncStorage.setItem('userId', authedUser.id)
        //     console.log(`logged in with custom function auth as user ${authedUser.id}`);
        //     }).catch((err) => {
        //     this.setState({
        //         ...this.state,
        //         ...{ error: "Login failed" },
        //     });
        //     console.log(`failed to log in with custom function auth: ${err}`);
        // });
    }
      
    verifyPressed = () => {
        this.verifyCode(this.state.phone, this.state.code);
    };
      
    onDidnTReceiveCodePressed = () => {
        const { navigate } = this.props.navigation;
    
        navigate("Login");
    };
    inputNumber(value, flag) {
        const completeFlag = `num${flag}`
        this.setState({[completeFlag]: value})
        //var s = this.state;
        var nnd = this.state.code
        var nCode = `${nnd}${value}`;
        this.setState({code:nCode});
       // console.log(value)
        flag = flag + 1
        if (flag < 5 && value) {
            const nextFlag = `num${flag}`
         
            const textInputToFocus = this[nextFlag]
            textInputToFocus.current.focus()
        }else if (flag == 5){
           // this.refs.current.blur
        }
       
    }  
    onKeyPress = (e, i) => {
        
        var otp = this.state.code
        
        if (otp != undefined){
            var otpText = otp.split("")
            this.state.code = otp.slice(0, -1)
            const val = otpText[i] || "";
            
            if (e.nativeEvent.key === "Backspace" && i !== 0 && !(val.length - 1)) {
                if(i != 1){
                   // console.log('backspace:--:backspace')
                    const newxtflat = `num${i - 1}`
                    const textInputToFocus = this[newxtflat]
                    textInputToFocus.current.focus()
                }
                
            }
        }
        
    };
    render() {
        return(
            <View style={RSStyle.backgroundView} >
                <SafeAreaView style={{flex:1}} >
                    <StatusBar barStyle="light-content"/>
                    <View style={{flex:1}}>
                        <ScrollView contentContainerStyle={{flex:1, height:'100%'}} bounces={false}>

                            <TouchableOpacity style={RSStyle.backButton} onPress={() => Actions.pop()}>
                                <Image source={RSIcon.IC_left} style={{height:30, width:40, tintColor:'white'}} resizeMode="contain"/>
                            </TouchableOpacity>
                            <View style={[RSStyle.logoMargin, {marginTop:'20%'}]}>
                                {/* <Image source={RSIcon.IC_logo} style={{height:64, width:64}} resizeMode="contain"/> */}
                                <SvgXml width="64" height="64" xml={RSIcon.IC_Logo_SVG} />

                            </View>
                            <View style={{marginTop:70}}>
                                <Text style={[RSStyle.textSlogn, {color:"rgb(247, 247, 247)"}]}>We sent you a code!</Text>
                            </View>
                            
                            <View style={{flexDirection:'row', marginTop:20, marginLeft:30, marginRight:30, height:50}}>
                                <OTPTextView ref={e => (this.otpInput = e)} 
                                textInputStyle={{color:'white'}}
                                handleTextChange={(ff) => this.setState({code:ff})}
                                containerStyle={{flex:1}}/>
                            </View>
                            
                            <TouchableOpacity style={RSStyle.codeButton} onPress={() => Actions.pop()}>
                                <Text style={{fontSize:14, color:'white', fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'}}>Didn't receive code?</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <LinearGradient
                        start={{
                            x: 0,
                            y: 0.7,
                        }}
                        end={{
                            x: 0.8,
                            y: 0.8,
                        }}
                        locations={[0, 1]}
                        colors={["rgb(151, 87, 222)", "rgb(228, 181, 203)"]}
                        style={RSStyle.startButton}
                    >
                        <TouchableOpacity style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} onPress={() => this.verifyPressed()}>
                            <Text style={{fontSize:20, color:'white', fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium'}}>Verify</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    
                </SafeAreaView>
                
            </View>
        )
    }
}