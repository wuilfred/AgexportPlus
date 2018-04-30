import React from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { NavigationActions } from 'react-navigation'
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import { Ionicons } from '@expo/vector-icons'; 

import { connect } from 'react-redux';
import { logoutApp } from '../actions/contacts';

class TabContainer extends React.Component {

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
    
    changeToScreen (currentIndex, route){
        const { navigation, jumpToIndex } = this.props;
        if(route.key == 'RootHomeStack'){
            let listadoRoutes = route.routes[currentIndex];
            const { index } = listadoRoutes;
            const { routes } = listadoRoutes;
            let rutaActual = routes[index];
            const { routeName } = rutaActual;
            if(routeName == 'ProgramaPuntos' || routeName == 'ProgramaBeneficios' || routeName == 'Invitados' || routeName == 'InvitadoModal'){
                navigation.goBack(currentIndex);
            }else{
                jumpToIndex(currentIndex);
            }
        }else{
            jumpToIndex(currentIndex);
        }
    }

    render() {
        const {
            navigation,
            renderIcon,
            activeTintColor,
            inactiveTintColor,
            jumpToIndex,
            getLabel
        } = this.props;
        const { routes } = navigation.state;
        const { rol, typeUser } = this.state;
        return (
            <View style={styles.tabbar}>
                {routes && routes.map((route, index) => {
                    const focused = index === navigation.state.index;
                    const tintColor = focused ? activeTintColor : inactiveTintColor;
                    let TabScene = {
                        focused,
                        route:route,
                        tintColor
                    };
                    const { routeName } = navigation.state;
                    if(rol == 'Establecimiento' && route.key == "RootActivitiesStack"){
                        return null;
                    }
                    return (
                        <TouchableWithoutFeedback
                            key={route.key}
                            style={styles.tab}
                            onPress={() => this.changeToScreen(index, route) }
                        >
                            <View style={styles.tab}>
                                {renderIcon({
                                    route,
                                    index,
                                    focused,
                                    tintColor
                                })}
                                <Text style={{ color:'white' }}>{getLabel(TabScene)}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        )
    }
}

const styles = StyleSheet.create({
  tabbar: {
    height: 49,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    backgroundColor: '#0A1040'
  },
  tab: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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

export default connect(mapStateToProps)(TabContainer);