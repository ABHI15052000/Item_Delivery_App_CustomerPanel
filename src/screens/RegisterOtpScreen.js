import {
  Text,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Button } from "../components/Button";
import {
  ContinueView,
  Heading,
  Main,
  OtpInput,
  OtpInputView,
  OtpView,
  ResendView,
  Subheading,
  TextView,
  Wrapper,
} from "../styles/styles";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth, firebaseConfig } from "../../firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../Api";
import CheckInternet from "../components/CheckInternet";

export const RegisterOtpScreen = ({ route }) => {
  const navigation = useNavigation();
  const { verificationId, phone, callingCode } = route.params;
  // console.log(phoneNumber);
  const [countdown, setCountdown] = useState(30);
  recaptchaVerifier = useRef("");
  const [resend, setResend] = useState("");
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const input5 = useRef(null);
  const input6 = useRef(null);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [value4, setValue4] = useState("");
  const [value5, setValue5] = useState("");
  const [value6, setValue6] = useState("");
  const [apiError, setApiError] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (text, ref) => {
    if (text.length === 1 && ref && ref.current) {
      ref.current.focus();
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        AsyncStorage.removeItem("token");
        AsyncStorage.removeItem("creationTime");
        return false; // Return false to prevent default back navigation
      }
    );

    return () => backHandler.remove(); // Clean up the event listener on unmount
  }, []);

  useEffect(() => {
    let interval = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const resendOTP = async () => {
    const phoneNumber = "+" + callingCode + phone;
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );

      setResend(verificationId);
      setCountdown(30); // Reset countdown timer on resend
    } catch (error) {
      if (error.message === "Firebase: Error (auth/too-many-requests).") {
        setShow(true);
        setApiError("Too many requests try after 15 minutes.");
      }
    }
  };

  const handleBackspace = (event, ref) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      ref &&
      ref.current &&
      ref.current.isFocused()
    ) {
      event.preventDefault();
      if (ref.current === input6.current && value6 === "") {
        setValue5("");
        input5.current.focus();
      } else if (ref.current === input5.current && value5 === "") {
        setValue4("");
        input4.current.focus();
      } else if (ref.current === input4.current && value4 === "") {
        setValue3("");
        input3.current.focus();
      } else if (ref.current === input3.current && value3 === "") {
        setValue2("");
        input2.current.focus();
      } else if (ref.current === input2.current && value2 === "") {
        setValue1("");
        input1.current.focus();
      }
    }
  };

  const onVerifyOTP = async () => {
    setIsLoading(true);
    const verificationCode =
      value1 + value2 + value3 + value4 + value5 + value6;
    if (verificationCode.length !== 6) {
      setShow(true);
      setApiError("OTP must be filled");
      return;
    }
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId || resend,
        verificationCode
      );
      await signInWithCredential(auth, credential);
      handleSubmit();

      setValue1("");
      setValue2("");
      setValue3("");
      setValue4("");
      setValue5("");
      setValue6("");
    } catch (error) {
      console.log(error.code);
      if (
        error.message === "Firebase: Error (auth/invalid-verification-code)."
      ) {
        setShow(true);
        setApiError("Invalid OTP");
      }
      if (error.message === "Firebase: Error (auth/code-expired).") {
        setShow(true);
        setApiError("OTP Expired");
      }
      if (error.code === "auth/invalid-verification-id") {
        setShow(true);
        setApiError("Please Resend OTP got expired");
      }
    } finally {
      setIsLoading(false); // Hide activity indicator
    }
  };
  const handleSubmit = async () => {
    // setIsLoading(true);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, CallingCode: callingCode }),
    };
    try {
      await fetch(api + "auth/Signup", requestOptions).then((response) => {
        console.log(response.ok);
        if (!response.ok) {
          response.json().then((data) => {
            if (data.msg) {
              setShow(true);
              setApiError(data.msg);
              setIsLoading(false);
            } else if (data.message) {
              setShow(true);
              setApiError(data.message);
              setIsLoading(false);
              // setLoading(false)
            } else {
              setShow(true);
              setApiError(data.errors[0].msg);
              setIsLoading(false);
              // setLoading(false)
            }
            setTimeout(() => {
              setShow(false);
            }, 3000);
            setIsLoading(false);
            // setLoading(false);
          });
        } else {
          response.json().then(async (data) => {
            console.log(data.data.tokens);
            await AsyncStorage.setItem("token", data.data.tokens);
            await AsyncStorage.setItem(
              "creationTime",
              new Date().getTime().toString()
            );
            await AsyncStorage.setItem("Sucess", "True");

            navigation.navigate("EditProfile");
          });
        }
      });
    } catch (error) {
      console.log(error);
      if (error.message === "Network request failed") {
        setShow(true);
        setApiError(
          "Network request failed. Please check your internet connection."
        );
      }
      setIsLoading(false);
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("creationTime");
    } finally {
      setIsLoading(false); // Hide activity indicator
    }
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
          onPress={() => {
            AsyncStorage.removeItem("token");
            AsyncStorage.removeItem("creationTime");

            navigation.goBack();
          }}
        />
      </Wrapper>
      <TextView>
        <Heading>Verification</Heading>
        <Subheading marginVertical={20}>
          OTP has been sent to you +{callingCode}
          {phone}
        </Subheading>
      </TextView>

      <OtpView flex={1}>
        <OtpInputView>
          <OtpInput
            maxLength={1}
            keyboardType={"numeric"}
            ref={input1}
            value={value1}
            onChangeText={(text) => {
              setValue1(text);
              handleTextChange(text, input2);
            }}
            onKeyPress={(event) => handleBackspace(event, input1)}
          />
          <OtpInput
            maxLength={1}
            keyboardType={"numeric"}
            ref={input2}
            value={value2}
            onChangeText={(text) => {
              setValue2(text);
              handleTextChange(text, input3);
            }}
            onKeyPress={(event) => handleBackspace(event, input2)}
          />
          <OtpInput
            maxLength={1}
            keyboardType={"numeric"}
            ref={input3}
            value={value3}
            onChangeText={(text) => {
              setValue3(text);
              handleTextChange(text, input4);
            }}
            onKeyPress={(event) => handleBackspace(event, input3)}
          />
          <OtpInput
            maxLength={1}
            keyboardType={"numeric"}
            ref={input4}
            value={value4}
            onChangeText={(text) => {
              setValue4(text);
              handleTextChange(text, input5);
            }}
            onKeyPress={(event) => handleBackspace(event, input4)}
          />
          <OtpInput
            maxLength={1}
            keyboardType={"numeric"}
            ref={input5}
            value={value5}
            onChangeText={(text) => {
              setValue5(text);
              handleTextChange(text, input6);
            }}
            onKeyPress={(event) => handleBackspace(event, input5)}
          />
          <OtpInput
            maxLength={1}
            keyboardType={"numeric"}
            ref={input6}
            value={value6}
            onChangeText={(text) => {
              setValue6(text);
              handleTextChange(text, null);
            }}
            onKeyPress={(event) => handleBackspace(event, input6)}
          />
        </OtpInputView>

        <ResendView justifyContent="center" flexDirection="row">
          {countdown === 0 ? (
            <TouchableOpacity onPress={resendOTP}>
              <Text>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text>Resend Code in {countdown} seconds</Text>
          )}
        </ResendView>

        {/* <ContinueView>
          <Button title="Continue" onPress={handleSubmit} />
        </ContinueView> */}
        <ContinueView>
          {isLoading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <Button title="Continue" onPress={onVerifyOTP} />
          )}
        </ContinueView>
      </OtpView>
      <CheckInternet />
      <Snackbar visible={show} onDismiss={() => setShow(false)}>
        {apiError}
      </Snackbar>
      <StatusBar style="light" />
    </Main>
  );
};
