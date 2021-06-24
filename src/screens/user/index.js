/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/order */
import React, { useState } from 'react';
import {
  Body,
  Block,
  Text,
  Icon,
  Image,
  Button,
  Touchable,
} from '@components/index';
import images from '@assets/images';
import Header from '@components/header';
import colors from '@assets/colors';
import SvgComponent from '@assets/svg';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import * as screenTypes from '@navigation/screenTypes';
import { useSelector } from 'react-redux';
import { profileSelector } from '@modules/user/selectors';
import { TabStatus } from '@screens/listFriend';

const Account = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [showFavorite, setShowFavorite] = useState(false);
  const dataProfile = useSelector(profileSelector);

  const onShowFavorite = () => {
    setShowFavorite(true);
  };

  const onShowTabMusic = () => {
    setShowFavorite(false);
  };

  const goSetting = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.Setting,
    });
  };

  const goListFriend = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.ListFriend,
      params: { dataProfile, statusTab: TabStatus.Friend },
    });
  };

  const goListFollowers = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.ListFriend,
      params: { dataProfile, statusTab: TabStatus.Followers },
    });
  };

  const goListFollowing = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.ListFriend,
      params: { dataProfile, statusTab: TabStatus.Following },
    });
  };

  const goEditProfile = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.EditProfile,
    });
  };

  return (
    <Body ph={16}>
      <Header
        title={dataProfile?.name}
        isBack={false}
        iconRight={SvgComponent.menuAccount}
        onRightPress={goSetting}
      />
      <Block mt={16} row>
        {dataProfile?.avatar ? (
          <Image source={{ uri: dataProfile?.avatar }} circle={74} />
        ) : (
          <Image source={images.default_avatar} circle={74} />
        )}

        <Block flex={1} ml={32}>
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
          <Button bg={colors.gray} pv={2} onPress={goEditProfile}>
            <Text c2 medium color={colors.white}>
              {t('editProfile')}
            </Text>
          </Button>
        </Block>
      </Block>
      <Text medium c1 mt={16} mh={16}>
        {dataProfile?.description}
      </Text>
      <Block row width='100%' mv={16}>
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

export default Account;
