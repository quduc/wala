/* eslint-disable indent */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Keyboard } from "react-native";
import { Text, Body, Touchable, Search, Block } from "@components/index";
import { useTranslation } from "react-i18next";
import { LIST_TAB } from "@common/constant/index";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, fetchUserSucceeded } from "@modules/user/slice";
import { fetchTotalUnReadNotification } from "@modules/notification/slice";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { useDebounce } from "@common/customHook";
import TabUser from "./tabUser";
import TabHost from "./tabHost";
import SearchData from "./components/SearchData";

const mapTabNameToview = {
  users: <TabUser />,
  host: <TabHost />,
};

export default function Home() {
  const [valueSearch, setValueSearch] = useState("");
  const { t } = useTranslation("home");
  const dispatch = useDispatch();
  const [tabName, setTabName] = useState(LIST_TAB[0].title);
  const route = useRoute();
  const debouncedSearchTerm = useDebounce(valueSearch, 1000);
  const childRef = useRef();

  useFocusEffect(
    useCallback(
      () => () => {
        setValueSearch("");
      },
      []
    )
  );

  useEffect(() => {
    !!valueSearch && childRef.current.onSearch();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    onFetchData();
    if (route?.params?.tabName) {
      setTabName(route?.params?.tabName);
    }
  }, [route.params?.tabName]);

  const onFetchData = () => {
    dispatch(fetchProfile());
    dispatch(fetchTotalUnReadNotification());
  };

  const onChangeTab = (value) => {
    setTabName(value);
  };

  const _onChangeText = (value) => {
    setValueSearch(value);
  };

  const onCancel = () => {
    setValueSearch("");
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (!valueSearch) {
      if (tabName === "users") {
        dispatch(fetchUserSucceeded({ data: [] }));
      }
    }
  }, [valueSearch]);

  return (
    <Body pl={16} loading={false}>
      <Block row middle mt={10}>
        <Block flex={1}>
          <Search
            placeholder={t("placeholder_search")}
            mr={16}
            height={40}
            onChangeText={_onChangeText}
            value={valueSearch}
          />
        </Block>

        {!!valueSearch && (
          <Touchable medium c1 mr={16} onPress={onCancel}>
            <Text>{t("cancel")}</Text>
          </Touchable>
        )}
      </Block>
      <SearchData
        tabName={tabName}
        valueSearch={valueSearch?.trim()}
        onCancel={onCancel}
        ref={childRef}
      />
    </Body>
  );
}
