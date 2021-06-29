import React from "react";
import { Body } from "@components/index";
import { useDispatch } from "react-redux";
import ChatModule from "@screens/room/components/ChatModules";
import { useRoute } from "@react-navigation/native";
import { fetchMessageList } from "@modules/chat/slice";
import { useEffect } from "react";

const ChatDetail = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const userId = route.params?.userId;

  useEffect(() => {
    dispatch(
      fetchMessageList({
        data: {
          receiverId: userId,
        },
      })
    );
  }, []);
  return (
    <Body ph={16} pt={45}>
      <ChatModule userId={userId} />
    </Body>
  );
};

export default ChatDetail;
