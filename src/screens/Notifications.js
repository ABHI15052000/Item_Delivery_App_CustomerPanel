import {
  FlatList,
  StyleSheet,
  Text,
  View,
  BackHandler,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import moment from "moment/moment";
import Titlebar from "../components/TitileBar";
import { api } from "../../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckInternet from "../components/CheckInternet";
// const DATA = [
//   {
//     id: 1,
//     note: "Your order will be shipped, once we get your confirm address",
//   },
//   {
//     id: 2,
//     note: "Your order will be shipped, once we get your confirm address",
//   },
//   {
//     id: 3,
//     note: "Your order will be shipped, once we get your confirm address",
//   },
//   {
//     id: 4,
//     note: "Your order will be shipped, once we get your confirm address",
//   },
// ];

const Notifications = ({ navigation }) => {
  const [data, setData] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getArticles();
      setRefreshing(false);
    }, 500);
  }, []);

  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });
  const getArticles = async () => {
    let token = "";
    try {
      token = await AsyncStorage.getItem("token");
    } catch (error) {
      // console.log("cannot get token", error);
    }
    setIsLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      // const response = await fetch(api + "notification/list_notifications");
      const response = await fetch(
        `${api}notification/list_notifications`,
        requestOptions
      );
      console.log(response.ok);
      const json = await response.json();
      setData(json.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getArticles();
    // console.log(data);
  }, [authToken]);

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

  return (
    <View flex={1}>
      <View style={{ marginHorizontal: "5%", marginTop: 10 }}>
        <Titlebar title={"Notifications"} />
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0c8a7b" />
        </View>
      ) : (
        <View marginBottom={100}>
          {data && data.length === 0 ? (
            <View style={styles.notification}>
              <Text style={styles.notificationText}>
                No Notifications yet ⭐⭐
              </Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    marginBottom: 20,
                    marginHorizontal: "5%",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Montserrat_400Regular",
                    }}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "grey",
                      marginTop: 7,
                      fontFamily: "Montserrat_400Regular",
                    }}
                  >
                    {moment(item.createdAt).fromNow()}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      )}

      <CheckInternet />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  notification: {
    // flex:1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 20,
  },
});
