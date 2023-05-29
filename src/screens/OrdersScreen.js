import {
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Container, CenteredView } from "../styles/styles";
import { Header } from "../components/Header";
import { HorizontalScroll } from "../components/HorizontalScroll";
import { OrderCard } from "../components/OrderCard";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Titlebar from "../components/TitileBar";
import { View, BackHandler } from "react-native";
import { api } from "../../Api";
import CheckInternet from "../components/CheckInternet";
import messaging from "@react-native-firebase/messaging";
import { useCallback } from "react";

export const OrdersScreen = ({ navigation }) => {
  const [authToken, setAuthToken] = useState("");
  const [orders, setOrders] = useState([]);
  const [list, setList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancel, setCancel] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData();
      setRefreshing(false);
    }, 1000);
  }, [list]);
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });
  // console.log(orders);
  const handleListChange = (value) => {
    setIsLoading(true);
    setOrders([]);
    switch (value) {
      case "Pending":
        value = "0";
        break;
      case "Accepted":
        value = "1";
        break;
      case "Completed":
        value = "2";
        break;
      case "Cancelled":
        value = "3";
        break;
      default:
        value = null;
        break;
    }
    setList(value);
  };

  async function fetchData() {
    setIsLoading(true);

    let token = "";
    try {
      token = await AsyncStorage.getItem("token");
    } catch (error) {
      // console.log("cannot get token", error);
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(`${api}orders/${list}`, requestOptions);
      console.log(response.ok);
      if (response.ok) {
        const data = await response.json();

        // console.log(data);
        if (data.orders) {
          // setDriver_feedback(data.orders.driver_feedback);
          setOrders(data.orders);
          setIsLoading(false);
        }
      }
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken, list]);

  const convertDate = (str) => {
    const date = new Date(str);

    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
    const finalFormattedDate = `${formattedDate}, ${formattedTime}`;
    return finalFormattedDate;
  };
  // console.log(orders[0].additional_charge);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      title = JSON.stringify(remoteMessage);
      const jsonObj = JSON.parse(title);
      console.log("-----------------", jsonObj);
      if (
        jsonObj.notification.title === "Order Complete" ||
        jsonObj.notification.title === "Order Confirmed"
      ) {
        fetchData();
      }
    });
    return unsubscribe;
  }, [list]);

  return (
    <View flex={1}>
      <View marginHorizontal="5%">
        <Titlebar title="Orders" />
      </View>
      <HorizontalScroll inputSelect={handleListChange} />
      {isLoading ? (
        <CenteredView>
          <ActivityIndicator size="large" color="#0000ff" />
        </CenteredView>
      ) : orders.length === 0 ? (
        <CenteredView>
          <Text>No Order Yet! Place an order!!!</Text>
        </CenteredView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {orders.map((order) => (
            <OrderCard
              key={order.order_id}
              user_id={order.user_id}
              orderId={order.order_id}
              item_type={order.category_item_type}
              status={order.status || order.order_status}
              Pickup_from={order.pickup_from}
              Deliver_To={order.deliver_to}
              Billing_Details={order.billing_details}
              timing={convertDate(order.createdAt)}
              pickup_latitude={order.pickup_latitude}
              pickup_longitude={order.pickup_longitude}
              delivery_latitude={order.delivery_latitude}
              delivery_longitude={order.delivery_longitude}
              driver_id={order.driver_id}
              distance={order.distance_km}
              driver_feedback={order.driver_feedback}
              completed_timing={order.order_completed_time || ""}
              order_pin={order.order_pin}
              fetchData={fetchData}
              addtional_charge={order.additional_charge}
            />
          ))}
        </ScrollView>
      )}
      <CheckInternet />
      <StatusBar style="dark" />
    </View>
  );
};
