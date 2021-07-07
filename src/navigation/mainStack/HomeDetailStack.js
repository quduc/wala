import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListUsers from "@screens/home/tabUser/listUser";
import ListHost from "@screens/home/tabHost/listHost";

import * as screenTypes from "@navigation/screenTypes";
import PostDetail from "@screens/postDetail";
import listLike from "@screens/listLike";

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name={screenTypes.ListHost} component={ListHost} />
    <Stack.Screen name={screenTypes.ListUsers} component={ListUsers} />
    <Stack.Screen name={screenTypes.PostDetail} component={PostDetail} />
    <Stack.Screen name={screenTypes.ListLike} component={listLike} />
  </Stack.Navigator>
);
