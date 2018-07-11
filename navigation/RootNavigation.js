import React, { Component } from 'react';
import { DrawerNavigator, StackNavigator, SwitchNavigator, TabNavigator, DrawerItems } from 'react-navigation';
import { Text, View, SafeAreaView, Image } from "react-native";
import { Root, Button, Icon } from "native-base";
import { Ionicons } from '@expo/vector-icons'; 

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';

import RegistroScreen from '../screens/RegistroScreen';
import ValidacionScreen from '../screens/ValidacionScreen';
import SolicitudScreen from '../screens/SolicitudScreen';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import BeneficioScreen from '../screens/BeneficioScreen';
import PublicScreen from '../screens/PublicScreen';
import PrivateScreen from '../screens/PrivateScreen';
import DetalleScreen from '../screens/DetalleScreen';
import DetalleActivityScreen from '../screens/DetalleActivityScreen';
import DetalleBeneficioScreen from '../screens/DetalleBeneficioScreen';
import LectorScreen from '../screens/LectorScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ScannerActivityScreen from '../screens/ScannerActivityScreen';
import TabContainer from '../screens/TabContainer';
import DrawerContainer from '../screens/DrawerContainer';
import ProgramBeneficiosScreen from '../screens/ProgramaBeneficiosScreen';
import ProgramPuntosScreen from '../screens/ProgramaPuntosScreen';
import InvitadosScreen from '../screens/InvitadosScreen';
import AgregarInvitadoModal from '../screens/AgregarInvitadoModal';

import LectorBeneficioScreen from '../screens/LectorBeneficioScreen';
import EditarModalScreen from '../screens/EditarModalScreen';

import store from '../config/store'
import { connect } from 'react-redux';
import { newActivities } from '../actions/contacts';

const HomeStack = StackNavigator({
    Main: { screen: HomeScreen },
    ProgramaBeneficios: { screen: ProgramBeneficiosScreen },
    ProgramaPuntos: { screen: ProgramPuntosScreen },
    Invitados: { screen: InvitadosScreen }
},{    
    navigationOptions: ({ navigation }) => ({
        //headerTitle: 'Agexport+',
        headerLeft: (<Image style={{marginLeft: 20, height:180, width:120 }} resizeMode='contain' source={require('../assets/img/HeaderLogo.png')} />),
        headerStyle:{
            backgroundColor: '#0A1040',
        },
        headerBackTitle: null,
        headerTitleStyle:{
            textAlign: 'center',
            color: '#FFFFFF'
        },
        headerTintColor:'#FFF',
        headerRight:<Button transparent light onPress={() => navigation.navigate('DrawerOpen')}>
                    <Icon style={{ color: 'white' }} name='menu' />
        </Button>
    })
});

const RootHomeStack = StackNavigator({
        Home: {
            screen: HomeStack,
        },
        ScannerModal: {
            screen: ScannerScreen,
        },
        InvitadoModal: {
            screen: AgregarInvitadoModal,
        },
        EditarModal:{
            screen: EditarModalScreen,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);

const LectorStack = StackNavigator({
    Lector: { screen: LectorScreen },
},{    
    navigationOptions: ({ navigation }) => ({
       
    })
});

const BeneficioStack = StackNavigator({
    Beneficio: { screen: BeneficioScreen },
    DetalleBeneficio: { screen: DetalleBeneficioScreen },
    Lector: LectorBeneficioScreen,
},{
    cardStyle:{
        backgroundColor: '#FFF'
    },
    navigationOptions: ({ navigation }) => ({
        //headerTitle: 'Agexport+',
        headerTitle: (<Image style={{marginLeft: 20, height:180, width:120 }} resizeMode='contain' source={require('../assets/img/HeaderLogo.png')} />),
        headerStyle:{
            backgroundColor: '#0A1040',
        },
        headerBackTitle: null,
        headerTitleStyle:{
            textAlign: 'center'
        },
        headerTintColor:'#FFF',
        headerRight:<Button transparent light onPress={() => navigation.navigate('DrawerOpen')}>
                    <Icon style={{ color: 'white' }} name='menu' />
        </Button>
    })
});

const ListActivities = TabNavigator({
    Public: { screen: PublicScreen },
    Private: { screen: PrivateScreen }
},{
    tabBarPosition: 'top',
    swipeEnabled: false,
    tabBarOptions: {
        activeTintColor: '#FFF',
        inactiveTintColor: '#bdc3c7',
        style: {
            backgroundColor: '#101474',
        },
        indicatorStyle:{
            backgroundColor: '#FFFFFF'
        }
    },
});

const ActivitiesStack = StackNavigator({
    ListActivities,
    DetalleActivity: { screen: DetalleActivityScreen }
},{
    cardStyle:{
        backgroundColor: '#FFFFFF'
    },
    navigationOptions: ({ navigation }) => ({
        //headerTitle: 'Agexport+',
        headerTitle: (<Image style={{marginLeft: 20, height:180, width:120 }} resizeMode='contain' source={require('../assets/img/HeaderLogo.png')} />),
        //headerTitle: 'Actividades',
        headerStyle:{
            backgroundColor: '#0A1040',
        },
        headerTitleStyle:{
            textAlign: 'center'
        },
        headerTintColor:'#FFFFFF',
        headerRight:<Button transparent light onPress={() => navigation.navigate('DrawerOpen')}>
                    <Icon style={{ color: 'white' }} name='menu' />
        </Button>,
    })
});

const RootActivitiesStack = StackNavigator({
        Activities: {
            screen: ActivitiesStack,
        },
        ScannerModalActivity: {
            screen: ScannerActivityScreen,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);

let listadoTabs = {
    RootHomeStack,
    BeneficioStack,
    RootActivitiesStack,
};

const AppStack = TabNavigator(listadoTabs, {
    tabBarComponent: TabContainer,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
        showIcon:true,
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#bdc3c7',
        style: {
            backgroundColor: '#0A1040',
        },
        indicatorStyle:{
            backgroundColor: '#FFFFFF'
        },
        iconStyle:{
            color: '#FFFFFF',
        }
    },
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
           
            let iconName;
            if (routeName === 'RootHomeStack') {
                iconName = `ios-qr-scanner${focused ? '' : '-outline'}`;
            } else if (routeName === 'BeneficioStack') {
                iconName = `ios-pricetags${focused ? '' : '-outline'}`;
            }else if(routeName === 'RootActivitiesStack'){
                iconName = `ios-calendar${focused ? '' : '-outline'}`;
            }
            return <Ionicons name={iconName} size={25} color={tintColor} />;
        },
        tabBarLabel: () => {
            const { routeName } = navigation.state;
            //const { tabname } = nametabbar;
            
            //console.log(tabname);
            let lblName;
            if(routeName == 'RootHomeStack'){
                lblName = 'Inicio';
            }else if(routeName == 'BeneficioStack'){
                lblName = 'Beneficios';
            }else if(routeName == 'RootActivitiesStack'){
                lblName = 'Actividades';
            }
            return lblName
        }
    })
});

const AuthStack = StackNavigator({
    Registro: RegistroScreen,
    Validacion: ValidacionScreen,
    Solicitud: SolicitudScreen,
},{
    navigationOptions: ({ navigation }) => ({
        //headerTitle: 'Agexport+',
        headerLeft: (<Image style={{marginLeft: 20, height:180, width:120 }} resizeMode='contain' source={require('../assets/img/HeaderLogo.png')} />),
        headerStyle:{
            backgroundColor: '#0A1040',
        },
        headerTitleStyle:{
            textAlign: 'center',
            color: '#FFFFFF'
        }
    })
});


const AppDrawer = DrawerNavigator({
    ContainerApp: { screen: AppStack },
}, {
    drawerPosition: 'right',
    contentComponent: DrawerContainer
});

const RootTabNavigator = SwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: AppDrawer,
    Auth: AuthStack,
},{
    initialRouteName: 'AuthLoading',
});

let persistor = persistStore(store)

export default () =>(
    <Root>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RootTabNavigator />
            </PersistGate>        
        </Provider>
    </Root>
)
