import React, { memo } from 'react';
import { Text, Radio, Touchable, Image } from '@components/index';
import images from '@assets/images';

const ItemVertical = ({
  item,
  onChangeListeners,
  listenerIds,
  list,
  index,
}) => (
  <Touchable row middle mt={13} onPress={() => onChangeListeners(item)}>
    <Radio
      onPress={() => onChangeListeners(item)}
      checked={listenerIds.includes(list[index].id)}
    />
    <Image
      ml={12}
      uri={item?.avatar}
      defaultImage={images.default_avatar}
      circle={44}
    />
    <Text ml={12}>{item?.name}</Text>
  </Touchable>
);

export default memo(ItemVertical);
