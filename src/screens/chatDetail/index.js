import React from "react";
import { Body, Header } from "@components/index";
import { useDispatch } from "react-redux";
import ChatModule from "@screens/createPost/components/ChatModules";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchMessageList } from "@modules/chat/slice";
import { useEffect } from "react";
import SvgComponent from "@assets/svg";
import Toast from "react-native-toast-message";

const ChatDetail = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const userId = route.params?.userId;
  const name = route.params?.name;
  const { goBack } = useNavigation();
  useEffect(() => {
    dispatch(
      fetchMessageList({
        data: {
          receiverId: userId,
        },
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
  }, []);
  return (
    <Body>
      <Header
        ml={16}
        mb={16}
        title={name}
        isBack={false}
        iconLeft={SvgComponent.back}
        onLeftPress={goBack}
      />
      <ChatModule userId={userId} />
    </Body>
  );
};

export default ChatDetail;
