/* eslint-disable indent */
/* eslint-disable function-paren-newline */
/* eslint-disable operator-linebreak */
import React, { useState, useEffect, useMemo } from "react";
import {
  Body,
  Block,
  Text,
  Header,
  Radio,
  Touchable,
  Search,
} from "@components/index";
import { FlatList } from "react-native";
import * as screenTypes from "@navigation/screenTypes";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  addListeners,
  fetchInviteList,
  inviteFriendJoinRoom,
} from "@modules/chat/slice";
import {
  inviteFriendJoinRoomLoadingSelector,
  inviteListSelector,
  listenersSelector,
} from "@modules/chat/selectors";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useDebounce, useModal } from "@common/customHook";
import ItemVertical from "./components/ItemVertical";
import ItemHorizontal from "./components/ItemHorizontal";

const AddInviteList = () => {
  const { t } = useTranslation(["room", "common"]);
  const [selectAll, setSelectAll] = useState(false);
  const [listenerIds, setListenerIds] = useState([]);
  const [searchListeners, setSearchListeners] = useState("");
  const listeners = useSelector(listenersSelector);
  const inviteList = useSelector(inviteListSelector);
  const inviteFriendJoinRoomLoading = useSelector(
    inviteFriendJoinRoomLoadingSelector
  );
  const [modal, contextHolder] = useModal();
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const debouncedSearchListeners = useDebounce(searchListeners, 300);

  const room = route.params?.room;

  useEffect(() => {
    onFetchInviteList();
  }, [debouncedSearchListeners]);

  const onFetchInviteList = () => {
    dispatch(
      fetchInviteList({
        data: {
          roomId: room?.id || "0",
        },
      })
    );
  };

  useEffect(() => {
    if (route.params?.fromScreen === screenTypes.CreateRoomScreen) {
      const listIds = listeners.map((item) => item.id);
      console.log({ listIds });
      setListenerIds(listIds);
    } else {
      dispatch(
        addListeners({
          listeners: [],
        })
      );
      setListenerIds([]);
    }
  }, [route.params?.fromScreen]);

  const listUserNotIsMember = useMemo(
    () => inviteList.filter((item) => item.isMember !== 1),
    [inviteList]
  );

  useEffect(() => {
    if (
      selectAll &&
      listenerIds &&
      listUserNotIsMember &&
      listenerIds.length !== listUserNotIsMember.length
    ) {
      setSelectAll(false);
    }
    if (
      !selectAll &&
      listenerIds &&
      listUserNotIsMember &&
      listUserNotIsMember.length !== 0 &&
      listenerIds.length === listUserNotIsMember.length
    ) {
      setSelectAll(true);
    }
  }, [listenerIds]);

  const onSelectAllListeners = () => {
    setSelectAll((PreviusSelectAll) => {
      if (!PreviusSelectAll) {
        const listIds = listUserNotIsMember.map((item) => item.id);
        setListenerIds(listIds);
        dispatch(
          addListeners({
            listeners: listUserNotIsMember,
          })
        );

        return true;
      }
      setListenerIds([]);
      dispatch(
        addListeners({
          listeners: [],
        })
      );
      return false;
    });
  };

  const onChangeListeners = (item) => {
    if (listenerIds.includes(item.id)) {
      const indexId = listenerIds.indexOf(item.id);
      const listIds = [...listenerIds];
      listIds.splice(indexId, 1);
      setListenerIds(listIds);
      const index = listeners.findIndex((elm) => elm.id === item.id);
      const list = [...listeners];
      list.splice(index, 1);
      dispatch(
        addListeners({
          listeners: list,
        })
      );
    } else {
      dispatch(
        addListeners({
          listeners: [item].concat(listeners),
        })
      );
      setListenerIds([item.id].concat(listenerIds));
    }
  };

  const onInviteRoom = () => {
    const userIds = listeners.map((item) => item.id);
    dispatch(
      inviteFriendJoinRoom({
        data: {
          roomId: room?.id,
          userIds,
        },
        onSuccess: () => {
          dispatch(
            addListeners({
              listeners: [],
            })
          );
          navigation.goBack();
        },
        onError: (e) => {
          modal.error({
            title: t("common:title_error"),
            content: e.errorMessage,
          });
        },
      })
    );
  };

  const _renderItemHorizontal = ({ item }) => (
    <ItemHorizontal
      item={item}
      key={item.id}
      listenerIds={listenerIds}
      onChangeListeners={onChangeListeners}
    />
  );

  const _renderItemVertical = (list, item, index) => (
    <ItemVertical
      key={item.id}
      item={item}
      index={index}
      onChangeListeners={onChangeListeners}
      listenerIds={listenerIds}
      list={list}
    />
  );

  return (
    <Body ph="16" loading={inviteFriendJoinRoomLoading}>
      <Block flex={1}>
        <Header title={t("txt_add_listeners")} isBack />
        <Search
          mt={20}
          placeholder={t("placeholder_search_listener")}
          value={searchListeners}
          onChangeText={setSearchListeners}
        />

        <Block
          mt={listeners.length ? 15 : 0}
          pb={listeners.length ? 12 : 0}
          borderBottom={!!listeners.length}
        >
          <FlatList
            data={listeners}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={_renderItemHorizontal}
          />
        </Block>

        {!searchListeners.length && (
          <Touchable row middle mt={20} onPress={onSelectAllListeners}>
            <Radio checked={selectAll} onPress={onSelectAllListeners} />
            <Text ml={14}>Select All</Text>
          </Touchable>
        )}

        <FlatList
          data={listUserNotIsMember}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) =>
            _renderItemVertical(listUserNotIsMember, item, index)
          }
        />
      </Block>
      {contextHolder}
    </Body>
  );
};

export default AddInviteList;
