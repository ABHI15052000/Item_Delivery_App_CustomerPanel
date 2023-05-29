import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { BlackButton } from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker from "react-native-country-picker-modal";
import TextInputs from "../components/TextInputs";
import { api } from "../../Api";
import { Snackbar } from "react-native-paper";
import CheckInternet from "../components/CheckInternet";
import { codeFinder } from "../components/CountryCode";
const MView = styled.View`
flex:1;
background-color:white
margin-top:20px;
`;
const TopView = styled.View`
  margin-top: 15px;
  flex-direction: row;
  border: 1px;
  border-color: white;
  padding: 10px;
  margin: 10px;
  width: 95%;
  elevation: 5;
  margin: 10px;
  border-radius: 8px;
  background-color: white;
`;
const MText = styled.Text`
  fontfamily: "Montserrat_500Medium";
  margin-left: 35%;
`;
const AvatarView = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
const AvatarText = styled.Text`
margin-top:10px;
font-size:22px;
text-align:center;
color:black
fontFamily:"Montserrat_500Medium"
`;

const BorderView = styled(View)`
  border: 1px solid lightgrey;
  padding: 5px 20px;
  border-radius: 5px;
  margin: 10px 0px;
`;
const PhoneInputView = styled(View)`
  padding-vertical: 4px;
  flex-direction: row;
  align-items: center;
`;
const FterView = styled.View`
flex:1
background-color:white;
width:100%;
// height:90%;
border-top-left-radius:20px;
border-top-right-radius:20px;
padding:10px;

`;
const EditProfile = ({ route }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editable, setEditable] = useState(false);
  const [buttonText, setButtonText] = useState("Edit Profile");
  const [photo, setPhoto] = useState(null);
  const [callingCode, setCallingCode] = useState("91");
  const [countryCode, setCountryCode] = useState("IN");
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const navigation = useNavigation();
  const [authToken, setAuthToken] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [save, setSave] = useState(false);
  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });
  async function getApi() {
    // console.log("fetch profile");
    setMainLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };
    const response = await fetch(api + "get", requestOptions);

    const json = await response.json();

    return json;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (
        authToken !== null &&
        authToken !== undefined &&
        authToken.length !== 0 &&
        userData == null
      ) {
        try {
          const json = await getApi();
          // console.log("json:", json); // log the json object
          if (json && json.data.phone) {
            setUserData(json.data);
            setPhone(json.data.phone);
            const callCode = json.data.calling_code;
            const flag = codeFinder(callCode);
            setCountryCode(flag);
          }
          if (json && json.data.name) {
            setName(json.data.name);
            setEmail(json.data.email);
            setAddress(json.data.address);
            setPhoto(api + json.data.photo_uri);
            AsyncStorage.setItem("name", json.data.name);
            AsyncStorage.setItem("-photo", api + json.data.photo_uri);
          } else {
          }
        } catch (error) {
          setMainLoading(false);
          // console.log("Error fetching data:", error);
        } finally {
          setMainLoading(false);
        }
      }
    };
    fetchData();
  }, [authToken, handleSavePress]);

  useEffect(() => {
    const backAction = () => {
      if (name === "" || name === null) {
        setError("Enter Name");
        return true; // Prevent the back action
      } else if (!isValidEmail(email)) {
        setError1("Enter email");
        return true; // Prevent the back action
      } else if (address === "" || address === null) {
        setError3("Enter address");
        return true; // Prevent the back action
      } else if (buttonText === "Save") {
        setSaveError("Save Details First!!");
        return true;
      } else {
        navigation.replace("Main");
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [name, address, email, buttonText]);
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSavePress = () => {
    setError2(null);
    const nameRegex = /^[a-zA-Z ]{2,30}$/;
    const addressRegex = /^[a-zA-Z0-9\s\-\#\,\.]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    // Check if inputs are valid
    if (!nameRegex.test(name) || !name) {
      setError("Invalid Name", "Please enter a valid name.");
      return;
    }
    if (!emailRegex.test(email) || !email) {
      setError1("Invalid Email", "Please enter a valid email address.");
      return;
    }
    // if (!phoneRegex.test(phone)) {
    //   setError2("Invalid Phone", "Please enter a valid 10-digit phone number.");
    //   return;
    // }
    if (!addressRegex.test(address) || !address) {
      setError3(
        "Invalid Address",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }
    setSave(true);
    setMainLoading(true);
    setLoading(true);
    setEditable(false);
    handleUpdate();
    // handleSubmit();
    setButtonText("Edit Profile");
    setSaveError("");
  };
  const handleEditPress = () => {
    setError2(null);
    setEditable(true);
    setButtonText("Save");
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setModalVisible(false);
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        const photoUri = result.assets[0].uri;
        // console.log(photoUri);
        setPhoto(photoUri);
        await AsyncStorage.setItem("-photo", photoUri);
      }
    } else {
      alert("Camera permission not granted");
    }
  };

  const getProfilePicture = async () => {
    const photoUri = await AsyncStorage.getItem(`-photo`);
    if (photoUri !== "") {
      setPhoto(photoUri);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProfilePicture();
    }, [])
  );
  const pickImage = useCallback(async () => {
    setModalVisible(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        const photoUri = result.assets[0].uri;
        setPhoto(photoUri);
        await AsyncStorage.setItem("-photo", photoUri);
      }
    } catch (error) {
      console.log(error);
    }
  }, [photo]);
  const formdata = new FormData();
  const handleUpdate = async () => {
    if (!photo) {
      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("phone", phone);
      formdata.append("address", address);
      formdata.append("calling_code", callingCode);
    } else {
      formdata.append("photo_uri", {
        uri: photo,
        name: "image.jpg",
        type: "image/jpeg",
      });

      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("phone", phone);
      formdata.append("address", address);
      formdata.append("calling_code", callingCode);
    }
    let token = "";
    try {
      token = await AsyncStorage.getItem("token");
    } catch (error) {
      console.log("cannot get token", error);
    }
    const requestOptions = {
      method: "POST",
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    };

    try {
      await fetch(api + "update", requestOptions).then((response) => {
        // console.log(JSON.stringify(response));
        response.json().then((data) => {
          // console.log("update hu dost", data);
          setShow(true);
          setMessage("Profile Updated Successfully.");
          setTimeout(() => {
            setShow(false);
          }, 1000);
        });
      });
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setLoading(false);
    } finally {
      setSave(false);
      setMainLoading(false);
    }
  };
  return (
    <>
      {mainLoading ? (
        <View
          flex={1}
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {save ? (
            <Text
              style={{
                color: "black",
                fontSize: 26,
                fontFamily: "Montserrat_400Regular",
              }}
            >
              Saving Data{" "}
            </Text>
          ) : (
            ""
          )}
          <ActivityIndicator color={"black"} size={40} />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 8 }}>
          <MView>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Choose an Option</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={pickImage}
                    >
                      <Text style={styles.textStyle}>Gallery</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={handleTakePhoto}
                    >
                      <Text style={styles.textStyle}>Camera</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
            <View
              style={{
                height: 53,
                marginTop: 10,
                backgroundColor: "white",
                borderRadius: 8,
                width: "94%",
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
              <View style={{ position: "absolute", left: 15 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (name === "" || name === null) {
                      setError("Enter Name");
                      return true; // Prevent the back action
                    } else if (!isValidEmail(email)) {
                      setError1("Enter email");
                      return true; // Prevent the back action
                    } else if (address === "" || address === null) {
                      setError3("Enter address");
                      return true; // Prevent the back action
                    } else if (buttonText === "Save") {
                      setSaveError("Save Details First!!");
                      return true;
                    } else {
                      navigation.replace("Main");
                      return true;
                    }
                  }}
                >
                  <AntDesign name="left" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16 }}>
                {" "}
                {editable ? "Edit Profile" : "Profile"}{" "}
              </Text>
            </View>

            <AvatarView>
              {!photo && (
                <Avatar
                  rounded
                  size="xlarge"
                  source={{
                    uri: "https://images.unsplash.com/photo-1580518337843-f959e992563b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
                  }}
                  activeOpacity={0.7}
                />
              )}
              {photo && (
                <Avatar
                  rounded
                  size={180}
                  source={{ uri: photo }}
                  backgroundColor="#2182BD"
                />
              )}

              {editable ? (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 100,
                    bottom: 10,
                    backgroundColor: "#0C8A7B",
                    borderRadius: 27,
                    padding: 10,
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  <Entypo
                    name="camera"
                    size={30}
                    color="white"
                    style={[styles.button, styles.buttonOpen]}
                  />
                </TouchableOpacity>
              ) : null}
            </AvatarView>
            <AvatarText>{name}</AvatarText>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <FterView flex={1}>
                <TextInputs
                  label="Name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setError(null);
                  }}
                  disabled={!editable}
                  mode="outlined"
                />
                {error && (
                  <Text style={{ color: "red", alignSelf: "center" }}>
                    {error}
                  </Text>
                )}
                <TextInputs
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError1(null);
                  }}
                  disabled={!editable}
                  mode="outlined"
                />
                {error1 && (
                  <Text style={{ color: "red", alignSelf: "center" }}>
                    {error1}
                  </Text>
                )}
                <BorderView>
                  <Text
                    style={{
                      position: "absolute",
                      paddingHorizontal: 6,
                      top: -10,
                      left: 7,
                      backgroundColor: "white",
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: "lightgrey",
                    }}
                  >
                    Phone
                  </Text>
                  <PhoneInputView>
                    <View style={{ pointerEvents: "none" }}>
                      <CountryPicker
                        withFilter
                        countryCode={countryCode}
                        withFlag
                        // withCountryNameButton
                        withAlphaFilter={false}
                        withCallingCode
                        withCurrencyButton={false}
                        onSelect={(country) => {
                          // console.log(country)
                          const { cca2, callingCode } = country;
                          setCountryCode(cca2);
                          setCallingCode(callingCode[0]);
                        }}
                        containerButtonStyle={{
                          alignItems: "center",
                          marginRight: -10,
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 14, color: "lightgrey" }}>
                      {" "}
                      |{" "}
                    </Text>
                    <TextInput
                      value={phone}
                      flex={1}
                      onChangeText={(text) => {
                        setPhone(text), setError2(null);
                      }}
                      mode="outlined"
                      keyboardType={"phone-pad"}
                      maxLength={15}
                      editable={false}
                    />
                    {error2 && <Text style={{ color: "red" }}>{error2}</Text>}
                  </PhoneInputView>
                </BorderView>
                <TextInputs
                  label="Address"
                  value={address}
                  onChangeText={(text) => {
                    setAddress(text), setError3(null);
                  }}
                  disabled={!editable}
                  mode="outlined"
                />
                {error3 && (
                  <Text style={{ color: "red", alignSelf: "center" }}>
                    {error3}
                  </Text>
                )}

                <View style={{ marginTop: "auto" }}>
                  {saveError && (
                    <Text style={{ color: "red", alignSelf: "center" }}>
                      {saveError}
                    </Text>
                  )}

                  {loading ? (
                    <View marginTop="auto">
                      <ActivityIndicator color="black" size="large" />
                    </View>
                  ) : (
                    <View marginTop="auto">
                      <BlackButton
                        title={buttonText}
                        onPress={editable ? handleSavePress : handleEditPress}
                      />
                    </View>
                  )}
                </View>
              </FterView>
            </ScrollView>
            <Snackbar visible={show} onDismiss={() => setShow(false)}>
              {message}
            </Snackbar>
            <StatusBar style="dark" />
          </MView>
          <CheckInternet />
        </SafeAreaView>
      )}
    </>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "column",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    // flexDirection:"row",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    //   flex: 1,
  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
  },
  buttonClose: {
    borderRadius: 10,
    backgroundColor: "#0C8A7B",
    padding: 10,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    backgroundColor: "#0C8A7B",
    padding: 10,
    color: "white",
    borderRadius: 10,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});
