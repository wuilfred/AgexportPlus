import React, { Component } from 'react';
import { Dimensions, TouchableHighlight, Image, FlatList, StyleSheet, View, Platform, Linking } from 'react-native';
import {    Button, 
            Body, 
            Left, 
            Right, 
            Container, 
            Content, 
            Form, 
            Item, 
            Icon, 
            Input, 
            Label, 
            List, 
            ListItem, 
            Spinner, 
            Text, 
            Toast, 
            Thumbnail, 
            Fab, 
            Header, 
            Card, 
            CardItem
        } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import { newActivities, changeQR } from '../actions/contacts';
import axios from 'axios';

class PublicScreen extends Component {

    static navigationOptions = {
        //title: 'Actividades',
        tabBarLabel: 'INSTITUCIONAL'
    };

    state = {
        loading: false,
        error: false,
        messageError: '',
        isFetching: false,
        listaActividades: this.props.actividades || [],
        sessionID: this.props.session_id,
        rol: this.props.current_rol,
    };

    componentWillReceiveProps() {
        this._onRefresh();
    }

    componentWillMount(){
        this.loadActivities();
       
    }

    loadActivities = () => {
        const { sessionID } = this.state;
        const urlActivity = `http://aeapi.iflexsoftware.com/activity.json/${sessionID}/myActivities`;
        const that = this;
        that.setState({ loading: true });
		axios.get(urlActivity)
  		.then(function (responseActivities) {
            console.log(responseActivities);
            that.setState({ loading: false });
            const { data } = responseActivities;
            that.props.dispatch(newActivities(data));
            const lPublico = responseActivities.data.Publico || [];
            that.setState({ listaActividades: lPublico});
  		})
  		.catch(function (errorActivities) {
            that.setState({ loading: false })
            if(errorActivities.response){
                const { error } = errorActivities.response.data;
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
    };

    openQr(index){
        const { listaActividades } = this.state;
        console.log('index ', index);
        console.log(listaActividades[index]);
        let detalleActividad = listaActividades[index] || [];
        this.props.navigation.navigate('ScannerModalActivity', {
            activity_code: detalleActividad.activity_code
        });
    }

    _onRefresh(){
        const { sessionID } = this.state;
        this.setState({ isFetching: true });
        const _that = this;
        const urlActivity = `http://aeapi.iflexsoftware.com/activity.json/${sessionID}/myActivities`;
		axios.get(urlActivity)
  		.then(function (response) {
            console.log(response);
            _that.setState({ isFetching: false });
            const lPublico = response.data.Publico || [];
            _that.setState({ listaActividades: lPublico });
  		})
  		.catch(function (errorRefreshing) {
            _that.setState({ isFetching: false });
            if(errorRefreshing.response){
                const { error } = errorRefreshing.response.data;
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

    _keyExtractor = (item, index) => index;

    _emptyList = () => {
        return(
            <View style={Styles.center}>
                <Text>
                    No hay eventos 
                </Text>
            </View>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE',
                }}
            />
        );
    };

    openMap = (index) => {
        const { listaActividades } = this.state;
        console.log(listaActividades);
        if(Platform.OS === 'ios'){
            let url = `http://maps.apple.com/maps?q=Actividad,ll=${listaActividades[index].latitude},${listaActividades[index].longitude}`;
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
        }else{
            let url = `http://maps.google.com/maps?q=${listaActividades[index].latitude},${listaActividades[index].longitude}`;
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
        }
    }

    _goDetalle (index){
        
        const { listaActividades } = this.state;
        //console.log('index ', index);
        //console.log(listaActividades[index]);
        let detalleActividad = listaActividades[index] || [];
        this.props.navigation.navigate('DetalleActivity', {
            detalle: detalleActividad
        });
    };

    _renderItem = ({item, index}) => {
        const screenWidth = Dimensions.get('window').width;
        //const { onGoDetalle } = this.props
        const { rol } = this.state;

        return(
       
          <Card style={{ borderTopWidth: 1, borderColor: 'white', borderTopWidth: 0}}>
            <CardItem button style={{ flex: 0 }} onPress={() => this._goDetalle(index)}>
              <Left>
                <Thumbnail square large size={150} source={{uri: item.images[0].url}} />
                <Body>
                    <Text><Icon name="calendar" /> {item.subject}</Text>
                    <Text><Icon name="calendar" /> {item.datetrx}</Text>
                    <Text><Icon name="calendar" /> {item.cost_type}</Text>              
                </Body>
              </Left>
            </CardItem>
            <CardItem style={{flex:0, height: 0, marginBottom: 10}}>
              <Left>
                <Button transparent textStyle={ {color: '#87838B' }}
                        success style={{ alignSelf: 'flex-end' }}
                        onPress={() => this.openMap(index)}>
                  <Icon name="ios-pin"  />
                  <Text>{item.location}</Text>
                </Button>
              </Left>
              
            { rol == 'Agexport' && 
                <Right>
                    <Button iconLeft transparent primary onPress={() => this.openQr(index)}
                        style={{ alignSelf: 'flex-end', marginLeft:10 }}>
                        <Icon name='ios-qr-scanner' /><Text>QR</Text>
                    </Button>
                 </Right>
            }

                
            </CardItem>
          </Card>
        );
    };

    render (){
        const { rol } = this.state;
        const { loading, error, messageError, listaActividades } = this.state

		if (loading) {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Spinner color='blue' />
				</View>
			)
		}

		if (error) {
			return (
				<View style={Styles.center}>
					<Text>
						{ messageError }
					</Text>
				</View>
			)
		}

        return(
            <View style={{ flex: 1 }}>
            <FlatList
                data={listaActividades}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                ItemSeparatorComponent={this.renderSeparator}
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.isFetching}
                ListEmptyComponent={this._emptyList()}
            />
             { rol == 'Regular' && 
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#33cc33' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('ScannerModal')}>
                    <Icon name='ios-qr-scanner' />
                
                </Fab>
             }
        </View>
            
        )
    }
}

const mapStateToProps = (state) => {
    const current_rol = state.contacts.rol;
    const session_id = state.contacts.session_id;
    const actividades = state.contacts.actividades.Publico;
    return{
        current_rol,
        session_id,
        actividades
    }
}

export default connect(mapStateToProps)(PublicScreen);
