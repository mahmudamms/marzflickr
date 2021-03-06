import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { Block, theme, Text, Icon, withGalio } from "galio-framework";
import GalioTheme from "../../constants/Theme";

import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('screen');

function CustomHeader({
  back,
  hideLeft,
  hideRight,
  left,
  leftStyle,
  leftIconColor,
  leftHitSlop,
  leftIconSize,
  leftIconName,
  leftIconFamily,
  onLeftPress,
  right,
  rightStyle,
  style,
  styles,
  transparent,
  theme,
  title,
  titleStyle,
}) {
  function renderTitle() {
    if (typeof title === 'string') {
      return (
        <View style={styles.title}>
          <Text style={[styles.titleTextStyle, titleStyle]}>{title}</Text>
        </View>
      );
    }

    if (!title) return null;

    return title;
  }

  function renderLeft() {
    if (!hideLeft) {
      if (leftIconName || (back && !left)) {
        return (
          <View style={[styles.left, leftStyle]}>
            <TouchableOpacity onPress={() => onLeftPress && onLeftPress()} hitSlop={leftHitSlop}>
              <Icon
                family={leftIconFamily || 'evilicons'}
                color={leftIconColor || theme.COLORS.ICON}
                size={leftIconSize || theme.SIZES.BASE * 1.0625}
                name={leftIconName || (back ? 'chevron-left' : 'navicon')}
              />
            </TouchableOpacity>
          </View>
        );
      }
      return <View style={[styles.left, leftStyle]}>{left}</View>;
    }
    return <View style={[styles.left]} />;
  }

  function renderRight() {
    const hasIcons = React.Children.count(right) > 1;
    const rightStyles = [styles.right, rightStyle];
    if (!hideRight) {
      return (
        <Block right row={hasIcons} style={rightStyles}>
          {right}
        </Block>
      );
    }
    return <View style={styles.right} />;
  }

  const navStyles = [styles.navBar, transparent && styles.transparent, style];

  return (
        <Block>
            <LinearGradient
                // Button Linear Gradient
                colors={['#0BAB64', '#3BB78F']}
                style={navStyles}
                start={{ x: 0, y: 0 }}
                end={{x: 1, y: 1 }}
            >
                <Block style={navStyles}>
                    {renderLeft()}
                    {renderTitle()}
                    {renderRight()}
                </Block>
            </LinearGradient>
        </Block>
  );
}

CustomHeader.defaultProps = {
  back: false,
  transparent: false,
  title: null,
  titleStyle: null,
  left: null,
  leftStyle: null,
  leftIconColor: null,
  onLeftPress: () => {},
  leftHitSlop: null,
  right: null,
  rightStyle: null,
  style: null,
  styles: {},
  theme: GalioTheme,
};

CustomHeader.propTypes = {
  back: PropTypes.bool,
  transparent: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  titleStyle: PropTypes.any,
  left: PropTypes.node,
  leftStyle: PropTypes.any,
  leftIconColor: PropTypes.string,
  onLeftPress: PropTypes.func,
  leftHitSlop: PropTypes.any,
  right: PropTypes.node,
  rightStyle: PropTypes.any,
  style: PropTypes.any,
  styles: PropTypes.any,
  theme: PropTypes.any,
  leftIconName: PropTypes.string,
  leftIconFamily: PropTypes.string,
  hideLeft: PropTypes.bool,
  hideRight: PropTypes.bool,
};

const styles = theme =>
  StyleSheet.create({
    navBar: {
      width: 'auto',
      height: theme.SIZES.BASE * 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingVertical: theme.SIZES.BASE,
      borderBottomEndRadius: 50,
    },
    title: {
      flex: 2,
      height: height * 0.07,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleTextStyle: {
      fontWeight: '400',
      fontSize: theme.SIZES.FONT * 0.875,
      color: theme.COLORS.WHITE,
      zIndex: 1,
    },
    left: {
      flex: 0.5,
      height: height * 0.07,
      justifyContent: 'center',
      marginLeft: theme.SIZES.BASE,
    },
    right: {
      flex: 0.5,
      height: height * 0.07,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.SIZES.BASE,
    },
    transparent: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
    },
  });

export default withGalio(CustomHeader, styles);
