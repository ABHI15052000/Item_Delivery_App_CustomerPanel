import {
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Button } from "../components/Button";
import {
  PhoneView,
  Heading,
  Main,
  Subheading,
  ButtonViewHeight,
  TextView,
  Wrapper,
  BorderView,
  PhoneInputView,
  SignupView,
  ErrorText,
} from "../styles/styles";
import CountryPicker from "react-native-country-picker-modal";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth, firebaseConfig } from "../../firebase";
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../Api";
import CheckInternet from "../components/CheckInternet";

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [callingCode, setCallingCode] = useState("91");
  const [countryCode, setCountryCode] = useState("IN");
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  // console.log(callingCode);

  recaptchaVerifier = useRef("");

  function onCaptcha() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            onSignIn;
          },
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          },
        },
        auth
      );
    }
    setLoading(false);
  }

  const handleSubmit = async () => {
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
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, CallingCode: callingCode }),
    };

    try {
      await fetch(api + "auth/Signin", requestOptions).then((response) => {
        console.log(response.ok);
        if (!response.ok) {
          response.json().then((data) => {
            if (data.message) {
              setShow(true);
              setApiError(data.message);
            } else if (data.msg) {
              setShow(true);
              setApiError(data.msg);
            } else {
              setShow(true);
              setApiError(data.errors[0].msg);
            }
            setTimeout(() => {
              setShow(false);
            }, 3000);
          });
          setLoading(false);
        } else {
          response.json().then((data) => {
            // console.log(data);
            AsyncStorage.setItem("token", data.data.token);
            AsyncStorage.setItem(
              "creationTime",
              new Date().getTime().toString()
            );
            setLoading(false);
          });
          onSignIn();
        }
      });
    } catch (error) {
      // console.log(error);
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
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("creationTime");
    }
  };

  const onSignIn = () => {
    onCaptcha();

    const appVerifier = recaptchaVerifier.current;
    signInWithPhoneNumber(auth, `+${callingCode}${phone}`, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setPhone("");
        setLoading(false);
        navigation.navigate("OTP", {
          verificationId: confirmationResult.verificationId,
          phoneNumber: `+${callingCode}${phone}`,
        });
      })
      .catch((error) => {
        if (error.message === "Firebase: Error (auth/too-many-requests).") {
          setShow(true);
          setApiError("Too2-many-requests try after 15 minutes");
        } else {
          // Cancelled reCAPTCHA, clear token from AsyncStorage
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("creationTime");
          setLoading(false);
        }
      });
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
        {/* <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Subheading>Register</Subheading>
        </TouchableOpacity> */}
      </Wrapper>
      <TextView>
        <Heading>Sign in</Heading>
        <Subheading marginVertical={20}>Welcome back</Subheading>
      </TextView>

      <PhoneView flex={1}>
        <BorderView>
          <Text
            style={{
              color: "#808080",
              position: "absolute",
              top: -10,
              left: 12,
              paddingHorizontal: 6,
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
              maxLength={15}
              placeholder="Phone"
            />
          </PhoneInputView>
        </BorderView>
        {error && <ErrorText>{error}</ErrorText>}

        <ButtonViewHeight>
          {loading ? (
            <ActivityIndicator size="large" color="#0C8A7B" />
          ) : (
            <Button onPress={handleSubmit} title="Sign in" />
          )}
        </ButtonViewHeight>
      </PhoneView>
      <SignupView>
        <Text style={{ fontFamily: "Montserrat_400Regular" }}>
          Don’t have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text
            style={{ color: "orange", fontFamily: "Montserrat_400Regular" }}
          >
            {" "}
            Sign up{" "}
          </Text>
        </TouchableOpacity>
      </SignupView>
      <CheckInternet />
      <Snackbar visible={show} onDismiss={() => setShow(false)}>
        {apiError}
      </Snackbar>
      <StatusBar style="light" />
    </Main>
  );
};
