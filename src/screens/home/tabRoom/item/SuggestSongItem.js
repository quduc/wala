import React from 'react';
import SvgComponent from '@assets/svg';
import PropTypes from 'prop-types';
import { Touchable, Text, Image, Icon } from '@components/index';
const SuggestSongItem = ({ item, selectedItem, setSelectedItem }) => (
  <Touchable
    row
    middle
    mt={8}
    borderBottom
    pb={8}
    onPress={() => setSelectedItem(item)}>
    <Image source={{ uri: item?.thumbnails }} circle={60} />

    <Text c1 numberOfLines={3} extraBold ml={16} flex={1}>
      {item.name}
    </Text>

    {selectedItem?.youtubeId === item.youtubeId && (
      <Icon ml={16} xml={SvgComponent.checkOrange} />
    )}
  </Touchable>
);
SuggestSongItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default SuggestSongItem;
