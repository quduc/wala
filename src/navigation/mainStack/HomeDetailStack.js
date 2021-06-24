import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListUsers from '@screens/home/tabUser/listUser';
import ListHost from '@screens/home/tabHost/listHost';

import * as screenTypes from '@navigation/screenTypes';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={screenTypes.ListHost} component={ListHost} />
    <Stack.Screen name={screenTypes.ListUsers} component={ListUsers} />
  </Stack.Navigator>
);
