import React, { useRef } from "react";
import { Block, Icon, Image, Text, Touchable } from "@components/index";
import images from "@assets/images";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import SvgComponent from "@assets/svg";
import SmallButton from "@components/button/ButtonSmall";
import colors from "@assets/colors";
import { followFriend, addFriend } from "@modules/user/slice";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "@common/customHook";
import { kickMemberSocket } from "@modules/chat/socket";
import { SocketIoSelector } from "@modules/home/selectors";
import Swipeable from "react-native-swipeable";
import { profileSelector } from "@modules/user/selectors";
function FriendItem({ item, room }) {
  const profile = useSelector(profileSelector);
  const { t } = useTranslation(["common", "room"]);
  const dispatch = useDispatch();
  const [modal, contextHolder] = useModal();
  const isHost = profile.id === room?.hostId;
  const socketIo = useSelector(SocketIoSelector);
  const swipeable = useRef(null);
  const getIconByFriendStatus = () => {
    switch (item.friendStatus) {
      case "FRIEND":
        return (
          <Icon
            touchable={item.requestDisable !== "1"}
            xml={SvgComponent.following}
            mr={16}
          />
        );
      case "PENDING":
        return (
          <Icon
            onPress={() => onAddFriend("PENDING")}
            touchable={item.requestDisable !== "1"}
            xml={SvgComponent.waitingAccept}
            mr={16}
          />
        );
      default:
        return (
          <Icon
            onPress={() => onAddFriend("NOTHING")}
            touchable={item.requestDisable !== "1"}
            xml={SvgComponent.addFriend}
            mr={16}
          />
        );
    }
  };
  const onFollowFriend = () => {
    dispatch(
      followFriend({
        data: {
          userId: item.id,
          roomId: room.id,
        },
        onError: (error) => {
          modal.error({
            title: t("common:title_error"),
            content: error.errorMessage,
          });
        },
      })
    );
  };
  const onAddFriend = () => {
    dispatch(
      addFriend({
        data: {
          userId: item.id,
          type: "PENDING",
          roomId: room.id,
        },
        onError: (error) => {
          modal.error({
            title: t("common:title_error"),
            content: error.errorMessage,
          });
        },
      })
    );
  };

  const kickMember = () => {
    kickMemberSocket(socketIo, room?.id, [item.id]);
    swipeable.current.recenter();
  };

  const removeUser = () => {
    modal.normal({
      title: t("room:removeUser"),
      content: t("room:doYouWantToRemoveUser", { name: item?.name }),
      okButton: () => {
        kickMember();
      },
    });
  };

  const rightButtons = [
    <Touchable
      mv={8}
      ml={16}
      onPress={removeUser}
      bg={colors.gray}
      width={45}
      height={50}
      borderRadius={10}
      middle
      center
    >
      <Icon xml={SvgComponent.deleteIcon} />
    </Touchable>,
  ];
  return (
    <Swipeable
      rightButtons={isHost ? rightButtons : null}
      onRef={(ref) => (swipeable.current = ref)}
    >
      <Block row mt={16} middle>
        <Image
          circle={44}
          uri={item?.avatar}
          defaultImage={images.default_avatar}
        />
        <Text flex={1} ml={16} c1 extraBold>
          {item?.name || ""}
        </Text>
        {getIconByFriendStatus()}
        {item.isFollowed === 1 ? (
          <SmallButton
            onPress={onFollowFriend}
            bg={colors.yellow}
            title="following"
            icon={SvgComponent.trophySmall}
          />
        ) : (
          <SmallButton
            onPress={onFollowFriend}
            bg={colors.gray}
            title="follow"
            icon={SvgComponent.trophySmall}
          />
        )}
        {contextHolder}
      </Block>
    </Swipeable>
  );
}
FriendItem.propTypes = {
  item: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
};
FriendItem.defaultProps = {
  item: {},
  room: {},
};
export default React.memo(FriendItem);
