import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Block, Text, Image, Loading } from "@components/index";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessageListLoadingSelector,
  messageListSelector,
} from "@modules/chat/selectors";
import images from "@assets/images";
import { loadmoreMessageList } from "@modules/chat/slice";
import { profileSelector } from "@modules/user/selectors";
import colors from "@assets/colors";
import { MESSAGES_TYPE } from "@common/constant";
import keyExtractor from "@utils/keyExtractor";

const ListMessage = ({ roomId }) => {
  const fetchMessageListLoading = useSelector(fetchMessageListLoadingSelector);
  const messageList = useSelector(messageListSelector);
  const profile = useSelector(profileSelector);
  const dispatch = useDispatch();

  const _renderListMessageItem = ({ item }) => (
    <Block row mv={8}>
      <Image
        source={item?.sender?.avatar}
        defaultImage={images.default_avatar}
        circle={22}
        mt={2}
      />
      <Block ml={12}>
        <Text
          extraBold
          c1
          color={
            item?.sender?.name === profile.name
              ? colors.orange
              : colors.textPrimary
          }
        >
          {item?.sender?.name || ""}{" "}
          <Text medium c1>
            {" "}
            {item?.content}
          </Text>
        </Text>
      </Block>
    </Block>
  );

  return (
    <Block ph={16}>
      {fetchMessageListLoading && <Loading />}
      {!fetchMessageListLoading && (
        <FlatList
          data={messageList}
          keyExtractor={keyExtractor}
          inverted
          // onEndReached={() => {
          //   if (
          //     !loadMoreMessageListNoMore &&
          //     !loadmoreMessageListLoading &&
          //     messageList.length >= 100
          //   ) {
          //     onLoadMoreMessage();
          //   }
          // }}
          // ListFooterComponent={() =>
          //   loadmoreMessageListLoading && (
          //     <Block center mv={5}>
          //       <Loading />
          //     </Block>
          //   )
          // }
          renderItem={_renderListMessageItem}
        />
      )}
    </Block>
  );
};

export default ListMessage;
