import React,{useState} from "react";
import AwesomeAlert from 'react-native-awesome-alerts';
import { 
    ActivityIndicator,
    AsyncStorage,
    ImageBackground,
    Image,
    Dimensions,
    Keyboard,
    StyleSheet, 
    ScrollView,
    TouchableWithoutFeedback,
    View,
    TextInput,    
    FlatList,
    TouchableOpacity,
} from "react-native";

import { 
    Block, 
    Input, 
    Button,
    theme, 
    Text, 
    Icon
} from "galio-framework";

import FlashMessage, { showMessage } from "react-native-flash-message";

import Select2 from "react-native-select-two"

import { GradientHeader} from "../components";
import { nowTheme, config } from "../constants";

import Autocomplete from '../components/Autocomplete';
import {Camera} from 'expo-camera';
import mime from "mime";

import ImageModal from 'react-native-image-modal';

const { height, width } = Dimensions.get("screen");

var iconColor = '#6FBE6F';
var gradientColor = ['#0BAB64', '#83D475'];
var index_employee = 1;
var filter = ['department', 'project', ];

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class Add extends React.Component {

    _isMounted = false;

    constructor() {
    super();
    
    this.state = {
    
    arr_employee: [''],

    listDataDepartment: [],
    flashSuccess: true,
    cekPhoto: false,
    startCamera: false,
    cameraRatio : "4:3",
    typeCamera: Camera.Constants.Type.back,
    capturedImage: false,
    photoName: '',
    list_of_photo: [],

    badge   : '',
    department  : '',
    project     : '',
    case    : '',
    showAlertConfirm: false,
    new_runningNumber   : '',
    
    listMasterDepartment: [],
    listMasterProject: [], 
    
    listData: [],
    isLoading: false,
    isLoadData: false,
    loadButton: false,
    dataLogin: [],
    filter: '',

    setImagePadding: 0,
    imagePadding:0,
    ratio: '4:3',
    setRatio: '4:3',
    isRatioSet: false,
    setIsRatioSet: false



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
        }
        
      
    
    this.setState({dataLogin: data_login});

    this.readDataDept()

    return () => { isMounted = false };
    }

    


    componentWillUnmount() {
    this._isMounted = false;
    }

    loadCallback = (limit) =>{

    var project = this.state.dataLogin.project;
    var api     = this.state.dataLogin.api;

    var url = config.config.url + '/api/iym/master_data';

    // console.log(url);
    // console.log(api);
    
    fetch(url, {
    method: 'GET',
    headers: new Headers({
        'Authorization': api
    }),
    })
    .then((response) => response.text())
    .then(data =>{

    var list_data = data;
   // console.log(list_data);
    if(list_data.slice(-1) != '}'){
        list_data = data + '}';
    }

    list_data = JSON.parse(list_data);

    var all_data = this.state.listData;

    list_data.results.forEach(element => {
        all_data.push(element);
    });

    this.setState({
        listData: all_data,
        isLoadData: false,
        loadButton: (list_data.results.length >= 10 ? true : false),
    });

    });
    }

    filterCallback = (filterdata) => {
    this.setState({
    isLoadData : true,
    filter: filterdata,
    });

    var project   = this.state.dataLogin.project;
    var api   = this.state.dataLogin.api;

    var url = config.config.url + '/api/vt/list/pending/' + project + '/0/' + filterdata;

    // console.log(url);
    // console.log(api);
    
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

    readDataDept = () => {
    var url = config.config.url + '/api/iym/master_data';
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

        var master_data_dept = data;

        master_data_dept = JSON.parse(master_data_dept);
        var arr_dept = master_data_dept.data_dept 
        var arr_project = master_data_dept.data_project 
        this.setState({
            listMasterDepartment: arr_dept,
            listMasterProject: arr_project,
            isLoading: false,
        });

    // console.log('================================================')
    //     console.log(arr_dept) 
    //     console.log('xxxxxxxxxxxxxx')
    //     console.log(this.state.listMasterProject)     
    // console.log('================================================')
    
    }).catch((error) => {
    console.error(error);
    });
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
        if(this.state.capturedImage){
           // console.log('here some pict.')
            return (
              <Block>
                <TouchableWithoutFeedback 
                      onPress={() => this.permissionCamera() }
                      color={iconColor} 
                  >
                  <Image
                      style={styles.tinyLogo}
                      source={{
                      uri: this.state.photoName.uri,
                      }}
                      onPress={() => this.permissionCamera() }
                  />
                </TouchableWithoutFeedback>
              </Block>
            )
        }
    }

    add_employee = () => {
        let temp = index_employee++
        this.state.arr_employee.push(temp)
        this.setState({
            arr_employee: this.state.arr_employee
        })
        //console.log(this.state.arr_employee)
        }
    
    removeComponent = (index) => {
        
        var array_employee = this.state.arr_employee
        var indexs = array_employee.indexOf(index);
    
        // if (indexs > -1) {
            array_employee.splice(index, 1);
        // }
    
        this.setState({
            arr_employee: array_employee
        })
       // console.log(this.state.arr_employee)
        }
     
    update_value_total_smoe = (value, index) => {
        const Textdata = [...this.state.arr_employee]; //make a copy of array
        Textdata[index] = value.nativeEvent.text;
    
        this.setState({ arr_employee: Textdata }); 
        // console.log(this.state.arr_employee)
        }

        RenderPreviewPicture = () => {
          
            return (
                <ScrollView>
                <Block style={{width:'100%'}}>
                    <FlatList
                        data={this.state.list_of_photo}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item,index) => {
                            return(
                                this.renderItemListOfPhoto(item,index)
                            )
                        }}
                        numColumns={3}
                    />
                </Block>
                </ScrollView>
            )
            
        } 
        
        renderItemListOfPhoto = ({item,index}) => {
            //console.log(item);
            return(
              
                <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="#000000"
                    style={{
                        width: 100,
                        height: 100,
                    }}
                    source={{
                        uri: item,
                    }}
                />
               
            )
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

        <Text style={{marginBottom: 6}}>Case</Text>
        <Block style={styles.textAreaContainer}>
            <TextInput
                placeholder={'Type Case'}
                style={styles.textArea,{textAlignVertical: 'top'}}
                underlineColorAndroid="transparent"
                numberOfLines={6}
                multiline={true}
                onChangeText={(val) => this.inputValueUpdate(val, 'case')}
                defaultValue = {this.state.case}
            />
        </Block> 
        
        <Text style={{marginTop: 10, marginBottom: -20}}>Badge</Text>
            {
                this.state.arr_employee.map((v, indx) => {
                    return (
                        <Block row key={indx}>
                            <Block style={{ width: '85%' }}>
                                <Text
                                title={'Department'}
                                size={15}
                                bold
                                color="grey"
                                />
                                <Input
                                color="black"
                                placeholder="Badge Employee"
                                placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                defaultValue={this.state.arr_employee[indx]}
                                onEndEditing={(val) => this.update_value_total_smoe(val, indx)}

                            />
                        </Block>
                        <Block style={{ width: '20%' }}>

                            <Button 
                            onlyIcon
                            icon={indx==0 ? 'pluscircle' : 'minuscircle'}
                            iconFamily="antdesign"
                            iconSize={20}
                            color={indx==0 ? 'info' : 'danger'}
                            iconColor="#fff"
                            style={{ width: 40, height: 40, marginTop: 20 }}
                            onPress={(i) => indx==0 ? this.add_employee() : this.removeComponent(indx)}
                            >
                            warning
                            </Button>
                        </Block>
                        </Block>
                    )
                })
            }
            {/* ======================================================================= */}
            {
            filter.map((item, index) => {
            var text_title = item.split('_').join(' ');
                return( 
                    <Block key={index}>
                    <Block>
                        <Text style={{marginBottom: 10, marginTop: 3}}>{text_title.charAt(0).toUpperCase() + text_title.slice(1)}</Text>
                        <Select2
                        isSelectSingle
                        style={{ borderRadius: 5}, styles.input}
                        colorTheme="blue"
                        popupTitle={"Select "+(text_title.charAt(0).toUpperCase() + text_title.slice(1))}
                        searchPlaceHolderText={"Search "+(text_title.charAt(0).toUpperCase() + text_title.slice(1))}
                        cancelButtonText="Cancel"
                        selectButtonText="Select"
                        listEmptyTitle="No Data Found"

                        title={"Select "+(text_title.charAt(0).toUpperCase() + text_title.slice(1))}
                        data={index==0 ? this.state.listMasterDepartment : (index==1 ? this.state.listMasterProject : '-')}
                        onSelect={data => {
                            index==0 ? this.setState({ department:data[0] }) : this.setState({ project:data[0] })
                        }}
                        onRemoveItem={data => {
                            index==0 ? this.setState({ department:data[0] }) : this.setState({ project:data[0] })
                        }}
                        />
                    </Block>
                    </Block>
                )
            })
            }
            
            <Block style={{paddingBottom: 10}}>
              <Block>
                  <Text
                      title={'Photo'}
                      size={15}
                      bold
                      color={nowTheme.COLORS.GRAY}
                  />
              </Block>
              <Block >
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

                      <Block row style={{paddingTop:10,paddingLeft:10, backgroundColor: nowTheme.COLORS.WHITE}}>
                        { this.RenderPreviewPicture() }
                      </Block>
                      
                  </Block>
              </Block>
          </Block>

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
                > Send
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

    showNotif = () => {
        return(
            showMessage({
              message: 'Testing Aa',
              type: 'success',
              hideStatusBar: true,
            })
        );
    }

    onSubmit = async() => {

        this.setState({
            showAlertConfirm: false
        });
    
        var data = [];    
        data.push({
            'badge'   : this.state.arr_employee,
            'department'  : this.state.department,
            'project'     : this.state.project,
            'case'    : this.state.case,
            'image'    : this.state.photoName.uri,
        });

        var url = config.config.url + '/api/iym/submit_main';
        var api = this.state.dataLogin.api;

        let options = {
            method: 'POST',
            headers: new Headers({
                'Authorization': api,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                data_user: this.state.dataLogin,
                approval: data,
            })
        };
        
    await fetch(url, options)
    .then(response => response.text())
    .then(data => {
        var detail_data = data; 
        if(data.slice(-1) != '}'){ 
            detail_data = data + '}'; 
        } 
        detail_data = JSON.parse(detail_data); 
      
    if(data.includes('success')){
        
        this.setState({
            arr_employee        : [''],
            badge               : '',
            department          : '',
            project             : '',
            case                : '',
            new_runningNumber   : detail_data.running_number,
            flashSuccess        : true
        })
        if(this.state.capturedImage!=true){
          this.props.navigation.push('App')
        }
    }

    })
    .catch(error => {
    console.error(error);
    });

      if(this.state.list_of_photo.length > 0){
         //===================== foto =======================
                let data_submit = new FormData()

                this.state.list_of_photo.forEach((element, i) => {
                                       
                    var localPhoto = element
                    var filename   = localPhoto.split('/').pop()
                    var type       = mime.getType(localPhoto)

                    const data = {
                        'name' : filename,
                        'type' : type,
                        'uri'  : localPhoto,
                    }

                    data_submit.append(i, data);
                });
                                                              
                var url_photo = config.config.url + '/api/iym/insert_array_photo/'+this.state.new_runningNumber;
                var api_photo = this.state.dataLogin.api; 
                
                let options_photo = {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': api_photo,
                        'Content-Type': 'multipart/form-data' 
                    }),
                    body: data_submit,
                };

                await fetch(url_photo, options_photo).then(response => response.text())
                .then(data => {
                    //console.log(data);
                    if(data.includes('success')){
                        this.props.navigation.push('App')
                        // this.props.navigation.push('Update List', {   
                        // running_number: this.state.new_runningNumber,
                        // })
                    }
                })
                .catch(error => {
                    console.error('error photo');
                    console.error(error);
                });

      }


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
            Are you sure want to send this data ? 
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
    const state = this.state;
    state[prop] = val;
    this.setState(state);
    //console.log(prop, 'change to ', val)
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
        title={'Add Data'}
        back={true}
        gradientColor={gradientColor}
        borderRadius={5}
        profile={false}
        headerHeight={8}
    />
    
    )
    }

    permissionCamera = async() => {
      var status    = await Camera.requestPermissionsAsync();
      if (status['status'] === 'granted') {
          // start the camera
          this.setState({startCamera: true});
      }
    }
 
    renderCamera = () => {

         // Screen Ratio and image padding
        const ratio = this.state.ratio;
        const isRatioSet = this.state.isRatioSet;

        const { height, width } = Dimensions.get('window');
        const screenRatio = height / width;
        
        // set the camera ratio and padding.
        // this code assumes a portrait mode screen
        const prepareRatio = async () => {
            let desiredRatio = '4:3';  // Start with the system default
            // This issue only affects Android
            if (Platform.OS === 'android') {
            const ratios = await this.camera.getSupportedRatiosAsync();

            // Calculate the width/height of each of the supported camera ratios
            // These width/height are measured in landscape mode
            // find the ratio that is closest to the screen ratio without going over
            let distances = {};
            let realRatios = {};
            let minDistance = null;
            for (const ratio of ratios) {
                const parts = ratio.split(':');
                const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
                realRatios[ratio] = realRatio;
                // ratio can't be taller than screen, so we don't want an abs()
                const distance = screenRatio - realRatio; 
                distances[ratio] = realRatio;
                if (minDistance == null) {
                minDistance = ratio;
                } else {
                if (distance >= 0 && distance < distances[minDistance]) {
                    minDistance = ratio;
                }
                }
            }
            // set the best match
            desiredRatio = minDistance;
            //  calculate the difference between the camera width and the screen height
            const remainder = Math.floor(
                (height - realRatios[desiredRatio] * width) / 2
            );
            
            this.setState({
                 setImagePadding: remainder / 2,
                 setRatio: desiredRatio, 
                 setIsRatioSet: true,
                 imagePadding: remainder / 2,
                 ratio: desiredRatio, 
                 isRatioSet: true,
                })
         
            }
        };

        // the camera must be loaded in order to access the supported ratios
        const setCameraReady = async() => {
            if (!isRatioSet) {
            await prepareRatio();
            }
        };


        if(this.state.capturedImage){
          return(
            <Block style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%' }}>
              { this.renderHeader() }
              <ImageBackground source={{uri: this.state.photoName && this.state.photoName.uri}} style={{ flex: 1 }}>
                  <Block style={{ flex: 1, flexDirection: 'column', padding: 15, justifyContent: 'flex-end'}}>
                      <Block row>
                          <Block style={{style: '50%'}}>
                              <Button style={{backgroundColor: nowTheme.COLORS.WHITE}} onPress={() => this.setState({capturedImage: false, photoName: ''})}>
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
              </ImageBackground>
          </Block>
          )
        } else {
          return(
            <Camera 
                onCameraReady={setCameraReady} 
                ratio={ratio} 
                autofocus={Camera.Constants.AutoFocus.on} 
                flashMode={Camera.Constants.FlashMode.off} 
                style={[styles.cameraPreview, {marginTop: this.state.imagePadding, marginBottom: this.state.imagePadding}]}
                type={this.state.typeCamera} 
                ref={ref => { this.camera = ref; }}>
              {/* { this.renderHeader() } */}
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
                            <TouchableOpacity onPress={() => this.takePicture()}>
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
                            </TouchableOpacity>
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
            // console.log(photo)

        this.setState({
            capturedImage: true,
            photoName: photo,
        });
    }

  savePicture = () => {
    //console.log(this.state.photoName.uri);
    
    var joined = this.state.list_of_photo.concat(this.state.photoName.uri);
    this.setState({
          startCamera: false,
          capturedImage: false,
          cekPhoto : true,
          list_of_photo: joined
    })
  }

    render() {
    
      if(this.state.startCamera){
        return this.renderCamera()
      } else {

          //console.log(this.state.list_of_photo);

        return (
            
            <DismissKeyboard>
                <Block style={{flex: 1}}>
                    {/* <FlashMessage 
                        position="top" 
                        floating
                        autoHide={false} 
                    /> */}
                    <Block flex style={{top: height * 0}}>
                        { this.renderHeader() }
                        <ScrollView>
                            <Block flex center style={styles.home}>
                                { this.state.isLoading == true ? this.Loading() : this.renderArticles() }
                            </Block>
                        </ScrollView>
                        { this.renderAlert() }
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
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    fontFamily: 'montserrat-regular'

  },
  logo: {
    width: 66,
    height: 58,
  },
  cameraPreview: {
    flex: 1,
  }
});

export default Add;
