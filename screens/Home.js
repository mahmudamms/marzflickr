import React from "react";
import { SearchBar, Header } from 'react-native-elements';
import { 
  ActivityIndicator,
  AsyncStorage, 
  Dimensions,
  FlatList,
  Keyboard,
  StyleSheet, 
  ScrollView,
  RefreshControl,
  View, Button,
  Image,   
  TouchableOpacity,
} from "react-native";

import {  Block, Card, theme, Icon, color, Button as Btn } from "galio-framework";
import { Text, GradientHeader } from "../components";
import nowTheme from "../constants/Theme";


import { TouchableWithoutFeedback } from "react-native";
const { height, width } = Dimensions.get("screen");

var iconColor = '#c2ffc2';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class Home extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      isLoading: true,      
      pictures: [],
      method: "flickr.photos.search",
      api_key: "92eb970121bc32aea2b84967199a0074",
      format: "json",
      tags: "Family",
      per_page: "10",
      nojsoncallback: "1",
      search_status: false,
      refreshing: false,
    };
  }

  async componentDidMount() {       
    if(this.state.search_status == false){
     this.LoadPictures();    
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.LoadPictures();
  }
  
  LoadPictures = async () => {
    try {      
      var url = "https://api.flickr.com/services/rest/?method="+this.state.method+"&api_key="+this.state.api_key+"&format="+this.state.format+"&tags="+this.state.tags+"&per_page="+this.state.per_page+"&page="+this.state.page+"&nojsoncallback="+this.state.nojsoncallback;
      await fetch(url)
      .then(response => response.json())
      .then(data => {       
        var list_data = data;  
        list_data = JSON.stringify(data);
        list_data = JSON.parse(list_data);
        this.setState({pictures: list_data.photos.photo,isLoading: false,refreshing: false});
      })
      .catch((error) => {
          setTimeout(() => {
            console.log(error);
          }, 1000);
        });
    } catch (e) {
      console.log(e);
    }
  }

  updateSearch = (search) => {
    this.setState({ tags: search,search_status: true });
    this.FilterTagsPictures();
  };

  FilterTagsPictures = async () => {
    try {      
      var url = "https://api.flickr.com/services/rest/?method="+this.state.method+"&api_key="+this.state.api_key+"&format="+this.state.format+"&tags="+this.state.tags+"&per_page="+this.state.per_page+"&page="+this.state.page+"&&nojsoncallback="+this.state.nojsoncallback;
      await fetch(url)
      .then(response => response.json())
      .then(data => {       
        var list_data = data;  
        list_data = JSON.stringify(data);
        list_data = JSON.parse(list_data);
        this.setState({pictures: list_data.photos.photo,isLoading: false,});
      })
      .catch((error) => {
          setTimeout(() => {
            console.log(error);
          }, 1000);
        });
    } catch (e) {
      console.log(e);
    }
  }

  Loading = function(){
    return(
      <Block style={{ justifyContent: 'center', marginTop: 100, alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ab0025" />
      </Block>
    );
  }

  render() {
    return (     
        <Block flex style={{flex: 1, backgroundColor: nowTheme.COLORS.WHITE}}>
          <Header 
            containerStyle={{
              backgroundColor: '#ad0000',
              justifyContent: 'space-around',
            }}          
            centerComponent={{ text: 'My Dreams - Flickr', style: { color: '#fff',fontSize:20 } }}
          />
          <SearchBar
            containerStyle={{backgroundColor: '#ad0000'}}
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            value={this.state.tags}
          />
          <ScrollView 
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          > 
          <View style={{flex: 1,paddingHorizontal: 20, paddingVertical: 20,borderRadius: 10, backgroundColor: nowTheme.COLORS.WHITE}}>  
            { this.state.isLoading == true ? this.Loading() : this.renderContent() }  
          </View>
          </ScrollView>
        </Block>
    );
  }

  renderContent = () => {
    //console.log(this.state.pictures);
    return(
      <Block>          
          <Block center>           
                {
                    this.state.pictures.map((item, index) => {
                      return this.renderItem(item,index) 
                    })
                }      
          </Block> 
      </Block> 
    )
  }


  renderItem = (item, index) => {    
    var srcPath = 'https://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'.jpg';
     
    return( 
      <Block key={index} style={{paddingBottom: 10}}>   

        <TouchableOpacity
           onPress={() => this.props.navigation.push('Detail Photo', {                       
            title: 'Detail Photo',
            photo_id: item.id,
          })}
        >
          <Block card style={{width: width / 1.1, backgroundColor: nowTheme.COLORS.WHITE}}>
            <Block row>
              <Block style={{height:300, width: '100%', padding:10}}>
              <Block style={{width: '100%',paddingBottom:10,borderBottomWidth: 1,}}>
                  <Text
                    size={20}
                    color={nowTheme.COLORS.GRAY}
                    title={item.title}
                    bold
                    left
                  />
                </Block>
              <Image source={{uri: srcPath}} style = {{paddingTop:10,paddingBottom:10,height: "75%", width:"100%", padding: 10, resizeMode : 'stretch',}} />
              
                <Block style={{width: '100%',borderBottomColor: '#e0e0e0',paddingTop:10,paddingBottom:10,borderTopWidth: 1,}}>
                  <Text
                    size={9}
                    color={nowTheme.COLORS.GRAY}
                    title={'Owner : '+item.owner}
                    bold
                    left
                  />
                </Block>
              </Block>
              
            </Block>           
          </Block>
        </TouchableOpacity>   
           
      </Block>

       
      
    )
  }

}

const styles = StyleSheet.create({
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  }
});

export default Home;
