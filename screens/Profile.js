import React from "react";

import { 
  ActivityIndicator,
  AsyncStorage, 
  Dimensions,
  FlatList,
  StyleSheet, 
  ScrollView,
  View, 
} from "react-native";

import { Block, theme, Text, Icon } from "galio-framework";

import { Col, Row, Grid } from "react-native-easy-grid";

import { Card, Button } from "../components";
import menu from "../constants/menu";
import nowTheme from "../constants/Theme";

import { LinearGradient } from 'expo-linear-gradient';
import { TouchableWithoutFeedback } from "react-native";

const { height, width } = Dimensions.get("screen");

var iconColor = '#6FBE6F';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      role: [],
      isLoaded: false,
      data_user: [],
    };
  }

  async componentDidMount() {
    this.setState({isLoaded: true});

    var data_user = await AsyncStorage.getItem('data_user');
    var data_user = JSON.parse(data_user);

    this.setState({
      role: data_user.role,
      data_user: data_user,
      isLoaded: false,
    });
  }

  Loading = function(){
    return(
      <Block style={{ justifyContent: 'center', marginTop: 100, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={nowTheme.COLORS.PRIMARY} />
      </Block>
    );
  }

  renderItem = ({item}) => {

    var link = item.action;

    return(
      <TouchableWithoutFeedback
        onPress={() => this.props.navigation.navigate(link, {
          title: item.title,
        })}
      >
        <Block style={{paddingHorizontal: 10, paddingVertical: 10}}>
          <Block 
            center
            style={{ 
              borderRadius: 8,
              paddingHorizontal: 20,
              paddingVertical: 20,
              backgroundColor: nowTheme.COLORS.WHITE,
              width: width / 2.5,
              height: height * 0.17,
            }}
          >
            <Block>
              <Icon
                size={50}
                color={iconColor}
                name={item.icon}
                family={item.family}
              />
            </Block>

            <Block style={{paddingTop: 5, justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text
                style={{ fontFamily: 'montserrat-bold', textAlign: 'center' }}
                size={17}
                color={iconColor}
              >
                {item.title}
              </Text>
            </Block>
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    )
  }

  render() {

    return (
      <View style={{flex: 1}}>
        <Block flex style={{top: height * 0}}>
          <LinearGradient
            // Button Linear Gradient
            colors={['#0BAB64', '#83D475']}
            style={{
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Block 
              style={{
                height: height / 2.5,
              }}
            >
              <Block style={{paddingHorizontal: 20, paddingTop: 50}}>
                <Grid>
                  
                  <Col>
                    <Block>
                      <TouchableWithoutFeedback 
                        onPress={() => this.props.navigation.goBack()}
                      >
                        <Icon
                          size={25}
                          color={nowTheme.COLORS.WHITE}
                          name={'arrow-left-circle'}
                          family={'Feather'}
                        />
                      </TouchableWithoutFeedback>
                    </Block>

                    <Block style={{paddingHorizontal: 35}}>
                      <Text
                        style={{ fontFamily: 'montserrat-bold' }}
                        size={17}
                        color={nowTheme.COLORS.WHITE}
                      >
                        Profile
                      </Text>
                    </Block>
                  </Col>

                </Grid>
              </Block>

            </Block>
          </LinearGradient>

          <Block center style={{top: -140}}>
            <TouchableWithoutFeedback>
              <Block style={{paddingHorizontal: 10, paddingVertical: 10, zIndex: 999}}>
                <Block 
                  center
                  style={{top: height * 0.01}}
                >
                  <Block>
                    <Icon
                      size={70}
                      color={iconColor}
                      name={'user'}
                      family={'EvilIcons'}
                    />
                  </Block>

                </Block>
              </Block>
            </TouchableWithoutFeedback>

            <Block style={{top: -70}}>
              <Block 
                width={width / 1.2}
                height={height * 0.5}
                style={{
                  backgroundColor: nowTheme.COLORS.WHITE,
                  borderColor: iconColor,
                  borderWidth: 2,
                  borderRadius: 6,
                  paddingHorizontal: 20,
                  paddingVertical: 70,
                }}
              >
                <Block style={{paddingVertical: 5}}>
                  <Text
                    style={{ 
                      fontFamily: 'montserrat-bold',
                      textAlign: 'center' 
                    }}
                    size={22}
                    color={iconColor}
                  >
                    { this.state.data_user.full_name }
                  </Text>

                  <Text
                    style={{ 
                      fontFamily: 'montserrat-regular',
                      textAlign: 'center' 
                    }}
                    size={16}
                    color={iconColor}
                  >
                    { this.state.data_user.project_name }
                  </Text>
                </Block>

                <Block style={{paddingVertical: 20}}>
                  {/* <Block 
                    style={{
                      paddingHorizontal: 10, 
                      paddingVertical: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: iconColor,
                    }} 
                  >
                    <Text
                      style={{ 
                        fontFamily: 'montserrat-regular', 
                      }}
                      size={15}
                      color={iconColor}
                    >
                      Change Password
                    </Text>
                  </Block> */}
                </Block>

                <Block style={{paddingVertical: 80}}>
                  <TouchableWithoutFeedback onPress={() => this.logoutAction()}>
                    <Block 
                      style={{
                        paddingHorizontal: 10, 
                        paddingVertical: 10,
                        backgroundColor: iconColor,
                        borderRadius: 10
                      }} 
                    >
                      <Text
                        style={{ 
                          fontFamily: 'montserrat-bold',
                          textAlign: 'center', 
                        }}
                        size={16}
                        color={nowTheme.COLORS.WHITE}
                      >
                        Sign Out
                      </Text>
                    </Block>
                  </TouchableWithoutFeedback>
                </Block>
                
              </Block>

            </Block>
            
          </Block>

        </Block>

      </View>
    );
  }

  logoutAction = () => {
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  }

}

const styles = StyleSheet.create({
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  }
});

export default Home;
