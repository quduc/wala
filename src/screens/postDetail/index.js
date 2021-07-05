import colors from "@assets/colors";
import SvgComponent from "@assets/svg";
import { Body, Block, Image, Text, Header, Icon } from "@components/";
import { addLike } from "@modules/home/slice";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
export default PostDetail = () => {
  const route = useRoute();
  const item = route.params?.item;
  const { goBack } = useNavigation();

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

  return (
    <>
      <Block bg={colors.bg}>
        <Header
          isBack={false}
          iconLeft={SvgComponent.back}
          onLeftPress={goBack}
          title={`Post of ${item.name}`}
        />
      </Block>
      <Body ph={16} keyboardAvoid>
        <Text size={16} mt={32} mb={16}>
          {item.title}
        </Text>
        {item?.image ? <Image uri={item?.image} height={300} /> : null}
        <Block row mt={16}>
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
      </Body>
    </>
  );
};
