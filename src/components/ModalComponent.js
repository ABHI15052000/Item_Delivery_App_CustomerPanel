import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "react-native";
import styled from "styled-components/native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Avatar } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, firebaseConfig } from "../../firebase";
import { signOut } from "firebase/auth";
import { api } from "../../Api";
const AvatarView = styled.View`
  margin-left: 3%;
  // margin-right:10px
  margin-bottom: 10px;
`;
export const Sidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("home");
  const navigation = useNavigation();
  const handleTabPress = (tab) => {
    setActiveTab(tab);
    navigation.navigate("Main");
    setActiveTab(null);
    onClose();
  };
  const handleTab1Press = (tab) => {
    setActiveTab(tab);
    navigation.navigate("EditProfile");
    setActiveTab(null);
    onClose();
  };
  const handleTab2Press = (tab) => {
    setActiveTab(tab);
    navigation.navigate("Orders");
    setActiveTab(null);
    onClose();
  };
  const handleTab3Press = (tab) => {
    setActiveTab(tab);
    navigation.navigate("Notifications");
    setActiveTab(null);
    onClose();
  };
  const handleTab4Press = (tab) => {
    setActiveTab(tab);
    navigation.navigate("Ratings");
    setActiveTab(null);
    onClose();
  };
  const handleTab5Press = async (tab) => {
    setActiveTab(tab);

    try {
      AsyncStorage.clear()
      await signOut(auth);
      navigation.replace("Home");
      // AsyncStorage.removeItem('name')
      // AsyncStorage.removeItem(`-photo`)
      // AsyncStorage.removeItem('token')
      // AsyncStorage.removeItem('creationTime')
      // AsyncStorage.removeItem('Sucess')
      onClose();
    } catch (error) {
      console.error(error);
    }
  };
  // const handleTab5Press = (tab) => {
  //   setActiveTab(tab);
  //   signOut(auth);
  //   navigation.replace("Home")
  //   onClose();
  // };
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [authToken, setAuthToken] = useState("");

  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });
  const getProfilePicture = async () => {
    const photoUri = await AsyncStorage.getItem(`-photo`);
    const nameGet = await AsyncStorage.getItem("name");
    setName(nameGet);
    setPhoto(photoUri);
    // getApi();
  };
  useFocusEffect(
    useCallback(() => {
      getProfilePicture();
    }, [])
  );

  const fetchData = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const response = await fetch(
        `${api}get`,
        requestOptions
      );
      // console.log(response.ok);
      const json = await response.json();
      if (json.data.name) {
        setName(json.data.name);
        setPhoto(api+json.data.photo_uri)
        AsyncStorage.setItem("name", json.data.name);
        AsyncStorage.setItem("-photo", api+json.data.photo_uri);
      } else {
        AsyncStorage.removeItem("name");
      }
      // console.log(json.data)
    } catch (error) {
      // console.log("Error: json or json.data is undefined or null.");
    }
  }, [name]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [name])
  );

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
    >
      <View style={styles.container}>
        <AvatarView>
          {!photo && (
            <Avatar
              rounded
              size="large"
              source={{
                uri: "https://images.unsplash.com/photo-1580518337843-f959e992563b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
              }}
              activeOpacity={0.7}
            />
          )}
          {photo && (
            <Avatar
              rounded
              size="large"
              source={{ uri: photo }}
              backgroundColor="#2182BD"
            />
          )}
        </AvatarView>
        <Text style={{ marginLeft: "4%", fontFamily: "Montserrat_500Medium" }}>
          {name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: 500,
            marginLeft: -20,
            marginTop: 10,
            width: "120%",
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#0000004D" }} />
        </View>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabPress("Main")}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/home.jpg")}
              style={{ width: 22, height: 24, marginRight: 10 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Main" && styles.activeTabText,
              ]}
            >
              Home
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTab1Press("profile")}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/user.png")}
              style={{ width: 22, height: 28, marginRight: 10 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "profile" && styles.activeTabText,
              ]}
            >
              Profile
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTab2Press("OrderHistory")}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/Order.png")}
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "OrderHistory" && styles.activeTabText,
              ]}
            >
              Order History
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTab3Press("Notification")}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/noti.png")}
              style={{ width: 22, height: 28, marginRight: 10 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Notification" && styles.activeTabText,
              ]}
            >
              Notification
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTab4Press("Rating&Reviews")}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/review.jpg")}
              style={{ width: 24, height: 28, marginRight: 10 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Rating&Reviews" && styles.activeTabText,
              ]}
            >
              Rating & Reviews
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTab5Press("Logout")}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/Logout.png")}
              style={{ width: 22, height: 24, marginRight: 10 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Logout" && styles.activeTabText,
              ]}
            >
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const CustomSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSidebarOpen = () => {
    setIsOpen(true);
  };

  const handleSidebarClose = () => {
    setIsOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handleSidebarOpen} style={{ marginTop: 1 }}>
        <Image
          source={require("../../assets/side.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
      <Sidebar isOpen={isOpen} onClose={handleSidebarClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    // position:"absolute",
    flexDirection: "row",
  },
  modal: {
    margin: 0,
    alignItems: "flex-start",
    width: 400,
    // justifyContent: 'flex-end',
    // bottom:500
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    width: "75%",
    height: "100%",
  },
  tab: {
    paddingVertical: 5,
    // paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  activeTabText: {
    color: "#FF9C1C",
  },
});

export default CustomSidebar;
