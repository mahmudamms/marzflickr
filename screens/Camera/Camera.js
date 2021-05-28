import React from "react";

import { 
    ActivityIndicator,
    AsyncStorage,
    Dimensions,
    ImageBackground,
    StyleSheet, 
    ScrollView,
    Picker,
    View, 
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native";

import { 
    Block, 
    Input, 
    theme, 
} from "galio-framework";

import {Camera} from 'expo-camera';

import { 
    Autocomplete, 
    WorkpackList, 
    ContentDetail, 
    GradientHeader, 
    DetailMVList, 
    Button, 
    Icon, 
    Filter, 
    Select, 
    LoadMore, 
    Text,
} from "../../components";

import { nowTheme, detail_mrir, example_workpack_detail, config } from "../../constants";

const { height, width } = Dimensions.get("screen");

let camera = Camera;

var iconColor = '#6FBE6F';
var gradientColor = ['#0BAB64', '#83D475'];

class Detail extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        // console.log();

        this.state = {
          listData: [],
          
            startCamera: true,
            typeCamera: Camera.Constants.Type.back,

            isLoading: false,
            isChanged: false,
            isLoadData: false,
            loadButton: false,
            dataLogin: [],
            filter: '',
            filterBy: ['Workpack_No', 'Template'],
            progress: 0,
            progressComplete: false,
            Unique_No: {},
            capturedImage: false,
            photoName: '',
            url_go: '',
        };
    }

    async componentDidMount() {

      this.setState({
        url_go: this.props.route.params.url,

      })

      this._isMounted = true;

      var status = await Camera.requestPermissionsAsync();
      if (status === 'granted') {
          // start the camera
          this.setState({startCamera: true});
      }

      return () => { isMounted = false };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return(
            (this.state.startCamera ? (this.renderCamera()) : (null))
        );
    }

    renderCamera = () => {

      if(this.state.capturedImage){
        return(
          <Block style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%' }}>
            <ImageBackground source={{uri: this.state.photoName && this.state.photoName.uri}} style={{ flex: 1 }}>
                <Block style={{ flex: 1, flexDirection: 'column', padding: 15, justifyContent: 'flex-end'}}>
                    <Block row>
                        <Block style={{style: '50%'}}>
                            <Button style={{backgroundColor: nowTheme.COLORS.WHITE}} onPress={() => this.retakePicture()}>
                                <Text
                                    title={'Re-Take'}
                                    bold
                                    color={nowTheme.COLORS.GRAY}
                                />
                            </Button>
                        </Block>

                        <Block style={{style: '50%'}}>
                            <Button style={{backgroundColor: nowTheme.COLORS.WHITE}} onPress={() => this.sendImage()}>
                              <Text
                                  title={'Send'}
                                  bold
                                  color={nowTheme.COLORS.GRAY}
                              />
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ImageBackground>
        </Block>
        )
      } else {
        return(
          <Camera style={{flex: 1, justifyContent: 'center'}} type={this.state.typeCamera} ref={ref => { this.camera = ref; }}>
                
            <Block style={{flex: 1, justifyContent: 'flex-end', marginBottom: 50}}>
              <Block center style={{width: width / 1.1}}>
                  <Block row>
                      <Block style={{width: '20%', justifyContent: 'center'}}>
                          <Block center>
                              <TouchableOpacity
                                  onPress={() => {
                                      this.props.navigation.goBack()
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

    __savePhoto = () => {
      console.log(this.props);
    }
    
    retakePicture = () => {
        this.setState({
          capturedImage: false
        });
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

    sendImage = () => {

      var menu = 'MV';

      if(menu == 'MV'){

        this.props.navigation.navigate(this.state.url_go, {
          // list_submit: '',
          // data_workpack: '',
          // title: '',
          // piecemark: '',
          menu: 'MV',
          photo: this.state.photoName,
          piecemark: this.props.route.params.piecemark,
        })

      }

    }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  articles: {
    // width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    // paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'
  },

  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default Detail;
