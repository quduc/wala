import React, { useEffect, useState } from "react";
import { Body, Block, Text, Icon, Image, Touchable } from "@components/index";
import images from "@assets/images";
import Header from "@components/header";
import { FlatList, RefreshControl } from 'react-native'
import colors from "@assets/colors";
import SvgComponent from "@assets/svg";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/core";
import * as screenTypes from "@navigation/screenTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingFetchProfileSelector,
  profileOtherSelector,
} from "@modules/profile/selectors";
import { fetchProfileOther } from "@modules/profile/slice";
import { TabStatus } from "@screens/listFriendOther";
import { addFriendApi, followFriendApi } from "@modules/user/services";
import { profileSelector } from "@modules/user/selectors";
import SmallButton from "@components/button/ButtonSmall";
import Toast from "react-native-toast-message";
import { baseApi } from "@common/baseApi";
import keyExtractor from "@utils/keyExtractor";
export default ProfileOther = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;
  const dataProfile = useSelector(profileOtherSelector);
  const loading = useSelector(loadingFetchProfileSelector);
  const userProfile = useSelector(profileSelector)
  const [data, setData] = useState([]);
  const [loadingPost, setLoadingPost] = useState(false);
  useEffect(() => {
    dispatch(
      fetchProfileOther({
        data: { userId },
      })
    );
  }, [userId]);
  useEffect(() => {
    fetchPostList();
  }, []);
  const fetchPostList = async () => {
    setLoadingPost(true);
    try {
      const res = await baseApi.get("/post", {
        limit: 10,
        offset: 0,
        userId: dataProfile?.id
        // keyword: valueSearch || "",
      });
      setData(res?.items);
    } catch (error) {
      Toast.show({
        type: "error",
        props: {
          message: error?.message,
          onClose: () => Toast.hide(),
        },
      });
    }
    setLoadingPost(false);
  };
  const goListFriend = () => {
    // navigate(screenTypes.ProfileDetailStack, {
    //   screen: screenTypes.ListFriendOther,
    //   params: { statusTab: TabStatus.Friend, userId },
    // });
  };

  const goListFollowers = () => {
    // navigate(screenTypes.ProfileDetailStack, {
    //   screen: screenTypes.ListFriendOther,
    //   params: { statusTab: TabStatus.Followers, userId },
    // });
  };

  const goListFollowing = () => {
    // navigate(screenTypes.ProfileDetailStack, {
    //   screen: screenTypes.ListFriendOther,
    //   params: { statusTab: TabStatus.Following, userId },
    // });
  };

  const goMessenger = () => {
    navigate(screenTypes.ChatStack, {
      screen: screenTypes.ChatDetail,
      params: { userId, name: dataProfile?.name },
    });
  }

  const getIconByFriendStatus = (id) => {
    switch (dataProfile?.friendStatus) {
      case "FRIEND":
        return <Icon touchable={true} xml={SvgComponent.following} mr={16} />;
      case "PENDING":
        return (
          <SmallButton
            mr={10}
            onPress={onAddFriend}
            bg={colors.gray}
            title="add"
            icon={SvgComponent.waitingAccept}
          />

        );
      default:
        return (
          <SmallButton
            mr={10}
            onPress={onAddFriend}
            bg={colors.gray}
            title="Thêm bạn"
            icon={SvgComponent.addFriend}
          />

        );
    }
  };


  const onFollowFriend = async () => {
    const data = {
      userId: dataProfile?.id,
    };
    try {
      await followFriendApi(data);
    } catch (error) {
      console.log({ error });
      Toast.show({
        type: "error",
        props: {
          message: error.errorMessage,
        },
      });
    }
  };
  const onAddFriend = async () => {
    const data = {
      userId: dataProfile?.id,
      type: "PENDING",
    };
    try {
      await addFriendApi(data);
    } catch (error) {
      console.log({ error });
      Toast.show({
        type: "error",
        props: {
          message: error.errorMessage,
        },
      });
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <Touchable mt={10}
        onPress={() => {
          navigate(screenTypes.HomeDetailStack, {
            screen: screenTypes.PostDetail,
            params: { item },
          });
        }}
      >
        <Block row justifyBetween >
          {item?.image ? (
            <Image
              uri={
                Platform.OS !== "ios"
                  ? "http://192.168.0.101:3000" + item?.image
                  : "http://192.168.0.101:3000" + item?.image
              }
              borderRadius={5}
              mr={10}
              height={80}
              width={'35%'}
            />
          ) : null}
          <Block width={'62%'}>
            <Text numberOfLines={3} fontWeight='bold' size={14} mv={3}>
              {item.title}
            </Text>
            <Text numberOfLines={3} color={'#ECECEC'} size={14} mv={3}>
              {item.description}
            </Text>
          </Block>

        </Block>
        <Block height={1} mt={10} bg={colors.gray} />
      </Touchable>
    )
  }

  return (
    <Body loading={loading}>
      <Header
        ml={16}
        title={dataProfile?.name}
        isBack={false}
        iconLeft={SvgComponent.back}
        onLeftPress={goBack}
      />
      <Block mt={16} row mh={16}>
        {dataProfile?.avatar ? (
          <Image source={{ uri: "http://192.168.0.101:3000" + dataProfile?.avatar }} circle={74} />
        ) : (
          <Image source={images.default_avatar} circle={74} />
        )}
        <Block flex={1} ml={32} ph={16}>
          <Block flex={1} row justifyBetween>
            <Touchable onPress={goListFriend}>
              <Text bold h5 center>
                {dataProfile?.numberFriend}
              </Text>
              <Text medium>{t("friends")}</Text>
            </Touchable>
            <Touchable onPress={goListFollowers}>
              <Text bold h5 center>
                {dataProfile?.queryFollowers}
              </Text>
              <Text medium>{t("followers")}</Text>
            </Touchable>
            <Touchable onPress={goListFollowing}>
              <Text bold h5 center>
                {dataProfile?.queryFollowing}
              </Text>
              <Text medium>{t("following")} </Text>
            </Touchable>
          </Block>
          <Block >
            {userProfile.id !== userId && (
              <Block row>
                {getIconByFriendStatus(userId)}
                {1 ? (
                  <SmallButton
                    onPress={onFollowFriend}
                    bg={colors.yellow}
                    title="following"
                    icon={SvgComponent.trophySmall}
                  />
                ) : (
                  <SmallButton
                    onPress={onFollowFriend}
                    bg={colors.gray}
                    title="follow"
                    icon={SvgComponent.trophySmall}
                  />
                )}
              </Block>
            )}
          </Block>
        </Block>
      </Block>

      <Text medium c1 mt={16} ph={16}>
        {dataProfile?.description}
      </Text>
      <Block row width="100%" mv={16} ph={16}>
        <Touchable
          row
          center
          flex={1}
          bg={colors.orange}
          pv={4}
          middle
          borderRadius={3}
          onPress={goMessenger}
        >
          <Text size={14} bold>
            CHAT NOW
          </Text>
        </Touchable>
      </Block>
      <FlatList
        style={{ marginHorizontal: 10 }}
        data={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={loadingPost}
            onRefresh={fetchPostList}
            tintColor={colors.white}
          />
        }
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Block center middle>
            <Text size={16} >
              {t("common:noData")}
            </Text>
          </Block>
        }
      />
    </Body>
  );
};
