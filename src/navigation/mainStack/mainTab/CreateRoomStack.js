import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateScreenModal from '@screens/room';

import * as screenTypes from '@navigation/screenTypes';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name={screenTypes.CreateRoomScreen}
      component={CreateScreenModal}
    />
  </Stack.Navigator>
);
