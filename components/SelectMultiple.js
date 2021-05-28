import React from "react";

import { 
  AsyncStorage, 
  Dimensions, 
  Keyboard,
  StyleSheet,
  TouchableOpacity 
} from "react-native";

import PropTypes from 'prop-types';

import { Block, Input, theme } from "galio-framework";

import Icon from './Icon';
import Text from './Text';
import Autocomplete from './Autocomplete';
import { nowTheme, config } from "../constants";

const { height, width } = Dimensions.get("screen");
var iconColor = '#6FBE6F';

class DropdownMultiple extends React.Component {

  constructor() {
    super();
    // console.log();

    this.state = {
      isShow: false,
      isChanged: false,
      selected: '',
      valueDropdown: [],
      symbol: '',
      category: '',
      title: '',

      dataLogin: [],
      listItems: [],

      Fitter_Code: {},
      
      isClicked: false,
      valueText: '',

    };
  }

  async componentDidMount() {

    var data_user = await AsyncStorage.getItem('data_user');
    var data_user = JSON.parse(data_user);

    var data_login = {
      project: data_user.project_id,
      api: data_user.api_key,
    }

    this.setState({
      dataLogin: data_login,
      selected: this.props.selected,
      valueDropdown: this.props.value,
      category: this.props.category,
      valueText: this.props.value,
    });

    return () => { isMounted = false };

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
      placeholder,
      data,
      category,
      categorySelected,
      selectedValue,
      value,
      style,
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
            <Block style={{paddingBottom: 5}}>
              <Block card style={{borderWidth: 1, borderColor: nowTheme.COLORS.GRAY}}>
                  <Block flex={2} style={{paddingHorizontal: 10, paddingVertical: 10}}>
                      <Block row style={{flexWrap: 'wrap'}}>

                        {
                          selectedValue.map((item, index) => {
                            return this.selectedValue(item, index)
                          })
                        }

                        <Block>
                          <Input
                            onChangeText={(val) => this.inputValueUpdate(val, category)}
                            onBlur={() => this.valueFocus() }
                            onBlur={() => this.valueBlur() }
                            placeholder={placeholder}
                            value={(categorySelected == category) ? this.state.valueText : this.state.valueText }
                            // value={value}
                            placeholderTextColor={nowTheme.COLORS.GRAY}
                            style={[
                              style,
                              {
                                width: width / 1.35,
                                borderWidth: 1, 
                                borderColor: nowTheme.COLORS.GRAY
                                // borderWidth: 0,
                                // marginTop: -20,

                              }
                            ]}
                            color={nowTheme.COLORS.GRAY}
                          />
                        </Block>

                      </Block>
                  </Block>
              </Block>
            </Block>

            {
              (categorySelected == category && this.state.isClicked == false) ? (
                this.props.data.map((item, index) => {
                  return this.renderItem(item, index)
                })
              ) : null 
            }


        </Block>
    );
  }

  selectedValue = (item, index) => {
    return(
      <Block key={index}>
        <TouchableOpacity onPress={() => this.removeSelected(item, this.props.category)}>
          <Block style={{paddingRight: 5, paddingBottom: 5}}>
            <Block card style={{paddingLeft: 10, borderWidth: 1, borderColor: nowTheme.COLORS.GRAY }}>
              <Block style={{paddingVertical: 10}}>
                <Block row>
                  <Block style={{width: '85%'}}>
                    <Text
                      title={item.name}
                      size={15}
                      bold
                      color={nowTheme.COLORS.GRAY}
                    />
                  </Block>

                  <Block style={{width: '15%'}}>
                    <Block style={{paddingHorizontal: 10}}>
                      <Icon
                          size={20}
                          color={nowTheme.COLORS.GRAY}
                          name={"x-circle"}
                          family="Feather"
                      />
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </TouchableOpacity>
      </Block>
    )
  }

  removeSelected = (item, category) => {
    Keyboard.dismiss();
    this.setState({
      isClicked: true,
      valueText: '',
    });
    this.props.removeSelected(item, category)
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

  renderItem = (item, index) => {

    return(
      <Block key={index}>
        <TouchableOpacity onPress={() => this.selectedItem(item, this.props.category) }>
          <Block style={{paddingBottom: 5}}>
            <Block card style={{backgroundColor: nowTheme.COLORS.BLOCK, borderWidth: 1, borderColor: nowTheme.COLORS.GRAY}}>
              <Block style={{paddingHorizontal: 15, paddingVertical: 5}}>
                <Text
                    title={item.name}
                    size={15}
                    bold
                    color={nowTheme.COLORS.GRAY}
                />
              </Block>
            </Block>
          </Block>
        </TouchableOpacity>
      </Block>
    )
  }

  selectedItem = (item, category) => {
    Keyboard.dismiss();
    this.setState({
      isClicked: true,
      valueText: '',
    });
    this.props.selectedItem(item, category)
  }

  // selectedItem = (item, category) => {
  //   this.props.selectedItem(item, category);
  //   // this.setState({[category] : item});
  // }

  textChanged = (val, props) => {
    this.props.textChanged(val, props);        
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

export default DropdownMultiple;
