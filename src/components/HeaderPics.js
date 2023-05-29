import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../Api";

const HeaderPics = (props) => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [authToken, setAuthToken] = useState("");

  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });

  const getProfilePicture = async () => {
    const photoUri = await AsyncStorage.getItem(`-photo`);
    setPhoto(photoUri);
  };
  useFocusEffect(
    useCallback(() => {
      getProfilePicture();
    }, [authToken, name])
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
      const response = await fetch(`${api}/get`, requestOptions);
      //   console.log(response.ok);
      const json = await response.json();
      setName(json.data.name);
      if (json.data.name) {
        AsyncStorage.setItem("name", json.data.name);
      } else {
        AsyncStorage.removeItem("name");
      }
      // console.log(json.data)
    } catch (error) {
      console.log("Heder pic error");
    }
  }, [authToken, name]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );
  return (
    <View
      style={{
        height: 52,
        marginTop: 10,
        backgroundColor: "white",
        borderRadius: 8,
        width: "90%",
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
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", left: 20, zIndex: 5 }}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color="grey" />
      </TouchableOpacity>

      <View style={styles.imageview}>
        {photo !== null ? (
          <Image
            style={styles.image}
            source={{
              uri: photo,
            }}
          />
        ) : (
          <Image
            style={styles.image}
            source={{
              uri: "https://banner2.cleanpng.com/20180725/hrj/kisspng-computer-icons-person-5b58a2a82e0cd6.9562737315325354641886.jpg",
            }}
          />
        )}
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontFamily: "Montserrat_400Regular" }}>
            {props.title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderPics;

const styles = StyleSheet.create({
  adam: {
    borderRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  imageview: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  image: { width: 28, height: 28, borderRadius: 14, marginRight: 10 },
});
