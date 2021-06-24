import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PlaylistScreen from '@screens/playlist';


import * as screenTypes from '@navigation/screenTypes';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name={screenTypes.PlaylistScreen}
      component={PlaylistScreen}
    />
  </Stack.Navigator>
);
