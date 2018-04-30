import React, { Component } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { Button, Body, Left, Right, Container, Content, Form, Item, Icon, Input, Label, List, ListItem, Spinner, Text, Toast, Thumbnail } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import { logoutApp, newDataValidation, newSessionID } from '../actions/contacts';

import axios from 'axios';
import QRCode from 'react-native-qrcode';

class ProgramaBeneficiosScreen extends Component {
    state = {
        loading: false,
        error: false,
        messageError: '',
    }

    render (){
        const { loading, error, messageError } = this.state
        const contentHTML = ''
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
                    <View style={{ padding: 10 }}>
                        <Text>
                            Programa de fidelización que brinda al asociado, la oportunidad de obtener descuentos y beneficios exclusivos de AGEXPORT y sus aliados.
                        </Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text>
                            En este programa  obtendrás los siguientes beneficios:

                        </Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <List>
                            <ListItem>
                                <Text>1. Capacitaciones </Text>
                            </ListItem>
                            <ListItem>
                                <Text>2. Descuentos especiales en servicios AGEXPORT</Text>
                            </ListItem>
                            <ListItem>
                                <Text>3. Descuentos en establecimientos aliados</Text>
                            </ListItem>
                            <ListItem>
                                <Text>4. Eventos especiales de Networking</Text>
                            </ListItem>
                            <ListItem>
                                <Text>5. Acceso VIP a SYU y ofertas exclusivas para asociados.</Text>
                            </ListItem>
                            <ListItem>
                                <Text>6. Acumulación de puntos por participar en actividades AGEXPORT.</Text>
                            </ListItem>
                        </List>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default connect()(ProgramaBeneficiosScreen);
