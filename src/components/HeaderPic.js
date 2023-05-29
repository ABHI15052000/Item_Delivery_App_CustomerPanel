import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../Api";

const HeaderPic = () => {
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
      const response = await fetch(`${api}get`, requestOptions);
      const json = await response.json();
      setName(json.data.name);
      if (json.data.name) {
        AsyncStorage.setItem("name", json.data.name);
      } else {
        AsyncStorage.removeItem("name");
      }
    } catch (error) {
      // console.log("Heder pic error");
    }
  }, [authToken, name]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );
  return (
    <View style={styles.adam}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons style={{}} name="chevron-back" size={24} color="black" />
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
        <Text style={{ fontSize: 16 }}>{name}</Text>
      </View>
    </View>
  );
};

export default HeaderPic;

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
