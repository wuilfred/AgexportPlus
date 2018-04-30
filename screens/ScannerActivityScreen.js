import React, { Component } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { Button, Body, Left, Right, Container, Content, Form, Item, Icon, Input, Label, List, ListItem, Spinner, Text, Toast, Thumbnail } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import axios from 'axios';

class ScannerActivityScreen extends Component {
    state = {
        loading: false,
        error: false,
        messageError: '',
        hasCameraPermission: null,
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    _handleBarCodeRead = ({ type, data }) => {
        const that = this;
        const { params } = that.props.navigation.state;
        const { activity_code } = params;
        that.setState({ loading: true })
        const urlWS = `http://aeapi.iflexsoftware.com/transaction.json`
		axios.post(urlWS, {
    		type: 'Asistencia',
            record_id: activity_code,
            session_id: data
  		}).then(function (responseScanner) {
            that.setState({ loading: false })
            const { message } = responseScanner.data;
            Toast.show({
                text: message,
                position: 'top',
                buttonText: 'Ok',
                type:'success',
                duration:5000
            });
            that.props.navigation.goBack()
        }).catch(function(errorScanner){
            that.setState({ loading: false })
            if(errorScanner.response){
                const { error } = errorScanner.response.data;
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
                    text: 'Ocurrió un problema, intenta más tarde ',
                    position: 'top',
                    buttonText: 'Ok',
                    type:'danger',
                    duration:5000
                });   
            }
        })
    }

    render() {
        const { loading, error, messageError, hasCameraPermission } = this.state
        const { session_id } = this.props;
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
        console.log('hasCameraPermission ', hasCameraPermission)
        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flex:1, backgroundColor: 'skyblue'}}>
                        <BarCodeScanner
                            onBarCodeRead={this._handleBarCodeRead}
                            style={StyleSheet.absoluteFill}
                        >
                            <Button success rounded style={{ alignSelf: 'flex-end', marginTop:25, marginRight: 25 }}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Icon name='ios-close' />
                            </Button>
                        </BarCodeScanner>
                    </View>
                </View>
            );
        }
    }
}

const mapStateToProps = (state) =>{
    const session_id = state.contacts.session_id;
    return{
        session_id
    }
}

export default connect(mapStateToProps)(ScannerActivityScreen);