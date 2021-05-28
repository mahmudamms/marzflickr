import React from 'react';
import { Block } from "galio-framework";
import { Easing, Animated, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// screens

import Home from '../screens/Home';
import Detailphoto from '../screens/Detailphoto';
import Camera from '../screens/Camera/Camera';

import Profile from '../screens/Profile';
import Register from '../screens/Register';
import Components from '../screens/Components';
import Articles from '../screens/Articles';

// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Header, GradientHeader, CustomHeader, Icon} from '../components';
import { nowTheme, tabs } from "../constants";
import { func } from 'prop-types';

const { width } = Dimensions.get("screen");

var iconColor = '#6FBE6F';
var gradientColor = ['#2EB62C', '#57C84D', '#83D475', '#ABE098', '#C5E8B7'];

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function ProfileStack({route, props}) {
  const { id } = route.params; 

  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTransparent: false
        }}
        initialParams={{
          id: id,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack({route, props}) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Dashboard"
        component={Home}
        options={{
          headerTransparent: false
        }}
      />
    </Stack.Navigator>
  );
}

function DetailDataStack({route, props}){ 
  const { title, photo_id } = route.params;  
  return ( 
    <Stack.Navigator mode="card" headerMode="none"> 
      <Stack.Screen 
        name="Detail Of Photo" 
        component={Detailphoto} 
        title={title} 
        options={{ 
          header: ({ navigation, scene }) => ( 
            <GradientHeader  
              title={title} 
              back={true} 
              gradientColor={gradientColor} 
              borderRadius={5} 
              headerHeight={10} 
            /> 
          ), 
          // cardStyle: { backgroundColor: "#FFFFFF" }, 
        }} 
        initialParams={{ 
          title: title, 
          photo_id: photo_id
        }} 
      /> 
    </Stack.Navigator> 
  ); 
} 

function CameraStack({route, props}) {
  const { id, title, url, piecemark } = route.params; 

  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Camera"
        component={Camera}
        title={title}
        options={{
          headerTransparent: false
        }}
        initialParams={{
          id: id,
          title: title,
          url: url,
          piecemark: piecemark,
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: nowTheme.COLORS.PRIMARY,
        width: width * 0.7
      }}
      drawerContentOptions={{
        activeTintcolor: nowTheme.COLORS.WHITE,
        inactiveTintColor: nowTheme.COLORS.WHITE,
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={HomeStack} />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">

      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen name="Camera" component={CameraStack} />  
      <Stack.Screen name="Profile" component={ProfileStack} />
      <Stack.Screen name="Detail Photo" component={DetailDataStack} />

    </Stack.Navigator>
  );
}

