import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';

import { Col, Row, Grid } from "react-native-easy-grid";

import { 
    AsyncStorage,
    StyleSheet, 
    Image, 
    TouchableWithoutFeedback 
} from 'react-native';

import { Block, Text, theme, Icon } from 'galio-framework';

import ContentDetail from './ContentDetail';

import { nowTheme } from '../constants';

class DetailList extends React.Component {
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
      titleStyle,
      category,
    } = this.props;

    const imageStyles = [full ? styles.fullImage : styles.horizontalImage, imageStyle];
    const titleStyles = [styles.cardTitle, titleStyle];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [
      styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow
    ];

    return (
      <Block row={horizontal} card flex style={cardContainer}>
        <TouchableWithoutFeedback 
          onPress={() => navigation.navigate('Approval MRIR', {
            title: item.report_no,
            id: item.mrir_id,
            category: category,
          })}
        >
          <Block flex space="between" style={styles.cardDescription}>
            <Block flex>
                <Block flex>

                    <Block style={{paddingLeft: 5}}>

                      <Grid style={{paddingBottom: 15}}>
                        <Col 
                          style={{
                            alignItems: 'center',
                          }}
                        >
                          <Text
                              style={{ 
                                  fontFamily: 'montserrat-bold', 
                              }}
                              size={15}
                              color={nowTheme.COLORS.SECONDARY}
                          >
                              {item.report_no}
                          </Text>
                        </Col>
                      </Grid>
                        
                      {item.project ? (
                        <ContentDetail
                          title='Project'
                          content={item.project}
                        />
                      ) : (
                        <Block />
                      )}

                      {item.po_number ? (
                        <ContentDetail
                          title='PO No.'
                          content={item.po_number}
                        />
                      ) : (
                        <Block />
                      )}

                      {item.do_pl ? (
                        <ContentDetail
                          title='DO / PL No.'
                          content={item.do_pl}
                        />
                      ) : (
                        <Block />
                      )}

                      {item.category_cm ? (
                        <ContentDetail
                          title='Category'
                          content={item.category_cm}
                        />
                      ) : (
                        <Block />
                      )}

                      {item.discipline ? (
                        <ContentDetail
                          title='Discipline'
                          content={item.discipline}
                        />
                      ) : (
                        <Block />
                      )}

                      {item.vendor ? (
                        <ContentDetail
                          title='Vendor'
                          content={item.vendor}
                        />
                      ) : (
                        <Block />
                      )}

                      {item.total ? (
                        <Grid 
                          style={{
                            alignItems: 'center',
                            alignContent: 'center',
                          }}
                        >
                          <Col>
                            <Text
                              style={{ 
                                fontFamily: 'montserrat-regular',
                              }}
                              size={12}
                              color={nowTheme.COLORS.BLACK}
                            >
                              Total Item
                            </Text>
                          </Col>
                          
                          <Col>
                            <Block 
                              left
                              flex
                              style={{
                                backgroundColor: nowTheme.COLORS.PRIMARY,
                                borderRadius: 50,
                                alignSelf: 'flex-start'
                              }}
                            >
                              <Block style={{paddingHorizontal: 15}}>
                                <Text
                                  style={{ 
                                    fontFamily: 'montserrat-bold',
                                  }}
                                  size={12}
                                  color={nowTheme.COLORS.WHITE}
                                >
                                  {item.total + ' Item(s)'}
                                </Text>
                              </Block>
                            </Block>
                          </Col>
                        </Grid>
                      ) : (
                        <Block />
                      )}

                    </Block>                    

                </Block>
              
            </Block>

          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

DetailList.propTypes = {
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
    minHeight: 80,
    marginBottom: 4
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
  }
});

export default withNavigation(DetailList);
