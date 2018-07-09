import React, { Component } from 'react';
import { Dimensions, TouchableHighlight, Image, FlatList, StyleSheet, View, Platform } from 'react-native';
import {    Button, 
            Body, 
            Left, 
            Right, 
            Container, 
            Header,
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
            Card, 
            CardItem,
            Thumbnail } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import { newOffers } from '../actions/contacts';
import axios from 'axios';

class BeneficioScreen extends Component {
    
    static navigationOptions = {
        //title: 'Beneficios',
        headerTitleStyle: Platform.OS === 'ios' ? { color: 'white' } : { textAlign: 'center', alignSelf: 'center', marginLeft: 115, fontWeight: 'normal', fontSize: 12, color: 'white' } 
    };

    state = {
        loading: false,
        error: false,
        messageError: '',
        isFetching: false,
        listaDeBeneficios: [],
        sessionID: this.props.session_id,
        rol: this.props.current_rol,
    }

    logout = () => {
        this.props.dispatch(logoutApp());
        this.props.navigation.navigate('Auth');
    }

    componentWillMount(){
        this.loadBeneficios();
    }

    _goDetalle (index){
        const { listaDeBeneficios } = this.state;
        console.log('index ', index);
        console.log(listaDeBeneficios[index]);
        let detalleBeneficio = listaDeBeneficios[index] || [];
        this.props.navigation.navigate('DetalleBeneficio', {
            detalle: detalleBeneficio
        });
    };

    loadBeneficios = () => {
        const { sessionID, rol } = this.state;
        let urlBeneficios = (rol != 'Regular') ? `http://aeapi.iflexsoftware.com/offer.json/${sessionID}/myOffers` : `http://aeapi.iflexsoftware.com/offer.json`;
        console.log(urlBeneficios);
        const that = this;
        that.setState({ loading: true });
		axios.get(urlBeneficios)
  		.then(function (responseBeneficios) {
            //console.log(responseBeneficios, 'bug bug');
            that.setState({ loading: false });
            const { data } = responseBeneficios;
            const { offer } = data;
            that.props.dispatch(newOffers(offer));
            const lOfertas = offer || [];
            that.setState({ listaDeBeneficios: lOfertas});
            that.props.navigation.goBack()
  		})
  		.catch(function (errorBeneficios) {
            that.setState({ loading: false })
            if(errorBeneficios.response){
                const { error } = errorBeneficios.response.data;
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

    openQr(offerid){
        //console.log(offerid, 'bug aa1');
        this.props.navigation.navigate('Lector', {
            record_id: offerid,
            type: 'Beneficio'
        });
        /*this.props.navigation.navigate('Lector', {
            record_id: this.props.navigation.state.params.detalle.a001_offer_id,
            type: 'Beneficio'
        });*/
    }

    _onRefresh(){
        console.log('Onrefresh');
        this.loadBeneficios();
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

    _renderItem = ({item, index}) => {
        const screenWidth = Dimensions.get('window').width;
        const { rol } = this.state;
        //const { onGoDetalle } = this.props
        return(
            
            <TouchableHighlight>
              <Card>
                <CardItem>
                  <Left>
                    <Thumbnail square small source={{uri: item.images[0].url}} />
                    <Body>
                      <Text>{item.name}</Text>
                      <Text note>{item.description}</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem button onPress={() => this._goDetalle(index)} cardBody>
                    <Image source={{uri: item.images[1].url }} style={{height: 250, width: null, flex: 1}} />
                 </CardItem>
                 <CardItem>
                    <Left>
                        <Button transparent  onPress={() => this._goDetalle(index)}>
                        <Icon active name="thumbs-up" />
                        <Text>Favoritos</Text>
                        </Button>
                    </Left>
                    <Right>
                    { rol != 'Regular' && 
                        <Button iconLeft transparent primary onPress={() => this.openQr(item.a001_offer_id)}
                            style={{ alignSelf: 'flex-end', marginLeft:10 }}>
                           <Icon name='ios-qr-scanner' /><Text>QR</Text>
                        </Button>
                    }
                    </Right>
                </CardItem>
              </Card>
          </TouchableHighlight>
        );
    };

    render (){
        const { loading, error, messageError, listaDeBeneficios } = this.state

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
            <FlatList
                data={listaDeBeneficios}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                ItemSeparatorComponent={this.renderSeparator}
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.isFetching}
                ListEmptyComponent={this._emptyList()}
            />
        ) 
    }
}

const mapStateToProps = (state) =>{
    const current_rol = state.contacts.rol;
    const session_id  = state.contacts.session_id;
    return{
        current_rol,
        session_id
    }
}

export default connect(mapStateToProps)(BeneficioScreen);
