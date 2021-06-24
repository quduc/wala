/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import HeaderSearch from '@components/headerSearch';
import SvgComponent from '@assets/svg';
import { verticalScale } from '@common/scale';
import { Body, Text } from '@components/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserLoadingSelector,
  fetchUserSelector,
} from '@modules/user/selectors';
import { fetchUser, fetchUserSucceeded } from '@modules/user/slice';
import { useRoute } from '@react-navigation/core';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@common/customHook';
import UserItem from '../../components/UserItem';

export default function ListUser() {
  const [valueSearch, setValueSearch] = useState('');
  const loadingSongs = useSelector(fetchUserLoadingSelector);
  const { t } = useTranslation(['common', 'translation']);
  const dispatch = useDispatch();
  const route = useRoute();
  const { type, iconType, title } = route.params;
  const debouncedSearchTerm = useDebounce(valueSearch, 300);
  const listUser = useSelector(fetchUserSelector);
  const [listUserSearch, setListUserSearch] = useState([]);

  useEffect(() => {
    onFetchUser();
  }, []);

  useEffect(() => {
    searchUser();
  }, [debouncedSearchTerm]);

  const onChangeText = value => {
    setValueSearch(value);
  };

  const onFetchUser = () => {
    dispatch(
      fetchUser({
        data: { type },
        onSuccess: res => {
          setListUserSearch(res.data);
        },
        onError: e => {
          Toast.show({
            type: 'error',
            props: {
              message: e.errorMessage,
            },
          });
        },
      }),
    );
  };

  const searchUser = () => {
    const newList = listUserSearch.filter(item =>
      item.name.toLowerCase().includes(valueSearch.toLowerCase().trim()),
    );

    dispatch(
      fetchUserSucceeded({
        data: newList,
      }),
    );
  };

  return (
    <Body loading={loadingSongs}>
      <HeaderSearch
        title={title}
        isBack
        iconRightName={SvgComponent.search}
        onChangeText={onChangeText}
        value={valueSearch}
        onClose={() => setValueSearch('')}
      />
      <FlatList
        style={{ marginTop: verticalScale(16) }}
        data={listUser}
        renderItem={({ item, index }) => (
          <UserItem
            item={item}
            index={index}
            iconType={iconType}
            userType={type}
            valueSearch={valueSearch}
          />
        )}
        refreshing={loadingSongs}
        onRefresh={onFetchUser}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text c1 center middle>
            {t('common:noData')}
          </Text>
        }
      />
    </Body>
  );
}
