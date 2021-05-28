import React from "react";
import AwesomeAlert from 'react-native-awesome-alerts';

import mime from "mime";
import * as ImageManipulator from 'expo-image-manipulator';

import ImageModal from 'react-native-image-modal';

import { 
    ActivityIndicator,
    AsyncStorage,
    ImageBackground,
    FlatList,
    Image,
    TextInput,
    Dimensions,
    Keyboard,
    StyleSheet, 
    ScrollView,
    TouchableWithoutFeedback,
    View,
    Modal,
    TouchableOpacity,
} from "react-native";

import { 
    Toast,
    Block, 
    Input, 
    Button,
    theme, 
    Text, 
    Icon
} from "galio-framework";

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import Select2 from "react-native-select-two"

import { GradientHeader} from "../components";
import { nowTheme, config } from "../constants";

import Autocomplete from '../components/Autocomplete';
import {Camera} from 'expo-camera';

import ImageViewer from 'react-native-image-zoom-viewer';


const { height, width } = Dimensions.get("screen");

var iconColor = '#6FBE6F';
var gradientColor = ['#0BAB64', '#83D475'];
var index_employee = 1;
var filter = ['department', 'project'];

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);
 
class Action extends React.Component {  

    _isMounted = false;

    constructor() {
    super();
    
    this.state = {

    assigned_case : '',
    isShow: false,
    update_status: false, 
    status_issue: '',
    total : '', 
    id_issue_delete: '',
    arr_employee: [''],
    arr_new_employee: [],
    running_number: '',
    listDataDepartment: [],
    flashSuccess: true,
    cekPhoto: false,
    startCamera: false,
    typeCamera: Camera.Constants.Type.back,
    capturedImage: false,
    photoName: '',

    badge   : '',
    department  : '',
    project     : '',
    case    : '',
    action    : '',
    showAlertConfirm: false,
    showDeleteConfirm: false,
    
    listMasterDepartment: [],
    listMasterProject: [], 
    
    listData: [],
    listPhoto: [],
    listPhotoAct: [],
    isLoading: true,
    isLoadData: false,
    loadButton: false,
    dataLogin: [],
    filter: '',
    
    evidence: [],
    link: '',
    link_evidence: [],

    isModalOpened: false,  //Controls if modal is opened or closed
    currentImageIndex: 0   //Controls initial photo to show for modal

    };
    }

  

    async componentDidMount() {
    this._isMounted = true;

    var data_user = await AsyncStorage.getItem('data_user');
    var data_user = JSON.parse(data_user);
    var data_login = {
    project: data_user.project_id,
    api: data_user.api_key,
    id_user: data_user.id_user,
    permission: data_user.role
    }
    //console.log( data_login )
    this.setState({
        dataLogin: data_login,
        running_number : this.props.route.params.running_number,
        update_status : this.props.route.params.update_status,
    });
    setTimeout(() => {this.setState({update_status: false})}, 1000)
    this.readData()
    this.loadAllphoto()
    this.loadActionPhoto()

    return () => { isMounted = false };
    }

    componentWillUnmount() {
    this._isMounted = false;
    }

    filterCallback = (filterdata) => {
    this.setState({
    isLoadData : true,
    filter: filterdata,
    });

    var project   = this.state.dataLogin.project;
    var api   = this.state.dataLogin.api;

    var url = config.config.url + '/api/vt/list/pending/' + project + '/0/' + filterdata;
    
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
        listData: list_data.results,
        isLoadData: false,
        loadButton: (list_data.results.length >= 10 ? true : false),
    });

    });
    }  

    openModal = (index) => {
        this.setState({isModalOpened: true, currentImageIndex: index })
     }

    loadAllphoto = () => {

        this.setState({
        isLoadData : true,
        });
    
        var api   = this.state.dataLogin.api;
        var url = config.config.url + '/api/iym/search_photo/'+this.state.running_number+'/0';
            
        fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': api 
        }),
        })
        .then((response) => response.text())
        .then(data =>{
            console.log('ini bukti')
            console.log(data)
            var list_photo = data;
            if(data.slice(-1) != '}'){
                list_photo = data + '}';
            }
        
            list_photo = JSON.parse(list_photo);
        
            this.setState({
                listPhoto: list_photo.results,
                isLoadData: false,                
            });
    
        });
    } 

    loadActionPhoto = () => {

        this.setState({
        isLoadData : true,
        });
    
        var api   = this.state.dataLogin.api;
        var url = config.config.url + '/api/iym/search_photo/'+this.state.running_number+'/1';
            
        fetch(url, {
        method: 'GET',
        headers: new Headers({ 
            'Authorization': api 
        }),
        })
        .then((response) => response.text())
        .then(data =>{
            console.log('ini aksi')
            console.log(data)
            var list_photo = data;
            if(data.slice(-1) != '}'){
                list_photo = data + '}';
            }
        
            list_photo = JSON.parse(list_photo);
        
            this.setState({
                listPhotoAct: list_photo.results,
                isLoadData: false,                
            });
    
        });
    } 
 
    readData = () => {   
    var url = config.config.url + '/api/iym/detail_data_update/'+this.state.running_number;
    var api   = this.state.dataLogin.api;

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
        // console.log(data)
        var master_data_dept = data; 

        master_data_dept = JSON.parse(master_data_dept);
        var arr_dept = master_data_dept.data_dept 
        var arr_project = master_data_dept.data_project   
        var arr_issue = master_data_dept.data_issue 
        var arr_action = master_data_dept.data_action  

        this.setState({
            total : master_data_dept.total_row,

            listMasterDepartment: arr_dept,
            listMasterProject: arr_project,
            arr_employee: arr_issue, 
            case: arr_issue[0].case,
            department: arr_issue[0].department, 
            project: arr_issue[0].project, 
            assigned_case: arr_issue[0].assign_to,
            status_issue: arr_issue[0].status_issue,
            action: arr_action.action_detail,

            isLoading: false,

            evidence : master_data_dept.evidence,
            link : master_data_dept.link,
        });
        //console.log('ini ini ini')
        //console.log(this.state.assigned_case)
    }).catch((error) => {
    console.error(error);
    });

    }

    

    renderFlashMessage = () => {
        if(true==true){
            
            return (
                <FlashMessage 
                autoHide={false}
                position="top" 
                animated
                icon={'success'}
                style={{paddingTop: 60, width: width}}
                hideOnPress={true}
                titleStyle={{fontFamily: 'montserrat-bold'}}
                />
            ); 
        }
    }

    renderAutocomplete = (item, index, text_title) => {
        return (
            <Autocomplete
                onItemSelect={(itemSelect) => {
                    this.setData(itemSelect, item)
                }}
                textInputValue={''}
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
                menu={''}
                title={text_title}
                titleColor={iconColor}
                itemsContainerStyle={{ maxHeight: 140 }}
                resetValue={false}
                textInputProps={
                {
                placeholder: "Search " + text_title,
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
        )
    }

    renderPicture = () => {
          
        return (
            <ScrollView>
            <Block style={{width:'100%'}}>
                <FlatList
                    data={this.state.listPhoto}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item,index) => {
                        return(
                            this.renderItem(item,index)
                        )
                    }}
                    numColumns={3}
                />
            </Block>
            </ScrollView>
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

    renderPictureAct = () => {
          
        return (
            <ScrollView>
            <Block style={{width:'100%'}}>
                <FlatList
                    data={this.state.listPhotoAct}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item,index) => {
                        return(
                            this.renderItemAct(item,index)
                        )
                    }}
                    numColumns={3}
                />
            </Block>
            </ScrollView>
        )
        
    }

    renderItemAct = ({item,index}) => {
    
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

    

    showDelete = (id_issue) => {
        this.setState({
            id_issue_delete: id_issue,
            showDeleteConfirm: true
        })
    }

    add_employee = () => {
        let temp = index_employee++
        this.state.arr_employee.push(temp)
        this.setState({
            arr_employee: this.state.arr_employee
        })
      
        }
    
    removeComponent = (index) => {
        var array_employee = this.state.arr_new_employee
        array_employee.splice(index-this.state.total, 1);
        this.setState({
            arr_new_employee: array_employee
        })

        var array_old_employee = this.state.arr_employee
        array_old_employee.splice(index, 1);
        this.setState({
            arr_employee: array_old_employee
        })

    }
     
    update_value_total_smoe = (value, index) => {
        const Textdata = [...this.state.arr_new_employee]; //make a copy of array
        Textdata[index] = value.nativeEvent.text;
    
        this.setState({ arr_new_employee: Textdata }); 
    }

    buttonFirstIndex = (indx) => {
        if(indx==0){
            return (
                <Button 
                    onlyIcon
                    icon={'minuscircle'}
                    iconFamily="antdesign"
                    iconSize={20}
                    color={'danger'}
                    iconColor="#fff"
                    style={{ width: 40, height: 40, marginTop: 30 }}
                    onPress={(i) => this.showDelete(this.state.arr_employee[indx].id)}
                >
                </Button>
            )
        }
    }

    forman_assigned = () => {
        
        if(this.state.dataLogin.permission.assigned_foreman==1){
            //console.log('boleh liat foreman')
            return (
                <Block>
                    <Text>Assigned to Foreman</Text>
                    <Block>
                        <Input
                            editable={false}
                            defaultValue = {this.state.assigned_case} 
                            color="black"
                            placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                        />
                    </Block>
                </Block>
            );
        } else { 
            //console.log('tidak boleh liat')
        }
    }

    renderArticles = () => {
    return (
    <Block>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
        >
        <Block flex style={{borderRadius: 10, backgroundColor: nowTheme.COLORS.WHITE}}>
        <Block style={{paddingHorizontal: 20, paddingVertical: 20}}>

        <Text>Case :</Text>
        <Block row style={{paddingTop:10}}>
            { this.renderPicture() }
        </Block>

        <Text></Text>

        <Block style={styles.textAreaContainer}>
            <TextInput
                editable={false} 
                placeholder={'Type Case'}
                style={styles.textArea,{textAlignVertical: 'top'}}
                underlineColorAndroid="transparent"
                numberOfLines={6}
                multiline={true}
                defaultValue = {this.state.case}
            />
        </Block>

        {/* Ini batas antara case dan activity ok */}
        <Text></Text><Text></Text>

        <Text>Detail of Activity :</Text> 
        <Block row style={{paddingTop:10}}>
            { this.renderPictureAct() }
        </Block>
        <Text></Text>
        <Block style={styles.textAreaContainer}>
            <TextInput
                placeholder={'Type Case'}
                style={styles.textArea,{textAlignVertical: 'top'}}
                underlineColorAndroid="transparent"
                numberOfLines={6}
                multiline={true}
                onChangeText={(val) => this.inputValueUpdate(val, 'action')}
                defaultValue = {this.state.action}
            />
        </Block>
        
            <Block style={{paddingBottom: 10}}>
              <Block>
                  <Text
                      title={'Photo'}
                      size={15}
                      bold
                      color={nowTheme.COLORS.GRAY}
                  />
              </Block>
              <Block>
                  <Block row>
                      <Block style={{width:'100%'}}>
                        <TouchableWithoutFeedback 
                            onPress={() => this.permissionCamera() }
                            color={iconColor} 
                        >
                            <Block style={{backgroundColor: nowTheme.COLORS.ACTIVE, borderRadius: 5, paddingVertical: 8}}>
                                <Block center>
                                    <Icon
                                        size={25}
                                        color={nowTheme.COLORS.WHITE}
                                        name="camera"
                                        family="Feather"
                                    />
                                </Block>
                            </Block>
                            
                        </TouchableWithoutFeedback>
                      </Block>
                     
                  </Block>
                  
                    
              </Block>
          </Block>

        </Block>

        <Block>
        </Block>

        <Block center style={{paddingBottom: 20}}>
            <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate('List Submit MV', {
            title: item.title,
            })}
            >
            <Button 
            // color={iconColor} 
            style={{width: width / 1.25}}
            onPress={ () => this.setState({showAlertConfirm: true}) }
            >
            <Block row>
                <Icon
                size={20}
                color={nowTheme.COLORS.WHITE}
                name="arrow-up-circle"
                family="Feather"
                />
                <Text
                style={{
                fontFamily: 'montserrat-bold'
                }}
                color={nowTheme.COLORS.WHITE}
                size={15}
                > Save
                </Text>
            </Block>
            </Button>
            </TouchableWithoutFeedback>
        </Block>

        </Block>

        </ScrollView> 
    </Block>
    );
    };

    onDelete = async() => {
            this.setState({
                showDeleteConfirm: false
            });
            
            var data = [];
        
            data.push({
                'id_issue'   : this.state.id_issue_delete,
            }); 
            // return
            var url = config.config.url + '/api/iym/delete_badge_issue/' + this.state.id_issue_delete;
            var api = this.state.dataLogin.api;

            let options = {
                method: 'POST',
                headers: new Headers({
                    'Authorization': api,
                    'Content-Type': 'application/json'  
            }),
            body: JSON.stringify({
                delete: this.state.id_issue_delete,
            })
            };

            await fetch(url, options)
            .then(response => response.text())
            .then(data => { 
                if(data.includes('success')){
                    // this.props.navigation.push('App') //ntar ini mau diredirect ke halamannya sendiri
                    this.props.navigation.push('Update List', {                       
                        title: 'Update List', 
                        running_number: this.state.running_number,
                        update_status: true,
                      })
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    onSubmit = async() => {
        if(this.state.status_issue!=0){
            this.setState({
                isShow: true,
                showAlertConfirm: false
            })
            setTimeout(() => {this.setState({isShow: false})}, 1000)
        } else {  
            this.setState({
                showAlertConfirm: false
            });
            
            var data = [];
        
            data.push({
                'login' : this.state.dataLogin,
                'new_badge': this.state.arr_new_employee,
                'badge'   : this.state.arr_employee,
                'department'  : this.state.department,
                'project'     : this.state.project,
                'case'    : this.state.case,
                'action' :   this.state.action,
            });

            // return
            var url = config.config.url + '/api/iym/update_action';
            var api = this.state.dataLogin.api;

            let options = {
                method: 'POST',
                headers: new Headers({
                    'Authorization': api,
                    'Content-Type': 'application/json'  
            }),
            body: JSON.stringify({
                data_user: this.state.dataLogin, 
                action: data,
            })
            };
            

            await fetch(url, options)
            .then(response => response.text())
            .then(data => {
                console.log(data) 
                if(data.includes('success') && this.state.capturedImage==false){
                    this.props.navigation.push('Action Activity', {   
                        running_number: this.state.running_number,
                        update_status: true,
                    })
                }
            })
            .catch(error => {
                console.error(error);
            });
            if(this.state.capturedImage==true){
            //===================== foto =======================
            let data_submit = new FormData()

            var localPhoto = this.state.photoName.uri
            var filename   = localPhoto.split('/').pop()
            var type       = mime.getType(localPhoto)

            var photo_submit = {
            'name' : filename,
            'type' : type,
            'uri' : localPhoto,
            'running_number' : this.state.running_number,
            }
            

            data_submit.append('photo_submit', photo_submit);
            var url_photo = config.config.url + '/api/iym/update_foto/'+this.state.running_number+'/1';
            var api_photo = this.state.dataLogin.api; 
            
            let options_photo = {
                method: 'POST',
                headers: new Headers({
                    'Authorization': api_photo,
                    'Content-Type': 'multipart/form-data' 
            }),
            body: data_submit,
            
            };

            //console.log(url_photo, api_photo, options_photo)

            await fetch(url_photo, options_photo).then(response => response.text())
            .then(data => {
                
                if(data.includes('success')){
                this.props.navigation.push('App')
                this.props.navigation.push('Action Activity', {   
                    running_number: this.state.running_number,
                    update_status: true,
                    })
                }
            })
            .catch(error => {
                console.error('error photo');
                console.error(error);
            });
        }}
    }

    showAlert = () => {
        
    this.setState({
    showAlertConfirm: true
    });
  };
    
    hideAlert = () => {
    this.setState({
    showAlertConfirm: false
    });
  };

    renderAlert = () => {
    return(
    <Block>
        <Block>
        <AwesomeAlert
        show={this.state.showAlertConfirm}
        customView={this.alertConfirm()}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        />
        </Block>
    </Block>
    );
    }

    renderDeleteAlert = () => {
        return(
        <Block>
            <Block>
            <AwesomeAlert
            show={this.state.showDeleteConfirm}
            customView={this.deleteConfirm()}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            />
            </Block>
        </Block>
        );
        }

        deleteConfirm = () => {

            return(
                <Block>
                    <Block 
                    style={{ 
                    textAlign: 'center',  
                    }}
                    >
                        <Icon
                            size={50}
                            color={nowTheme.COLORS.ERROR}
                            name="warning"
                            family="AntDesign"
                            style={{
                                textAlign: 'center',
                            }}
                        />
                    </Block> 
        
                    <Block>
                        <Block style={{paddingTop: 10}}>
                            <Text
                                size={18}
                                bold
                                center
                                color={nowTheme.COLORS.SECONDARY} 
                            >
                                Are you sure to Delete this data ? 
                            </Text>
                        </Block>
        
                    </Block>
        
                    <Block>
                        <Block style={{paddingTop: 10}}>
                            <Text
                                size={10}
                                bold
                                center
                                color={nowTheme.COLORS.SECONDARY} 
                            >
                                This will permanently deleted! 
                            </Text>
                        </Block>
                    </Block>
                    
                    <Block row center >
                        <Button 
                        size={'small'}
                        onPress={ () => this.onDelete() }
                        >     
                            <Text
                                size={14}
                                bold
                                center
                                color={nowTheme.COLORS.WHITE}
                            >
                            Yes, Delete
                            </Text>
                        </Button>
                        <Button 
                        size={'small'}
                        color={nowTheme.COLORS.ERROR}
                        onPress={ () => this.setState({showDeleteConfirm: false}) }
                        >
                            <Text
                                size={14}
                                bold
                                center
                                color={nowTheme.COLORS.WHITE}
                            >
                                No, Cancel
                            </Text>
                        </Button>
                    </Block>
        
                </Block>
                );
            }

    alertConfirm = () => {

    return(
        <Block>
            <Block 
            style={{ 
            textAlign: 'center',  
            }}
            >
            <Icon
            size={50}
            color={nowTheme.COLORS.ERROR}
            name="warning"
            family="AntDesign"
            style={{
                textAlign: 'center',
            }}
            />
            </Block> 

            <Block>
            <Block style={{paddingTop: 10}}>
            <Text
                size={18}
                bold
                center
                color={nowTheme.COLORS.SECONDARY} 
            >
                Are you sure want to update this data ? 
            </Text>
            </Block>

            </Block>

            <Block>
            <Block style={{paddingTop: 10}}>
            <Text
                size={10}
                bold
                center
                color={nowTheme.COLORS.SECONDARY} 
            >
                You're still able to edit before processed! 
            </Text>
            </Block>

            </Block>
            
            <Block row center >
            <Button 
            size={'small'}
            onPress={ () => this.onSubmit() }
            >
                
            <Text
                size={14}
                bold
                center
                color={nowTheme.COLORS.WHITE}
            >
                Yes, Send
            </Text>
            </Button>

            <Button 
            size={'small'}
            color={nowTheme.COLORS.ERROR}
            onPress={ () => this.setState({showAlertConfirm: false}) }
            >
            <Text
                size={14}
                bold
                center
                color={nowTheme.COLORS.WHITE}
            >
                No, Cancel
            </Text>
            </Button>
            </Block>

        </Block>
        );
    }

    inputValueUpdate = (val, prop) => {
        if(this.state.status_issue==0){ 
            const state = this.state;
            state[prop] = val;
            this.setState(state);
        }
    };

    Loading = function(){
       
        return(
            <Block style={{ flex: 1, justifyContent: 'center', alignItems: 'center'  }}> 
                {/* <Text>Asdf</Text> */}
                <ActivityIndicator size="large" color={nowTheme.COLORS.PRIMARY} style={{marginTop: 30}} />
            </Block>
        );
    }

    renderHeader = () => {
        return(
            <GradientHeader 
                datauser={this.state.data_user}
                title={'Detail of Case'}
                back={true}
                gradientColor={gradientColor}
                borderRadius={5}
                profile={false}
                headerHeight={8}
            />
        )
    }

    permissionCamera = async() => {
      var status = await Camera.requestPermissionsAsync();
      if (status['status'] === 'granted') {
          // start the camera
          this.setState({startCamera: true});
      }
    }

    renderCamera = () => {

      if(this.state.capturedImage){
        return(
          <Block style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%' }}>
            { this.renderHeader() }
            <ImageBackground source={{uri: this.state.photoName && this.state.photoName.uri}} style={{ flex: 1 }}>
                <Block style={{ flex: 1, flexDirection: 'column', padding: 15, justifyContent: 'flex-end'}}>
                    <Block row>
                        <Block style={{style: '50%'}}>
                            <Button style={{backgroundColor: nowTheme.COLORS.WHITE}} onPress={() => this.setState({capturedImage: false})}>
                                <Text
                                    title={'Re-Take'}
                                    bold
                                    color={nowTheme.COLORS.GRAY}
                                >
                                  Re - Take
                                </Text>
                            </Button>
                        </Block>

                        <Block style={{style: '50%'}}>
                            <Button style={{backgroundColor: nowTheme.COLORS.WHITE}} onPress={() => this.savePicture()}>
                              <Text
                                  title={'Submit'}
                                  bold
                                  color={nowTheme.COLORS.GRAY}
                              >
                                Save
                              </Text>
                            </Button>
                        </Block>
                    </Block>
                </Block>
                <FlashMessage 
                    autoHide={true}
                    position="top" 
                    animated
                    icon={'success'}
                    style={{paddingTop: 60, width: width}}
                    hideOnPress={true}
                    titleStyle={{fontFamily: 'montserrat-bold'}}
                />
            </ImageBackground>
        </Block>
        )
      } else {
        return(
          <Camera style={{flex: 1, justifyContent: 'center'}} type={this.state.typeCamera} ref={ref => { this.camera = ref; }}>
            { this.renderHeader() }
            <Block style={{flex: 1, justifyContent: 'flex-end', marginBottom: 50}}>
              <Block center style={{width: width / 1.1}}>
                  <Block row>
                      <Block style={{width: '20%', justifyContent: 'center'}}>
                          <Block center>
                              <TouchableOpacity
                                  onPress={() => {
                                      this.setState({startCamera: false})
                                  }}
                              >
                                  <Icon
                                      size={40}
                                      color={nowTheme.COLORS.WHITE}
                                      name="arrow-left-circle"
                                      family="Feather"
                                  />
                              </TouchableOpacity>
                          </Block>
                      </Block>

                      <Block center style={{width: '60%'}}>
                          <TouchableWithoutFeedback onPress={() => this.takePicture()}>
                              <Block>
                                  <Block style={{
                                      backgroundColor: nowTheme.COLORS.WHITE,
                                      width: width / 6,
                                      height: height / 12.5,
                                      borderColor: nowTheme.COLORS.WHITE,
                                      borderWidth: 2,
                                      borderRadius: 50,
                                  }}>
                                      
                                  </Block>
                              </Block>
                          </TouchableWithoutFeedback>
                      </Block>

                      <Block style={{width: '20%', justifyContent: 'center'}}>
                          <Block center>
                              <TouchableOpacity
                                  onPress={() => {
                                      if(this.state.typeCamera === Camera.Constants.Type.back){
                                          var status_camera = Camera.Constants.Type.front
                                      } else {
                                          var status_camera = Camera.Constants.Type.back
                                      }

                                      this.setState({typeCamera: status_camera});
                                  }}>            
                                      <Icon
                                          size={30}
                                          color={nowTheme.COLORS.WHITE}
                                          name="refresh-ccw"
                                          family="Feather"
                                      />                
                              </TouchableOpacity>
                          </Block>
                      </Block>
                  </Block>
              </Block>
            </Block>

          </Camera>
        )
      }
  }

  takePicture = async () => {
        
    if (!this.camera) return
        const photo = await this.camera.takePictureAsync()
       
        const result_photo = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 480, height: 640 } }],
          { compress: 1}
        );

        this.setState({
            capturedImage: true,
            photoName: result_photo,
        });
       

  }

  savePicture = () => {
      
      this.setState({
          startCamera: false,
          cekPhoto : true
      })
  }

    render() {
        //console.log('ini update statusnya')
        //console.log(this.state.update_status)
      if(this.state.startCamera){
        return this.renderCamera()
      } else {
        return (    
            <DismissKeyboard>
                <Block style={{flex: 1}}>
                <Toast 
                    isShow={this.state.update_status} 
                    positionIndicator="top"
                    fadeInDuration={500}
                    fadeOutDuration={500}
                    color={'success'}
                >
                    Your Data has been Updated
                </Toast>
                <Toast 
                    isShow={this.state.isShow} 
                    positionIndicator="top"
                    fadeInDuration={500}
                    fadeOutDuration={500}
                    color={'warning'}
                >
                    You can't edit this Case
                </Toast>

                    <Block flex style={{top: height * 0}}>
                        {/* { this.renderFlashMessage() }  */}
                        { this.renderHeader() }
                        
                        <ScrollView>
                        <Block flex center style={styles.home}>
                            { this.state.isLoading == true ? this.Loading() : this.renderArticles() }
                        </Block>
                        </ScrollView> 
                        { this.renderAlert() }
                        { this.renderDeleteAlert() }
                        
                    </Block>
                </Block>
            </DismissKeyboard>
        );
      }
    }   
}

const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: nowTheme.COLORS.INPUT,
        borderWidth: 1,
        padding: 5
      },
      textArea: {
        height: 150,
        justifyContent: "flex-start"
      },
  home: {
    width: width
  },
  tinyLogo: {
    width: '100%',
    height: 50,
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

export default Action;
