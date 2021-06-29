import React from 'react';
import SvgComponent from '@assets/svg';
import images from '@assets/images';
import PropTypes from 'prop-types';
import colors from '@assets/colors';
import { Block, Text, Image, Icon } from '@components/index';
import SmallButton from '@components/button/ButtonSmall';

import {
  RANK_POSITION,
  MAP_SCREEN_TYPE_TO_ICON,
  MAP_INDEX_TO_ICON,
} from '@common/constant';
import { followFriend, addFriend } from '@modules/user/slice';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { profileSelector } from '@modules/user/selectors';

const UserItem = ({ item, index, iconType, valueSearch }) => {
  const profile = useSelector(profileSelector);
  const dispatch = useDispatch();
  const getIconByFriendStatus = () => {
    switch (item?.friendStatus) {
      case 'FRIEND':
        return (
          <Icon
            touchable={item.requestDisable !== '1'}
            xml={SvgComponent.following}
            mr={16}
          />
        );
      case 'PENDING':
        return (
          <Icon
            onPress={() => onAddFriend('PENDING')}
            touchable={item.requestDisable !== '1'}
            xml={SvgComponent.waitingAccept}
            mr={16}
          />
        );
      default:
        return (
          <Icon
            onPress={() => onAddFriend('NOTHING')}
            touchable={item.requestDisable !== '1'}
            xml={SvgComponent.addFriend}
            mr={16}
          />
        );
    }
  };
  // iconType: xu ly trong slice
  const onFollowFriend = () => {
    dispatch(
      followFriend({
        data: {
          userId: item.id,
          isNeedUpdate: true,
          iconType,
        },
        onError: error => {
          Toast.show({
            type: 'error',
            props: {
              message: error.errorMessage,
            },
          });
        },
      }),
    );
  };
  const onAddFriend = () => {
    dispatch(
      addFriend({
        data: {
          userId: item.id,
          type: 'PENDING',
          isNeedUpdate: true,
          iconType,
        },
        onError: error => {
          Toast.show({
            type: 'error',
            props: {
              message: error.errorMessage,
            },
          });
        },
      }),
    );
  };
  return (
    <Block
      key={index.toString()}
      row
      middle
      borderBottom
      pb={13}
      mb={13}
      mr={16}>
      {!valueSearch &&
        (RANK_POSITION.includes(index) ? (
          <Icon xml={MAP_INDEX_TO_ICON[index]} ml={13} />
        ) : (
          <Text h5 ph={10} bold ml={13}>
            {index + 1}
          </Text>
        ))}

      <Image
        uri={item?.avatar}
        defaultImage={images.default_avatar}
        circle={60}
        mh={16}
      />
      <Block flex={1}>
        <Text c1 extraBold>
          {item.name}
        </Text>
        {iconType && (
          <Block row mt={4}>
            <Icon xml={MAP_SCREEN_TYPE_TO_ICON[iconType]} />
            <Text c2 ml={4} color={colors.textSecondary}>
              {item?.total || 0}
            </Text>
          </Block>
        )}
      </Block>
      {profile.id !== item.id && (
        <>
          {getIconByFriendStatus()}
          {item?.isFollowed ? (
            <SmallButton
              onPress={onFollowFriend}
              bg={colors.yellow}
              title='following'
              icon={SvgComponent.trophySmall}
            />
          ) : (
            <SmallButton
              onPress={onFollowFriend}
              bg={colors.gray}
              title='follow'
              icon={SvgComponent.trophySmall}
            />
          )}
        </>
      )}
    </Block>
  );
};

UserItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  iconType: PropTypes.string,
};

export default React.memo(UserItem);