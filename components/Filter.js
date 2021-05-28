import React from "react";

import { 
  Animated,
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  StyleSheet,
  Image, 
  Keyboard,
  Picker,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import PropTypes from 'prop-types';

import { Block, Button, Input, Text, theme } from 'galio-framework';

import SearchableDropdown from 'react-native-searchable-dropdown';

import Icon from './Icon';
import Divider from './Divider';
// import Input from './Input';
import Select from './Select';

import { nowTheme, config, detail_mrir } from "../constants";

import Autocomplete from './AutocompleteOri';

const { height, width } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class FilterBar extends React.Component {

  _isMounted = false;
  
  constructor(props) {
    super();

    this.state = {
      isShow: false,
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
      Module: {},
      Discipline: {},
      Drawing_type: {},
      Batch: {},

      isLoading : false,
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

  filterClicked = () => {

    this.setState({isLoading: true});

    // var search        = (this.state.Search.id != undefined ? this.state.Search.id : '');
    var module        = (this.state.Module.id != undefined ? this.state.Module.id : '');
    var discipline    = (this.state.Discipline.id != undefined ? this.state.Discipline.id : '');

    var data = module + 'xx' + discipline + 'xx'; 

    this.props.filterClicked(data);

    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 2000);

  }

  collapseShow = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }

  getSearch = (text) => {

    this.setState({
      isChanged: true,
      searchList: [],
    });

    if(text){

      var project = this.state.dataLogin.project;
      var api     = this.state.dataLogin.api;
      var search  = text;

      var category = this.state.category;
          category = category.split('-');

      var url = '';

      if(category[0] == 'MRIR'){
        url = config.config.url + '/api/mrir/list/pending/'+category[1]+'/ac/'+search;
      }

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

        this.setState({
          searchList: list_data.results,
        })

      }).catch((error) => {
        console.error(error);
      });
    }

    this.setState({
      isChanged: false,
    });
    
  }

  testCallBack = (text) => {
    console.log(text);
  }
  
  render() {

    return (
      
      <DismissKeyboard>
        <Block style={{width: width / 1.1, marginTop: 20, marginBottom: 5}}>
          <Block style={{backgroundColor: nowTheme.COLORS.WHITE, borderRadius: 8}}>
            <Block>
              <TouchableOpacity onPress={() => this.collapseShow()}>
                  <Block row style={styles.cardDescription}>
                      
                      <Block style={{width: '50%'}}>
                          <Text
                              style={{
                                  fontFamily: 'montserrat-bold'
                              }}
                              color={nowTheme.COLORS.SECONDARY}
                              size={15}
                          >
                              Filter
                          </Text>
                      </Block>

                      <Block right style={{width: '50%'}}>
                          <Icon
                              size={20}
                              color={nowTheme.COLORS.SECONDARY}
                              name={ this.state.isShow == true ? "arrow-up-circle" : "arrow-down-circle"}
                              family="Feather"
                          />
                      </Block>

                  </Block>
              </TouchableOpacity>
              
              <Block style={{paddingBottom: 20}}>
                <Block style={{width: width / 1.10, paddingHorizontal: 15}}>
                  <Divider />
                </Block>
              </Block>

            </Block>

            { this.state.isShow == true ? (
            
            <Block>
              { 
                this.props.filterBy.map((item, index) => {
                  var arr_data = this.state[item];
                  var text_replace = item.replace('_', ' ');
                  return(
                    <Block key={index} style={styles.pickerStyle}>
                      <Block style={{paddingBottom: 10}}>
                        <Text
                            style={{
                                fontFamily: 'montserrat-bold'
                            }}
                            color={nowTheme.COLORS.SECONDARY}
                            size={14}
                        >
                            {text_replace} :
                        </Text>
                      </Block>
                      
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
                            fontFamily: 'montserrat-bold',
                          }}
                          itemTextStyle={{ 
                            color: '#222', 
                            fontFamily: 'montserrat-bold',
                          }}
                          category={item}
                          menu={this.state.menu}
                          itemsContainerStyle={{ maxHeight: 140 }}
                          resetValue={false}
                          textInputProps={
                            {
                              placeholder: "Search " + text_replace,
                              underlineColorAndroid: "transparent",
                              style: {
                                  paddingVertical: 5,
                                  paddingHorizontal: 15,
                                  borderWidth: 1,
                                  borderColor: nowTheme.COLORS.GRAY,
                                  borderRadius: 5,
                                  fontFamily: 'montserrat-bold',
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

              <Block center style={{paddingBottom: 15}}>
                <Button 
                  onPress={() => this.filterClicked()}
                  style={{width: width / 1.2}}
                >
                  {
                    this.state.isLoading ? (
                      <ActivityIndicator size="large" color={nowTheme.COLORS.WHITE} />
                    ) : (
                      <Text
                        style={{
                            fontFamily: 'montserrat-bold'
                        }}
                        color={nowTheme.COLORS.WHITE}
                        size={14}
                      >
                        Search
                      </Text>
                    )
                  }

                </Button>
              </Block>

            </Block>
          ) : <Block />}
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
