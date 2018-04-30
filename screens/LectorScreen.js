import React, { Component } from 'react';
import { Button, Body, Left, Right,Container, Content, Form, Item, Icon, Input, Label, List, ListItem, Spinner, Text, Toast, Thumbnail } from 'native-base';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { BarCodeScanner, Permissions } from 'expo';
//import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import { changeQR } from '../actions/contacts';
import axios from 'axios';

class LectorScreen extends Component {
  
  state = {
    loading: false,
    error: false,
    messageError: '',
    hasCameraPermission: null,
  }

    state = {
        hasCameraPermission: null,
        lastScannedUrl: null,
      };
    
      componentDidMount() {
        this._requestCameraPermission();
      }
    
      _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
          hasCameraPermission: status === 'granted',
        });
      };
    
      _handleBarCodeRead = result => {
        if (result.data !== this.state.lastScannedUrl) {
          LayoutAnimation.spring();
          this.setState({ lastScannedUrl: result.data });
        }
      };

  _handleBarCodeRead = ({ type, data }) => {
      const that = this;
      that.setState({ loading: true })
      const urlWS = `http://aeapi.iflexsoftware.com/transaction.json`
      const { session_id } = that.props;
    axios.post(urlWS, {
      type: 'Beneficio',
      record_id: data,
      session_id
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

    render (){
        return( <View style={styles.container}>

            {this.state.hasCameraPermission === null
              ? <Text>Requesting for camera permission</Text>
              : this.state.hasCameraPermission === false
                  ? <Text style={{ color: '#fff' }}>
                      Camera permission is not granted
                    </Text>
                  : <BarCodeScanner
                      onBarCodeRead={this._handleBarCodeRead}
                      style={{
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width,
                      }}
                    />}
    
            {this._maybeRenderUrl()}
    
            <StatusBar hidden />
          </View>
        );
    }

    _handlePressUrl = () => {
        Alert.alert(
          'Open this URL?',
          this.state.lastScannedUrl,
          [
            {
              text: 'Yes',
              onPress: () => Linking.openURL(this.state.lastScannedUrl),
            },
            { text: 'No', onPress: () => {} },
          ],
          { cancellable: false }
        );
      };
    
      _handlePressCancel = () => {
        this.setState({ lastScannedUrl: null });
      };
    
      _maybeRenderUrl = () => {
        if (!this.state.lastScannedUrl) {
          return;
        }
    
        return (
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
              <Text numberOfLines={1} style={styles.urlText}>
                {this.state.lastScannedUrl}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={this._handlePressCancel}>
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        );
      };
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 15,
      flexDirection: 'row',
    },
    url: {
      flex: 1,
    },
    urlText: {
      color: '#fff',
      fontSize: 20,
    },
    cancelButton: {
      marginLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 18,
    },
  })

const mapStateToProps = (state) => {
    const session_id = state.contacts.session_id;
  
    return{
        session_id
    }
}

export default connect(mapStateToProps)(LectorScreen);
