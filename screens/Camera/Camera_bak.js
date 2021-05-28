import React from "react";

import { 
    ActivityIndicator,
    AsyncStorage,
    Dimensions,
    StyleSheet, 
    ScrollView,
    Picker,
    View, 
    TouchableOpacity,
} from "react-native";

import { 
    Block, 
    Input, 
    theme, 
    Text 
} from "galio-framework";

import {Camera} from 'expo-camera';

import { Autocomplete, WorkpackList, ContentDetail, GradientHeader, DetailMVList, Button, Icon, Filter, Select, LoadMore } from "../../components";
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
            typeCamera: Camera.Constants.Type.front,

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
        };
    }

    async componentDidMount() {
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

    // startCamera = async () => {
    //     const {status} = await Camera.requestPermissionsAsync()
    //     if (status === 'granted') {
    //         // start the camera
    //         this.setState({startCamera: true});
    //     } else {
    //       Alert.alert('Access denied')
    //     }
    // }

    selectChanged = (item) => {
        this.setState({
            progress: 0
        });

        if(item == 100){
            var status = true;
        } else {
            var status = false;
        }


        this.setState({
            progressComplete: status,
            progress: item
        });

    }

    saveClicked = () => {
        console.log(this.state.progress);
    }

    renderContent = (item, index) => {
        return(
            <Block key={index}>
                <Block center>
                    <Block card style={{width: width / 1.1, backgroundColor: nowTheme.COLORS.WHITE}}>
                        <Block style={{paddingHorizontal: 20, paddingVertical: 10}}>

                            <Block style={{paddingBottom: 10}}>
                                <ContentDetail
                                    title={'Drawing AS'}
                                    content={item.drawing_as}
                                />
                            </Block>

                            <Block style={{paddingBottom: 10}}>
                                <ContentDetail
                                    title={'Rev AS'}
                                    content={item.rev_as}
                                />
                            </Block>

                            <Block style={{paddingBottom: 10}}>
                                <ContentDetail
                                    title={'Piecemark'}
                                    content={item.part_id}
                                />
                            </Block>

                            <Block style={{paddingBottom: 10}}>
                                <ContentDetail
                                    title={'Material'}
                                    content={item.material}
                                />
                            </Block>

                            <Block style={{paddingBottom: 10}}>
                                <ContentDetail
                                    title={'Profile'}
                                    content={item.profile}
                                />
                            </Block>

                            <Block style={{paddingBottom: 10}}>
                                <ContentDetail
                                    title={'Grade'}
                                    content={item.grade}
                                />
                            </Block>

                            <Block style={{paddingBottom: 10}}>
                                <ContentDetail
                                    title={'Weight (kg)'}
                                    content={item.weight}
                                />
                            </Block>

                            <Block style={{paddingBottom: 10}}>
                                <Block>
                                    <Block row>
                                        <Block style={{width: '50%'}}>
                                            <Block style={{height: 30, justifyContent: 'center'}}>
                                                <Text
                                                    style={{ 
                                                        fontFamily: 'montserrat-bold',
                                                    }}
                                                    size={14}
                                                    color={iconColor}
                                                >
                                                    Progress
                                                </Text>
                                            </Block>
                                        </Block>

                                        <Block style={{width: '50%'}}>
                                            <Block>
                                                <Select 
                                                    selected={this.state.progress}
                                                    value={['0', '25', '50', '75', '100']}
                                                    symbol={'%'}
                                                    selectChanged={this.selectChanged}
                                                />
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>
                            
                            <Block style={{paddingBottom: 10}}>
                                <Block>
                                    <Block row>
                                        <Block style={{width: '50%'}}>
                                            <Block style={{height: 40, justifyContent: 'center'}}>
                                                <Text
                                                    style={{ 
                                                        fontFamily: 'montserrat-bold',
                                                    }}
                                                    size={14}
                                                    color={iconColor}
                                                >
                                                    Unique No
                                                </Text>
                                            </Block>
                                        </Block>

                                        <Block style={{width: '50%'}}>
                                            <Block>
                                                <Autocomplete
                                                    onItemSelect={(itemSelect) => {
                                                        this.setData(itemSelect, item)
                                                    }}
                                                    // textInputValue={Object.keys(this.state.Unique_No).length === 0 ? '' : this.state.Unique_No.name}
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
                                                    category={'Unique No'}
                                                    menu={'MV'}
                                                    itemsContainerStyle={{ maxHeight: 140 }}
                                                    resetValue={false}
                                                    workpack={1}
                                                    textInputProps={
                                                    {
                                                        placeholder: "Search Unique No",
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
                                                    listProps={{
                                                        nestedScrollEnabled: true,
                                                    }}
                                                />
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>
                            
                            <Block style={{paddingBottom: 10}}>
                                <Block>
                                    <Block row>
                                        <Block style={{width: '50%'}}>
                                            <Block style={{height: 60, justifyContent: 'center'}}>
                                                <Text
                                                    style={{ 
                                                        fontFamily: 'montserrat-bold',
                                                    }}
                                                    size={14}
                                                    color={iconColor}
                                                >
                                                    Photo
                                                </Text>
                                            </Block>
                                        </Block>

                                        <Block style={{width: '50%'}}>
                                            <Block>
                                                <Block>
                                                    <Button style={{width: width / 3}} onPress={() => this.startCamera() }>
                                                        <Icon
                                                            size={25}
                                                            color={nowTheme.COLORS.WHITE}
                                                            name="camera"
                                                            family="Feather"
                                                        />
                                                    </Button>
                                                </Block>
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>

                            <Block>
                                <Block>
                                    <Block center style={{paddingVertical: 20}}>
                                        <Button style={{width: width / 1.25}} onPress={() => this.saveClicked() }>
                                            <Text
                                                style={{ 
                                                    fontFamily: 'montserrat-bold',
                                                }}
                                                size={16}
                                                color={nowTheme.COLORS.WHITE}
                                            >
                                                Save
                                            </Text>
                                        </Button>
                                    </Block>
                                </Block>
                            </Block>

                        </Block>
                    </Block>
                </Block>
            </Block>
        )
    }

    renderArticles = () => {

        return (
            <Block>
                {/* { this.renderMaster() } */}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.articles}
                >
                    <Block flex>
                    {
                        // this.state.listData.map((item, index) => {
                        example_workpack_detail.map((item, index) => {
                            return(
                                this.renderContent(item, index)
                            );
                        })
                    }
                    </Block>

                    {
                        this.state.loadButton == true ? (
                            <LoadMore 
                                limit={this.state.listData.length + 1}
                                ButtonClicked={this.loadCallback}
                            />
                        ) : null
                    }
                </ScrollView>
        </Block>
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
                datauser={''}
                title={'Test'}
                menu={''}
                back={true}
                gradientColor={gradientColor}
                borderRadius={5}
                profile={false}
                headerHeight={10}
            />
        )
    }

    renderCamera = () => {
        return(
            <Camera style={{flex: 1}} type={this.state.typeCamera}>
                
                <Block card style={{flex: 1, justifyContent: 'flex-end', marginBottom: 50}}>
                    <Block center style={{width: width / 1.1}}>
                        <Block row>
                            <Block style={{width: '20%', justifyContent: 'center'}}>
                                <Block center>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.goBack()
                                        }}>            
                                            <Icon
                                                size={35}
                                                color={nowTheme.COLORS.WHITE}
                                                name="arrow-left-circle"
                                                family="Feather"
                                            />                
                                    </TouchableOpacity>
                                </Block>
                            </Block>

                            <Block center style={{width: '60%'}}>
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

    render() {

        return(
            (this.state.startCamera ? (this.renderCamera()) : (null))
        );
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
