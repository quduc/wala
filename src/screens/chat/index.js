import React from "react";
import { Body, Text, Touchable } from "@components/index";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingFetchMessageSelector,
  messengerSelector,
} from "@modules/chat/selectors";
import { useTranslation } from "react-i18next";
import keyExtractor from "@utils/keyExtractor";
import { useCallback } from "react";
import { FlatList } from "react-native";
import { useEffect } from "react";
import { fetchMessenger } from "@modules/chat/slice";
import Toast from "react-native-toast-message";
import reactotron from "reactotron-react-native";
import * as screenTypes from "@navigation/screenTypes";
import { useNavigation } from "@react-navigation/native";

const ChatScreen = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const messenger = useSelector(messengerSelector);
  const loadingMessenger = useSelector(loadingFetchMessageSelector);
  const { navigate } = useNavigation();
  reactotron.log({ messenger });

  useEffect(() => {
    dispatch(
      fetchMessenger({
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
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <Touchable
        onPress={() => {
          navigate(screenTypes.ChatDetail, {
            userId: item.id,
          });
        }}
      >
        <Text>{item.name} </Text>
      </Touchable>
    ),
    []
  );

  return (
    <Body ph={16} pt={45} loading={loadingMessenger}>
      <FlatList
        data={messenger?.items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <Text c1 center middle>
            {t("common:noData")}
          </Text>
        }
      />
    </Body>
  );
};

export default ChatScreen;
