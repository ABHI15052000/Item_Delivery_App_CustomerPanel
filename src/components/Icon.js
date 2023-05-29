import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesome } from "@expo/vector-icons";

const Icon = () => {
  return (
    <FontAwesome
      name="credit-card-alt"
      size={22}
      color="black"
      style={{ marginRight: 16 }}
    />
  );
}

export default Icon
