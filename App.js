import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import RootNavigation from './navigation/RootNavigation';

export default class App extends React.Component {

	state = {
    	isLoadingComplete: false,
  	};
	  
	_loadResourcesAsync = async () => {
    	return Promise.all([
      		Font.loadAsync({
        		'Roboto': require('native-base/Fonts/Roboto.ttf'),
				'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
				Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      		}),
    	]);
  	};
	
	_handleLoadingError = error => {
    	// In this case, you might want to report the error to your error
    	// reporting service, for example Sentry
    	console.warn(error);
  	};

  	_handleFinishLoading = () => {
    	this.setState({ isLoadingComplete: true });
  	};

	render() {
		if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      		return (
        		<AppLoading
          			startAsync={this._loadResourcesAsync}
          			onError={this._handleLoadingError}
          			onFinish={this._handleFinishLoading}
        		/>
      		);
    	} else {
			return (
				<RootNavigation />
			);
		}
  	}
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	backgroundColor: '#FFFFFF',
  	},
  	statusBarUnderlay: {
    	height: 24,
		backgroundColor: 'rgba(0,0,0,0.2)',

  	},
});
