import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, Container, Content, Form, Item, Input, Label, Spinner, Text, Toast, Thumbnail } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import { newRol, newDataValidation, newSessionID, saveInvitationCode, savePhoneNumber, newRegister } from '../actions/contacts';
import axios from 'axios';

class ValidacionScreen extends Component {

    static navigationOptions = {
        headerBackTitle: null
    };

    state = {
        loading: false,
        error: false,
        messageError: '',
        code_sms: null,
        fullname:this.props.fullname,
        session: this.props.session,
        contact_id: this.props.contact_id,
        phone: this.props.phone,
        code: this.props.code,
    }

    goProfile = () => {
        const that = this;
        that.setState({ loading: true });
        const { session, code_sms, phone, contact_id, fullname } = this.state;
        const device_id = Expo.Constants.deviceId;
        if(!code_sms || !fullname){
            console.log('Todos los campos son requeridos');
            Toast.show({
              text: 'Todos los campos son requeridos!',
              position: 'top',
              buttonText: 'Ok',
              type:'warning'
            });
            that.setState({ loading: false });
            return;
        }
        const inputSMS = this.props.code_sms;
        if(code_sms != inputSMS){
            Toast.show({
              text: 'Código SMS no concuerda, verifica',
              position: 'top',
              buttonText: 'Ok',
              type:'warning'
            });
            that.setState({ loading: false });
            return;
        }

        let urlConfirmDevice = `http://aeapi.iflexsoftware.com/device/confirm.json`;
        axios.get(urlConfirmDevice, {
            params: {
                c_contact_id: contact_id,
                device_id,
                serial: device_id
            }
        }).then(function(confirmData){
            console.log('confirmData');
            const { session_id } = confirmData.data;
            that.props.dispatch(newSessionID(session_id));
            const urlWS = `http://aeapi.iflexsoftware.com/contact.json/${session_id}/profile`;
            axios.get(urlWS)
            .then(function (response) {
                const { data } = response;
                const { role } = data.data;
                that.props.dispatch(newRol(role));
                that.props.dispatch(newDataValidation(data));
                that.setState({ loading: false});
                that.props.navigation.navigate('App');
            })
            .catch(function (errorProfile) {
                console.log('errorProfile')
                that.setState({ loading: false })
                if(errorProfile.response){
                    const { error } = errorProfile.response.data;
                    const { message } = error;                    
                    Toast.show({
                        text: message,
                        position: 'top',
                        buttonText: 'Ok',
                        type:'danger',
                        duration:5000
                    });
                }else{
                    Toast.show({
                        text: 'Ocurrió un problema, intenta más tarde',
                        position: 'top',
                        buttonText: 'Ok',
                        type:'danger',
                        duration:5000
                    });   
                }
            });
        })
        .catch(function(errorConfirm){
            console.log('errorConfirm');
            console.log(errorConfirm);
            console.log(errorConfirm.response);
            that.setState({ loading: false })
            if(errorConfirm.response){
                const { error } = errorConfirm.response.data;
                const { message } = error;                
                Toast.show({
                    text: message,
                    position: 'top',
                    buttonText: 'Ok',
                    type:'danger',
                    duration:5000
                });
            }else{
                Toast.show({
                    text: 'Ocurrió un problema, intenta más tarde',
                    position: 'top',
                    buttonText: 'Ok',
                    type:'danger',
                    duration:5000
                });   
            }
        });
    }

    sendCodeAgain = () =>{
        const that = this;
        that.setState({ loading: true });
        const { phone, code } = this.state;
        const urlWS = `http://aeapi.iflexsoftware.com/contact/invite.json/${code}` 
		axios.post(urlWS, {
    		phone
  		})
  		.then(function (response) {
            const { contact } = response.data;
			that.setState({ loading: false });
            that.props.dispatch(saveInvitationCode(code));
            that.props.dispatch(savePhoneNumber(phone));
            that.props.dispatch(newRegister(contact));
            Toast.show({
              text: 'Se envio el código SMS nuevamente',
              position: 'top',
              buttonText: 'Ok',
              type:'success',
              duration:5000
            });
  		})
  		.catch(function (error) {
            const { message } = error.response.data.error;
            that.setState({ loading: false })
            Toast.show({
              text: message,
              position: 'top',
              buttonText: 'Ok',
              type:'danger',
              duration:5000
            });
  		});
    }

    render (){
        const { width } = Dimensions.get('window');
        const { loading, error, messageError } = this.state

		if (loading) {
			return (
				<View style={{ flex: 1, justifyContent: 'center',alignItems: 'center' }}>
					<Spinner color='blue' />
				</View>
			)
		}

		if (error) {
			return (
				<View style={styles.center}>
					<Text>
						{ messageError }
					</Text>
				</View>
			)
		}
        return(
            <Container>
                <Content style={Styles.backgroundContainer}>
                    <View style={{ alignItems:'center' }} >
                        <Thumbnail style={{flex:1, width:280, height:100 }} resizeMode='contain' source={require('../assets/img/logo.png')} />
                    </View>
                    <View style={ Styles.paddingLR20 }>
                        <Form>
                            <Item stackedLabel>
                                <Label>Nombre:</Label>
                                <Input
                                    editable={false}
                                    onChangeText={(fullname)=> this.setState({fullname})}
                                    value={this.state.fullname} />
                            </Item>
                            <Item stackedLabel last>
                                <Label>Código SMS</Label>
                                <Input
                                    onChangeText={(code_sms)=> this.setState({ code_sms })}
                                    value={this.state.code_sms}
                                    keyboardType={"numeric"}
                                />
                            </Item>
                            <Button 
                                onPress={this.goProfile}
                                style={Styles.btnActivar} full>
                                <Text>Activar</Text>
                            </Button>
                            <Button 
                                onPress={this.sendCodeAgain}
                                style={Styles.btnActivar} full>
                                <Text>Reenviar Codigo SMS</Text>
                            </Button>
                        </Form>
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) =>{
    const contact_id = state.contacts.info.c_contact_id;
    const code_sms   = state.contacts.info.sms_code;
    const fullname   = state.contacts.info.concat_ws;
    const session    = state.contacts.info.session_id;
    const phone      = state.contacts.phone;
    const code       = state.contacts.code;
    const session_id = state.contacts.session_id;
    return{
        contact_id,
        fullname,
        code_sms,
        session,
        phone,
        code,
        session_id
    }
}

export default connect(mapStateToProps)(ValidacionScreen);