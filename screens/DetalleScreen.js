import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, Container, Content, Icon, Input, Spinner, Text, Toast, Thumbnail, Fab } from 'native-base';
import Styles from '../utils/Styles';

import { connect } from 'react-redux';

class DetalleScreen extends Component {

    static navigationOptions = {
        title: 'Detalle',
        headerTitleStyle: Platform.OS === 'ios' ? { color: 'white' } : { textAlign: 'center', alignSelf: 'center', marginLeft: 115, fontWeight: 'normal', fontSize: 12, color: 'white' } 

    };

    render (){
        return(
            <Container>
                <Content style={Styles.backgroundContainer}>
                    <Text>DetalleScreen</Text>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    const session_id = state.contacts.session_id;
    return{
        session_id
    }
}

export default connect(mapStateToProps)(DetalleScreen);