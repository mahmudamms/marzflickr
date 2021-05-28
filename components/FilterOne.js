import React from "react";

import { 
  Animated,
  AsyncStorage,
  StyleSheet,
  Image, 
  Dimensions,
  Keyboard,
  Picker,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import PropTypes from 'prop-types';

import { Block, Input, Text, theme } from 'galio-framework';

import SearchableDropdown from 'react-native-searchable-dropdown';

import Icon from './Icon';
// import Input from './Input';
import Select from './Select';
import Button from './Button';

import { nowTheme, config, detail_mrir } from "../constants";

import Autocomplete from './Autocomplete';

const { height, width } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class FilterBar extends React.Component {

  _isMounted = false;
  
  constructor(props) {
    super();

    this.state = {
      isShow: true,
      isTemplateShow: true,
      category: '',
      menu: '',
      disciplineList: [],
      searchList: [],
      isChanged: false,
      dataLogin: [],
      discipline: [],
      acSelected: [],
      dataSearch: [],
      filterBy: [],

      Search: {},
      Unique_No: {},
    };
    
  }

  async componentDidMount() {

    this._isMounted = true;

    var data_user = await AsyncStorage.getItem('data_user');
    var data_user = JSON.parse(data_user);

    var data_login = {
        project: data_user.project_id,
        api: data_user.api_key,
    }

    this.setState({
      dataLogin: data_login,
      menu: this.props.menu,
      filterBy: this.props.filterBy,
    });

    // console.log(this.state.category);

    return () => { isMounted = false };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setData = (val, prop) => {

    const state = this.state;

    state['isChanged'] = true;
    this.setState(state);

    state[prop] = val;

    state[prop].index = 0;

    state['isChanged'] = false;
    this.setState(state);

    // console.log(this.state.Module);

  }

  readDiscipline = () => {

    var project = this.state.dataLogin.project;
    var api     = this.state.dataLogin.api;

    var url = config.config.url + '/api/discipline/';

    console.log(url);
    console.log(api);

    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': api
        }),
    })
    .then((response) => response.text())
    .then(data =>{

      var list_data = data;
        
      if(data.slice(-1) != '}'){
          list_data = data + '}';
      }

      list_data = JSON.parse(list_data);
      
      var dt = {
        id: '',
        name: 'All',
      }

      list_data.data.unshift(dt);

      this.setState({
        disciplineList: list_data.data,
      })
    }).catch((error) => {
      console.error(error);
    });
  }

  filterClicked = (menu) => {
    var category_template = menu[1].toLowerCase();

    var search        = (this.state.Search.id != undefined ? this.state.Search.id : '');
    var module        = (this.state.Module.id != undefined ? this.state.Module.id : '');
    var discipline    = (this.state.Discipline.id != undefined ? this.state.Discipline.id : '');
    var drawing_type  = (this.state.Drawing_type.id != undefined ? this.state.Drawing_type.id : '');
    var batch         = (this.state.Batch.id != undefined ? this.state.Batch.id : '');
    var workpack_no   = (this.state.Workpack_No.id != undefined ? this.state.Workpack_No.id : '');

    if(category_template == 'piecemark'){
      var template     = (this.state.Piecemark.id != undefined ? this.state.Piecemark.id : '');
    } else if(category_template == 'joint'){
      var template      = (this.state.Joint.id != undefined ? this.state.Joint.id : '');
    }

    var data = workpack_no + 'xx' + template; 

    this.props.filterClicked(data, menu);
  }

  collapseShow = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }

  testCallBack = (text) => {
    console.log(text);
  }
  
  render() {

    return (
      
        <DismissKeyboard>
            <Block card style={{ backgroundColor: nowTheme.COLORS.WHITE}}>
                <Block>            
                    <Block>
                        { 
                            this.props.filterBy.map((item, index) => {
                            var arr_data = this.state[item];
                            var text_replace = item.replace('_', ' ');

                                return(
                                    <Block key={index} >                                    
                                        { this.state.isChanged == false ? (
                                            <Block>
                                                <Autocomplete
                                                    onItemSelect={(itemSelect) => {
                                                    this.setData(itemSelect, item)
                                                    }}
                                                    textInputValue={Object.keys(arr_data).length === 0 ? '' : arr_data.name}
                                                    itemStyle={{
                                                    padding: 10,
                                                    marginTop: 2,
                                                    backgroundColor: '#ddd',
                                                    borderColor: '#bbb',
                                                    borderWidth: 1,
                                                    borderRadius: 5,
                                                    fontFamily: 'montserrat-regular',
                                                    }}
                                                    itemTextStyle={{ 
                                                    color: '#222', 
                                                    fontFamily: 'montserrat-regular',
                                                    }}
                                                    category={item}
                                                    menu={this.props.menu}
                                                    itemsContainerStyle={{ maxHeight: 140 }}
                                                    resetValue={false}
                                                    workpack={''}
                                                    textInputProps={
                                                    {
                                                        placeholder: "Search " + text_replace,
                                                        underlineColorAndroid: "transparent",
                                                        style: {
                                                            paddingVertical: 5,
                                                            paddingHorizontal: 10,
                                                            borderWidth: 1,
                                                            borderColor: '#ccc',
                                                            borderRadius: 5,
                                                            fontFamily: 'montserrat-regular',
                                                        },
                                                    }
                                                    }
                                                    listProps={
                                                    {
                                                        nestedScrollEnabled: true,
                                                    }
                                                    }
                                                />
                                            </Block>
                                        ): null }
                                    </Block>
                                );
                            })
                        }                     
                    </Block>
                </Block>
            </Block>
      </DismissKeyboard>
    );
  }
}

FilterBar.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  primary: false
};

FilterBar.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  primary: PropTypes.bool
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderRadius: 5,
    backgroundColor: '#ddd',
    borderColor: nowTheme.COLORS.BORDER,
    height: 44,
    justifyContent: 'center',
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
    paddingHorizontal: theme.SIZES.BASE / 1,
    paddingBottom: theme.SIZES.BASE / 1.5,
    borderRadius: 4,
    borderColor: nowTheme.COLORS.BLACK,
  },
  autocompleteContainer: {
    flex: 1,
    // zIndex: 1
  },
});

export default FilterBar;
