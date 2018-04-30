import React, { Component } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { Button, Body, Left, Right, Container, Content, Form, Item, Icon, Input, Label, List, ListItem, Spinner, Text, Toast, Thumbnail } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';
import { logoutApp, newDataValidation, newSessionID } from '../actions/contacts';

import axios from 'axios';
import QRCode from 'react-native-qrcode';

class ProgramaPuntosScreen extends Component {
    state = {
        loading: false,
        error: false,
        messageError: '',
    }

    render (){
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
                    <View style={{ padding: 10 }}>
                        <Text>
                            Programa de Puntos de Agexport PLUS
                        </Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text>
                            Partipa en actividades AGEXPORT PLUS, ECE, Promoción Comercial, Eventos SYU, Competitividad, Sectoriales y acumula puntos para obtener descuentos especiales, y otros beneficios.
                        </Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text>
                            El canje de los puntos puede ser realizado únicamente por el contacto principal en oficinas de Agexport a través de un certificado de canje.
                        </Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text>
                            Puedes encontrar más información del programa a través de nuestra página WEB
                        </Text>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default connect()(ProgramaPuntosScreen);