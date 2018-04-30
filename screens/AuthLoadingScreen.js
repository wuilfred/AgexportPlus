import React, { Component } from 'react';
import { ActivityIndicator, View, StatusBar, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

class AuthLoadingScreen extends Component{
    
    componentWillMount(){
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = () => {
        //const userToken = await AsyncStorage.getItem('userToken');
        const userToken = this.props.isLoggedIn;
        console.log(userToken);

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) =>{
    const isLoggedIn = state.contacts.isLoggedIn
    return{
        isLoggedIn
    }
}

export default connect(mapStateToProps)(AuthLoadingScreen)