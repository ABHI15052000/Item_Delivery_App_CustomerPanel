import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../Api";

export const OrderCard = (props) => {
  const [authToken, setAuthToken] = useState("");

  const navigation = useNavigation();
  let {
    orderId,
    item_type,
    Pickup_from,
    Deliver_To,
    Billing_Details,
    status,
    user_id,
    timing,
    fetchData,
    pickup_latitude,
    pickup_longitude,
    delivery_latitude,
    delivery_longitude,
    driver_id,
    distance,
    completed_timing,
    order_pin,
    driver_feedback,
    addtional_charge,
  } = props;
  // console.log(addtional_charge);
  const itemtype = item_type;
  const itemstring = itemtype.toString();
  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });

  switch (status) {
    case "0":
      status = "Pending";
      break;
    case "1":
      status = "Accepted";
      break;
    case "2":
      status = "Completed";
      break;
    // case '3':
    //     status = "Rejected"
    //     break;
    case "3":
      status = "Cancelled";
      break;
    default:
      break;
  }

  const cancelOrder = async (id) => {
    // console.log("hi got clicked", id);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ order_id: id }),
    };
    try {
      const response = await fetch(`${api}orders/cancel`, requestOptions);
      console.log(response.ok);
      if (response.ok) {
        const data = await response.json();
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      paddingHorizontal={20}
      paddingVertical={25}
      marginVertical={10}
      backgroundColor="#fff"
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{ color: "#8E8EA1", fontFamily: "Montserrat_600SemiBold" }}
        >
          Order #{orderId}
        </Text>
        <View style={styles.location}>
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

          <AntDesign
            onPress={() =>
              navigation.navigate("Chat", {
                orderId,
                item_type: itemstring,
                Pickup_from,
                Deliver_To,
                Billing_Details,
                status,
                user_id,
              })
            }
            name="message1"
            size={24}
            color="black"
          />
        </View>
      </View>
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
        Order PIN : {order_pin}
      </Text>
      <Text style={{ fontFamily: "Montserrat_400Regular" }}>
        Item Type:{" "}
        <Text style={{ lineHeight: 20, fontFamily: "Montserrat_600SemiBold" }}>
          {itemstring}
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

      <View
        marginVertical={12}
        marginLeft={6}
        marginRight={15}
        style={styles.location}
      >
        <Text
          style={{
            color: "#8E8EA1",
            fontFamily: "Montserrat_400Regular",
            fontSize: 12,
          }}
        >
          {timing}
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: "#394F6B",
            fontFamily: "Montserrat_600SemiBold",
          }}
        >
          $ {Billing_Details}
        </Text>
      </View>
      {status === "Cancelled" ? (
        <View marginBottom={-10}></View>
      ) : (
        <View
          style={driver_feedback === 1 ? styles.feedback : styles.buttonView}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Orderdetail", {
                orderId,
                item_type: itemstring,
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
              });
            }}
          >
            <View style={styles.button}>
              <Text style={styles.text}>View Details</Text>
            </View>
          </TouchableOpacity>
          {status === "Pending" || status === "Accepted" ? (
            <TouchableOpacity onPress={() => cancelOrder(orderId)}>
              <View style={styles.cancelbutton}>
                <Text style={styles.canceltext}>Cancel</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <>
              {driver_feedback === 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Feedback", {
                      driver_orderId: orderId,
                      fetchData,
                    })
                  }
                >
                  <View style={styles.feedbackButton}>
                    <Text style={styles.feedbackText}>Give Feedback</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </>
          )}
        </View>
      )}
    </ScrollView>
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
    marginRight: 20,
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
    marginRight: 20,
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
    marginRight: 20,
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
    marginRight: 20,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  buttonView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: "8%",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0C8A7B1A",
    // width: "100%",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    textAlign: "center",
    color: "#0C8A7B",
    fontFamily: "Montserrat_600SemiBold",
  },
  cancelbutton: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: "12%",
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
    fontFamily: "Montserrat_600SemiBold",
  },
  feedbackButton: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: "5%",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#FFEFD4",
    width: "100%",
  },
  feedbackText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    textAlign: "center",
    color: "#FF9C1C",
    fontFamily: "Montserrat_400Regular",
  },
  feedback: {
    width: "auto",
  },
});
