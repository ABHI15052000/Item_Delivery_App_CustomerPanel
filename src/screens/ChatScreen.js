import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  Keyboard,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { ChatMessage } from "../components/ChatMessage";
import { Header } from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderPics from "../components/HeaderPics";
import CheckInternet from "../components/CheckInternet";
export const ChatScreen = ({ route }) => {
  const {
    orderId,
    item_type,
    Pickup_from,
    Deliver_To,
    Billing_Details,
    status,
    user_id,
  } = route.params;
  // const navigation=useNavigation();
  const [user, setUser] = useState([]);
  const navigation = useNavigation();
  const [data, setData] = useState("");
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const getName = () => {
    AsyncStorage.getItem("name").then((name) => {
      setName(name);
      // console.log(name);
    });
  };
  useEffect(() => {
    getName();
  }, [name]);

  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const chatId = `${orderId}_${user_id}`;
  const ref = collection(db, "Chat_Customer");

  {
    /* Fetch chats and check that if chat already exists than continue chatting otherwise creation of new chat function called */
  }
  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (querySnapshot) => {
      const user = [];
      querySnapshot.forEach((doc) => {
        const { timestamp, chatName } = doc.data();
        user.push({
          id: doc.id,
        });
      });
      setUser(user);
      var count = 0;
      if (user.length > 0) {
        for (let i = 0; i < user.length; i++) {
          if (user[i].id == chatId) {
            count++;
          }
        }
        if (count > 0) {
          setId(chatId);
          // console.log(count,id)
        } else {
          addChat();
        }
      } else addChat();
    });
    return () => unsubscribe();
  }, []);

  const sendmessage = async () => {
    if (!data) {
      // console.log("Kuch daal do msg mein");
      Alert.alert("Please Fill Something !");
      return;
    }
    try {
      const docRef = await addDoc(
        collection(db, `Chat_Customer/${chatId}/messages`),
        {
          message: data,
          timestamp: serverTimestamp(),
          senderName: name,
          messageId: Date.now(),
          from: user_id,
          id: makeid(26),
        }
      );
      setData("");
      //setScroll(true)
      // sendtoapi();
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const addChat = async () => {
    //const myDocumentId = "749823_89723608765";
    const documentRef = doc(db, "Chat_Customer", chatId);
    const documentData = {
      timestamp: serverTimestamp(),
    };

    setDoc(documentRef, documentData)
      .then(() => {
        // console.log('Document added successfully');
        setId(chatId);
        // console.log(id)
      })
      .catch((error) => {
        console.log("Error adding document:", error);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F3F3F3",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <HeaderPics title={name} />

      {/* order view */}

      <View
        style={{
          borderRadius: 10,
          margin: 10,
          width: "90%",
          alignSelf: "center",
          backgroundColor: "white",
          padding: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              marginTop: 10,
              marginLeft: 10,
              fontSize: 14,
              fontWeight: "bold",
              color: "#394F6B",
            }}
          >
            Order #{orderId}{" "}
          </Text>
          <View
            style={{
              marginTop: 10,
            }}
          >
            {status === "Accepted" && (
              <Text style={styles.statusTextAccepted}>{status}</Text>
            )}
            {status === "Completed" && (
              <Text style={styles.statusTextCompleted}>{status}</Text>
            )}
            {status === "Cancelled" && (
              <Text style={styles.statusTextCancelled}>{status}</Text>
            )}
            {status === "Pending" && (
              <Text style={styles.statusText}>{status}</Text>
            )}
          </View>
        </View>
        <View>
          <Text style={{ marginLeft: 10, fontSize: 14 }}>
            Item Type :{" "}
            <Text style={{ fontSize: 14, fontWeight: "bold", fontSize: 14 }}>
              {item_type}
            </Text>{" "}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingLeft: 5,
            paddingBottom: 5,
            paddingTop: 5,
          }}
        >
          <Ionicons name="location-sharp" size={15.82} color="#BFBFBF" />
          <Text style={{ fontSize: 12, flexWrap: "wrap", maxWidth: "90%" }}>
            {" "}
            {Pickup_from}{" "}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", marginBottom: 15, paddingLeft: 5 }}
        >
          <Ionicons name="location-sharp" size={15.82} color="#FF9C1C" />
          <Text style={{ fontSize: 12, flexWrap: "wrap", maxWidth: "90%" }}>
            {" "}
            {Deliver_To}{" "}
          </Text>
        </View>
      </View>

      {/* order view closed */}

      <View style={{ flex: 1 }}>
        <ChatMessage idchat={id} user_id={user_id} />
      </View>

      <View
        style={{
          borderRadius: 10,
          padding: 10,
          flexDirection: "row",
          backgroundColor: "white",
          marginTop: 5,
          margin: 15,
          justifyContent: "flex-end",
        }}
      >
        <TextInput
          value={data}
          onChangeText={(t) => {
            setData(t);
          }}
          style={{ flex: 1, alignSelf: "flex-start" }}
          placeholder="Type a message"
        />
        <TouchableOpacity
          onPress={() => {
            {
              sendmessage();
            }
          }}
        >
          <Feather
            style={{ alignSelf: "flex-end" }}
            name="send"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <CheckInternet />
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="#F3F3F3"
        translucent={true}
      />
    </View>
  );
};

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
  statusText: {
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "#e3e3e8",
    color: "#8E8EA1",
    fontWeight: 600,
    borderRadius: 15,
    // marginRight: 20,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  statusTextAccepted: {
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "#FFF6E7",
    color: "#FF9C1C",
    fontWeight: 600,
    borderRadius: 15,
    // marginRight: 20,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  statusTextCompleted: {
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "#E6FAEE",
    color: "#00C853",
    fontWeight: 600,
    borderRadius: 15,
    // marginRight: 20,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  statusTextCancelled: {
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "#FF151514",
    color: "#FF4A55",
    fontWeight: 600,
    borderRadius: 15,
    // marginRight: 20,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
});
