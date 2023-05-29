import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { DefaultTheme, TextInput as PaperTextInput } from "react-native-paper";

const CustomOutlinedTextInput = ({ label, width, maxLen, keyboard, padding, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginTop: 15, width: width, paddingTop: 10 }}>
      <PaperTextInput
        {...props}
        maxLength={maxLen}
        keyboardType={keyboard}
        label={isFocused ? label : label}
        mode="outlined"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        theme={{
          ...DefaultTheme,
          roundness: 10,
          colors: {
            primary: "#0C8A7B",
            text: isFocused ? "blue" : "#000000",
            background: "transparent",
            placeholder: "red",
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  
  input: {
    backgroundColor: "white",
    paddingHorizontal: 4,
    fontSize: 16,
    color: "red",
  },
});

export default CustomOutlinedTextInput;
