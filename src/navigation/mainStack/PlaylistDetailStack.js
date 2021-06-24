import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as screenTypes from '@navigation/screenTypes';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: false,
    }}
    mode='modal'></Stack.Navigator>
);
