import React, { memo } from 'react';
import { Block, Text, Icon, Touchable, Image } from '@components/index';

import colors from '@assets/colors';
import SvgComponent from '@assets/svg';
import images from '@assets/images';

const ItemHorizontal = ({ item, onChangeListeners }) => (
  <Block mr={15} middle>
    <Block>
      <Image
        uri={item?.avatar}
        defaultImage={images.default_avatar}
        circle={44}
      />
      <Touchable
        absolute
        top={0}
        left={30}
        circle={16}
        center
        middle
        bg={colors.orange}
        onPress={() => onChangeListeners(item)}>
        <Icon xml={SvgComponent.closeIcon} />
      </Touchable>
    </Block>
    <Text extraBold c1 center mt={8}>
      {item?.name || ''}
    </Text>
  </Block>
);

export default memo(ItemHorizontal);
