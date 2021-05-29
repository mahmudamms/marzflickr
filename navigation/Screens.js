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


function HomeStack({route, props}) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Dashboard"
        component={Home}
        options={{
          headerStyle: {
            backgroundColor: '#ab0025',
          },
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





export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">

      <Stack.Screen name="Home" component={HomeStack} />
      <Stack.Screen name="Camera" component={CameraStack} />  
      <Stack.Screen name="Detail Photo" component={DetailDataStack} />

    </Stack.Navigator>
  );
}

