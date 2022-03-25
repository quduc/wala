/* eslint-disable indent */
import React, { useState, useEffect, useCallback } from "react";
import { Keyboard, Platform } from "react-native";
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
import { FlatList, RefreshControl } from "react-native";
import {
  loadingFetchPostSelector,
  loadingLoadMoreSelector,
  postSelector,
  refreshSelector,
} from "@modules/home/selectors";
import keyExtractor from "@utils/keyExtractor";
import {
  addLike,
  fetchPost,
  loadMorePost,
  onRefresh,
} from "@modules/home/slice";
import Toast from "react-native-toast-message";
import { profileSelector } from "@modules/user/selectors";
import images from "@assets/images";
import colors from "@assets/colors";
import SvgComponent from "@assets/svg";
import * as screenTypes from "@navigation/screenTypes";
import moment from "moment";

export default function Home() {
  const { t } = useTranslation("home");
  const dispatch = useDispatch();
  const post = useSelector(postSelector);
  const profile = useSelector(profileSelector);
  const loading = useSelector(loadingFetchPostSelector);
  const loadingLoadMore = useSelector(loadingLoadMoreSelector);
  const refresh = useSelector(refreshSelector);
  const { navigate } = useNavigation();

  useEffect(() => {
    onFetchData();
  }, []);

  const onFetchData = () => {
    dispatch(fetchProfile());
    dispatch(fetchTotalUnReadNotification());
    dispatch(
      fetchPost({
        onError: (e) => {
          Toast.show({
            type: "error",
            props: {
              message: e.errorMessage,
            },
          });
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

  const onRefreshPost = () => {
    if (refresh) return;
    dispatch(
      onRefresh({
        onError: (e) => {
          Toast.show({
            type: "error",
            props: {
              message: e.errorMessage,
            },
          });
        },
      })
    );
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
            <Block>
              <Text size={16} color={colors.white} bold pl={8}>
                {item?.name}
              </Text>
              <Text size={12} color={colors.white} pl={8} medium>
                Created:{" "}
                <Text size={12} color={colors.white}>
                  {" "}
                  {moment(item?.createdAt).format("hh:mm A - DD/MM/YYYY")}{" "}
                </Text>
              </Text>
            </Block>
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
        {item?.image ? (
          <Image
            uri={
              Platform.OS !== "ios"
                ? "http://192.168.140.68:3000" + item?.image
                : "http://192.168.140.68:3000" + item?.image
            }
            height={300}
          />
        ) : null}
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

  const goListUser = () => {
    navigate(screenTypes.HomeDetailStack, {
      screen: screenTypes.ListUsers,
    });
  };

  return (
    <Body loading={loading} ph={16}>
      <Text size={24} bold pt={32}>
        {`Hi ${profile?.name},`}
      </Text>
      <Block row middle mt={10}>
        <Block flex={1} mt={16}>
          <Touchable
            onPress={goListUser}
            row
            height={56}
            borderRadius={8}
            borderWidth={1}
            middle
            borderColor={colors.gray}
            bg={colors.gray}
          >
            <Icon xml={SvgComponent.searchActive} mh={10} />
            <Text size={16} medium>
              Search all users...
            </Text>
          </Touchable>
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
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefreshPost}
            tintColor={colors.white}
          />
        }
      />
    </Body>
  );
}
