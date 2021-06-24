import React from 'react';
import images from '@assets/images';
import { Block, Text, Image, Body } from '@components/index';
import { useNavigation } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';
import { LIST_POPULAR_USER, ICON_TYPE } from '@common/constant';

import UserListHorizontal from '../components/UserListHorizontal';

export default function HostTab() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Body scroll>
      <Block mr={16}>
        <Image
          width='100%'
          height={160}
          borderRadius={16}
          source={images.bruno}
        />
      </Block>
      <Text h3 bold mv={16}>
        {t('topFavHosts')}
      </Text>
      <UserListHorizontal
        list={LIST_POPULAR_USER}
        iconType={ICON_TYPE.FAVOURITE}
        title='topFavHosts'
      />
      <Text h3 bold mv={16}>
        {t('mostActiveHosts')}
      </Text>
      <UserListHorizontal
        list={LIST_POPULAR_USER}
        iconType={ICON_TYPE.ACTIVE}
        title='mostActiveHosts'
      />
      <Block height={20} />
    </Body>
  );
}
