import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Body, Text, Icon, Touchable } from '@components/index';
import { useTranslation } from 'react-i18next';
import Header from '@components/header';
import { useNavigation } from '@react-navigation/core';
import * as screenTypes from '@navigation/screenTypes';
import { useDispatch } from 'react-redux';
import { signOut } from '@modules/auth/slice';
import { disconnectSocket } from '@utils/SocketHelper';
import LogoutModal from './components/LogoutModal';
import { LIST_SETTING } from './config/listSetting';

export default function Setting() {
  const [isShowModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const showModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onLogout = () => {
    disconnectSocket();
    dispatch(signOut());
    closeModal();
  };

  const { t } = useTranslation();
  const moveToScreen = item => {
    item.route === 'logoutAccount'
      ? showModal()
      : navigation.navigate(screenTypes.ProfileDetailStack, {
          screen: item.route,
        });
  };
  return (
    <Body ph={16}>
      <Header title='settings' />
      <FlatList
        data={LIST_SETTING}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Touchable row borderBottom pv={8} onPress={() => moveToScreen(item)}>
            <Icon xml={item.icon} />
            <Text ml={16}>{t(item.title)}</Text>
          </Touchable>
        )}
      />
      <LogoutModal
        visible={isShowModal}
        onClose={closeModal}
        onLogout={onLogout}
      />
    </Body>
  );
}
