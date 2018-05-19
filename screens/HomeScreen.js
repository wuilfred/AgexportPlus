import React, { Component } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { Button, Body, Left, Right, Container, Content, Form, Item, Icon, Input, Label, List, ListItem, Spinner, Text, Toast, Thumbnail } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import { logoutApp, newDataValidation, newSessionID } from '../actions/contacts';

import axios from 'axios';
import QRCode from 'react-native-qrcode';

class HomeScreen extends Component {

    state = {
        appState: AppState.currentState,
        loading: false,
        error: false,
        messageError: '',
        contact_id: this.props.contact_id,
        session_id: this.props.session_id,
        firstname1: this.props.firstname1,
        firstname2: this.props.firstname2,
        lastname1: this.props.lastname1,
        lastname2: this.props.lastname2,
        company: this.props.company,
        rol: this.props.current_rol,
        type: this.props.type,
    }

    componentWillUnmount() {
        console.log('componentWillUnmount', this.appState);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidMount() {
        console.log('componentDidMount', this.appState);
        AppState.addEventListener('change', this._handleAppStateChange);
        console.log('componentDidMount2', this.appState);
    }

    _handleAppStateChange = (nextAppState) => {
        console.log(nextAppState);
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');
            this._newSessionID();
        }else{
            console.log('App has gone to background!');
            // save stuff to storagethis.storeState(); 
        }
          this.setState({ appState: nextAppState }); 
        this.setState({appState: nextAppState});
    }

    logout = () => {
        this.props.dispatch(logoutApp());
        this.props.navigation.navigate('Auth');
    }

    _newSessionID = () => {
        const that = this;
        that.setState({ loading: true });
        let urlConfirmDevice = `http://aeapi.iflexsoftware.com/device/confirm.json`;
        const { contact_id } = this.state;
        const device_id = Expo.Constants.deviceId;
        axios.get(urlConfirmDevice, {
            params: {
                c_contact_id: contact_id,
                device_id,
                serial: device_id
            }
        }).then(function(confirmData){
            console.log(confirmData);
            const { session_id } = confirmData.data;
            that.props.dispatch(newSessionID(session_id));
            that.setState({ loading: false, session_id });
        })
        .catch(function(errorConfirm){
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

    _goUpModalInfo(typeUser){
        const { contact_id, session_id } = this.state;
        this.props.navigation.navigate('EditarModal', {
            contact_id,
            session_id,
            typeUser,
        });
        
    }
    

    render (){
        const { loading, error, messageError, firstname1, firstname2, lastname1, lastname2, company, session_id, rol, type } = this.state;
        const customFullName = ` ${firstname1 === null ? '' : firstname1} ${firstname2 === null ? '' : firstname2} ${lastname1 === null ? '': lastname1} ${ lastname2 === null ? '' : lastname2 }`;
        //const { rol } = this.state;
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
                    <View style={{ alignItems:'center', marginTop:5 }}>
                        <QRCode
                            value={session_id}
                            size={200}
                        />
                    </View>
                    <View style={ Styles.paddingLRT20 }>
                        <List>
                            <ListItem icon>
                                <Left>
                                    <Icon style={Styles.colorText} name="md-person" />
                                </Left>
                                <Body>
                                    <Text style={Styles.colorText}>{customFullName}</Text>
                                </Body>
                                { rol == 'Regular' &&
                                    <Icon style={Styles.colorText} name="md-create"
                                    onPress={() => this._goUpModalInfo('contact')}
                                    ></Icon>
                                }
                                <Right />
                            </ListItem>
                            <ListItem icon>
                                <Left>
                                    <Icon style={Styles.colorText} name="md-people" />
                                </Left>
                                <Body>
                                    <Text style={Styles.colorText}>{company}</Text>
                                </Body>
                                
                                { rol == 'Regular' && type == 'Principal' &&
                                    <Icon style={Styles.colorText} name="md-create"
                                    onPress={() => this._goUpModalInfo('company')}
                                    ></Icon>
                                }
                                <Right />
                            </ListItem>
                        </List>
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) =>{
    const firstname1 = state.contacts.contact.data.firstname1;
    const firstname2 = state.contacts.contact.data.firstname2;
    const lastname1  = state.contacts.contact.data.lastname1;
    const lastname2  = state.contacts.contact.data.lastname2;
    const company    = state.contacts.info.company;
    const contact_id = state.contacts.info.c_contact_id;
    const session_id = state.contacts.session_id;
    const current_rol = state.contacts.rol;
    const type       = state.contacts.contact.data.type;
    return{
        firstname1,
        firstname2,
        lastname1,
        lastname2,
        company,
        contact_id,
        session_id,
        current_rol,
        type,
    }
}

export default connect(mapStateToProps)(HomeScreen);
