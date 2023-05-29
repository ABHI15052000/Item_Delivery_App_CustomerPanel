import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  BackHandler,
  Alert,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { Avatar } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSidebar, { Sidebar } from "../components/ModalComponent";
import { PickButton, WButton } from "../components/Button";
import { FcmToken } from "../components/FcmToken";
import { api } from "../../Api";
import CheckInternet from "../components/CheckInternet";

const MainVView = styled.View`
  flex: 1;
  margin-top: 8%;
`;
const SBView = styled.View`
flex-direction:row;
text-align:center;
jusitfy-content:center;
margin:10px;
height: 53px
border:2px;
border-color:white;
border-radius:8px;
background-color:white;
elevation:5;
`;
const AvatarView = styled.View`
  // margin-left:26%;
  // margin-right:3%;
`;
const PhotoView = styled.View`
top:10%;
margin:4%;
border-radius:12px
background-color:#0C8A7B;
padding:3%;
`;
const SubText = styled.Text`
  font-size: 18px;
  font-family: Montserrat_600SemiBold;
  color: white;
  margin-right: 50%;
`;
const SubbText = styled.Text`
font-size:12px;
color:white;
font-family:Montserrat_500Medium
margin-right:50%;
`;
const ContainerView = styled.View`
background-color:white
margin:10px;
top:12%;
padding:10px;
elevation:2
`;
const Ctext = styled.Text`
  justify-content: center;
  font-family: Montserrat_600SemiBold;
  text-align: center;
`;
const FooterText = styled.View`
  padding: 10px;
  margin-top: auto;
  margin-bottom: 10px;

  align-items: center;
`;

const MainScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const [authToken, setAuthToken] = useState("");
  const [fcmToken, SetfcmToken] = useState("");

  const handleFcm = (token) => {
    SetfcmToken(token);
  };

  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });
  const getProfilePicture = async () => {
    const photoUri = await AsyncStorage.getItem(`-photo`);
    const nameGet = await AsyncStorage.getItem("name");
    setName(nameGet);
    setPhoto(photoUri);
  };
  useFocusEffect(
    useCallback(() => {
      getProfilePicture();
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const fetchData = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const response = await fetch(api + "get", requestOptions);
      // console.log(response.ok);
      const json = await response.json();
      // console.log(json);
      if (json.data.name) {
        setName(json.data.name);
        setPhoto(api + json.data.photo_uri);
        // console.log(api+json.data.photo_uri);
        AsyncStorage.setItem("name", json.data.name);
        AsyncStorage.setItem("-photo", api + json.data.photo_uri);
      } else {
        AsyncStorage.removeItem("name");
        AsyncStorage.removeItem("-photo");
        navigation.navigate("EditProfile");
      }
      // console.log(json)
    } catch (error) {
      // console.log("Error: json or json.data is undefined or null.");
    }
  }, [name]);

  const sendFcm = useCallback(async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcmtoken: fcmToken }),
    };
    try {
      const response = await fetch(api + "fcmtoken", requestOptions);
      const json = await response.json();
    } catch (error) {
      // console.log("Error: json or json.data is undefined or null.");
    }
  }, [fcmToken]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useEffect(() => {
    sendFcm();
  }, [fcmToken]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <FcmToken inputSelect={handleFcm} />

        <MainVView>
          <View
            style={{
              height: 53,
              marginTop: 10,
              backgroundColor: "white",
              borderRadius: 8,
              width: "92%",
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginTop: 10,
            }}
          >
            <View style={{ position: "absolute", left: 10 }}>
              <CustomSidebar />
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {!photo && (
                <Avatar
                  rounded
                  size="small"
                  source={{
                    uri: "https://images.unsplash.com/photo-1580518337843-f959e992563b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
                  }}
                />
              )}
              {photo && (
                <Avatar
                  rounded
                  size="small"
                  source={{ uri: photo }}
                  backgroundColor="#2182BD"
                />
              )}
            </View>

            <Text
              style={{
                fontFamily: "Montserrat_400Regular",
                fontSize: 16,
                marginLeft: 5,
              }}
            >
              {name}
            </Text>
          </View>
          <PhotoView>
            <SubText>Here's how you can use this for your needs</SubText>
            <SubbText>Order Now!!</SubbText>
            <WButton
              title="Book Now"
              onPress={() => navigation.navigate("Task")}
            />
            <View
              style={{ position: "absolute", marginLeft: "60%", bottom: -8 }}
            >
              <Image
                source={require("../../assets/Plant.png")}
                style={{ right: 30, height: 250, width: 180 }}
              />
            </View>
          </PhotoView>
          <ContainerView>
            <Ctext>
              Pick up or Send
              <Text style={{ fontFamily: "Montserrat_400Regular" }}>
                {" "}
                anything
              </Text>{" "}
            </Ctext>
            <PickButton onPress={() => navigation.navigate("Task")} />
          </ContainerView>
          <FooterText>
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Here's how you can use this for your needs
            </Text>
          </FooterText>
          <CheckInternet />

          <StatusBar style="dark" />
        </MainVView>
      </SafeAreaView>
    </>
  );
};

export default MainScreen;
