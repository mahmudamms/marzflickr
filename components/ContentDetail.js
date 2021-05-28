import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import { Col, Row, Grid } from "react-native-easy-grid";

import { 
    Block,
    Input,
    Text,
} from "galio-framework";

import Icon from './Icon';
import { nowTheme } from "../constants";

var iconColor = '#6FBE6F';
var gradientColor = ['#0BAB64', '#83D475'];

class Content extends React.Component {
  render() {
    const { 
        title,
        content
    } = this.props;

    return (
        <Block row>
            <Block style={{width: '50%'}}>
                <Text
                    style={{ 
                        fontFamily: 'montserrat-bold',
                    }}
                    size={14}
                    color={iconColor}
                >
                    {title}
                </Text>
            </Block>
            
            <Block style={{width: '50%'}}>
                <Text
                    style={{ 
                    fontFamily: 'montserrat-bold',
                    }}
                    size={14}
                    color={iconColor}
                >
                    {content}
                </Text>
            </Block>
        </Block>
    );
  }
}

Content.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  primary: false
};

Content.propTypes = {
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
    shadowRadius: 1,
    shadowOpacity: 0.13,
    elevation: 2,
  }
});

export default Content;
