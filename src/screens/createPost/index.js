/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-escape */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect } from "react";
import {
  Body,
  Block,
  Text,
  Touchable,
  TextInput,
  Button,
} from "@components/index";

import colors from "@assets/colors";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import i18next from "i18next";
import ImagePicker from "./components/ImagePicker";
import { useDispatch, useSelector } from "react-redux";
import { createPost, fetchPost } from "@modules/home/slice";
import { loadingCreatePostSelector } from "@modules/home/selectors";
import Toast from "react-native-toast-message";
import * as screenTypes from "@navigation/screenTypes";

const validate = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = i18next.t("message:MSG_2", {
      field: i18next.t("common:roomName"),
    });
  }

  return errors;
};

const CreatePostModal = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(["room", "comom"]);
  const [uriImage, setUriImage] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector(loadingCreatePostSelector);

  const formik = useFormik({
    initialValues: { title: "" },
    validate,
  });

  const onGoBack = () => {
    navigation.navigate(screenTypes.HomeStack);
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

  const onCreatePostRoom = () => {
    let parts;
    let image;
    if (uriImage) {
      parts = uriImage.uri.split("/");
      image = {
        uri: uriImage.uri,
        type: uriImage.type,
        name: parts[parts.length - 1],
        size: uriImage.fileSize,
      };
    }
    dispatch(
      createPost({
        data: {
          image: image || "",
          title: formik.values?.title,
        },
        onError: (e) => {
          Toast.show({
            type: "error",
            props: {
              message: e.errorMessage,
            },
          });
        },
        onSuccess: () => {
          onGoBack();
        },
      })
    );
  };

  const handleTrimWhenBlurInput = (inputName, e) => {
    formik.setFieldValue(inputName, formik.values[inputName].trim());
    formik.handleBlur(inputName)(e);
  };

  const isDisableButton = () =>
    Object.keys(formik.errors).length !== 0 || !formik.values.title;

  return (
    <Body scroll bg="transparent" loading={loading}>
      <Touchable height={120} opacity={0} onPress={onGoBack} />
      <Block
        ph={16}
        bg={colors.blackPrimary}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
      >
        <Block row mt={32} mb={24}>
          <Text medium c1 color={colors.blackPrimary} left>
            Cancel
          </Text>
          <Text bold h5 center flex={1}>
            Create New Post
          </Text>
          <Touchable onPress={onGoBack}>
            <Text medium c1 color={colors.orange} left>
              {t("txt_btn_cancel")}
            </Text>
          </Touchable>
        </Block>
        <TextInput
          height={140}
          mt={18}
          multiline
          numberOfLines={10}
          fontSize={12}
          placeholder={"Share something about this post"}
          maxLength={100}
          iconRight={
            <Block flex={1} justifyEnd ml={5}>
              <Text mb={15} medium c2 color={colors.textGrayDark}>
                {formik.values.title?.length}
                /100
              </Text>
            </Block>
          }
          value={formik.values.title}
          onChangeText={formik.handleChange("title")}
          onBlur={(e) => handleTrimWhenBlurInput("title", e)}
          error={formik.errors.title && formik.touched.title}
          errorMessage={formik.errors.title}
        />
        <ImagePicker uriImage={uriImage} setUriImage={setUriImage} />
        <Button
          height={40}
          gradient
          mt={18}
          mb={35}
          borderRadius={3}
          bg={colors.orange}
          disabled={isDisableButton()}
          onPress={onCreatePostRoom}
        >
          <Text medium c1 color={colors.white}>
            {t("txt_create")}
          </Text>
        </Button>
      </Block>
    </Body>
  );
};

export default CreatePostModal;
