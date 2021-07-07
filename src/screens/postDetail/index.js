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
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import images from "@assets/images";
import { useModal } from "@common/customHook";
import { useTranslation } from "react-i18next";
import { Touchable } from "@components/";
import * as screenTypes from "@navigation/screenTypes";
import { profileSelector } from "@modules/user/selectors";

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
  const [isLiked, setIsLiked] = useState(false);
  const [totalLike, setTotalLike] = useState(false);
  const { navigate } = useNavigation();
  const profile = useSelector(profileSelector);

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
      setIsLiked(res.data?.isLiked);
      setTotalLike(res?.data?.totalLike);
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
        },
        onSuccess: () => {
          setIsLiked(!isLiked);
          if (isLiked) {
            setTotalLike((prev) => prev - 1);
          } else {
            setTotalLike((prev) => prev + 1);
          }
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
  };

  const goListLike = () => {
    navigate(screenTypes.HomeDetailStack, {
      screen: screenTypes.ListLike,
      params: { postId: item?.id },
    });
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
          <Touchable row middle onPress={goListLike}>
            <Icon
              touchable
              onPress={() => {
                onAddLike(item.id);
              }}
              xml={isLiked ? SvgComponent.iconLoveRedBig : SvgComponent.love}
            />
            <Text size={16} ml={8} medium underline>
              {totalLike} Like
            </Text>
          </Touchable>
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
              <Text
                bold
                size={16}
                ml={8}
                color={
                  profile?.id === item?.userId ? colors.orange : colors.white
                }
              >
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
