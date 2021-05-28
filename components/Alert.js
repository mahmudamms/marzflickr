import React from "react";
import AwesomeAlert from 'react-native-awesome-alerts';
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import { Text } from "galio-framework";

import Icon from './Icon';
import { nowTheme } from "../constants";

class AlertCustom extends React.Component {
  render() {
    const { 
        shadowless, 
        success, 
        error, 
        primary,
        title,
        color,
        bold,
        size,
        center, 
    } = this.props;

    var fontType = [bold ? styles.fontBold : styles.fontRegular];

    const inputStyles = [
      styles.input,
      !shadowless,
      success && styles.success,
      error && styles.error,
      primary && styles.primary,
      {...this.props.style}
    ];

    return (
      <Text 
        size={size} 
        style={[
            {
              color: color,
            }, 
            fontType,
            (center ? {textAlign: 'center'} : '')
        ]}
    >
          {title}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  fontBold: {
    fontFamily: 'montserrat-bold'
  },
  fontRegular: {
    fontFamily: 'montserrat-regular'
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
    shadowRadius: 1,
    shadowOpacity: 0.13,
    elevation: 2,
  }
});

export default AlertCustom;
