/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import { moderateScale } from '@common/scale';
import PropTypes from 'prop-types';
import colors from '@assets/colors';
import fontSize from '@assets/fontSize';
import fonts from '@assets/fontFamily';

const TextView = ({
  flex,
  m,
  mt,
  mr,
  mb,
  ml,
  mv,
  mh,
  p,
  pt,
  pr,
  pb,
  pl,
  pv,
  ph,
  h1,
  h2,
  h3,
  h4,
  h5,
  c1,
  c2,
  center,
  right,
  left,
  size,
  thin,
  light,
  medium,
  semiBold,
  bold,
  fontWeight,
  extraBold,
  italic,
  fontFamily,
  underline,
  uppercase,
  letterSpacing,
  color,
  children,
  maxWidth,
  maxHeight,
  textAlignCenter,
  justifyStart,
  justifyEnd,
  alignItemsStart,
  alignItemsEnd,
  gradient,
  style,
  ...rest
}) => {
  const styledComponent = [
    {
      fontSize: 14,
      lineHeight: 21,
      fontFamily: fonts.primary,
      color: colors.textPrimary,
    },

    flex && { flex },
    m && { margin: moderateScale(m) },
    mt && { marginTop: moderateScale(mt) },
    mr && { marginRight: moderateScale(mr) },
    mb && { marginBottom: moderateScale(mb) },
    ml && { marginLeft: moderateScale(ml) },
    mh && { marginHorizontal: moderateScale(mh) },
    mv && { marginVertical: moderateScale(mv) },
    p && { padding: moderateScale(p) },
    pt && { paddingTop: moderateScale(pt) },
    pr && { paddingRight: moderateScale(pr) },
    pb && { paddingBottom: moderateScale(pb) },
    pl && { paddingLeft: moderateScale(pl) },
    ph && { paddingHorizontal: moderateScale(ph) },
    alignItemsStart && { alignItems: 'flex-start' },
    alignItemsEnd && { alignItems: 'flex-end' },
    justifyStart && { justifyContent: 'flex-start' },
    justifyEnd && { justifyContent: 'flex-end' },
    center && { textAlign: 'center' },
    right && { alignSelf: 'flex-end', textAlign: 'right' },
    left && { alignSelf: 'flex-start', textAlign: 'left' },
    maxWidth && { maxWidth },
    maxHeight && { maxHeight },
    textAlignCenter && { textAlign: 'center' },

    size && { fontSize: size },
    h1 && {
      fontSize: moderateScale(fontSize.FONT_36),
      lineHeight: moderateScale(34),
    },
    h2 && {
      fontSize: moderateScale(fontSize.FONT_24),
      lineHeight: moderateScale(28),
    },
    h3 && {
      fontSize: moderateScale(fontSize.FONT_20),
      lineHeight: moderateScale(23),
    },
    h4 && {
      fontSize: moderateScale(fontSize.FONT_18),
      lineHeight: moderateScale(20),
    },
    h5 && {
      fontSize: moderateScale(fontSize.FONT_16),
      lineHeight: moderateScale(19),
    },
    c1 && {
      fontSize: moderateScale(fontSize.FONT_12),
      lineHeight: moderateScale(18),
    },
    c2 && {
      fontSize: moderateScale(fontSize.FONT_10),
      lineHeight: moderateScale(15),
    },

    thin && {
      fontFamily: fonts.primaryThin,
    },
    light && {
      fontFamily: fonts.primaryLight,
    },
    medium && {
      fontFamily: fonts.primaryMedium,
    },
    semiBold && {
      fontFamily: fonts.primarySemiBold,
    },
    bold && {
      fontFamily: fonts.primaryBold,
    },
    extraBold && {
      fontFamily: fonts.primaryExtraBold,
    },
    fontFamily && {
      fontFamily,
    },
    //
    color && {
      color: colors[color] || color,
    },
    fontWeight && {
      fontWeight,
    },
    italic && {
      fontStyle: 'italic',
    },
    uppercase && {
      textTransform: 'uppercase',
    },

    letterSpacing && {
      letterSpacing,
    },

    style && style,
  ];

  const GradientText = props => (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={[`${colors.startColorSong}`, `${colors.endColorSong}`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );

  if (gradient) {
    return <GradientText style={styledComponent}>{children}</GradientText>;
  }

  return (
    <Text style={styledComponent} {...rest}>
      {children}
    </Text>
  );
};

Text.propTypes = {
  flex: PropTypes.number,
  m: PropTypes.number,
  mt: PropTypes.number,
  mr: PropTypes.number,
  mb: PropTypes.number,
  ml: PropTypes.number,
  mv: PropTypes.number,
  mh: PropTypes.number,
  p: PropTypes.number,
  pt: PropTypes.number,
  pr: PropTypes.number,
  pb: PropTypes.number,
  pl: PropTypes.number,
  pv: PropTypes.number,
  ph: PropTypes.number,
  h1: PropTypes.bool,
  h2: PropTypes.bool,
  h3: PropTypes.bool,
  h4: PropTypes.bool,
  h5: PropTypes.bool,
  c1: PropTypes.bool,
  c2: PropTypes.bool,
  center: PropTypes.bool,
  right: PropTypes.bool,
  left: PropTypes.bool,
  size: PropTypes.number,
  thin: PropTypes.bool,
  light: PropTypes.bool,
  medium: PropTypes.bool,
  semiBold: PropTypes.bool,
  bold: PropTypes.bool,
  fontWeight: PropTypes.string,
  extraBold: PropTypes.bool,
  italic: PropTypes.bool,
  fontFamily: PropTypes.string,
  underline: PropTypes.bool,
  uppercase: PropTypes.bool,
  letterSpacing: PropTypes.string,
  color: PropTypes.string,
  gradient: PropTypes.bool,
  children: PropTypes.node,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  textAlignCenter: PropTypes.bool,
  numberOfLines: PropTypes.number,
};

export default TextView;
