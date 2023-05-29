import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import SavedCard from "../features/SavedCard";
import NewCard from "../features/NewCard";
import { Container, CustomStyles } from "../styles/styles";
import CustomOutlinedTextInput from "../components/CustomOutlinedTextInput";
import Titlebar from "../components/TitileBar";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { api } from "../../Api";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import PaymentLottie from "../components/PaymentLottie";
import CheckInternet from "../components/CheckInternet";

const Payment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const tokenId = route.params?.tokenId;
  const price = route.params?.price;
  const distance = route.params?.price;

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
      const response = await fetch(api + "payment/cards", requestOptions);
      console.log(response.ok);
      const json = await response.json();
      // console.log(json);
      if (json.cards) {
        setItems(json.cards);
        // console.log(json.cards);
      }
    } catch (error) {
      console.log(error);
      if (error.message === "Network request failed") {
        setShow(true);
        setApiError(
          "Network request failed. Please check your internet connection."
        );
      }
    }
  };

  useEffect(() => {
    getArticles();
  }, [authToken, tokenId]);

  // console.log("fdsfs",items);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [cardnumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [showNewItemForm, setShowNewItemForm] = useState(false);

  const [showLottie, setShowLottie] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [cvvError, setCvvError] = useState(false);
  const [expiryError, setExpiryError] = useState(false);
  const [selectedMethod, setselectedMethod] = useState();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMakingPayment, setIsMakingPayment] = useState(false); // Added loading state variable
  const [isLoading, setIsLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);

  const payment = async () => {
    // navigation.navigate("TrackOrder");
    setMainLoading(true);
    setIsMakingPayment(true); // Start loading
    setSuccess(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        pay_id: selectedMethod,
        amount: price,
        task_id: tokenId,
      }),
    };
    // console.log(requestOptions.body);
    await fetch(api + "payment/pay", requestOptions)
      .then((response) => {
        console.log(response.ok);
        console.log(response.status);
        response.json().then((data) => {
          if (response.ok) {
            console.log("Response Status :::  200");
            setPaymentSuccess(true);
            setSuccess(true);
            setShowLottie(true);
            setTimeout(() => {
              setShowLottie(false);
              navigation.navigate("Main");
            }, 2000);
          } else if (response.status == 400) {
            console.log("errors");
            // console.log(data);
          }
        });
        setSuccess(false);
      })
      .catch((err) => {
        setMainLoading(false);
        // console.log("dssfsdf", err);
      })
      .finally(() => {
        setMainLoading(false);
        setIsMakingPayment(false); // Stop loading
      });
  };

  const handleItemSelect = (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? (console.log(item.stripe_card_id),
          setselectedMethod(item.stripe_card_id),
          { ...item, selected: true })
        : { ...item, selected: false }
    );
    setItems(updatedItems);
  };

  const handleAddItem = async () => {
    const number = cardnumber.slice(0, 19);
    const nameRegex = /^[a-zA-Z ]{2,30}$/;

    console.log(number, number.length === 19, expiry, newItemName, cvv);
    console.log("Adding Card Method");

    if (number.length < 19) {
      setNumberError(true);
    }
    if (!newItemName || !nameRegex.test(newItemName)) {
      setNameError(true);
    }
    if (newItemName != 0) {
      setNameError(false);
    }
    if (cardnumber.length == 19) {
      setNumberError(false);
    }
    if (cvv.length < 3) {
      setCvvError(true);
    }
    if (cvv.length == 3) {
      setCvvError(false);
    }
    if (expiry.length < 7) {
      setExpiryError(true);
    }
    if (expiry.length == 7) {
      const [expiryMonth, expiryYear] = expiry.split("/");
      const currentYear = new Date().getFullYear().toString();
      // console.log("=====================-=-=-=-", currentYear);
      const currentMonth = new Date().getMonth() + 1;
      console.log(typeof expiryMonth);
      // console.log("sdfghjklygrdr6dr6drr", expiryMonth, expiryYear);
      if (parseInt(expiryMonth, 10) > 12 || expiryMonth === "00") {
        console.log("yeh condition check bhi ho rahi hai ???");
        setExpiryError(true);
      }

      if (parseInt(expiryYear, 10) < parseInt(currentYear, 10)) {
        setExpiryError(true);
      } else if (
        parseInt(expiryYear, 10) === parseInt(currentYear, 10) &&
        parseInt(expiryMonth, 10) < currentMonth
      ) {
        setExpiryError(true);
      } else if (parseInt(expiryMonth, 10) > 12) {
        setExpiryError(true);
      } else {
        setExpiryError(false);
      }
    } else {
      setSnackbarVisible(true);
    }
    if (
      number.length === 19 &&
      expiry.length === 7 &&
      newItemName &&
      cvv.length === 3
    ) {
      setIsLoading(true);
      const newItem = {
        id: items.length + 1,
        name: newItemName,
        selected: false,
        number,
        cvv,
        expiry,
      };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: newItemName,
          email: "sk20012404@gmail.com",
          number,
          expiry,
          cvv,
        }),
      };
      try {
        // console.log("mere tak a gya");
        const response = await fetch(
          api + "payment/new_payment_method",
          requestOptions
        );
        // console.log("Inside Add Card Try block");
        // console.log(response.ok);
        const data = await response.json();
        // console.log(data);

        if (response.status === 200) {
          // console.log(data);
          setShow(true);
          setShowNewItemForm(false);
          setApiError("Card Added Successfully!");
          getArticles();
          setNewItemName("");
          setCardNumber("");
          setCvv("");
          setExpiry("");
        } else if (response.status === 402) {
          // console.log(data.error.code);
          setShow(true);
          setApiError(`Invalid Card Details - ${data.error.code}`);
          if (data.error.code == "invalid_expiry_year") setExpiryError(true);
          if (data.error.code == "invalid_expiry_month") setExpiryError(true);
          if (data.error.code == "incorrect_number") setNumberError(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
      getArticles();
      // setNewItemName("");
      // setCardNumber("");
      // setCvv("");
      // setExpiry("");
      // setShowNewItemForm(false);
    }
  };

  const formatExpiryDate = (inputValue) => {
    const formattedValue = inputValue
      .replace(/\D/g, "")
      .match(/^(\d{1,2})(\d{0,4})/)
      .slice(1)
      .filter(Boolean)
      .join("/");
    setExpiry(formattedValue);
  };

  const handleExpiryDateChange = (inputValue) => {
    setExpiryError("");
    if (inputValue.length === 0) {
      setExpiry(null);
    } else {
      formatExpiryDate(inputValue);
    }
  };

  const formatCardNumber = (inputValue) => {
    setNumberError("");
    const formattedValue = inputValue.replace(/\s/g, "").match(/.{1,4}/g);
    if (formattedValue) {
      const joinedValue = formattedValue.join(" ");
      setCardNumber(joinedValue);
    } else {
      setCardNumber("");
    }
  };

  return (
    <>
      {mainLoading && (
        <ActivityIndicator color={"black"} size={40} style={{ flex: 20 }} />
      )}

      {showLottie ? (
        <PaymentLottie />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ marginHorizontal: "5%" }}>
            <Titlebar title={"Payment"} />
          </View>
          <SavedCard />
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleItemSelect(item.id)}
                style={CustomStyles.flatListContainer}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Logo brand={item.name} />
                  <Text
                    style={{
                      fontSize: 17,
                      marginRight: 10,
                      fontFamily: "Montserrat_600SemiBold",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontStyle: "italic",
                      fontFamily: "Montserrat_600SemiBold",
                    }}
                  >
                    XXXX {item.card_no}
                  </Text>
                </View>
                <View style={CustomStyles.selectItem}>
                  {item.selected && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#0C8A7B",
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => setShowNewItemForm(true)}
            style={CustomStyles.newCardOption}
          >
            <View style={{ flexDirection: "row", marginHorizontal: "2%" }}>
              <Icon />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "Montserrat_600SemiBold",
                  marginBottom: 10,
                }}
              >
                Add New Card
              </Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </TouchableOpacity>
          <View style={CustomStyles.toPayButton}>
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                marginVertical: 5,
              }}
            >
              To pay
            </Text>
            <Text
              style={{ fontFamily: "Montserrat_400Regular", marginVertical: 5 }}
            >
              $ {price}
            </Text>
          </View>
          {selectedMethod ? (
            <TouchableOpacity
              onPress={() => payment()}
              style={CustomStyles.makePaymentButton}
              disabled={isMakingPayment}
            >
              {isMakingPayment ? ( // Show loading indicator if making payment
                <ActivityIndicator color="white" size="large" />
              ) : (
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    color: "white",
                    marginVertical: 5,
                  }}
                >
                  Make Payment
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <View
              style={{
                marginHorizontal: "4.5%",
                justifyContent: "center",
                alignItems: "center",
                padding: 8,
                marginBottom: 20,
                borderRadius: 8,
                backgroundColor: "grey",
              }}
            >
              <Text
                style={{ fontWeight: "500", color: "white", marginVertical: 5 }}
              >
                Make Payment
              </Text>
            </View>
          )}

          <Modal
            visible={showNewItemForm}
            onRequestClose={() => setShowNewItemForm(false)}
            transparent
          >
            <View style={CustomStyles.modalContainer}>
              <View style={CustomStyles.modalContent}>
                <NewCard />
                <CustomOutlinedTextInput
                  label={"Card Number"}
                  onChangeText={formatCardNumber}
                  value={cardnumber}
                  maxLen={19}
                  width={330}
                  keyboard={"numeric"}
                />
                {numberError ? (
                  <Text
                    style={{
                      color: "red",
                      fontFamily: "Montserrat_400Regular",
                    }}
                  >
                    Invalid Card Number
                  </Text>
                ) : null}
                <CustomOutlinedTextInput
                  label={"Card Holder Name"}
                  onChangeText={(text) => {
                    setNameError("");
                    setNewItemName(text);
                  }}
                  value={newItemName}
                  width={330}
                  keyboard={"default"}
                />
                {nameError ? (
                  <Text
                    style={{
                      color: "red",
                      fontFamily: "Montserrat_400Regular",
                    }}
                  >
                    Invalid Name
                  </Text>
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <View>
                    <CustomOutlinedTextInput
                      label={"CVV"}
                      onChangeText={(text) => {
                        setCvv(text);
                        setCvvError("");
                      }}
                      value={cvv}
                      width={150}
                      maxLen={3}
                      keyboard={"numeric"}
                      secureTextEntry={true}
                    />
                    {cvvError ? (
                      <Text
                        style={{
                          color: "red",
                          fontFamily: "Montserrat_400Regular",
                        }}
                      >
                        Invalid CVV
                      </Text>
                    ) : null}
                  </View>
                  <View>
                    <CustomOutlinedTextInput
                      label={"Expiry"}
                      onChangeText={handleExpiryDateChange}
                      value={expiry}
                      width={150}
                      maxLength={7}
                      keyboard={"numeric"}
                    />
                    {expiryError ? (
                      <Text
                        style={{
                          color: "red",
                          fontFamily: "Montserrat_400Regular",
                        }}
                      >
                        Invalid Expiry
                      </Text>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleAddItem()}
                  style={CustomStyles.addNewCardButtonContainer}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="large" /> // Show the activity indicator while loading
                  ) : (
                    <Text style={CustomStyles.addNewCardButtonText}>
                      Add Card
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={1000}
            >
              Please fill out all fields correctly.
            </Snackbar>
          </Modal>
          <Snackbar
            visible={paymentSuccess}
            onDismiss={() => setPaymentSuccess(false)}
            duration={1000}
          >
            Payment Succesfull
          </Snackbar>
          <Snackbar
            visible={show}
            onDismiss={() => setShow(false)}
            duration={1000}
          >
            {apiError}
          </Snackbar>
        </View>
      )}
      <CheckInternet />
    </>
  );
};

export default Payment;
