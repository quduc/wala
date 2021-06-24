import React, { memo } from 'react';
import { Text, Icon, Touchable } from '@components/index';

import SvgComponent from '@assets/svg';
import { useNavigation } from '@react-navigation/core';
import * as screenTypes from '@navigation/screenTypes';
import colors from '@assets/colors';

const ItemHorizontal = ({ item }) => {
  const navigation = useNavigation();
  const goToScreen = screen => {
    navigation.navigate(screenTypes.RoomDetailStack, {
      screen,
      params: { playlistId: item.id },
    });
  };

  return (
    <Touchable
      onPress={() => {}}
      row
      middle
      ph={24}
      pv={10}
      bg={colors.blackPrimary}
      ml={16}
      mv={16}
      borderRadius={10}>
      <Icon xml={SvgComponent.warIcon} />
      <Text bold h5 ml={16}>
        {item.name}
      </Text>
    </Touchable>
  );
};

export default memo(ItemHorizontal);
