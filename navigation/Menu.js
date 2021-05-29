import React from "react";
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";
import Images from "../constants/Images";
import { DrawerItem as DrawerCustomItem, Icon } from "../components";

import nowTheme from "../constants/Theme";

const { width } = Dimensions.get("screen");

var fullname = '';

async function readData() {
  var data_user = await AsyncStorage.getItem('data_user');
  var data_user = JSON.parse(data_user);

  
}

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  const screens = [
    "Home",
    // "Activity"
  ];

  readData();

  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block style={styles.header}>
        <Block style={styles.logo}></Block>
        
        <Block right style={styles.headerIcon}>
          <Icon
            name="align-left-22x"
            family="NowExtra"
            size={15}
            color={"white"}
          />
        </Block>

        <Block style={{marginTop: -20}}>
          <Block>
            <Text style={[ styles.textRegular ]}>{fullname}</Text>
          </Block>

          <Block>
            <Text style={[ styles.textRegular ]}>Admin</Text>
          </Block>
        </Block>
      </Block>

      <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}

          <Block flex style={{ marginTop: 30, marginVertical: 8, paddingHorizontal: 2 }}>
            <Block
              style={{ borderColor: 'white', width: '93%', borderWidth: StyleSheet.hairlineWidth, marginHorizontal: 10}}
            />
          </Block>

          <DrawerCustomItem title="LOGOUT" navigation={navigation}/>
          
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center"
  },
  headerIcon: {
    marginTop: -10
  },
  logo: {
    height: 40,
    width: 37
  },

  textRegular: {
    fontFamily: 'montserrat-regular',
    color: nowTheme.COLORS.WHITE,
  }
});

export default CustomDrawerContent;
