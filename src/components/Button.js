import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export const Button = (props) => {
  const { onPress, bg = "black", width = "100%", title = "Save" } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button} width={width} backgroundColor={bg}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const BorderButton = (props) => {
  const { onPress, bg = "black", width = "100%", title = "Save" } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.borderbutton} width={width} backgroundColor={bg}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
export const WhiteButton = (props) => {
  const { onPress, bg = "black", width = "100%", title = "Save" } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.whiteButton} width={width} backgroundColor={bg}>
        <Text style={styles.whitetext}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const WButton = (props) => {
  const {
    onPress,
    bg = "white",
    width = "30%",
    title = "Book Now",
    borderWidth = 1,
    borderColor = "white",
    borderRadius = 50,
    color = "#0C8A7B",
  } = props;
  return (
    <TouchableOpacity onPress={onPress} style={{ marginTop: 20 }}>
      <View
        style={styles.wbutton}
        backgroundColor={bg}
        width={width}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius={borderRadius}
        color={color}
      >
        <Text style={styles.wtext} color={color}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export const PickButton = (props) => {
  const {
    onPress,
    bg = "white",
    width = "99%",
    title = "Set Pick Up & Drop Location",
    borderWidth = 1,
    borderColor = "white",
    borderRadius = 50,
    color = "#0C8A7B",
  } = props;
  return (
    <TouchableOpacity onPress={onPress} style={{ marginTop: 20 }}>
      <View
        style={styles.Pbutton}
        backgroundColor={bg}
        width={width}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius={borderRadius}
        color={color}
      >
        <Text style={styles.Ptext} color={color}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export const BlackButton = (props) => {
  const {
    onPress,
    bg = "black",
    width = "100%",
    title = "Save",
    borderWidth = 1,
    borderColor = "white",
    borderRadius = 50,
    color = "#0C8A7B",
  } = props;
  return (
    <TouchableOpacity onPress={onPress} style={{ marginTop: 20 }}>
      <View
        style={styles.blackbutton}
        backgroundColor={bg}
        width={width}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius={borderRadius}
        color={color}
      >
        <Text style={styles.blacktext} color={color}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const GreenButton = (props) => {
  const {
    onPress,
    bg = "#E6FAEE",
    width = "100%",
    title = "Accept    ",
    borderWidth = 1,
    borderColor = "white",
    borderRadius = 50,
    color = "#0C8A7B",
    marginRight,
    margin,
  } = props;
  return (
    <TouchableOpacity onPress={onPress} style={{ marginTop: 20 }}>
      <View
        style={styles.Gbutton}
        backgroundColor={bg}
        width={width}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius={borderRadius}
        color={color}
        marginRight={marginRight}
        margin={margin}
      >
        <Text style={styles.Gtext} color={color}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export const RedButton = (props) => {
  const {
    onPress,
    bg = "#ffe6e6",
    width = "100%",
    title = "    Reject     ",
    borderWidth = 1,
    borderColor = "white",
    borderRadius = 50,
    color = "#0C8A7B",
  } = props;
  return (
    <TouchableOpacity onPress={onPress} style={{ marginTop: 20 }}>
      <View
        style={styles.Rbutton}
        backgroundColor={bg}
        width={width}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius={borderRadius}
        color={color}
      >
        <Text style={styles.Rtext} color={color}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Buttons = (props) => {
  const navigation = useNavigation();
  const tokenId = props.tokenId;
  const price = props.price;
  const distance = props.distance;

  // console.log("-----", tokenId);
  return (
    <View>
      <View>
        <TouchableOpacity
          style={{
            height: 52,
            backgroundColor: "black",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() =>
            navigation.navigate(props.press, { tokenId, price, distance })
          }
        >
          <Text style={{ color: "white", fontFamily: "Montserrat_400Regular" }}>
            {props.Name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: "8%",
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    textAlign: "center",
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
  },
  borderbutton: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: "12%",
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    borderColor: "#fff",
  },
  whiteButton: {
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: "12%",
    borderRadius: 8,
    alignItems: "center",
  },
  whitetext: {
    color: "#0C8A7B",
    fontFamily: "Montserrat_400Regular",
  },
  blacktext: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    textAlign: "center",
    color: "white",
    fontFamily: "Montserrat_500Medium",
  },
  blackbutton: {
    marginTop: "auto",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    // elevation: 3,
  },
  wbutton: {
    // marginTop:"auto",
    // justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 8,
    // elevation: 3,
  },
  wtext: {
    fontSize: 12,
    // lineHeight: 21,
    letterSpacing: 0.25,
    // fontWeight:"bold",
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
    color: "#0C8A7B",
  },
  Pbutton: {
    marginTop: "auto",
    justifyContent: "center",
    borderColor: "#0C8A7B",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    // elevation: 1,
    marginBottom: 8,
  },
  Ptext: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.25,
    // fontWeight:"bold",
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    color: "#0C8A7B",
  },
  Gbutton: {
    marginTop: "auto",
    justifyContent: "center",
    borderColor: "#E6FAEE",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    // elevation: 1,
    marginBottom: 8,
    // marginRight:40
  },
  Gtext: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.25,

    fontWeight: "bold",
    textAlign: "center",
    color: "#00C853",
  },
  Rbutton: {
    marginTop: "auto",
    justifyContent: "center",
    borderColor: "#ffe6e6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    // elevation: 1,
    marginBottom: 8,
  },
  Rtext: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FF1515",
  },
});
