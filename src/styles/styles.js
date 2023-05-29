import {
  SafeAreaView,
  Text,
  View,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";
import styled from "styled-components";

// common Css
export const Container = styled(SafeAreaView)`
  padding-top: ${Platform.OS === "android" ? "35px" : "0px"};
`;
export const Heading = styled(Text)`
  color: #fff;
  font-size: 30px;
  font-family: Montserrat_600SemiBold;
`;
export const Subheading = styled(Text)`
  color: #fff;
  font-family: Montserrat_400Regular;
`;
export const Main = styled(SafeAreaView)`
  background-color: #0c8a7b;
  padding-top: ${Platform.OS === "android" ? "30px" : "0px"};
  // padding:15px;
`;
export const Wrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
`;
export const TextView = styled(View)`
  padding: 15px;
`;
export const ErrorText = styled(Text)`
  color: red;
  text-align: center;
  font-size: 12px;
  font-family: Montserrat_400Regular;
`;
export const CenteredView = styled(View)`
  align-items: center;
  justify-content: center;
`;
// Home Screen css

export const Footer = styled(View)`
  background-color: #0c8a7b;
  width: 100%;
  margin-top: auto;
  padding: 16px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`;

export const ButtonView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 30px;
`;

// Login Screen Css

export const PhoneView = styled(ScrollView)`
  background-color: #fff;
  padding:15px;4
  border:1px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;
export const SignupView = styled(View)`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  justifycontent: center;
  // margin-top: auto;
  justify-content: center;
`;
export const BorderView = styled(View)`
  border: 1px solid #0c8a7b;
  padding: 5px 20px;
  border-radius: 10px;
  margin: 20px 0px 6px 0px;
`;
export const ButtonViewHeight = styled(View)`
  margin-top: 90px;
`;
export const PhoneInputView = styled(View)`
  padding-vertical: 10px;
  flex-direction: row;
  align-items: center;
`;

// Register Screen Css

export const RegisterView = styled(View)`
  background-color: #fff;
  padding: 15px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

// OTP Screen Css

export const OtpView = styled(View)`
  background-color: #fff;
  padding: 15px;
  // border:1px solid #0C8A7B;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;
export const OtpInput = styled(TextInput)`
  background-color: #f3f3f3;
  color: black;
  padding: 8px;
  font-size: 25px;
  border-radius: 5px;
  text-align: center;
  width: 15%;
  margin-horizontal: 4px;
  font-family: Montserrat_400Regular;
`;
export const OtpInputView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;
export const ResendView = styled(View)`
  flex-direction: row;
  background-color: #fff;
  padding-vertical: 20px;
`;
export const ContinueView = styled(View)`
  background-color: #fff;
  // padding-bottom:20px;
  margin-top: 50px;
`;

// Abhishek styling
import { StyleSheet } from "react-native";

export const CustomStyles = StyleSheet.create({
  addNewCardButtonContainer: {
    marginTop: 5,
    backgroundColor: "#0C8A7B",
    padding: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  addNewCardButtonText: {
    color: "white",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 15,
  },
  makePaymentButton: {
    marginHorizontal: "4.5%",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "black",
  },
  toPayButton: {
    borderColor: "#D8D6D4",
    borderWidth: 2,
    marginHorizontal: "4.5%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    marginBottom: 20,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  newCardOption: {
    marginHorizontal: "5%",
    fontSize: 15,
    fontWeight: "500",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectItem: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#0C8A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "5.5%",
    marginBottom: 20,
  },
});
