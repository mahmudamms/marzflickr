import React from 'react';
import { withNavigation } from '@react-navigation/compat';

import { 
    AsyncStorage,
    Dimensions,
    StyleSheet, 
    Image, 
    TouchableWithoutFeedback 
} from 'react-native';

import { 
  Block, 
  Checkbox,
  theme, 
  Icon 
} from 'galio-framework';

import { nowTheme } from '../constants';

import Text from './Text';
import Divider from './Divider';

const { height, width } = Dimensions.get("screen");

class ListChecked extends React.Component {

  constructor() {
    super();

    this.state = {
      isChecked: false,
      isShow: false,
    };
  }

  itemChecked = (item) => {
    this.setState({isChecked: !this.state.isChecked});

    var checked = !this.state.isChecked;

    this.props.itemChecked(checked, item);

  }

  render() {
    const {
      navigation,
      item,
      key
    } = this.props;

    return (
        <Block center key={key}>
            <TouchableWithoutFeedback onPress={() => this.itemChecked(item)}>
                <Block>
                    <Block style={{paddingVertical: 10}}>
                        <Block 
                            card  
                            style={[
                                {
                                    width: width / 1.1, 
                                    paddingVertical: 10, 
                                    paddingBottom: 30, 
                                    paddingHorizontal: 10, 
                                    backgroundColor: nowTheme.COLORS.WHITE,
                                },
                                (this.state.isChecked ? {borderColor: nowTheme.COLORS.PRIMARY, borderWidth: 2} : '')
                            ]}
                        >
                            <Block>
                                <Block>

                                    <Block right>
                                        {
                                            this.state.isChecked ? (
                                                <Icon
                                                    size={20}
                                                    color={nowTheme.COLORS.PRIMARY}
                                                    name="check-square"
                                                    family="Feather"
                                                />
                                            ) : <Block />
                                        }
                                    </Block>

                                    <Block style={{paddingHorizontal: 10, paddingVertical: 10}}>
                                        <Block center>
                                            <Text
                                                title={'Piecemark : ' + item.piecemark }
                                                bold
                                                color={nowTheme.COLORS.GRAY}
                                            />
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>

                            <Block style={{paddingHorizontal: 10, paddingBottom: 10}}>
                                <Divider />
                            </Block>

                            <Block row style={{paddingTop: 5, paddingBottom: 5}}>
                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={'Drawing AS'}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>

                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={item.drawing_as}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>
                            </Block>

                            <Block row style={{paddingBottom: 5}}>
                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={'Rev AS'}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>

                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={item.rev_as}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>
                            </Block>

                            <Block row style={{paddingBottom: 5}}>
                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={'Material'}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>

                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={item.material}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>
                            </Block>

                            <Block row style={{paddingBottom: 5}}>
                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={'Profile'}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>

                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={item.profile}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>
                            </Block>

                            <Block row style={{paddingBottom: 5}}>
                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={'Grade'}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>

                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={item.grade}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>
                            </Block>

                            <Block row>
                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={'Weight (kg)'}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>

                                <Block style={{width: '50%'}}>
                                    <Block style={{paddingHorizontal: 10}}>
                                        <Text
                                            title={item.weight}
                                            bold
                                            color={nowTheme.COLORS.GRAY}
                                        />
                                    </Block>
                                </Block>
                            </Block>

                        </Block>
                    </Block>
                </Block>
            </TouchableWithoutFeedback>
        </Block>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    minHeight: 80,
    marginBottom: 4
  },
  cardActive: {
    borderWidth: 2,
    borderColor: nowTheme.COLORS.PRIMARY,
  },
  cardTitle: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 15,
    textAlign: 'center',
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 1
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden'
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 122,
    width: 'auto'
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 215
  },
  shadow: {
    shadowColor: '#8898AA',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2
  },
  articleButton: {
    fontFamily: 'montserrat-bold',
    paddingHorizontal: 9,
    paddingVertical: 7
  },
  subtitlePadding: {
    paddingBottom: 5
  }
});

export default withNavigation(ListChecked);
