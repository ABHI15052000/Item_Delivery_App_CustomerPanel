import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { BorderButton, WhiteButton } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { Footer, ButtonView, Heading, Subheading } from "../styles/styles";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckInternet from "../components/CheckInternet";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const LoginScreen = () => {
    navigation.navigate("Login");
  };
  const RegisterScreen = () => {
    navigation.navigate("Register");
  };

  useEffect(() => {
    const checkAutoLogin = async () => {
      // Retrieve the stored JWT token and creation time from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      const creationTime = await AsyncStorage.getItem("creationTime");

      const sucess = await AsyncStorage.getItem("Sucess");
      if (token && creationTime && sucess) {
        const currentTime = new Date().getTime();
        const tokenCreationTime = new Date(parseInt(creationTime, 10));

        // Check if the token is within the desired timeframe (e.g., 1 week)
        const weekInMilliseconds = 15 * 24 * 60 * 60 * 1000;
        if (currentTime - tokenCreationTime <= weekInMilliseconds) {
          navigation.replace("Main"); // Replace with the appropriate screen name
        } else {
          // setLoading(false);
          AsyncStorage.clear();
        }
      }

      setLoading(false);
    };

    checkAutoLogin();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0c8a7b" />
      ) : (
        <>
          <Image source={require("../../assets/logo.png")} marginTop="auto" />
          <Footer>
            <Heading>Welcome</Heading>
            <Subheading>
              "Deliver Now to your preferable location instant" means that you
              want the item to be delivered to your preferred location
              immediately.
            </Subheading>
            <ButtonView>
              <WhiteButton onPress={RegisterScreen} title="Sign up" bg="#fff" />
              <BorderButton
                onPress={LoginScreen}
                title="Sign in"
                bg="#0C8A7B"
              />
            </ButtonView>
          </Footer>
          <CheckInternet />
        </>
      )}
      <StatusBar style="dark" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat-Regular",
  },
});
