import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  ImageBackground,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  Block, 
  Checkbox, 
  Text, 
  Button as GaButton, 
  theme 
} from 'galio-framework';

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import { Button, Icon, Input } from '../components';
import { config, Images, nowTheme } from '../constants';

const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class Register extends React.Component {

  constructor() {
    super();
    // this.firestoreRef = firebase.firestore().collection('users');
    this.state = {
      username: '',
      password: '',
      isLoading: true,
      isOnline: true,
      showToast: true,
      showAlert: false,
      echo: '',
    };
  }

  async componentDidMount() {

    // var socket = new WebSocket('ws://10.5.253.201/websocket/websocket.php');

    // socket.onopen = () => socket.send(new Date().toGMTString());

    // socket.onmessage = ({data}) => {
    //     console.log(data);

    //     this.setState({echo: data});

    //     setTimeout(() => {
    //         socket.send(new Date().toGMTString());
    //     }, 3000);
    // }

    // socket.onerror = (e) => {
    //   console.log(e);
    // };



    var data_user = await AsyncStorage.getItem('data_user');
    var data_user = JSON.parse(data_user);

    if(data_user != null){
      this.props.navigation.navigate('App');
    }

    this.setState({isLoading: false, username: '', password: ''});
}

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  LoginForm = function(){
    return(
      <Block>
        <Block>
          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
            <Input
              placeholder="Username"
              onChangeText={(val) => this.inputValueUpdate(val, 'username')}
              style={styles.inputs}
              iconContent={
                <Icon
                  size={16}
                  color="#ADB5BD"
                  name="profile-circle"
                  family="NowExtra"
                  style={styles.inputIcons}
                />
              }
            />
          </Block>
          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
            <Input
              password
              placeholder="Password"
              onChangeText={(val) => this.inputValueUpdate(val, 'password')}
              style={styles.inputs}
              iconContent={
                <Icon
                  size={16}
                  color="#ADB5BD"
                  name="lock"
                  family="Feather"
                  style={styles.inputIcons}
                />
              }
            />
          </Block>
        </Block>

        <Block center>
          <Button 
            color={(!this.state.username || !this.state.password) ? "default" : "primary" } 
            round 
            style={styles.createButton}
            disabled={!this.state.username || !this.state.password}
            onPress={ () => this.onSubmit() }
          >
            <Text
              style={{ fontFamily: 'montserrat-bold' }}
              size={14}
              color={nowTheme.COLORS.WHITE}
            >
              Login
            </Text>
          </Button>

        </Block>
      </Block>
    );
  }
  
  Loading = function(){
    return(
      <Block style={{ justifyContent: 'center', marginTop: 100, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={nowTheme.COLORS.PRIMARY} />
      </Block>
    );
  }

  alertError = (error_text) => {
    return(
      <Block>
        <Block 
          style={{ 
            textAlign: 'center',  
          }}
        >
          <Icon
            size={50}
            color={nowTheme.COLORS.ERROR}
            name="warning"
            family="AntDesign"
            style={{
              textAlign: 'center',
            }}
          />
        </Block>

        <Block>
          <Text
            size={20}
            style={{ 
              fontFamily: 'montserrat-regular',
              textAlign: 'center', 
              marginBottom: 5,
              marginTop: 10,
            }}
          >{error_text}</Text>
        </Block>
        
        <Block center>
          <Button 
            color="default"
            onPress={ () => this.setState({showAlert: false}) }
          >
            <Text
              style={{ fontFamily: 'montserrat-bold' }}
              size={14}
              color={nowTheme.COLORS.WHITE}
            >
              OK
            </Text>
          </Button>
        </Block>
      </Block>
    )
  };

  onSubmit = async() => {
    this.setState({
      isLoading: true,
    });

    try {
      let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      };

      var url = config.config.url + '/api/auth';
      console.log(url);

      await fetch(url, options)
      .then(response => response.text())
      .then(data => {

        console.log(data);

        var list_data = data;
        
        if(list_data.slice(-1) != '}'){
          list_data = list_data + '}';
        }

        console.log(list_data);

        list_data = JSON.parse(list_data);

        var status = false;
        if (list_data.status == 'success') {
          this.setData(list_data);
        } else {
          var status = true;
          // console.log(data.text);
          this.setState({ errorMessage: list_data.text });
        }

        this.setState({
          isLoading: false,
          showAlert: status,
          password: '',
        });

      })
      .catch((error) => {
        setTimeout(() => {
          console.log(error);
        }, 1000);
      });

    } catch (e) {
      console.log(e);
    }
  };

  setData = async (value) => {
    try{
      await AsyncStorage.setItem('data_user', JSON.stringify(value));  
      this.props.navigation.navigate('App');

    } catch (e){

    }
  }

  toastAlert = (message, status) => {

    if(this.state.isOnline != status){
      this.setState({isOnline: status});

      return(
        showMessage({
          message: message,
          type: status,
          hideStatusBar: true,
        })
      );
    }
    
  };

  render() {   
    
    const isOnline = () => {
      const timeout = new Promise((resolve, reject) => {
          setTimeout(reject, 2000, 'Request timed out');
      });
  
      const request = fetch(config.config.url);
  
      return Promise
          .race([timeout, request])
          .then(response => this.toastAlert('Back Online', 'success'))
          .catch(error => this.toastAlert('No Connection', 'detail'));
    }

    isOnline();

    return (
      <DismissKeyboard>
        <Block flex middle>
          <ImageBackground
            source={Images.LoginBackground}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
            <Block flex middle>
              <Block style={styles.registerContainer}>
                <Block flex space="evenly">
                  <Block flex={0.7} middle>
                    <Block middle>

                    <Block style={{paddingBottom: 20}}>
                      <Image 
                        style={{ width: 150, height: 50 }}
                        source={require('../assets/logo.png')}
                      />
                    </Block>

                      <Text
                        style={{
                          fontFamily: 'montserrat-bold',
                          textAlign: 'center'
                        }}
                        color="#333"
                        size={24}
                      >
                        PCMS Mobile
                      </Text>
                    </Block>
                  </Block>

                  <Block flex={1} middle space="between">
                    <Block center flex={0.1}>
                      <Block flex space="between">
                        { this.state.isLoading == true ? this.Loading() : this.LoginForm() }
                      </Block>
                    </Block>
                  </Block>

                  <Block>
                    <AwesomeAlert
                      show={this.state.showAlert}
                      // show={true}
                      customView={this.alertError(this.state.errorMessage)}
                      closeOnTouchOutside={false}
                      closeOnHardwareBackPress={false}
                    />
                  </Block>

                </Block>
              </Block>
            </Block>

            <FlashMessage 
              autoHide={(this.state.isOnline == 'success') ? true : false }
              position="top" 
              animated
              icon={(this.state.isOnline == 'success') ? 'success' : 'info'}
              style={{paddingTop: 60, width: width}}
              hideOnPress={(this.state.isOnline == 'success') ? true : false}
              titleStyle={{fontFamily: 'montserrat-bold'}}
            />

          </ImageBackground>
        </Block>
      </DismissKeyboard>

      
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  imageBackground: {
    width: width,
    height: height
  },
  registerContainer: {
    marginTop: 55,
    width: width * 0.9,
    height: height < 600 ? height * 0.6 : height * 0.5,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 10,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden'
  },
  
  socialConnect: {
    backgroundColor: nowTheme.COLORS.WHITE
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15
  },
  createButton: {
    width: width * 0.6,
    marginTop: 25,
    marginBottom: 40
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    marginHorizontal: 10
  }
});

export default Register;
