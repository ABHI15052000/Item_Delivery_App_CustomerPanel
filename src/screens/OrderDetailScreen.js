import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Container } from "../styles/styles";
import { Header } from "../components/Header";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import Titlebar from "../components/TitileBar";
import CheckInternet from "../components/CheckInternet";

export const OrderDetailScreen = ({ route }) => {
  const {
    orderId,
    item_type,
    Pickup_from,
    Deliver_To,
    Billing_Details,
    status,
    user_id,
    timing,
    pickup_latitude,
    pickup_longitude,
    delivery_latitude,
    delivery_longitude,
    driver_id,
    distance,
    completed_timing,
    addtional_charge,
  } = route.params;
  const navigation = useNavigation();
  return (
    <View marginTop={10} flex={1}>
      <View marginHorizontal="5%">
        <Titlebar title="Order Detail" />
      </View>
      {/* <Header title="Order details" /> */}
      <View paddingHorizontal={25} marginVertical={20}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: "#8E8EA1",
              fontWeight: 600,
              fontFamily: "Montserrat_600SemiBold",
            }}
          >
            Order #{orderId}{" "}
          </Text>
          {status === "Accepted" && (
            <Text style={styles.statusTextAccepted}>{status}</Text>
          )}
          {status === "Completed" && (
            <Text style={styles.statusTextCompleted}>{status}</Text>
          )}
          {status === "Cancelled" && (
            <Text style={styles.statusTextCancelled}>{status}</Text>
          )}
          {status === "Pending" && (
            <Text style={styles.statusText}>{status}</Text>
          )}
        </View>
        <Text style={{ fontFamily: "Montserrat_400Regular" }}>
          Item Type:{" "}
          <Text
            style={{
              fontWeight: 600,
              lineHeight: 20,
              fontFamily: "Montserrat_600SemiBold",
            }}
          >
            {item_type}
          </Text>
        </Text>

        <View style={{ marginLeft: -6, marginTop: 8, flexDirection: "row" }}>
          <Entypo name="location-pin" size={24} color="#BFBFBF" />
          <Text
            style={{
              color: "#8E8EA1",
              fontSize: 12,
              fontFamily: "Montserrat_400Regular",
              flexWrap: "wrap",
              maxWidth: "90%",
            }}
          >
            {Pickup_from}
          </Text>
        </View>
        <View marginBottom={10} marginLeft={18}>
          <Text
            style={{
              color: "#8E8EA1",
              fontSize: 12,
              fontFamily: "Montserrat_400Regular",
            }}
          >
            {timing}
          </Text>
        </View>

        <View style={{ marginLeft: -6, marginTop: 8, flexDirection: "row" }}>
          <Entypo name="location-pin" size={24} color="#FF9C1C" />
          <Text
            style={{
              color: "#8E8EA1",
              fontSize: 12,
              fontFamily: "Montserrat_400Regular",
              flexWrap: "wrap",
              maxWidth: "90%",
            }}
          >
            {Deliver_To}
          </Text>
        </View>

        <View marginBottom={10} marginLeft={18}>
          <Text
            style={{
              color: "#8E8EA1",
              fontSize: 12,
              fontFamily: "Montserrat_400Regular",
            }}
          >
            {completed_timing}
          </Text>
        </View>
      </View>
      <View paddingHorizontal={10}>
        <View style={styles.billing}>
          <Text style={{ fontFamily: "Montserrat_400Regular" }}>
            Billing Detials
          </Text>
          <View style={styles.flex}>
            <Text
              style={{
                borderBottomWidth: 1,
                fontFamily: "Montserrat_400Regular",
                borderStyle: "dashed",
                color: "#0AB7EE",
                borderColor: "#B4B4B4",
              }}
            >
              Delivery fee for {distance} km
            </Text>
            <Text style={{ fontFamily: "Montserrat_600SemiBold" }}>
              $ {addtional_charge}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "#B4B4B4" }} />
          </View>
          <View style={styles.flex}>
            <Text style={{ fontFamily: "Montserrat_600SemiBold" }}>Paid</Text>
            <Text style={{ fontFamily: "Montserrat_600SemiBold" }}>
              $ {Billing_Details}
            </Text>
          </View>
        </View>
      </View>

      {status === "Accepted" ? (
        <View
          padding={16}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <Button
            title="Track Order"
            bg="#0C8A7B"
            onPress={() => {
              navigation.navigate("TrackOrder", {
                driver_orderId: orderId,
                Pickup_from,
                Deliver_To,
                user_id,
                pickup_latitude,
                pickup_longitude,
                delivery_latitude,
                delivery_longitude,
                driver_id,
                distance,
              });
            }}
          />
          <Button
            title="Chat Now"
            onPress={() => {
              navigation.navigate("Chat", {
                orderId,
                item_type,
                Pickup_from,
                Deliver_To,
                Billing_Details,
                status,
                user_id,
              });
            }}
          />
        </View>
      ) : (
        <View marginTop="auto" padding={16}>
          <Button
            title="Chat"
            onPress={() => {
              navigation.navigate("Chat", {
                orderId,
                item_type,
                Pickup_from,
                Deliver_To,
                Billing_Details,
                status,
                user_id,
              });
            }}
          />
        </View>
      )}
      <CheckInternet />
    </View>
  );
};

const styles = StyleSheet.create({
  location: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusText: {
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "#e3e3e8",
    color: "#8E8EA1",
    fontWeight: 600,
    borderRadius: 15,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  statusTextAccepted: {
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "#FFF6E7",
    color: "#FF9C1C",
    fontWeight: 600,
    borderRadius: 15,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  statusTextCompleted: {
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "#E6FAEE",
    color: "#00C853",
    fontWeight: 600,
    borderRadius: 15,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  statusTextCancelled: {
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "#FF151514",
    color: "#FF4A55",
    fontWeight: 600,
    borderRadius: 15,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  button: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0C8A7B1A",
    width: "100%",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    textAlign: "center",
    color: "#0C8A7B",
  },
  cancelbutton: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#FF151514",
    width: "100%",
  },
  canceltext: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    textAlign: "center",
    color: "#FF1515",
  },
  billing: {
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#D8D6D4",
    borderWidth: 1,
    borderRadius: 8,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
