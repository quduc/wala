import React from 'react';
import { FlatList } from 'react-native';
import Header from '@components/headerSearch';
import images from '@assets/images';
import SvgComponent from '@assets/svg';
import { Block, Image, Body } from '@components/index';
import UserItem from '../../components/UserItem';

export default function ListHosts(props) {
  return (
    <Body>
      <Header title='topFavHosts' isBack iconRightName={SvgComponent.search} />
      <Block m={16}>
        <Image
          height={120}
          borderRadius={8}
          width='100%'
          source={images.bruno}
        />
      </Block>
      <FlatList
        data={props.route.params.listHost}
        renderItem={({ item, index }) => (
          <UserItem
            item={item}
            index={index}
            iconType={props.route.params.type}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </Body>
  );
}
