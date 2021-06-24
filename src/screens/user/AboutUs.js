import React from 'react';
import { TextInput } from 'react-native';
import { Body, Text, Button, Block } from '@components/index';
import { useTranslation } from 'react-i18next';
import Header from '@components/header';
import colors from '@assets/colors';

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <Body scroll ph={16}>
      <Header title='aboutUs' />
      <Text>{t('plsCopyLinkToInvite')}</Text>
      <Block row width='100%' mt={16}>
        <TextInput
          style={{
            width: '70%',
            paddingVertical: 10,
            paddingLeft: 16,
            backgroundColor: colors.gray,
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            color: 'white',
          }}
          value='rockwars.appstore//.com'

        />
        <Button width={90} gradient pv={10} ph={16} bbrr={10} btrr={10}>
          <Text>{t('copy')}</Text>
        </Button>
      </Block>
      <Text mt={24} c1 medium>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor elementum enim feugiat nunc, mauris mauris neque blandit ante. Faucibus proin donec orci et convallis id consectetur. Sit risus dolor est rhoncus laoreet ultrices integer. Tempus, vulputate in gravida nibh imperdiet ut commodo. Pulvinar ante massa, ut faucibus non mattis. Faucibus tellus faucibus felis volutpat morbi sit mi. Tempor sed sed non at a adipiscing ornare. Eleifend gravida purus elit, cursus morbi. Etiam ornare interdum elementum massa proin arcu. Amet, in adipiscing erat quis egestas scelerisque risus. Elit laoreet consectetur dictumst aliquam lacus, ultrices elementum in.</Text>
    </Body>
  );
}
