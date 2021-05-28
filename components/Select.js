import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import { Block, Input, Text } from "galio-framework";

import Icon from './Icon';
import { nowTheme } from "../constants";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";

const { height, width } = Dimensions.get("screen");
var iconColor = '#6FBE6F';

class Dropdown extends React.Component {

  constructor() {
    super();
    // console.log();

    this.state = {
      isShow: false,
      isChanged: false,
      selected: '',
      valueDropdown: [],
      symbol: '',
    };
  }

  async componentDidMount() {

    this.setState({
      selected: this.props.selected,
      valueDropdown: this.props.value,
      symbol: this.props.symbol,
    });

    console.log(this.state.selected);

  }

  renderOption = (item, index) => {
    return(
      <Block key={index}>
        <TouchableWithoutFeedback onPress={() => this.selectChanged(item)}>
          <Block style={{paddingBottom: 5}}>
            <Block card style={{borderWidth: 1, borderColor: nowTheme.COLORS.GRAY}}>
              <Block style={{paddingVertical: 10}}>
                <Block>
                  
                  <Block>
                    <Block style={{paddingHorizontal: 16}}>
                      <Text
                        style={{ 
                            fontFamily: 'montserrat-bold',
                        }}
                        size={14}
                        color={nowTheme.COLORS.GRAY}
                      >
                        { item + ' ' + this.state.symbol }
                      </Text>
                    </Block>
                  </Block>

                </Block>
              </Block>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    )
  }

  selectChanged = (item) => {
    this.setState({
      isShow: !this.state.isShow, 
      selected: item,
      isChanged: true
    });

    this.props.selectChanged(item);

    this.setState({isChanged: false});
  }

  selectPressed = (status) =>{
    this.setState({isShow: status});
  }

  render() {
    const { 
      shadowless, 
      success, 
      error, 
      primary,
      symbol, 
    } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless,
      success && styles.success,
      error && styles.error,
      primary && styles.primary,
      {...this.props.style}
    ];

    return (
      <Block>

        
        <TouchableWithoutFeedback onPress={() => this.selectPressed(!this.state.isShow)}>
          <Block style={{paddingBottom: 5}}>
            <Block card style={{borderWidth: 1, borderColor: nowTheme.COLORS.GRAY}}>
              <Block style={{paddingVertical: 10}}>
                <Block row>
                  
                  <Block style={{width: '85%'}}>
                    <Block style={{paddingHorizontal: 16}}>
                      {this.state.isChanged == false ? (
                        <Text
                          style={{ 
                              fontFamily: 'montserrat-bold',
                          }}
                          size={14}
                          color={nowTheme.COLORS.GRAY}
                        >
                          { this.state.selected + ' ' + symbol }
                        </Text>
                      ) : <Block />}
                    </Block>
                  </Block>

                  <Block style={{width: '15%'}}>
                    <Block center >
                      <Icon
                          size={15}
                          color={nowTheme.COLORS.SECONDARY}
                          name={ this.state.isShow == true ? "chevron-up" : "chevron-down"}
                          family="Feather"
                      />
                    </Block>
                  </Block>

                </Block>
              </Block>
            </Block>
          </Block>
        </TouchableWithoutFeedback>

        { this.state.isShow == true ? 
          <Block>
            {this.state.valueDropdown.map((item, index) => {
              return(
                this.renderOption(item, index)
              )

            })}
          </Block>
        : <Block /> }
        
      </Block>
    );
  }
}

Dropdown.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  primary: false
};

Dropdown.propTypes = {
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

export default Dropdown;
