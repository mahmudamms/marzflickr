import React from "react"; 
import {  
    ActivityIndicator, 
    AsyncStorage, 
    Dimensions, 
    StyleSheet,  
    ScrollView, 
    View, 
    Image,
    FlatList,
    RefreshControl,
    Linking,
} from "react-native"; 

import { SafeAreaView } from 'react-native-safe-area-context';
 
import {  
    Block,  
    Input, 
    theme,
    Text as TextGalio
} from "galio-framework"; 
 
import { GradientHeader,Text, } from "../components"; 
import { nowTheme, config } from "../constants"; 
import ImageModal from 'react-native-image-modal';
import moment from "moment";
import { TouchableOpacity } from "react-native";
 
const { height, width } = Dimensions.get("screen"); 
 
var gradientColor = ['#ff1100', '#ab0025']; 
 
class Detailphoto extends React.Component { 
 
   _isMounted = false;  

    constructor() { 
        super();      
        this.state = {   
            isLoaded: false,
            method: "flickr.photos.getInfo",
            api_key: "92eb970121bc32aea2b84967199a0074",
            format: "json",
            nojsoncallback: "1", 
            pictures: [],
            refreshing: false,
            farm: "",
            server: "",
            id: "",
            secret: "",

            title_content: "",
            owner_realname: "",
            location:"",
            description: "",
            taken_date: "",
            urls: [],
            tags_photo: [],
        }; 
    } 
 
    componentDidMount() { 
         this.readData();
    } 

    _onRefresh = () => {
      this.setState({refreshing: true});
      this.readData();
    }
           
    readData = async () => {
          try {      
            var url = "https://api.flickr.com/services/rest/?method="+this.state.method+"&api_key="+this.state.api_key+"&format="+this.state.format+"&photo_id="+this.props.route.params.photo_id+"&nojsoncallback="+this.state.nojsoncallback;
            await fetch(url)
            .then(response => response.json())
            .then(data => {       
              var list_data = data;  
              list_data = JSON.stringify(data);
              list_data = JSON.parse(list_data);
              this.setState({
                  farm: list_data.photo.farm,
                  server: list_data.photo.server,
                  id: list_data.photo.id,
                  secret: list_data.photo.secret,
                  title_content: list_data.photo.title._content,
                  owner_realname: list_data.photo.owner.username,
                  location: list_data.photo.owner.location,
                  description: list_data.photo.description._content,
                  tags_photo: list_data.photo.tags.tag,
                  taken_date: list_data.photo.dates.taken,
                  urls: list_data.photo.urls.url,
                  isLoaded: true,
                  refreshing: false});
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

    renderTags = ({item,index}) => {    
        return(          
            <TextGalio style={{fontWeight: "bold",backgroundColor:"#bdbdbd",padding:5,paddingLeft:10,borderRadius: 10,}}>{item.raw}</TextGalio>
        )
      }

    renderContent = () => {

        var srcPath = 'https://farm'+this.state.farm+'.staticflickr.com/'+this.state.server+'/'+this.state.id+'_'+this.state.secret+'.jpg';
        return(
            <Block card style={{width: width / 1.1, backgroundColor: nowTheme.COLORS.WHITE}}>
            <Block>
              <Block style={{width: '100%', padding:10}}>
              <Block style={{width: '100%',paddingBottom:10,borderBottomWidth: 1,}}>
                  <Text
                    size={20}
                    color={nowTheme.COLORS.GRAY}
                    title={this.state.title_content}
                    bold
                    left
                  />                  
                </Block>
                <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="#000000"
                    style={{
                        width: 310,
                        height: 200,
                    }}
                    source={{
                        uri: srcPath,
                    }}
                />
                <Block style={{width: '100%',paddingBottom:2}}>
                  <Text
                    size={10}
                    color={nowTheme.COLORS.GRAY}
                    title={this.state.owner_realname}
                    bold
                    left
                  />
                </Block>
                <Block style={{width: '100%',paddingTop:10,alignItems:"center"}}>
                    {
                            this.state.urls.map((item, index) => {
                                if(index == 0){
                                    return (
                                        <TouchableOpacity key={index} onPress={() => Linking.openURL(item._content)}>
                                        <Image 
                                        source={require('../assets/flickr_logo.png')} 
                                        style = {{height: 50, width: 50, padding: 10, resizeMode : 'stretch',}}                         
                                        />
                                        </TouchableOpacity>
                                    )
                                }
                            })
                    }                   
                </Block>
                <Block style={{width: '100%',paddingTop:10}}>
                  <Text
                    size={15}
                    color={nowTheme.COLORS.GRAY}
                    title={this.state.description == "" ? " - No Description - " : this.state.description }
                    bold
                    left
                  />
                </Block>
                
               
                <Block style={{width: '100%',paddingBottom:2}}>
                  <Text
                    size={10}
                    color={nowTheme.COLORS.GRAY}
                    title={this.state.location}
                    bold
                    left
                  />
                </Block>
                <Block style={{width: '100%'}}>
                    <TextGalio style={{fontWeight: "bold"}}>Tags :</TextGalio>
                    <FlatList
                        data={this.state.tags_photo}
                        renderItem={(item,index) => {
                            return(
                                this.renderTags(item,index)
                            )
                        }}
                        numColumns={3}
                        style={{width:'100%'}}
                    />                 
                </Block>
              </Block>
              
            </Block>           
          </Block>
        )
      }
      
      Loading = function(){
        return(
          <Block style={{ justifyContent: 'center', marginTop: 100, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#ab0025" />
          </Block>
        );
      }
 
    renderHeader = () => { 
        return( 
            <GradientHeader  
                datauser={this.state.data_user} 
                title={'Detail Photo'} 
                back={true} 
                gradientColor={gradientColor} 
                borderRadius={5} 
                profile={false} 
                headerHeight={5} 
            /> 
        ) 
    } 
    
    renderItem = ({item,index}) => {
    
        return(
          
            <ImageModal
                resizeMode="contain"
                imageBackgroundColor="#000000"
                style={{
                    width: 100,
                    height: 100,
                }}
                source={{
                    uri: item.filename,
                }}
            />
           
        )
      }
 
    render() {      
        return ( 
            <View style={{top: height * 0,flex: 1}}> 
                { this.renderHeader() }   
                <ScrollView 
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                > 
                    <View style={{flex: 1,paddingHorizontal: 20, paddingVertical: 20,borderRadius: 10, backgroundColor: nowTheme.COLORS.WHITE}}>            
                    { this.state.isLoaded == false ? this.Loading() : this.renderContent() } 
                    </View>
                </ScrollView>  
            </View>          
        ); 
       
    }    
} 
 
const styles = StyleSheet.create({ 
  home: { 
    width: width 
  }, 
  articles: { 
    width: width - theme.SIZES.BASE * 2, 
    paddingVertical: theme.SIZES.BASE, 
    fontFamily: 'montserrat-regular' 
 
  }, 
  logo: { 
    width: 66, 
    height: 58, 
  }, 
}); 
 
export default Detailphoto; 
