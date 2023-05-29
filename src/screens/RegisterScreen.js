import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Button } from "../components/Button";
import {
  BorderView,
  ButtonViewHeight,
  ErrorText,
  Heading,
  Main,
  PhoneInputView,
  RegisterView,
  Subheading,
  TextView,
  Wrapper,
} from "../styles/styles";
import CountryPicker from "react-native-country-picker-modal";
import { PhoneAuthProvider } from "firebase/auth";
import { auth, firebaseConfig } from "../../firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../Api";
import CheckInternet from "../components/CheckInternet";

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const [callingCode, setCallingCode] = useState("91");
  const [countryCode, setCountryCode] = useState("IN");
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [show, setShow] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  recaptchaVerifier = useRef("");

  const handleSubmit = async () => {
    console.log("mere adner a ga", phone);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone }),
    };

    try {
      const response = await fetch(api + "auth/checkuser", requestOptions);
      // console.log(response)
      console.log(response.ok);

      if (!response.ok) {
        const data = await response.json();
        // console.log(data);
        if (data.msg) {
          setShow(true);
          setApiError(data.msg);
          setLoading(false);
        } else if (data.message) {
          setShow(true);
          setApiError(data.message);
          setLoading(false);
        } else {
          setShow(true);
          setApiError(data.errors[0].msg);
          setLoading(false);
        }
        setTimeout(() => {
          setShow(false);
        }, 3000);
        setLoading(false);
      } else {
        const data = await response.json();
        // console.log(data);
        // AsyncStorage.setItem("token", data.data.tokens);
        // AsyncStorage.setItem('creationTime', new Date().getTime().toString());

        onSignup();
      }
    } catch (error) {
      console.log(error);
      if (error.message === "Network request failed") {
        setShow(true);
        setApiError(
          "Network request failed. Please check your internet connection."
        );
      }
      if (error.message === "too-many-requests") {
        setShow(true);
        setApiError("Too Many Requests Try after 15 minutes");
      }
      setLoading(false);
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("creationTime");
    }
  };

  const onSignup = async () => {
    if (!phone) {
      setError("Phone number can't be empty.");
      return;
    }
    if (phone.length < 9 || phone.length > 15) {
      setError("Enter Valid number.");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      setError("Phone number must contain only digits.");
      return;
    }
    setLoading(true);

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        `+${callingCode}${phone}`,
        recaptchaVerifier.current
      );
      // console.log("dsfsdfdsfds", verificationId);

      setLoading(false);
      setVerificationId(verificationId);
      // handleSubmit();
      navigation.navigate("ROTP", {
        verificationId,
        callingCode,
        phone,
      });
    } catch (error) {
      console.log("mera error aaya", error);
      if (error.code === "auth/invalid-phone-number") {
        setShow(true);
        setApiError("Invalid Phone Number.");
      }
      if (error.code === "auth/too-many-requests") {
        setShow(true);
        setApiError("Too Many Requests Try after 15 minutes");
      }
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("creationTime");
    }
    setLoading(false);
  };

  return (
    <Main flex={1}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <Wrapper>
        <AntDesign
          name="arrowleft"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Subheading>Sign in</Subheading>
        </TouchableOpacity>
      </Wrapper>
      <TextView>
        <Heading>Sign up</Heading>
        <Subheading marginVertical={20}>Hi user get yourself signup</Subheading>
      </TextView>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <RegisterView flex={1}>
          <BorderView>
            <Text
              style={{
                color: "#808080",
                position: "absolute",
                paddingHorizontal: 6,
                top: -10,
                left: 12,
                backgroundColor: "white",
                fontFamily: "Montserrat_400Regular",
              }}
            >
              Phone
            </Text>
            <PhoneInputView>
              <CountryPicker
                withFilter
                countryCode={countryCode}
                withFlag
                // withCountryNameButton
                withAlphaFilter={false}
                withCallingCode
                withCurrencyButton={false}
                onSelect={(country) => {
                  const { cca2, callingCode } = country;
                  setCountryCode(cca2);
                  setCallingCode(callingCode[0]);
                }}
                containerButtonStyle={{
                  alignItems: "center",
                  marginRight: -10,
                }}
              />
              <Text style={{ fontSize: 20 }}>
                {" "}
                <AntDesign name="down" size={12} color="black" /> |{" "}
              </Text>
              <TextInput
                value={phone}
                flex={1}
                onChangeText={(text) => {
                  const filteredText = text.replace(/[^0-9]/g, "");
                  setPhone(filteredText);
                  setError(null);
                }}
                style={{
                  fontFamily: "Montserrat_400Regular",
                }}
                mode="outlined"
                keyboardType={"phone-pad"}
                // maxLength={10}
                placeholder="Phone"
              />
            </PhoneInputView>
          </BorderView>
          {error && <ErrorText>{error}</ErrorText>}

          <ButtonViewHeight paddingBottom={15}>
            {loading ? (
              <ActivityIndicator size="large" color="#0C8A7B" /> // Show loading indicator while signing up
            ) : (
              <Button onPress={handleSubmit} title="Sign up" /> // Show the sign-up button when not loading
            )}
          </ButtonViewHeight>
        </RegisterView>
      </ScrollView>
      <CheckInternet />
      <Snackbar visible={show} onDismiss={() => setShow(false)}>
        {apiError}
      </Snackbar>

      <StatusBar style="light" />
    </Main>
  );
};
