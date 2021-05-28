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
} from "react-native"; 
 
import {  
    Block,  
    Input, 
    theme,  
    Text, 
} from "galio-framework"; 

 
import { GradientHeader } from "../components"; 
import { nowTheme, config } from "../constants"; 

import ImageModal from 'react-native-image-modal';

import moment from "moment";

import { WebView } from 'react-native-webview';
 
const { height, width } = Dimensions.get("screen"); 
 
var gradientColor = ['#0BAB64', '#83D475']; 
 
class DetailIssue extends React.Component { 
 
   // _isMounted = false; 
 
    constructor() { 
    super(); 
     
    this.state = { 
        case    : '', 
        listData: [], 
        isLoaded: false,
        isLoading: false, 
        isLoadData: false, 
        loadButton: false, 
        dataLogin: [], 
        filter: '', 
        data_issue: [],
        data_detail: [],
        listPhoto: [],
        listPhotoAction: [],
        running_number: '',
        id_cat_photo_evidence:  0,
        id_cat_photo_action:  1,
 
    }; 
    } 
 
    async componentDidMount() { 

        this.setState({isLoaded: true});
          
        var data_user = await AsyncStorage.getItem('data_user'); 
        var data_user = JSON.parse(data_user); 
    
        var data_login = { 
            project: data_user.project_id, 
            api: data_user.api_key, 
        } 
    
        this.setState({
            dataLogin: data_login,
            data_issue: this.props.route.params.data_issue,
            running_number : this.props.route.params.running_number,
            isLoaded: true,
        }); 
    
        //console.log(this.state.data_issue);

         this.readData() ;
         this.loadAllphoto();
         this.loadAllphotoAction();
    
    } 
 
    componentWillUnmount() { 
    //this._isMounted = false; 
   
    } 
        
    readData = () => { 
           
        var url = config.config.url + '/api/iym/detail_issue/' + this.state.data_issue; 
        var api = this.state.dataLogin.api;
        
            fetch(url, { 
                method: 'GET', 
                headers: new Headers({ 
                    'Content-Type': 'application/json', 
                    "Accept": "application/json", 
                    'Authorization': api, 
                }), 
            }) 
            .then((response) => response.text()) 
            .then((data) =>{         
                var detail_data = data; 
                if(data.slice(-1) != '}'){ 
                    detail_data = data + '}'; 
                }         
                detail_data = JSON.parse(detail_data); 
                //console.log(detail_data.results);            
                this.setState({ 
                    data_detail: detail_data.results,
                    isLoaded:false
                }); 
                //console.log(this.state.data_detail);          
            }).catch((error) => { 
                console.error(error); 
            }); 
    } 
  
    renderArticles = () => { 
        
    return ( 
         
        <ScrollView>     
                {
                        this.state.data_detail.map((item, index) => {
                            var dateView = moment(item.create_date).format("D MMMM YYYY HH:mm:ss");
                            if(index == 0){
                                return (
                                    <View row key={index} style={{ width: '100%' }}>
                                        <Text style={{flex:1,paddingBottom:10,fontWeight: "bold",fontSize: 20}}>
                                            Case No : {item.running_number}
                                        </Text> 
                                        <Text style={{flex:1,paddingBottom:10,fontWeight: "bold"}}>
                                            {item.create_by_full_name} , {dateView}
                                        </Text>
                                    </View> 
                                )
                            }
                        })
                }
                <Text style={{fontWeight: "bold"}}>Detail Of Case : {"\n"}</Text>
                {
                        this.state.data_detail.map((item, index) => {
                            //console.log(item);
                            if(index == 0){
                            return (                                
                                    <View row key={index} style={{ width: '100%',paddingBottom:10 }}>
                                    <Text style={{flex:1, borderColor: '#e0e0e0', borderWidth: 1,padding:10,borderRadius:10}}>{item.case}</Text>                      
                                    </View>   
                            )
                            }
                        })
                }  

                <Text style={{fontWeight: "bold"}}>Evidence Picture</Text>   
                <Block row style={{paddingTop:10,paddingLeft:10,paddingBottom:10, backgroundColor: nowTheme.COLORS.WHITE}}>
                        { this.renderPicture() }
                </Block> 
                
                <View
                    style={{
                        borderBottomColor: '#e0e0e0',
                        borderBottomWidth: 1,
                        paddingBottom:20,
                    }}
                    />
            
               <Text style={{fontWeight: "bold",paddingTop:20}}>Badge</Text>
               {
                    this.state.data_detail.map((item, index) => {
                        return (
                            <View row key={index} style={{ width: '100%' }}>
                                <Input
                                    color="black"
                                    placeholder="Badge Employee"
                                    placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                    defaultValue={item.badge_no + ' - ' + item.name }
                                    editable = {false}
                                    />                      
                            </View> 
                        )
                    })
                } 

                <Text style={{fontWeight: "bold"}}>Designation</Text>
                {
                    this.state.data_detail.map((item, index) => {
                        return (
                                <View row key={index} style={{ width: '100%' }}>
                                <Input
                                    color="black"
                                    placeholder="Badge Employee"
                                    placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                    defaultValue={item.badge_no + ' - ' + item.design_name }
                                    editable = {false}
                                    />                      
                                </View>  
                        )
                    })
                } 

                <Text style={{fontWeight: "bold"}}>Department</Text>
                {
                    this.state.data_detail.map((item, index) => {
                        return (                         
                                <View row key={index} style={{ width: '100%' }}>
                                <Input
                                    color="black"
                                    placeholder="Badge Employee"
                                    placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                    defaultValue={item.badge_no + ' - ' + item.department_name }
                                    editable = {false}
                                    />                      
                                </View> 
                        )
                    })
                }

                <Text style={{fontWeight: "bold"}}>Project</Text>
                {
                        this.state.data_detail.map((item, index) => {
                            if(index == 0){
                            return (
                                    <View row key={index} style={{ width: '100%' }}>
                                    <Input
                                        color="black"
                                        placeholder="Project Name"
                                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                        defaultValue={item.project_name }
                                        editable = {false}
                                        />                      
                                    </View>  
                            )
                            }
                        })
                } 

                
                <View
                    style={{
                        borderBottomColor: '#e0e0e0',
                        borderBottomWidth: 1,
                        paddingBottom:20,
                    }}
                    /> 

                <Text style={{fontWeight: "bold",paddingTop:20,}}>Assign To</Text>
                {
                        this.state.data_detail.map((item, index) => {
                            if(index == 0){
                            return (
                                    <View row key={index} style={{ width: '100%' }}>
                                    <Input
                                        color="black"
                                        placeholder="Assign To"
                                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                        defaultValue={item.assign_to}
                                        editable = {false}
                                        />                      
                                    </View>    
                            )
                            }
                        })
                } 

                <Text style={{fontWeight: "bold"}}>Assign Date</Text>
                {
                        this.state.data_detail.map((item, index) => {
                            if(index == 0){
                            return (
                                
                                    <View row key={index} style={{ width: '100%' }}>
                                    <Input
                                        color="black"
                                        placeholder="Assign To"
                                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                        defaultValue={item.assign_date}
                                        editable = {false}
                                        />                      
                                    </View>  
                            )
                            }
                        })
                } 

                <View
                    style={{
                        borderBottomColor: '#e0e0e0',
                        borderBottomWidth: 1,
                        paddingBottom:20,
                    }}
                    />

                <Text style={{fontWeight: "bold",paddingTop:20,}}>Action Detail</Text>
                {
                        this.state.data_detail.map((item, index) => {
                            if(index == 0){
                                return (
                                        <View row key={index} style={{ width: '100%' }}>
                                        <Input
                                            color="black"
                                            placeholder="Action Detail"
                                            placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                            defaultValue={item.action_detail}
                                            editable = {false}
                                            />                      
                                        </View>
                                )
                            }
                        })
                }

                <Text style={{fontWeight: "bold"}}>Action By</Text>
                {
                        this.state.data_detail.map((item, index) => {
                            //console.log(item);
                            if(index == 0){
                                return (
                                        <View row key={index} style={{ width: '100%' }}>
                                        <Input
                                            color="black"
                                            placeholder="Action By"
                                            placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                            defaultValue={item.action_by}
                                            editable = {false}
                                            />                      
                                        </View> 
                                )
                            }
                        })
                } 

                <Text style={{fontWeight: "bold"}}>Action Date</Text>
                {
                        this.state.data_detail.map((item, index) => {
                            if(index == 0){
                                return (
                                    <View row key={index} style={{ width: '100%' }}>
                                        <Input
                                            color="black"
                                            placeholder="Action Date"
                                            placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                            defaultValue={item.action_by_datetime}
                                            editable = {false}
                                            />                      
                                    </View>
                                )
                            }
                        })
                } 

                <Text style={{fontWeight: "bold"}}>Action Picture</Text>   
                <Block row style={{paddingTop:10,paddingLeft:10,paddingBottom:10, backgroundColor: nowTheme.COLORS.WHITE}}>
                        { this.renderPictureAction() }
                </Block> 

        </ScrollView>
           
    ); 
    }; 
 
      
    
    Loading = function(){ 
        return( 
            <Block style={{ flex: 1, justifyContent: 'center', alignItems: 'center'  }}> 
                <ActivityIndicator size="large" color={nowTheme.COLORS.PRIMARY} /> 
            </Block> 
        ); 
    } 
 
    renderHeader = () => { 
        return( 
            <GradientHeader  
                datauser={this.state.data_user} 
                title={'Detail Of Case'} 
                back={true} 
                gradientColor={gradientColor} 
                borderRadius={5} 
                profile={false} 
                headerHeight={5} 
            /> 
        ) 
    } 

    loadAllphoto = () => {

        this.setState({
            isLoadData : true,
        });
    
        var api   = this.state.dataLogin.api;    
        var url = config.config.url + '/api/iym/search_photo/'+this.state.data_issue+'/'+this.state.id_cat_photo_evidence;

        console.log(url);
            
        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': api
            }),
        })
        .then((response) => response.text())
        .then(data =>{
            var list_photo = data;
            if(data.slice(-1) != '}'){
                list_photo = data + '}';
            }
        
            list_photo = JSON.parse(list_photo);

            console.log(list_photo);
        
            this.setState({
                listPhoto: list_photo.results,
                isLoadData: false,                
            });
    
        });
    } 


    loadAllphotoAction = () => {

        this.setState({
            isLoadData : true,
        });
    
        var api   = this.state.dataLogin.api;    
        var url = config.config.url + '/api/iym/search_photo/'+this.state.data_issue+'/'+this.state.id_cat_photo_action;
            
        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': api
            }),
        })
        .then((response) => response.text())
        .then(data =>{
            var list_photo_action = data;
            if(data.slice(-1) != '}'){
                list_photo_action = data + '}';
            }
        
            list_photo_action = JSON.parse(list_photo_action);

            console.log();
        
            this.setState({
                listPhotoAction: list_photo_action.results,
                isLoadData: false,                
            });
    
        });
    } 

    renderPicture = () => {
        if(this.state.listPhoto.length > 0){ 

            return (        
                    <FlatList
                        data={this.state.listPhoto}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item,index) => {
                            return(
                                this.renderItem(item,index)
                            )
                        }}
                        numColumns={3}
                        style={{width:'100%'}}
                    />
            )

        } else {

            return (        
                <Block style={{width: '100%', padding:10}}>
                 <Image source={require('../assets/no_image.png')} style = {{height: 100, width: 125, padding: 10, resizeMode : 'stretch',}} />
                </Block>
            )

        }
        
    }

    renderPictureAction = () => {
        if(this.state.listPhotoAction.length > 0){ 

            return (        
                    <FlatList
                        data={this.state.listPhotoAction}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item,index) => {
                            return(
                                this.renderItem(item,index)
                            )
                        }}
                        numColumns={3}
                        style={{width:'100%'}}
                    />
            )

        } else {

            return (        
                <Block style={{width: '100%', padding:10}}>
                 <Image source={require('../assets/no_image.png')} style = {{height: 100, width: 125, padding: 10, resizeMode : 'stretch',}} />
                </Block>
            )

        }
        
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
                <View style={{flex: 1,paddingHorizontal: 20, paddingVertical: 20,borderRadius: 10, backgroundColor: nowTheme.COLORS.WHITE}}>            
                { this.state.isLoaded == true ? this.Loading() : this.renderArticles() } 
                </View> 
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
 
export default DetailIssue; 
