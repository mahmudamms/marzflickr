import React from "react";
import PropTypes from 'prop-types';

import { Block, Input } from "galio-framework";

import Icon from './Icon';
import Text from './Text';
import { nowTheme } from "../constants";
import { 
  Keyboard,
  StyleSheet, 
  TouchableWithoutFeedback ,
  TouchableOpacity
} from "react-native";

class TextAutocomplete extends React.Component {

  constructor() {
    super();
    // console.log();

    this.state = {
      isClicked: false,
      valueText: '',
    };
  }

  async componentDidMount() {
    this.setState({
      valueText: this.props.value,
    });
  }

  render() {
    var { 
      shadowless, 
      success, 
      error, 
      primary,
      menu,
      category,
      categorySelected,
      workpack,
      data,
      title,
      value,
      style,
    } = this.props;

    return (
      <Block>
        <Input
          onChangeText={(val) => this.inputValueUpdate(val, category)}
          onBlur={() => this.valueFocus() }
          onBlur={() => this.valueBlur() }
          placeholder={"Search " + title }
          value={(categorySelected == category) ? this.state.valueText : this.state.valueText }
          placeholderTextColor={nowTheme.COLORS.GRAY}
          style={[
            style,
            {
              borderColor: nowTheme.COLORS.GRAY,
            }
          ]}
          color={nowTheme.COLORS.GRAY}
        />

        <Block>
          
          { 
            (categorySelected == category && this.state.isClicked == false) ? (
              this.props.data.map((item, index) => {
                return this.renderList(item, index)
              })
            ) : null 
          }
            
          
        </Block>
      </Block>
    );
  }

  inputValueUpdate = (val, prop) => {
    this.setState({isClicked: false, valueText: val});
    this.props.textChanged(val, prop)
  }

  valueFocus = () => {
    this.setState({valueSelected: value});
  }

  valueBlur = () => {
    this.setState({isClicked: true, valueText: this.props.value});
  }

  renderList = (item, index) => {
    return(
      <Block key={index}>

        <Block style={{paddingBottom: 5}}>
          <TouchableOpacity onPress={() => this.selectedItem(item, this.props.category) }>
            <Block card style={{backgroundColor: nowTheme.COLORS.BLOCK, borderWidth: 1, borderColor: nowTheme.COLORS.GRAY}}>
              <Block style={{paddingVertical: 5, paddingHorizontal: 15}}>
                <Text 
                  size={15}
                  title={item.name}
                  color={nowTheme.COLORS.GRAY}
                  bold
                />
              </Block>
            </Block>
          </TouchableOpacity>
        </Block>
        
      </Block>
    )
  }

  selectedItem = (item, category) => {
    Keyboard.dismiss();
    this.setState({isClicked: true});
    this.props.selectedItem(item, category)
  }
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

export default TextAutocomplete;
