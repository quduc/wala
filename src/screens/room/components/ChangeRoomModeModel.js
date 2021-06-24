import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { StyleSheet } from 'react-native';
import { Block, Button, Text } from '@components/index';
import colors from '@assets/colors';
import { useTranslation } from 'react-i18next';
import { moderateScale, scale, verticalScale } from '@common/scale';

const ChangeRoomModeModal = React.memo(
  ({ visible, onClose, countdown, skip, selectSong, isNewTour }) => {
    const { t } = useTranslation(['room']);
    return (
      <Modal style={styles.modal} visible={visible} backdropOpacity={0.2}>
        <Block style={styles.container}>
          <Text bold h4 mt={18} center>
            {t(isNewTour ? 'startNewTour' : 'hostHasChange')}
          </Text>
          <Block>
            <Text c1 medium center color={colors.textGrayLight} mt={10}>
              {t('txt_hostChangeMode_1')}
            </Text>
            <Text c1 extraBold center color={colors.textGrayLight}>
              {t('txt_hostChangeMode_2')}
            </Text>
            <Text c1 medium center color={colors.textGrayLight}>
              {t('txt_hostChangeMode_3')}
            </Text>
            <Text c1 medium center color={colors.textGrayLight} mt={20}>
              {t('txt_hostChangeMode_4')}
            </Text>
            <Text c1 extraBold center color={colors.orange}>
              {countdown}s
            </Text>
            <Block row pv={16} ph={32} justifyBetween>
              <Button
                bg={colors.gray}
                pv={4}
                ph={48}
                borderRadius={5}
                mr={16}
                onPress={skip}>
                <Text medium c1>
                  {t('skip')}
                </Text>
              </Button>
              <Button
                bg={colors.orange}
                pv={4}
                ph={24}
                borderRadius={5}
                onPress={selectSong}>
                <Text medium c1>
                  {t('selectSong')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Modal>
    );
  },
);
export default ChangeRoomModeModal;
const styles = {
  modal: {
    backgroundColor: colors.blackModal,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(16),
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blackPrimary,
    borderRadius: moderateScale(16),
    paddingTop: verticalScale(16),
  },
  textInputSearch: {
    color: colors.white,
    fontSize: moderateScale(16),
    flex: 1,
  },
};
