import React, { Component } from 'react';
import { Dimensions, TouchableHighlight, Image, FlatList, StyleSheet, View, Platform } from 'react-native';
import { Button, Body, Left, Right, Container, Content, Form, Item, Icon, Input, Label, List, ListItem, Spinner, Text, Toast, Thumbnail, Fab, Card, CardItem } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import axios from 'axios';

class PrivateScreen extends Component {

    static navigationOptions = {
        //title: 'Actividades',
        //headerTitleStyle: Platform.OS === 'ios' ? { color: 'white' } : { textAlign: 'center', alignSelf: 'center', marginLeft: 115, fontWeight: 'normal', fontSize: 12, color: 'white' },
        tabBarLabel: 'SECTORIAL'
    };

    state = {
        loading: false,
        error: false,
        messageError: '',
        isFetching: false,
        listaActividades: this.props.actividades.Privado || [],
        sessionID: this.props.session_id,
        rol: this.props.current_rol,
    } 

    componentWillReceiveProps() {
        this._onRefresh();
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
            const lista = responseActivities.data.Privado || [];
            that.setState({ listaActividades: lista});
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

    _onRefresh(){
        const { sessionID } = this.state;
        this.setState({ isFetching: true });
        const _that = this;
        const urlActivity = `http://aeapi.iflexsoftware.com/activity.json/${sessionID}/myActivities`;
		axios.get(urlActivity)
  		.then(function (response) {
            console.log(response);
            _that.setState({ isFetching: false });
            const lista = response.data.Privado || [];
            _that.setState({ listaActividades: lista });
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

    onPressLearnMore = () => {
        this.props.navigation.navigate('DetalleActivity')
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

    _goDetalle (index){
        const { listaActividades } = this.state;
        console.log('index ', index);
        console.log(listaActividades[index]);
        let detalleActividad = listaActividades[index] || [];
        this.props.navigation.navigate('DetalleActivity', {
            detalle: detalleActividad
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


    _renderItem = ({item, index}) => {
        const screenWidth = Dimensions.get('window').width;
        //const { onGoDetalle } = this.props
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
              <Right>
                    <Button iconLeft transparent primary onPress={() => this.openQr(index)}
                        style={{ alignSelf: 'flex-end', marginLeft:10 }}>
                        <Icon name='ios-qr-scanner' /><Text>QR</Text>
                    </Button>
                </Right>
            </CardItem>
          </Card>
            /*<TouchableHighlight>
                <ListItem button style={{borderBottomWidth: 0}}>
                    <Thumbnail size={100} source={{uri: item.images[0].url}}  />
                    <Body style={{ paddingLeft:15 }}>
                        <Item style={Styles.removeBorder}>
                            <Icon name="calendar" />
                            <Text>{item.subject}</Text>
                        </Item>
                        <Item style={Styles.removeBorder}>
                            <Icon name="calendar" />
                            <Text>{item.datetrx}</Text>
                        </Item>
                        <Item style={Styles.removeBorder}>
                            <Icon name="ios-pin" />
                            <Text>{item.location}</Text>
                        </Item>
                    </Body>
                    <Right>
                        <Button light onPress={() => this._goDetalle(index) }>
                            <Icon active name="arrow-forward" />
                        </Button>
                    </Right>
                </ListItem>
            </TouchableHighlight>*/
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
    const actividades = state.contacts.actividades;
    return{
        current_rol,
        session_id,
        actividades
    }
}

export default connect(mapStateToProps)(PrivateScreen);