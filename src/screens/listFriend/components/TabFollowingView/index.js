/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-curly-brace-presence */
import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Block, Image, Loading, Text } from '@components/index';
import colors from '@assets/colors';
import { useTranslation } from 'react-i18next';
import Search from '@components/search';
import SvgComponent from '@assets/svg';
import SmallButton from '@components/button/ButtonSmall';
import keyExtractor from '@utils/keyExtractor';
import { useModal } from '@common/customHook';
import { fetchProfile, followFriend } from '@modules/user/slice';
import FriendItem from '@screens/user/item/FriendItem';
import { useDispatch } from 'react-redux';

export default TabFollowingView = ({
  data,
  loading,
  onLoadMore,
  refresh,
  onRefresh,
  searchText,
  setSearchText,
  loadingLoadMore,
  onSuccess,
  currentId,
}) => {
  const { t } = useTranslation();
  const [modal, contextHolder] = useModal();
  const dispatch = useDispatch();

  const renderItem = useCallback(({ item }) => {
    if (currentId === item.friend?.id) {
      return (
        <Block row mt={16} middle>
          <Image circle={44} source={{ uri: "http://192.168.0.101:3000" + item?.friend?.avatar }} />
          <Text flex={1} ml={16} c1 extraBold>
            {item.friend?.name}
          </Text>
        </Block>
      );
    }
    return (
      <FriendItem
        item={item?.friend}
        rightAction={
          <Block row>
            <SmallButton
              bg={colors.yellow}
              title={t('following')}
              icon={SvgComponent.trophySmall}
              onPress={() =>
                dispatch(
                  followFriend({
                    data: {
                      userId: item?.friend?.id,
                    },
                    onSuccess: () => {
                      onSuccess && onSuccess();
                      dispatch(fetchProfile());
                    },
                    onError: error => {
                      modal.error({
                        title: t('common:title_error'),
                        content: error.errorMessage,
                      });
                    },
                  }),
                )
              }
            />
          </Block>
        }
      />
    );
  }, []);

  const renderLoadMore = () =>
    loadingLoadMore ? (
      <Block center mv={10}>
        <Loading color={colors.white} />
      </Block>
    ) : null;

  const renderNoData = () => (
    <Block center middle mt={64}>
      <Text color={colors.white} size={16}>
        Không có dữ liệu
      </Text>
    </Block>
  );

  return (
    <>
      <Block pt={16} loading={loading}>
        <Search
          placeholder={t('search')}
          onChangeText={setSearchText}
          value={searchText}
        />
      </Block>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}
            tintColor={colors.white}
          />
        }
        onEndReachedThreshold={0.3}
        onEndReached={onLoadMore}
        ListFooterComponent={renderLoadMore}
        ListEmptyComponent={renderNoData}
        showsVerticalScrollIndicator={false}
      />
      {contextHolder}
    </>
  );
};
