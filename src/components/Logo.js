import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const Logo = (props) => {
  return props.brand === "mastercard" ? (
    <Image
      source={{
        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1920px-Mastercard_2019_logo.svg.png",
      }}
      style={{ height: 18, width: 35, marginRight: 20 }}
    />
  ) : (
    <Image
      source={{
        uri: "https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png",
      }}
      style={{ height: 10, width: 35, marginRight: 20 }}
    />
  );
};

export default Logo;

