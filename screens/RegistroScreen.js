import React, { Component } from 'react';
import { Dimensions, StyleSheet, Platform, View } from 'react-native';
import { Button, Container, Content, Form, Item, Input, Label, Spinner, Text, Toast, Thumbnail } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import { newRegister, savePhoneNumber, newSessionID, saveInvitationCode } from '../actions/contacts'; 
import axios from 'axios';

class RegistroScreen extends Component {

    state = {
        loading: false,
        error: false,
        messageError: '',
        invitation_code: null,
        phone_number:null,
    }

    makeValidation = () => {
        const that = this;
        that.setState({ loading: true })
        const { invitation_code, phone_number } = this.state;
        if(!invitation_code || !phone_number){
            console.log('Todos los campos son requeridos');
            Toast.show({
              text: 'Todos los campos son requeridos!',
              position: 'top',
              buttonText: 'Ok',
              type:'warning',
              duration:5000
            });
            that.setState({ loading: false })
            return;
        }
        const codInvitation = parseInt(invitation_code);
        const urlWS = `http://aeapi.iflexsoftware.com/contact/invite.json/${codInvitation}` 
        console.log(urlWS);
        console.log(phone_number);
		axios.post(urlWS, {
    		phone: phone_number
  		})
  		.then(function (response) {
            const { contact } = response.data;
            that.props.dispatch(saveInvitationCode(codInvitation));
            that.props.dispatch(savePhoneNumber(phone_number));            
            const { session_id, c_contact_id } = contact;
            that.props.dispatch(newSessionID(session_id));
            that.props.dispatch(newRegister(contact));
            let device_id = Expo.Constants.deviceId;
            let manufacturer = Expo.Constants.deviceName;
            let platform = Platform.OS === 'ios' ? 'ios' : 'android';
            const urlInsertValidate = `http://aeapi.iflexsoftware.com/contact/validate.json`;
            axios.post(urlInsertValidate, {
                c_contact_id,
                device_id,
                serial: device_id,
                manufacturer,
                platform,
                validated_phone: phone_number
            }).then(function(responseInsert){
                that.setState({ loading: false })
                that.props.navigation.navigate('Validacion');
            }).catch(function(errorValidate){
                that.setState({ loading: false })
                if(errorValidate.response){
                    const { error } = errorValidate.response.data;
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
  		.catch(function (errorInvite) {
            console.log(errorInvite);
            that.setState({ loading: false })
            if(errorInvite.response){
                const { error } = errorInvite.response.data;
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
                    text: 'Ocurrió un problema, intenta más tarde 2',
                    position: 'top',
                    buttonText: 'Ok',
                    type:'danger',
                    duration:5000
                });   
            } 
  		});
    }

    onChange(field, text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if ( numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
        }
        if(field == 'invitation_code'){
            this.setState({invitation_code: newText})
        }else{
            this.setState({phone_number: newText})
        }
    }

    render (){
        const { width } = Dimensions.get('window');
        const { loading, error, messageError } = this.state
        let nameDevice = Expo.Constants.deviceName;
        let sessionId  = Expo.Constants.sessionId; 

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
                                <Label>Código de invitación</Label>
                                <Input
                                    onChangeText={(invitation_code)=> this.onChange('invitation_code', invitation_code)}
                                    value={this.state.invitation_code}
                                    keyboardType={"numeric"} />
                            </Item>
                            <Item stackedLabel last>
                                <Label>No. celular</Label>
                                <Input
                                    onChangeText={(phone_number)=> this.onChange('phone_number', phone_number)}
                                    value={this.state.phone_number}
                                    keyboardType={"numeric"} />
                            </Item>
                            <Button 
                                onPress={this.makeValidation}
                                style={Styles.btnActivar} full>
                                <Text>Activar</Text>
                            </Button>
                            <View style={ Styles.btnRequest }>
                                <Button
                                    style={Styles.btnActivar} full
                                    onPress={() => this.props.navigation.navigate('Solicitud')}>
                                    <Text>¿No tiene código? Solicitar Código aquí</Text>
                                </Button>
                            </View>
                        </Form>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default connect()(RegistroScreen);