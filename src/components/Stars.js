import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Stars = (props) => {
  const starsArray = [];
  for (let i = 0; i < props.numberOfStars; i++) {
    starsArray.push(
      <Ionicons key={i} name="md-star" size={props.size} color="#EAC92C" />
    );
  }
  for (let i = 0; i < props.maxStars - props.numberOfStars; i++) {
    starsArray.push(
      <Ionicons
        key={i + props.numberOfStars}
        name="md-star"
        size={props.size}
        color="#c5c6d0"
      />
    );
  }
  return <View style={{ flexDirection: "row",}}>{starsArray}</View>;
};

export default Stars;
