import React, { useState, useEffect } from "react";
import { Body, Text, Touchable } from "@components/index";
import Header from "@components/header";
import colors from "@assets/colors";
import { INTERSTITIAL_ID } from "@common/constant";

export default function TermOfUse() {
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  useEffect(() => {}, []);

  return (
    <Body scroll ph={16}>
      <Header title="term" />
      <Text medium c1>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
        elementum enim feugiat nunc, mauris mauris neque blandit ante. Faucibus
      </Text>
      <Touchable
        disabled={!interstitialLoaded}
        middle
        bg={interstitialLoaded ? "orange" : "gray"}
        p={8}
        onPress={() => {}}
      >
        <Text color={colors.white}>SHOW QUANG CAO</Text>
      </Touchable>
    </Body>
  );
}
