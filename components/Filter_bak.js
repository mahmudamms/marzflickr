import React from "react";

import { 
  Animated,
  AsyncStorage,
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
// import Input from './Input';
import Select from './Select';

import { nowTheme, config, detail_mrir } from "../constants";

import Autocomplete from './Autocomplete';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class FilterBar extends React.Component {

  _isMounted = false;
  
  constructor() {
    super();

    this.state = {
      isShow: false,
      category: '',
      disciplineList: [],
      searchList: [],
      isChanged: false,
      dataLogin: [],
      discipline: [],
      acSelected: [],
      dataSearch: [],
      filterBy: [],
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
      category: this.props.category,
      filterBy: this.props.filterBy,
    });

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
    state['isChanged'] = false;
    this.setState(state);
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
    var id_discipline = this.state.discipline.id;
    var search        = this.state.searchData;

    var data = {
      discipline: id_discipline,
      search: search,
    };

    this.props.filterClicked(data);
  }

  collapseShow = () => {
    this.setState({
      isShow: !this.state.isShow
    })

    if(this.state.disciplineList.length == 0){
      this.readDiscipline();
    }
  }

  getSearch = (text) => {

    // console.log(text);

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
        <Block style={{width: '92%', marginTop: 30, marginBottom: 30}}>
          <ScrollView>
            <Block card>
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
              </Block>
              { this.state.isShow == true ? (
              
              <Block>
                <Block style={styles.pickerStyle}>
                  <Block style={{paddingBottom: 10}}>
                    <Text
                        style={{
                            fontFamily: 'montserrat-regular'
                        }}
                        color={nowTheme.COLORS.SECONDARY}
                        size={13}
                    >
                        Discipline :
                    </Text>
                  </Block>

                  <Block>
                    { this.state.isChanged == false ? (
                      <Block>
                        <Block>
                          <SearchableDropdown
                            onItemSelect={(item) => {
                              this.setData(item, 'discipline')
                            }}
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
                            defaultIndex={this.state.discipline.index + 1}
                            itemsContainerStyle={{ maxHeight: 140 }}
                            items={this.state.disciplineList}
                            selectedItems={this.state.discipline.index + 1}
                            resetValue={false}
                            textInputProps={
                              {
                                placeholder: "Search Discipline",
                                underlineColorAndroid: "transparent",
                                style: {
                                    padding: 10,
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
                      </Block>
                    ) : null}
                  </Block>
                </Block>

                <Block style={styles.pickerStyle}>
                  <Block style={{paddingBottom: 10}}>
                    <Text
                        style={{
                            fontFamily: 'montserrat-regular'
                        }}
                        color={nowTheme.COLORS.SECONDARY}
                        size={13}
                    >
                        Search :
                    </Text>
                  </Block>
                        
                  { this.state.isChanged == false ? (
                  <Block>
                    <Autocomplete
                      onItemSelect={(item) => {
                        console.log(item);
                        this.setData(item, 'acSelected')
                      }}
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
                      defaultIndex={this.state.disciplineList.index}
                      category={this.state.category}
                      itemsContainerStyle={{ maxHeight: 140 }}
                      resetValue={false}
                      textInputProps={
                        {
                          placeholder: "Search Data",
                          underlineColorAndroid: "transparent",
                          style: {
                              padding: 10,
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

                { 
                  this.props.filterBy.map((item, index) => {
                    return(
                      <Block key={index} style={styles.pickerStyle}>
                        <Block style={{paddingBottom: 10}}>
                          <Text
                              style={{
                                  fontFamily: 'montserrat-regular'
                              }}
                              color={nowTheme.COLORS.SECONDARY}
                              size={13}
                          >
                              {item} :
                          </Text>
                        </Block>
                        
                        { this.state.isChanged == false ? (
                        <Block>
                          <Autocomplete
                            onItemSelect={(itemSelect) => {
                              // console.log(itemSelect);
                              this.setData(itemSelect, item)
                            }}
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
                            defaultIndex={this.state.disciplineList.index}
                            category={this.state.category}
                            itemsContainerStyle={{ maxHeight: 140 }}
                            resetValue={false}
                            textInputProps={
                              {
                                placeholder: "Search " + item,
                                underlineColorAndroid: "transparent",
                                style: {
                                    padding: 10,
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

                <Block center >
                  <Button 
                    size={'small'}
                    onPress={() => this.filterClicked()}
                  >
                    <Text
                        style={{
                            fontFamily: 'montserrat-bold'
                        }}
                        color={nowTheme.COLORS.WHITE}
                        size={15}
                    >
                      Search
                    </Text>
                  </Button>
                </Block>

              </Block>
            ) : <Block />}
            </Block>
          </ScrollView>
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
    padding: theme.SIZES.BASE / 1,
    borderRadius: 4,
    borderColor: nowTheme.COLORS.BLACK,
  },
  autocompleteContainer: {
    flex: 1,
    // zIndex: 1
  },
});

export default FilterBar;
