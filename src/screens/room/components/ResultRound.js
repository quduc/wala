import React from 'react';
import colors from '@assets/colors';
import { useTranslation } from 'react-i18next';
function ListSongs({ result }) {
  const { t } = useTranslation(['room']);
  return <Body bg={colors.blackPrimary} mt={16} mh={-16}></Body>;
}

export default React.memo(ListSongs);
