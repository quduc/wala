/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { Block, Text } from '@components/index';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import colors from '@assets/colors';
import fonts from '@assets/fontFamily';
import * as screenTypes from '@navigation/screenTypes';
import { moderateScale, verticalScale } from '@common/scale';
import { useSelector } from 'react-redux';
import { getRoomDetailSelector } from '@modules/room/selectors';

const MaxMemberInput = ({ formik, fromScreen }) => {
  const roomDetail = useSelector(getRoomDetailSelector);
  const handleTrimWhenBlurInput = e => {
    let value = formik.values.maxMember
      .trim()
      .replace(/(\D)/g, '')
      .replace(/^(0*)/, '');

    if (
      fromScreen === screenTypes.UpdateRoomScreen &&
      roomDetail?.members &&
      value < roomDetail?.members.length
    ) {
      value = `${roomDetail?.members.length}`;
    }

    formik.setFieldValue(
      'maxMember',
      // eslint-disable-next-line no-useless-escape
      value,
    );
    formik.handleBlur('maxMember')(e);
  };

  return (
    <Block>
      <RNTextInput
        style={[
          styles.rnTextInput,
          formik.errors.maxMember &&
            formik.touched.maxMember &&
            styles.rnTextInputError,
        ]}
        value={formik.values.maxMember}
        onChangeText={formik.handleChange('maxMember')}
        onBlur={e => handleTrimWhenBlurInput(e)}
        keyboardType='number-pad'
        maxLength={3}
      />
      {formik.errors.maxMember && formik.touched.maxMember && (
        <Text c2 color={colors.error} medium ml={3} mt={8}>
          {formik.errors.maxMember}
        </Text>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  rnTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    paddingVertical: 8,
    color: colors.textGrayLight,
    fontFamily: fonts.primaryMedium,
  },
  rnTextInputError: {
    borderBottomColor: colors.error,
  },
  imageBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(32),
    backgroundColor: colors.gray,
    borderRadius: moderateScale(10),
  },
});

export default MaxMemberInput;
