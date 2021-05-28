import React from "react";

import { 
  Animated,
  AsyncStorage,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Image, 
  Keyboard,
  Picker,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import PropTypes from 'prop-types';

import { Block, Button, Text, theme } from 'galio-framework';

import Icon from './Icon';
import Input from './Input';
import Select from './Select';

import { nowTheme, config } from "../constants";

const { width } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class LoadMoreBar extends React.Component {
  
  constructor() {
    super();

    this.state = {
      loading: false,
    };
  }

  ButtonClicked = (limit) => {
        this.setState({
            loading: true
        });
        
        this.props.ButtonClicked(limit);

        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 2000);
  }
  
  render() {

    const { limit } = this.props;

    return (
        <DismissKeyboard>
            <Block center >
                <Button 
                    size='large'
                    onPress={ () => this.ButtonClicked(limit) }
                    disabled={ this.state.loading == true }
                >
                    <Text
                        style={{ fontFamily: 'montserrat-bold' }}
                        size={14}
                        color={nowTheme.COLORS.WHITE}
                    >
                        {this.state.loading == true ? <ActivityIndicator size="large" color={nowTheme.COLORS.WHITE} /> : 'Load More' }

                    </Text>
                </Button>
            </Block>
      </DismissKeyboard>
    );
  }
}

LoadMoreBar.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  primary: false
};

LoadMoreBar.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  primary: PropTypes.bool
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 1,
    borderColor: nowTheme.COLORS.BLACK,
    height: 44,
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
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 1
  },
  pickerStyle: {
    padding: theme.SIZES.BASE / 1,
    borderRadius: 4,
    borderColor: nowTheme.COLORS.BLACK,
  }
});

export default LoadMoreBar;
