import React, { useEffect, useState } from 'react';
import { Body, Block, Text, Icon, Image, Touchable } from '@components/index';
import images from '@assets/images';
import Header from '@components/header';
import colors from '@assets/colors';
import SvgComponent from '@assets/svg';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/core';
import * as screenTypes from '@navigation/screenTypes';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadingFetchProfileSelector,
  profileOtherSelector,
} from '@modules/profile/selectors';
import { fetchProfileOther } from '@modules/profile/slice';
import { TabStatus } from '@screens/listFriendOther';

export default ProfileOther = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const [showFavorite, setShowFavorite] = useState(false);
  const userId = route.params?.userId;
  const dataProfile = useSelector(profileOtherSelector);
  const loading = useSelector(loadingFetchProfileSelector);
  const onShowFavorite = () => {
    setShowFavorite(true);
  };
  const onShowTabMusic = () => {
    setShowFavorite(false);
  };

  useEffect(() => {
    dispatch(
      fetchProfileOther({
        data: { userId },
      }),
    );
  }, [userId]);

  const goListFriend = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.ListFriendOther,
      params: { statusTab: TabStatus.Friend, userId },
    });
  };

  const goListFollowers = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.ListFriendOther,
      params: { statusTab: TabStatus.Followers, userId },
    });
  };

  const goListFollowing = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.ListFriendOther,
      params: { statusTab: TabStatus.Following, userId },
    });
  };

  return (
    <Body loading={loading}>
      <Header
        ml={16}
        title={dataProfile?.name}
        isBack={false}
        iconLeft={SvgComponent.back}
        onLeftPress={goBack}
      />
      <Block mt={16} row mh={16}>
        {dataProfile?.avatar ? (
          <Image source={{ uri: dataProfile?.avatar }} circle={74} />
        ) : (
          <Image source={images.default_avatar} circle={74} />
        )}
        <Touchable flex={1} ml={32} ph={16}>
          <Block flex={1} row justifyBetween>
            <Touchable onPress={goListFriend}>
              <Text bold h5 center>
                {dataProfile?.numberFriend}
              </Text>
              <Text medium>{t('friends')}</Text>
            </Touchable>
            <Touchable onPress={goListFollowers}>
              <Text bold h5 center>
                {dataProfile?.queryFollowers}
              </Text>
              <Text medium>{t('followers')}</Text>
            </Touchable>
            <Touchable onPress={goListFollowing}>
              <Text bold h5 center>
                {dataProfile?.queryFollowing}
              </Text>
              <Text medium>{t('following')} </Text>
            </Touchable>
          </Block>
        </Touchable>
      </Block>
      <Text medium c1 mt={16} ph={16}>
        {dataProfile?.description}
      </Text>
      <Block row width='100%' mv={16} ph={16}>
        <Touchable
          row
          center
          flex={1}
          bg={showFavorite ? colors.gray : colors.yellow}
          pv={4}
          mr={16}
          middle
          borderRadius={3}
          onPress={onShowTabMusic}>
          <Icon xml={SvgComponent.clock} mr={4} />
          <Text medium>{t('activityHistory')}</Text>
        </Touchable>
        <Touchable
          row
          center
          flex={1}
          bg={showFavorite ? colors.yellow : colors.gray}
          pv={4}
          middle
          borderRadius={3}
          onPress={onShowFavorite}>
          <Icon xml={SvgComponent.love} mr={4} />
          <Text medium>{t('favourite')}</Text>
        </Touchable>
      </Block>
    </Body>
  );
};
