import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddListeners from '@screens/room/AddListeners';
import RoomDetail from '@screens/room/RoomDetail';
import * as screenTypes from '@navigation/screenTypes';
import ListSongInRoom from '@screens/room/ListSongInRoom';

import UpdateRoomScreen from '@screens/room/UpdateRoom';
import { Platform } from 'react-native';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: false,
    }}
    mode='modal'>
    <Stack.Screen
      name={screenTypes.AddListenersScreen}
      component={AddListeners}
    />
    <Stack.Screen name={screenTypes.RoomDetail} component={RoomDetail} />
    <Stack.Screen
      name={screenTypes.ListSongInRoom}
      component={ListSongInRoom}
    />
    <Stack.Screen
      name={screenTypes.UpdateRoomScreen}
      component={UpdateRoomScreen}
      options={{
        animationEnabled: Platform.OS !== 'android',
        cardStyle: {
          backgroundColor: 'transparent',
        },
      }}
    />
  </Stack.Navigator>
);
