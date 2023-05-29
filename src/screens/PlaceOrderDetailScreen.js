import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { TextInput, DefaultTheme } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
// import { useRoute } from "@react-navigation/native";
import { Keyboard } from "react-native";
import Titlebar from "../components/TitileBar";
import Buttons from "../components/Button";
import { api } from "../../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import CheckInternet from "../components/CheckInternet";

const PlaceOrderDetailScreen = ({ route }) => {
  const { instruction, pickUp, deliverTo, checkedItems, tokenId } =
    route.params;
  const [isFocused, setIsFocused] = useState(false);
  const [taskdetails, setTaskdetails] = useState();
  const [authToken, setAuthToken] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [distanceFee, setDistanceFee] = useState("");
  const [distance, setDistance] = useState("");
  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });
  const handleFocus = () => {
    Keyboard.dismiss();
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  const gettaskDetails = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };
    try {
      const response = await fetch(api + "taskdetails", requestOptions);
      // console.log(JSON.stringify(response));
      const json = await response.json();
      setDistanceFee(json.taskupdate.additional_charge);
      setLoading(false);
      setDistance(json.taskupdate.distance_km);
      setTaskdetails(json.taskupdate);
      setPrice(json.taskupdate.billing_details);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    gettaskDetails();
    // console.log(price);
  }, [authToken, tokenId]);

  const MapImage = require("../../assets/MapImage.png");
  // const route = useRoute();
  // const tokenId = route.params?.tokenId;
  // console.log("=====TokenId====", tokenId);
  // const instruction = route.params?.instruction;
  // const pickUp = route.params?.pickUp;
  // const deliverTo = route.params?.deliverTo;
  // const checkedItems = route.params?.checkedItems;

  return (
    <>
      {loading ? (
        <ActivityIndicator
          color={"black"}
          size={24}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <>
          <View
            style={{
              width: "100%",
              marginTop: 10,
              backgroundColor: "white",
              alignSelf: "center",
              paddingHorizontal: "5%",
            }}
          >
            <Titlebar title={"Order Details"} />
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={{
                backgroundColor: "white",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View style={{ marginTop: "1%", width: "92%" }}>
                <TextInput
                  label="Pickup from"
                  mode="outlined"
                  value={pickUp}
                  editable={false}
                  multiline
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <EvilIcons name="location" size={24} color="black" />
                      )}
                    />
                  }
                  theme={{
                    ...DefaultTheme,
                    roundness: 10,
                    colors: { primary: "#0C8A7B", background: "black" },
                  }}
                  style={{
                    backgroundColor: "white",
                    borderColor: isFocused ? "#0C8A7B" : "#808080",
                    color: "black",
                  }}
                />
              </View>
              <View style={{ marginTop: 15, width: "92%" }}>
                <TextInput
                  label="Deliver to"
                  mode="outlined"
                  value={deliverTo}
                  editable={false}
                  multiline
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <Entypo name="location-pin" size={24} color="orange" />
                      )}
                    />
                  }
                  theme={{
                    ...DefaultTheme,
                    roundness: 10,
                    colors: { primary: "#0C8A7B", background: "black" },
                  }}
                  style={{
                    backgroundColor: "white",
                    borderColor: isFocused ? "#0C8A7B" : "#808080",
                    color: "black",
                  }}
                />
              </View>
              <View
                style={{
                  padding: 10,
                  flexWrap: "wrap",
                  marginTop: 15,
                  backgroundColor: "white",
                  borderRadius: 8,
                  width: "91%",
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    // marginTop: 10,
                    // marginBottom: 5,
                    fontWeight: "400",
                    fontSize: 14,
                    fontFamily: "Montserrat_400Regular",
                  }}
                >
                  Item Type :
                </Text>
                <Text
                  style={{
                    flexWrap: "wrap",
                    fontFamily: "Montserrat_400Regular",
                  }}
                >
                  {checkedItems.join(",  ")}
                </Text>
              </View>
              <View
                style={{
                  width: "90%",
                  // height: 125,
                  paddingVertical: 10,
                  borderWidth: 1,
                  marginTop: 15,
                  borderRadius: 8,
                  borderColor: "#D8D6D4",
                }}
              >
                <View style={{ marginTop: 13, marginLeft: 16 }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat_600SemiBold",
                      fontSize: 14,
                    }}
                  >
                    Billing Details
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      marginLeft: 16,
                      marginTop: 10,
                      borderStyle: "dotted",
                      borderColor: "#B4B4B4",
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: 3,
                        color: "#0AB7EE",
                        fontWeight: "500",
                        fontSize: 10,
                        fontFamily: "Montserrat_400Regular",
                      }}
                    >
                      Delievery fee for {distance} km
                    </Text>
                  </View>
                  <View
                    style={{ marginTop: 16, position: "absolute", right: 25 }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 14,
                        fontFamily: "Montserrat_600SemiBold",
                      }}
                    >
                      ${distanceFee}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    marginTop: 16,
                    marginLeft: 16,
                    marginRight: 16,
                    borderColor: "#B4B4B4",
                  }}
                ></View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ marginLeft: 16, marginTop: 14 }}>
                    <Text
                      style={{
                        fontFamily: "Montserrat_600SemiBold",
                        fontSize: 14,
                      }}
                    >
                      To Pay
                    </Text>
                  </View>
                  <View
                    style={{ marginTop: 14, position: "absolute", right: 25 }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_600SemiBold",
                        fontSize: 14,
                      }}
                    >
                      $ {price}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 14, alignItems: "center" }}>
                <Image
                  style={{ width: 370, height: 130, borderRadius: 15 }}
                  source={MapImage}
                />
              </View>
              <View
                style={{
                  marginTop: 15,
                  backgroundColor: "white",
                  borderRadius: 8,
                  width: "90%",
                  alignSelf: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 4,
                }}
              >
                <View style={{ marginTop: 13, marginLeft: 15 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Montserrat_600SemiBold",
                    }}
                  >
                    Instruction
                  </Text>
                </View>
                <View style={{ marginTop: 5, marginLeft: 15, marginBottom: 5 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_400Regular",
                    }}
                  >
                    {instruction}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: "auto",
                  paddingVertical: 10,
                  width: "90%",
                }}
              >
                <Buttons
                  Name={"Payment"}
                  press={"Pay"}
                  tokenId={tokenId}
                  price={price}
                  distance={distance}
                />
              </View>
            </View>
            <CheckInternet />
          </ScrollView>
        </>
      )}
    </>
  );
};

export default PlaceOrderDetailScreen;

const styles = StyleSheet.create({});
