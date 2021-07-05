/* eslint-disable indent */
import React, { useState, useEffect, useCallback } from "react";
import { Keyboard } from "react-native";
import {
  Text,
  Body,
  Touchable,
  Search,
  Block,
  Image,
  Icon,
  Loading,
} from "@components/index";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "@modules/user/slice";
import { fetchTotalUnReadNotification } from "@modules/notification/slice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDebounce } from "@common/customHook";
import { FlatList } from "react-native";
import {
  loadingFetchPostSelector,
  loadingLoadMoreSelector,
  postSelector,
} from "@modules/home/selectors";
import keyExtractor from "@utils/keyExtractor";
import { addLike, fetchPost, loadMorePost } from "@modules/home/slice";
import Toast from "react-native-toast-message";
import { profileSelector } from "@modules/user/selectors";
import images from "@assets/images";
import colors from "@assets/colors";
import SvgComponent from "@assets/svg";
import * as screenTypes from "@navigation/screenTypes";

export default function Home() {
  const [valueSearch, setValueSearch] = useState("");
  const { t } = useTranslation("home");
  const dispatch = useDispatch();
  const debouncedSearchTerm = useDebounce(valueSearch, 1000);
  const post = useSelector(postSelector);
  const profile = useSelector(profileSelector);
  const loading = useSelector(loadingFetchPostSelector);
  const loadingLoadMore = useSelector(loadingLoadMoreSelector);
  const { navigate } = useNavigation();
  useFocusEffect(
    useCallback(
      () => () => {
        setValueSearch("");
      },
      []
    )
  );

  useEffect(() => {
    onFetchData();
  }, []);

  const onFetchData = () => {
    dispatch(fetchProfile());
    dispatch(fetchTotalUnReadNotification());
    dispatch(
      fetchPost({
        data: {
          onError: (e) => {
            Toast.show({
              type: "error",
              props: {
                message: e.errorMessage,
              },
            });
          },
        },
      })
    );
  };

  const onAddLike = (postId) => {
    dispatch(
      addLike({
        data: {
          postId,
          onError: (e) => {
            Toast.show({
              type: "error",
              props: {
                message: e.errorMessage,
              },
            });
          },
        },
      })
    );
  };

  const _onChangeText = (value) => {
    setValueSearch(value);
  };

  const onCancel = () => {
    setValueSearch("");
    Keyboard.dismiss();
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <Touchable
        mt={32}
        onPress={() => {
          navigate(screenTypes.HomeDetailStack, {
            screen: screenTypes.PostDetail,
            params: { item },
          });
        }}
      >
        <Block row justifyBetween middle mr={16}>
          <Block row>
            <Image
              uri={item?.avatar}
              defaultImage={images.default_avatar}
              circle={44}
            />
            <Text size={18} color={colors.white} pl={8}>
              {item?.name}
            </Text>
          </Block>
          <Icon
            touchable
            onPress={() => {
              onAddLike(item.id);
            }}
            xml={
              item?.isLiked ? SvgComponent.iconLoveRedBig : SvgComponent.love
            }
          />
        </Block>
        <Text size={14} mv={8}>
          {item.title}
        </Text>
        {item?.image ? <Image uri={item?.image} height={300} /> : null}
        <Block height={1} bg={"gray"} mt={item?.image ? 32 : 16} />
      </Touchable>
    );
  });

  const onLoadMore = () => {
    if (loadingLoadMore) return;
    if (post?.items?.length === post?.total) return;
    dispatch(
      loadMorePost({
        data: {
          onError: (error) => {
            Toast.show({
              type: "error",
              props: {
                message: error.errorMessage,
              },
            });
          },
        },
      })
    );
  };

  const renderLoadMore = () =>
    loadingLoadMore ? (
      <Block center mv={10}>
        <Loading color={colors.white} />
      </Block>
    ) : null;

  return (
    <Body loading={loading} ph={16}>
      <Text size={24} bold pt={32}>
        {`Hi ${profile?.name},`}
      </Text>
      <Block row middle mt={10}>
        <Block flex={1}>
          <Search
            placeholder={t("placeholder_search")}
            height={40}
            post
            onChangeText={_onChangeText}
            value={valueSearch}
          />
        </Block>
      </Block>
      <FlatList
        data={post?.items}
        renderItem={renderItem}
        style={{ marginTop: 32 }}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text center middle mt={60} size={18}>
            {t("common:noData")}
          </Text>
        }
        onEndReachedThreshold={0.3}
        onEndReached={onLoadMore}
        ListFooterComponent={renderLoadMore}
      />
    </Body>
  );
}
