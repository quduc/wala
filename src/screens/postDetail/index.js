import colors from "@assets/colors";
import SvgComponent from "@assets/svg";
import { TextInput } from "@components/";
import { Body, Block, Image, Text, Header, Icon } from "@components/";
import {
  addCommentApi,
  deleteCommentApi,
  getPostDetailApi,
} from "@modules/home/services";
import { addLike } from "@modules/home/slice";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import _ from "lodash";
import images from "@assets/images";
import reactotron from "reactotron-react-native";
import { useModal } from "@common/customHook";
import { useTranslation } from "react-i18next";

export default PostDetail = () => {
  const route = useRoute();
  const item = route.params?.item;
  const { goBack } = useNavigation();
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const [listLike, setListLike] = useState([]);
  const [listComment, setListComment] = useState([]);
  const [modal, contextHolder] = useModal();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const data = {
      postId: item.id,
    };
    try {
      const res = await getPostDetailApi(data);
      setListLike(res.data?.membersLike || []);
      setListComment(res.data?.memberComment || []);
    } catch (error) {
      Toast.show({
        type: "error",
        props: {
          message: error.errorMessage,
        },
      });
    }
    setLoading(false);
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

  const onAddComment = async () => {
    const data = {
      postId: item.id,
      content: value,
    };
    try {
      const res = await addCommentApi(data);
      const _listComment = _.cloneDeep(listComment);
      const response = res?.data;
      _listComment.unshift(response);
      setListComment(_listComment);
      setValue("");
    } catch (error) {
      Toast.show({
        type: "error",
        props: {
          message: error.errorMessage,
        },
      });
    }
  };

  const removeComment = async (id) => {
    try {
      const data = {
        postId: id,
      };
      await deleteCommentApi(data);
      getData();
    } catch (error) {
      Toast.show({
        type: "error",
        props: {
          message: error.errorMessage,
        },
      });
    }
  };

  const onClose = (id) => {
    modal.normal({
      title: "Remove Comment",
      content: "Do you want remove comment?",
      okButton: () => {
        removeComment(id);
      },
    });
  };

  return (
    <>
      <Block bg={colors.bg}>
        <Header
          isBack={false}
          iconLeft={SvgComponent.back}
          onLeftPress={goBack}
          title={`Post of ${item.name}`}
          ml={16}
        />
      </Block>
      <Body ph={16} keyboardAvoid loading={loading}>
        <Text size={16} mt={32} mb={16}>
          {item.title}
        </Text>
        {item?.image ? <Image uri={item?.image} height={300} /> : null}
        <Block row mt={16} justifyBetween mb={16}>
          <Block row middle>
            <Icon
              touchable
              onPress={() => {
                onAddLike(item.id);
              }}
              xml={
                item?.isLiked ? SvgComponent.iconLoveRedBig : SvgComponent.love
              }
            />
            <Text size={16} ml={8} medium>
              {listLike?.length}
            </Text>
          </Block>
          <Text size={16} medium>
            {listComment?.length} comments
          </Text>
        </Block>
        {_.map(listComment, (item, index) => (
          <Block key={index} row mh={16} mt={16} middle justifyBetween>
            <Block row middle>
              <Image
                uri={item?.avatar}
                defaultImage={images.default_avatar}
                circle={30}
              />
              <Text bold size={16} ml={8}>
                {`${item?.name} :`}
              </Text>
              <Text size={16}>
                {"  "}
                {item?.content}
              </Text>
            </Block>
            <Icon
              touchable
              xml={SvgComponent.close}
              onPress={() => onClose(item?.id)}
            />
          </Block>
        ))}
        <TextInput
          mt={32}
          placeholder="Add comment"
          maxLength={300}
          height={40}
          value={value}
          onChangeText={(value) => setValue(value)}
          iconRight={
            <Icon
              touchable
              xml={SvgComponent.sendIcon}
              onPress={onAddComment}
              disabled={false}
            />
          }
        />
        <Block height={60} />
      </Body>
      {contextHolder}
    </>
  );
};
