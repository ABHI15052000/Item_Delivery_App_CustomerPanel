import {
  Text,
  View,
  FlatList,
  Image,
  BackHandler,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import Titlebar from "../components/TitileBar";
import Stars from "../components/Stars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../Api";
import CheckInternet from "../components/CheckInternet";
import { useCallback } from "react";
// const DATA = [
//   {
//     id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//     name: "Adam",
//     uri: "https://images.unsplash.com/photo-1610043809095-9c87fe936e03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
//     title: "First Item",
//     comment:
//       "Lorem ipsum dolor sit amet consectetur. Cursus risus metus sit arcu lectus arcu iaculis eget ullamcorper. Ornare id ut nullasdf euismod tortor nec.",
//   },
//   {
//     id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//     name: "Eric",
//     uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
//     title: "Second Item",
//     comment:
//       "Lorem ipsum dolor sit amet consectetur. Cursus risus metus sit arcu lectus arcu iaculis eget ullamcorper. Ornare id ut nullasdf euismod tortor nec.",
//   },
//   {
//     id: "58694a0f-3da1-471f-bd96-145571e29d72",
//     name: "John",
//     uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
//     title: "Third Item",
//     comment:
//       "Lorem ipsum dolor sit amet consectetur. Cursus risus metus sit arcu lectus arcu iaculis eget ullamcorper. Ornare id ut nulla euismod tortor nec. Lorem ipsum dolor sit amet consectetur. Cursus",
//   },
// ];

const Ratings = ({ navigation }) => {
  const [data, setData] = useState();
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getArticles();
      setRefreshing(false);
    }, 500);
  }, [authToken]);
  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });
  const getArticles = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };
    try {
      const response = await fetch(
        api + "feedback/user_feedback",
        requestOptions
      );
      // console.log(response);
      const json = await response.json();
      // console.log(json);
      setData(json.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getArticles();
  }, [authToken]);
  // console.log(data)

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

  const renderItem = ({ item }) => {
    // console.log(item);
    return (
      <View
        style={{
          borderBottomWidth: 0.5,
          width: "100%",
          marginVertical: 10,
          borderColor: "grey",
          marginHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri:
                api + item.driver.photo_uri ||
                "https://img.freepik.com/premium-vector/avatar-profile-colorful-illustration-2_549209-82.jpg",
            }}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }}
          />
          <View style={{}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat_400Regular",
                marginBottom: 5,
              }}
            >
              {item.driver.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
                width: 280,
              }}
            >
              <Stars numberOfStars={item.stars} maxStars={5} size={22} />

              <Text
                style={{
                  fontSize: 12,
                  color: "#828A89",
                  marginRight: 10,
                  fontFamily: "Montserrat_400Regular",
                }}
              >
                {moment(item.createdAt).fromNow()}
              </Text>
            </View>
            <Text
              style={{
                marginBottom: 20,
                lineHeight: 20,
                width: 300,
                color: "#828A89",
                fontFamily: "Montserrat_400Regular",
              }}
            >
              {item.comment}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <View style={{ marginHorizontal: "5%", marginTop: 10 }}>
        <Titlebar title={"Rating and Reviews"} />
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        {data && data.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View style={styles.rating}>
            <Text style={styles.ratingText}>No ratings yet ⭐⭐</Text>
          </View>
        )}
      </View>
      <CheckInternet />
    </>
  );
};

export default Ratings;

const styles = StyleSheet.create({
  rating: {
    // flex:1,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 20,
  },
});
