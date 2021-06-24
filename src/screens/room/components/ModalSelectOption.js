import colors from '@assets/colors';
import SvgComponent from '@assets/svg';
import { Block, Text, Icon, Touchable, ListAvatar } from '@components/index';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { StyleSheet } from 'react-native';
import * as screenTypes from '@navigation/screenTypes';
import { MAP_TYPE_AND_RULE, TARGET_MEMBER } from '@common/constant';
import { useSelector } from 'react-redux';
import { listenersSelector } from '@modules/room/selectors';
import { useTranslation } from 'react-i18next';

const ModalSelectOption = ({ items, value, setValue, ignoreAddListeners }) => {
  const { t } = useTranslation(['room', 'comom']);
  const navigation = useNavigation();
  const [visible, setVisible] = useState();
  const listeners = useSelector(listenersSelector);

  const onToggle = () => setVisible(!visible);

  const onClose = () => setVisible(false);

  const onChangeValue = val => {
    setValue(val);
    onClose();
  };

  const goToAddListenersScreen = () => {
    navigation.navigate(screenTypes.RoomDetailStack, {
      screen: screenTypes.AddListenersScreen,
      params: {
        fromScreen: screenTypes.CreateRoomScreen,
      },
    });
  };

  return (
    <Block bg={colors.blackPrimary} mt={10}>
      <Touchable
        row
        justifyBetween
        middle
        mb={8}
        pb={8}
        onPress={onToggle}
        borderBottom={!visible}>
        <Text c1 medium ml={3}>
          {MAP_TYPE_AND_RULE[value]}
        </Text>
        <Icon
          xml={visible ? SvgComponent.upIcon : SvgComponent.downIcon}
          mr={10}
        />
      </Touchable>
      <Modal
        style={styles.modal}
        isVisible={visible}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        backdropOpacity={0.6}>
        <Block
          ph={30}
          pv={24}
          bg={colors.blackPrimary}
          borderTopLeftRadius={20}
          borderTopRightRadius={20}>
          {items.map((item, index) => (
            <Touchable
              key={item.title}
              pb={12}
              mb={12}
              row
              justifyBetween
              middle
              borderBottom={index === 0}
              onPress={() => onChangeValue(item.value)}>
              <Block flex={1}>
                <Text extraBold>{item.title}</Text>
                <Text medium c2>
                  {item.description}
                </Text>
              </Block>
              {item.value === value && (
                <Icon xml={SvgComponent.checkIcon} mr={10} ml={10} />
              )}
            </Touchable>
          ))}
        </Block>
      </Modal>

      {value === TARGET_MEMBER[1].value && !ignoreAddListeners && (
        <Touchable
          mt={10}
          row
          justifyBetween
          middle
          onPress={goToAddListenersScreen}>
          <Text c1 medium ml={3}>
            {listeners.length === 0
              ? t('room:txt_add_listeners')
              : t('room:txt_edit_listeners')}
          </Text>
          <ListAvatar
            list={listeners}
            mr={10}
            right={
              (listeners > 5 ? -80 : -100) + [...listeners].splice(0, 5).length
            }
          />
          <Icon xml={SvgComponent.leftIcon} mr={10} />
        </Touchable>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
});

export default ModalSelectOption;
