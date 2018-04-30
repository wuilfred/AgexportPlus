import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    center:{
        alignItems:'center'
    },
    backgroundContainer: {
        backgroundColor:'#FFF'
    },
    paddingLR20:{
        paddingLeft: 20, 
        paddingRight: 20
    },
    paddingLRT20:{
        paddingLeft: 20, 
        paddingRight: 20,
        marginTop:20
    },
    btnActivar:{
        backgroundColor:'#09175E',
        marginTop: 20,
    },
    btnRequest:{
        marginTop:30, 
        flex: 1, 
        alignItems: 'center',  
        flexDirection: 'column'
    },
    colorText: {
        color:'#09175E'
    },
    removeBorder:{
        borderBottomWidth:0,
        paddingBottom:5
    },
    icon: {
        width: 24,
        height: 24,
    },
    pickerStyle:{
        color: '#000000',
        paddingLeft: 5
    },
    headerStyle:{
        backgroundColor: '#0A1040',
    },
    colorStyle:{
        color: '#FFF'
    },
    closeButtonHeader:{
        fontSize: 40,
        color: 'white'
    },
    mt20:{
        marginTop: 20
    },
    keyboardAvoidContainer:{
        flex: 1
    }
})

export default Styles;
