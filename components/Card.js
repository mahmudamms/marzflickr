import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme, Icon } from 'galio-framework';

import { nowTheme } from '../constants';

class Card extends React.Component {
  render() {
    const {
      navigation,
      item,
      horizontal,
      full,
      style,
      ctaColor,
      imageStyle,
      ctaRight,
      titleStyle
    } = this.props;

    const imageStyles = [full ? styles.fullImage : styles.horizontalImage, imageStyle];
    const titleStyles = [styles.cardTitle, titleStyle];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [
      styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow
    ];

    var go_link = item.action;

    return (
      <Block row={horizontal} card flex style={cardContainer}>
        <TouchableWithoutFeedback 
          onPress={() => navigation.navigate(go_link, {
            title: item.title
          })}
        >
          <Block flex space="between" style={styles.cardDescription}>
            <Block flex>

              <Block center>
                <Icon
                  size={50}
                  color={nowTheme.COLORS.PRIMARY}
                  name={item.icon}
                  family={item.family}
                />
              </Block>

              <Block
                style={{
                  paddingTop: 10,
                  paddingBottom: 5,
                }}
              >
                <Text
                  style={{ 
                    fontFamily: 'montserrat-bold', 
                    textAlign: 'center',
                  }}
                  size={20}
                  color={nowTheme.COLORS.SECONDARY}
                >
                  {item.title}
                </Text>
              </Block>

              {item.subtitle ? (
                <Block flex center>
                  <Text
                    style={{ 
                      fontFamily: 'montserrat-regular',
                      textAlign: 'center',
                    }}
                    size={15}
                    color={nowTheme.COLORS.BLACK}
                  >
                    {item.subtitle}
                  </Text>
                </Block>
              ) : (
                <Block />
              )}

              {item.description ? (
                <Block flex center>
                  <Text
                    style={{ fontFamily: 'montserrat-regular', textAlign: 'center', padding: 15 }}
                    size={14}
                    color={"#9A9A9A"}
                  >
                    {item.description}
                  </Text>
                </Block>
              ) : (
                <Block />
              )}

              {item.body ? (
                <Block flex left>
                  <Text
                    style={{ fontFamily: 'montserrat-regular' }}
                    size={12}
                    color={nowTheme.COLORS.TEXT}
                  >
                    {item.body}
                  </Text>
                </Block>
              ) : (
                <Block />
              )}
              
            </Block>

          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

Card.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
  ctaRight: PropTypes.bool,
  titleStyle: PropTypes.any,
  textBodyStyle: PropTypes.any
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 4
  },
  cardTitle: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 15,
    textAlign: 'center',
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
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
  }
});

export default withNavigation(Card);
