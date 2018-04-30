import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux';
import { logoutApp } from '../actions/contacts';

class DrawerContainer extends React.Component {

    state = {
        loading: false,
        error: false,
        messageError: '',
        session_id: this.props.session_id,
        rol: this.props.rol,
        typeUser: this.props.typeUser,
    }

    logout = () => {
        this.props.dispatch(logoutApp());
        this.props.navigation.navigate('Auth');
    }

    render() {
        const { navigation } = this.props;
        const { rol, typeUser } = this.state;
        return (
            <View style={styles.container}>
                <Text
                    onPress={() => navigation.navigate('ProgramaBeneficios')}
                    style={styles.uglyDrawerItem}>
                    Programa de Beneficios
                </Text>
                <Text
                    onPress={() => navigation.navigate('ProgramaPuntos')}
                    style={styles.uglyDrawerItem}>
                    Programa de Puntos
                </Text>
                { rol == 'Regular' && typeUser == 'Principal' && 
                    <Text
                        onPress={() => navigation.navigate('Invitados')}
                        style={styles.uglyDrawerItem}>
                        Mis Invitados
                    </Text>
                }
                <Text
                    onPress={this.logout}
                    style={styles.uglyDrawerItem}>
                    Cerrar Sesión
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        paddingTop: 40,
        paddingHorizontal: 20
    },
    uglyDrawerItem: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#09175E',
        padding: 15,
        borderBottomWidth: 1,
    }
});

const mapStateToProps = (state) =>{
    const session_id = state.contacts.session_id;
    const rol = state.contacts.rol;
    const typeUser = state.contacts.contact.data.type;
    return{
        session_id,
        rol,
        typeUser
    }
}

export default connect(mapStateToProps)(DrawerContainer);
