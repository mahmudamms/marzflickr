import React from "react";

import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';

import { 
  ActivityIndicator,
  AsyncStorage, 
  Dimensions,
  FlatList,
  Keyboard,
  StyleSheet, 
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View, 
} from "react-native";

import { Block, theme, Text, Button as Btn } from "galio-framework";

import { Col, Row, Grid } from "react-native-easy-grid";

import { LinearGradient } from 'expo-linear-gradient';

import Icon from '../Icon';
import { nowTheme } from "../../constants";

const { height, width } = Dimensions.get("screen");

class GradientHeader extends React.Component {

  render() {
    const { 
        navigation,
        shadowless, 
        success, 
        error, 
        primary,
        datauser,
        title, 
        back,
        gradientColor,
        borderRadius,
        profile,
        headerHeight,
        menu
    } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless,
      success && styles.success,
      error && styles.error,
      primary && styles.primary,
      {...this.props.style}
    ];

    var left_width    = '0%';
    var center_width  = '0%';
    var right_width   = '0%';

    if(menu == 'Home'){
      left_width = '20%';
      center_width = '60%';
      right_width = '20%';
    } 
    
    else {
      left_width = '20%';
      center_width = '60%';
      right_width = '20%';
    }

    return (
      <Block>
        <LinearGradient
            // Button Linear Gradient
            colors={gradientColor}
            style={{
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,              
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Block style={{paddingTop: 40, paddingBottom: headerHeight, paddingHorizontal: 20}}>

              <Block>
                <Block row>
                  {back == true ? (
                    <Block style={{width: left_width}}>
                      <Block center>
                      <TouchableOpacity
                          onPress={() =>  this.props.navigation.push('App')}
                        >
                          <Icon
                              size={28}
                              color={nowTheme.COLORS.WHITE}
                              name={'arrow-left-circle'}
                              family={'Feather'}

                          />
                          
                        </TouchableOpacity>
                      </Block>
                    </Block>
                  ) : (
                    <Block style={{width:left_width,marginLeft:0,marginBottom:10}}>
                      <Block center>
                            <TouchableOpacity  
                                onPress={() => this.props.navigation.push('Add List', {                       
                                  title: 'Add List',
                                })}
                            >
                                <Icon
                                  size={35}
                                  color={nowTheme.COLORS.WHITE}
                                  name={'plus-circle'}
                                  family={'Feather'}
                                />

                            </TouchableOpacity>
                      </Block>
                  </Block>
                  )}
                  
                  <Block style={{width: center_width}}>
                    <Block style={{paddingHorizontal: 5}}>
                    {title != false ? (
                      <Text
                          style={{ fontFamily: 'montserrat-bold' }}
                          size={18}
                          color={nowTheme.COLORS.WHITE}
                      >
                          {title}
                      </Text>
                    ) : (
                      <View>
                      <Text
                          style={{ fontFamily: 'montserrat-bold',textAlign:'center' }}
                          size={18}
                          color={nowTheme.COLORS.WHITE}
                      >
                          {"MARZ"}
                      </Text>                      
                      <Text
                          style={{ fontFamily: 'montserrat-bold',textAlign:'center' }}
                          size={10}
                          color={nowTheme.COLORS.WHITE}
                      >
                          {"Flickr Image"}
                      </Text>                      
                      </View>
                    )}  
                    </Block>
                  </Block>

                  {profile == true ? (
                    <Block style={{width: right_width,marginLeft:0,marginBottom:10}}>
                      <Block center>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Profile', {
                              id: datauser.id_user,
                            })}
                        >
                            <Icon
                              size={35}
                              color={nowTheme.COLORS.WHITE}
                              name={'user'}
                              family={'Feather'}
                            />

                        </TouchableOpacity>
                      </Block>
                    </Block>
                  ) : <Block />}
                </Block>
                
                

              </Block>
            </Block>

        </LinearGradient>
      </Block>
    );
  }
}

GradientHeader.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  primary: false
};

GradientHeader.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  primary: PropTypes.bool
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  success: {
    borderColor: nowTheme.COLORS.INPUT_SUCCESS
  },
  error: {
    borderColor: nowTheme.COLORS.INPUT_ERROR
  },
  primary: {
    borderColor: nowTheme.COLORS.PRIMARY
  },
  shadow: {
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 5,
    shadowOpacity: 0.13,
    elevation: 3,
  },
});

export default withNavigation(GradientHeader);
