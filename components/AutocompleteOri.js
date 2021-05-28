import React, { Component } from 'react';
import {
  AsyncStorage,
  Text,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard
} from 'react-native';

import config from "../constants/config";

const defaultItemValue = {
  name: '', id: 0
};


export default class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.renderTextInput  = this.renderTextInput.bind(this);
    this.renderFlatList   = this.renderFlatList.bind(this);
    this.searchedItems    = this.searchedItems.bind(this);
    this.renderItems      = this.renderItems.bind(this);
    this.state = {
      item: {},
      listItems: {
        name: '',
      },
      focus: false,
      category: '',
      menu: '',
      dataLogin: [],
      workpack: '',
      valueText: this.props.textInputValue,
      isChanged: false,
    };
  }

  renderFlatList = () => {
    if (this.state.focus) {
      const flatListPorps = { ...this.props.listProps };
      const oldSupport = [
        { key: 'keyboardShouldPersistTaps', val: 'always' }, 
        { key: 'nestedScrollEnabled', val : false },
        { key: 'style', val : { ...this.props.itemsContainerStyle } },
        { key: 'data', val : this.state.listItems },
        { key: 'keyExtractor', val : (item, index) => index.toString() },
        { key: 'renderItem', val : ({ item, index }) => this.renderItems(item, index) },
      ];
      oldSupport.forEach((kv) => {
        if(!Object.keys(flatListPorps).includes(kv.key)) {
          flatListPorps[kv.key] = kv.val;
        } else {
          if(kv.key === 'style') {
            flatListPorps['style'] = kv.val;
          }
        }
      });
      return (
        <FlatList
          { ...flatListPorps }
        />
      );
    }
  };

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
      menu: this.props.menu,
      workpack: this.props.workpack,
    });

  }

  searchData = (text) => {

    this.setState({
      listItems: {},
      valueText: text,
      item: {},
    });

    if(text){

      var project = this.state.dataLogin.project;
      var api     = this.state.dataLogin.api;
      var search  = text;

      var category  = this.state.category;
      var menu      = this.state.menu;

      var url = '';

      if(category == 'Module'){
        url = config.config.url + '/api/module/' + project + '/' + search;
      }

      if(category == 'Discipline'){
        url = config.config.url + '/api/discipline/' + project + '/' + search;
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
          listItems: list_data.results,
        })

      }).catch((error) => {
        console.error(error);
      });

    } else {
        this.props.onItemSelect(this.state.listItems);
    }
  }

  searchedItems = searchedText => {

    let setSort = this.props.setSort;
    if (!setSort && typeof setSort !== 'function') {
      setSort = (item, searchedText) => { 
        return item.name.toLowerCase().indexOf(searchedText.toLowerCase()) > -1
      };
    }
    var ac = '';

    let item = {
      id: -1,
      name: searchedText
    };
    this.setState({ listItems: ac, item: item });
    const onTextChange = this.props.onTextChange || this.props.textInputProps.onTextChange || this.props.onChangeText || this.props.textInputProps.onChangeText || this.props.textValue;
    if (onTextChange && typeof onTextChange === 'function') {

      setTimeout(() => {
        onTextChange(searchedText);
      }, 0);
    }
  };

  renderItems = (item, index) => {
    // console.log(item);
    return (
    <TouchableOpacity
      style={{ ...this.props.itemStyle }}
      onPress={() => {
        this.setState({ 
          item: item, 
          focus: false,
          isChanged: true,
        });
        Keyboard.dismiss();
        setTimeout(() => {
          // console.log('clicked');
          this.props.onItemSelect(item);
          
        }, 0);

      }}
    >
        { 
        this.props.selectedItems && this.props.selectedItems.length > 0 && this.props.selectedItems.find(x => x.id === item.id) 
        ?
          <Text style={{ ...this.props.itemTextStyle }}>{item.name}</Text>
        :
          <Text style={{ ...this.props.itemTextStyle }}>{item.name}</Text>
        }
    </TouchableOpacity>
    );
  };

  renderListType = () => {
    return this.renderFlatList();
  };

  renderTextInput = () => {
    const textInputProps = { ...this.props.textInputProps };
    const oldSupport = [
        { key: 'ref', val: e => (this.input = e) }, 
        
        { key: 'onTextChange', val: (text) => { 
            this.searchData(text)
            this.searchedItems(text) 

        } }, 
       
        { key: 'underlineColorAndroid', val: this.props.underlineColorAndroid }, 
      { 
        key: 'onFocus', 
        val: () => {
          this.props.onFocus && this.props.onFocus()
          this.setState({
            focus: true,
            item: defaultItemValue,
          });
        } 
      }, 
      {
        key: 'onBlur',
        val: () => {
          this.props.onBlur && this.props.onBlur(this);
          this.setState({ focus: false, item: this.props.selectedItems });
        }
      },
      {
        key: 'value',
        val: this.state.item ? this.state.item.name : ''
      },
      {
        key: 'style',
        val: { ...this.props.textInputStyle }
      },
      {
        key: 'placeholderTextColor',
        val: this.props.placeholderTextColor
      },
      {
        key: 'placeholder',
        val: this.props.placeholder
      }
    ];
    oldSupport.forEach((kv) => {
      if(!Object.keys(textInputProps).includes(kv.key)) {
        if(kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps['onChangeText'] = kv.val;
        } else {
          textInputProps[kv.key] = kv.val;
        }
      } else {
        if(kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps['onChangeText'] = kv.val;
        }
      }
    });

    return (
      <TextInput
        { ...textInputProps }
        value={this.state.valueText }
        onBlur={(e) => {
          this.setState({valueText: this.props.textInputValue});

          if (this.props.onBlur) {
              this.props.onBlur(e);
          }
          if (this.props.textInputProps && this.props.textInputProps.onBlur) {
              this.props.textInputProps.onBlur(e);
          }
          this.setState({ focus: false, item: this.props.selectedItems });

          console.log('pilih');
          console.log(this.props);
        }}
      />
    )
  }

  render = () => {
    return (
      <View
        keyboardShouldPersist="always"
        style={{ ...this.props.containerStyle }}
      >
        { this.renderSelectedItems() }
        { this.renderTextInput() }
        {this.renderListType()}
      </View>
    );
  };

  renderSelectedItems(){
    let items = this.props.selectedItems || [];
    if(items !== undefined && items.length > 0 && this.props.chip && this.props.multi){
      return <View style={{flexDirection: 'row',  flexWrap: 'wrap', paddingBottom: 10, marginTop: 5 }}>
        { items.map((item, index) => {
          return (
            <View key={index} style={{
                width: (item.name.length * 8) + 60,
                justifyContent: 'center',
                flex: 0,
                backgroundColor: '#eee',
                flexDirection: 'row',
                alignItems: 'center',
                margin: 5,
                padding: 8,
                borderRadius: 15,
            }}>
              <Text style={{ color: '#555' }}>{item.name}</Text>
              <TouchableOpacity onPress={() => setTimeout(() => { this.props.onRemoveItem(item, index) }, 0) } style={{ backgroundColor: '#f16d6b', alignItems: 'center', justifyContent: 'center', width: 25, height: 25, borderRadius: 100, marginLeft: 10}}>
                  <Text>X</Text>
              </TouchableOpacity>
            </View>
          )
        }) 
      }
      </View>
    }
 }
}