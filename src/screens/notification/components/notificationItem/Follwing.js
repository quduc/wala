/* eslint-disable react/jsx-one-expression-per-line */
import React, { memo } from 'react';
import { Block, Text } from '@components/index';

// TODO Do it later
const Follwing = ({ item }) => (
  //   const dispatch = useDispatch();
  //   const [isFollow, setIsFollow] = useState(false);

  //   const { t } = useTranslation(['common']);

  //   const onFollowFriend = () => {
  //     setIsFollow(!isFollow);
  //     dispatch(
  //       followFriend({
  //         data: {
  //           userId: item.senderId,
  //         },
  //         onError: e => {
  //           Toast.show({
  //             type: 'error',
  //             props: {
  //               message: e.errorMessage,
  //             },
  //           });
  //         },
  //       }),
  //     );
  //   };

  <Block flex={1} row>
    <Text flex={1} medium c1>
      <Text extraBold>{item?.body} </Text>
      {/* <Text>followed you </Text> */}
    </Text>
    {/* <Button
        width={70}
        height={20}
        center
        middle
        borderRadius={3}
        onPress={onFollowFriend}
        bg={isFollow ? colors.gray : colors.yellow}>
        <Text medium c1>
          {isFollow ? t('txt_follow') : t('txt_following')}
        </Text>
      </Button> */}
  </Block>
);
export default memo(Follwing);
