import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native'
import RSColor from './RSColor'

const width1 = Dimensions.get('window').width
const height1 = Dimensions.get('window').height

const RSStyle = StyleSheet.create({
    viewFlex:{
        flex:1
    },
    viewFlexDirectionRow:{
        flexDirection:'row'
    },
    alimentCenter:{
        justifyContent:'center',
        alignItems:'center'
    },
    backgroundView:{
        backgroundColor:RSColor.BackColor,
        width:width1,
        height:'100%'
    },
    logoMargin:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:height1/5,
        
    },
    startButton:{
       
        height:60, 
        width:width1-70,
       
        alignSelf:'center',
        borderRadius:15,
        marginBottom:30
    },
    textSlogn:{
        color:RSColor.textColor,
        fontSize:20,
        alignSelf:'center', 
        marginTop:20,
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium'
    },
    inputPhone:{
        height:50,
        borderWidth:1,
        width:width1-50,
        paddingLeft:20, 
        paddingRight:20,
        marginTop:20,
        color:'white',
        fontSize:20,
        borderColor:"rgba(80, 55, 116, 1)",
        borderRadius:15,
        marginLeft:25,
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular',
        paddingTop: 0, paddingBottom: 0,
        
    },
    backButton:{
        marginTop:20, marginLeft:20
    },
    errorText: {
        backgroundColor: "#F5B200",
        borderRadius:20,
        color:"white",
 
        fontSize: 14,
        textAlign: "center",
        width: width1-40,
        padding: 10,
        marginLeft:20,
        marginTop:20
    },
    inputCode:{
        height:60,
        borderWidth:1,
        color:'white',
        fontSize:20,
        borderColor:"rgba(151, 87, 222, 0.5)",
        borderRadius:15,
        flex:1,
        textAlign:'center',
        marginLeft:5,
        marginRight:5,
    },
    codeButton:{
        height:40,
        width:204,
        borderWidth:2,
        borderRadius:10,
    
        marginTop:30,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'rgb(147, 85, 229)',
        alignSelf:'center'

    },
    dateButton:{
        marginLeft:20,
        marginTop:20,
        alignItems:'center',
        flexDirection:'row',
        
    },
    dateFont:{
        fontSize:18,
        color:'rgb(151, 87, 222)',
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'
    },
    noAppointText:{
        color:'black',
        marginTop:30,
        alignSelf:'center',
        marginTop:'20%',
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'
    },
    appointmentView:{
        
        flex:1,
        width:width1,
        marginLeft:30,
        flexDirection:'row',
        marginTop:20
    },
    timeTextView:{
        marginLeft:40
    },
    appointmentViewInner:{
        

        alignItems: "center",
        marginTop:10
        
    },
    descriptionText:{
        color:'red',
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular'
    },
    appointHeader:{
        flexDirection:'row',
        marginTop:25, 
        marginLeft:30,
        marginRight:30,
        alignItems:'center',
        height:40
    },
    appointBackView:{
        backgroundColor:RSColor.BackColor,
        marginTop:5,
        flex:1,
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        width:width1,
        alignItems:'center',
    
    },
    appointHeaderText:{
        fontSize:28,
        color:'white',
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium'
        
    },
    appointCloseBUtton:{
        //borderWidth:2,
        height:40,
        width:40,
        //borderColor:"rgb(225,180,204)",
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center'
    },
    appointFieldView:{
        width:width1-50
    
    },
    appointPlaceHolder:{
        color:"rgb(228, 181, 203)",
        fontSize:18,
        marginTop:30,
        marginLeft:10,
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsMedium'
    },
    appointInput:{
        width:'100%',
        height:50,
        borderWidth:1,
        borderRadius:10,
        marginTop:8,
        fontSize:19,
        paddingLeft:20,
        paddingRight:20,
        borderColor:'gray',
        color:'white',
        fontFamily:Platform.OS == 'ios'?'Poppins':'PoppinsRegular',
        textAlign:"justify",
        paddingTop: 0, paddingBottom: 0,
    },
    appointSwitch:{
        marginTop:30,
        marginLeft:10
        
    },
    appointSaveButton:{
        
        height:60, 
        width:width1-70,
   
        borderRadius:20,
        marginTop:50,
        marginLeft:35,
        marginBottom:20,
        
    },
    draggable: {
        flex:1,
   
      
    },
    dragHandle: {
      fontSize: 22,
      color: '#707070',
      height: 60
    },
    searchbarView:{
        backgroundColor:"rgb(238, 241, 248)",
        height:'100%', 
        width:'100%',
        borderRadius:10,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:15
    }
})
export default RSStyle;
//lineHeight: Platform.OS === 'ios' ? 40 : 20