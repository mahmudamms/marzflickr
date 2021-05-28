import React from "react";
import { Dimensions, StyleSheet } from "react-native";

import { 
    Block, 
    Button,
    Input, 
    ImageBackground,
    theme, 
} from "galio-framework";

import PropTypes from 'prop-types';

import {Camera} from 'expo-camera';

import Icon from '../Icon';
import Text from '../Text';
import { nowTheme } from "../../constants";

const { height, width } = Dimensions.get("screen");
let camera = Camera;

class CameraPreview extends React.Component {
  render() {
    const { 
        shadowless, 
        success, 
        error, 
        primary,
        photo 
    } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless,
      success && styles.success,
      error && styles.error,
      primary && styles.primary,
      {...this.props.style}
    ];

    return (
        <Block style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%' }}>
            <ImageBackground source={{uri: photo && photo.uri}} style={{ flex: 1 }}>
                <Block style={{ flex: 1, flexDirection: 'column', padding: 15, justifyContent: 'flex-end'}}>
                    <Block row>
                        <Block style={{style: '50%'}}>
                            <Button style={{backgroundColor: nowTheme.COLORS.WHITE}}>
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
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
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
  }
});

export default CameraPreview;
