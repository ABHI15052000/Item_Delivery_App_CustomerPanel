import { View, Text, FlatList, ScrollView, StyleSheet,ActivityIndicator } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { ScrollIntoView, scrollToEnd } from "react-native-scroll-into-view";
export const ChatMessage = (props) => {
  const { idchat, user_id } = props;
  // console.log(idchat,"chatmesage")
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  //const chatId = "GVZQXCXlHhwVcGjSu60W";
  const userref = collection(db, `Chat_Customer/${idchat}/messages`);
  const messagesQuery = query(userref, orderBy("timestamp"));
  useEffect(() => {
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const user = [];
      querySnapshot.forEach((doc) => {
        const { timestamp, message, from, messageId, senderName } = doc.data();
        user.push({
          timestamp,
          message,
          from,
          messageId,
          senderName,
        });
      });
      setUser(user);
      setLoading(false);
      //console.log(loading,"loading")
      //  console.log(user[0].from)
    });

    return () => unsubscribe();
  }, [idchat]);
  const childListRef = useRef(null);
  const scroll = () => {
    if (childListRef.current && user.length > 0) {
      childListRef.current.scrollToEnd({ animated: true });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      scroll();
    }, 2000);
  }, [loading, user]);

  function formatTimestamp(timestamp) {
    if (!timestamp) {
      return "";
    }
    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // return `${hours}:${minutes}`;
    return `${date}`;
  }

  function format(timestamp) {
    if (!timestamp) {
      return "";
    }
    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
    //return `${date}`
  }
  var arr = [];

  for (var i = 0; i < user.length; i++) {
    const u = user[i].timestamp;
    // console.log(u)
    let createdAt = new Date(formatTimestamp(u));
    var d = createdAt.toDateString();
    arr.push({
      message: user[i].message,
      timestamp: d,
      time: user[i].timestamp,
      from: user[i].from,
    });
  }
  //console.log(arr)
  const [chatMessages, setChatMessages] = useState(arr);
  const groupedChatMessages = arr.reduce((result, m) => {
    const date = m.timestamp;
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(m);
    return result;
  }, {});

  const renderItem = ({ item }) => {
    if (item.from === user_id) {
      return (
        <View style={styles.messageMainContainer}>
          <View style={styles.messageContainer}>
            <Text
              style={{
                fontSize: 18,
                margin: 10,
                fontFamily: "Montserrat_400Regular",
              }}
            >
              {item.message}
            </Text>
            <Text style={styles.messageText}>{format(item.time)}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.messageMainContainerTo}>
          <View style={styles.messageContainerTo}>
            <Text
              style={{
                fontSize: 18,
                margin: 10,
                fontFamily: "Montserrat_400Regular",
              }}
            >
              {item.message}
            </Text>
            <Text style={styles.messageTextTo}>{format(item.time)}</Text>
          </View>
        </View>
      );
    }
  };

  const renderDate = (i) => {
    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (i === today.toDateString()) {
      return "Today";
    } else if (i === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return i;
    }
  };

  const renderGroup = ({ item }) => {
    if (item.date != "Invalid Date") {
      return (
        <View>
          <View style={styles.datecontainer}>
            <Text style={{ fontFamily: "Montserrat_400Regular" }}>
              {renderDate(item.date)}
            </Text>
          </View>
          <View>
            
            <FlatList
              data={item.messages}
              renderItem={renderItem}
              //ref={childListRef}
              // inverted={true}
              // keyExtractor={(message) => message.id.toString()}
            />
          </View>
        </View>
      );
    } else {
      <View></View>;
    }
  };

  const groupedChatMessagesArray = Object.keys(groupedChatMessages).map(
    (date) => ({
      date,
      messages: groupedChatMessages[date],
    })
  );
  //   console.log(groupedChatMessages);

  return (
    <View>
    {loading ? (
      <ActivityIndicator size="large" color="#000000" />
    ) : (
      <FlatList
        data={groupedChatMessagesArray}
        renderItem={renderGroup}
        ref={childListRef}
        keyExtractor={(group) => group.date}
      />
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  messageMainContainer: { flexDirection: "row", justifyContent: "flex-end" },
  messageMainContainerTo: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  messageContainer: {
    backgroundColor: "#E6FAEE",
    marginBottom: 10,
    marginRight: 15,
    borderTopLeftRadius: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
    borderBottomLeftRadius: 10,
    minWidth: "25%",
    maxWidth: "70%",
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: "green",
  },
  messageText: {
    fontSize: 12,
    color: "grey",
    paddingRight: 5,
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginLeft: "auto",
    fontFamily: "Montserrat_600SemiBold",
  },
  messageContainerTo: {
    backgroundColor: "#EEEEEE",
    marginBottom: 10,
    marginLeft: 15,
    borderTopRightRadius: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
    borderBottomRightRadius: 10,
    minWidth: "25%",
    maxWidth: "70%",
    borderTopLeftRadius: 30,
    borderWidth: 1,
    borderColor: "grey",
  },
  messageTextTo: {
    fontSize: 12,
    color: "grey",
    paddingRight: 5,
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginLeft: "auto",
    fontFamily: "Montserrat_600SemiBold",
  },
  datecontainer: {
    borderRadius: 10,
    backgroundColor: "lightgrey",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 5,
    margin: 10,
  },
});
