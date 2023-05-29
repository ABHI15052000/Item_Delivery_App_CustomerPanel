import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-toast-message";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import notifee, { EventType, AndroidImportance } from "@notifee/react-native";
import { AndroidStyle } from "@notifee/react-native";

export const FcmToken = ({ inputSelect }) => {
  const [idtoken, setIdtoken] = useState("");

  async function onDisplayNotification(data) {
    const channelId = await notifee.createChannel({
      id: "important",
      name: "Important Notifications",
      importance: AndroidImportance.HIGH,
    });
    // console.log(channelId);
    await notifee.displayNotification({
      title: data.notification.title,
      //subtitle: '🎃',
      body: data.notification.body,
      android: {
        channelId,
        color: "#4caf50",
      },
    });
  }

  async function requestUserPermission() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
  }
  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          // console.log(token)

          inputSelect(token);
          setIdtoken(token);
        });
    } else {
      // console.log("Permission denied status", authStatus);
    }
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
      navigation.navigate(remoteMessage.data.type);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      title = JSON.stringify(remoteMessage);
      const jsonObj = JSON.parse(title);
      // console.log("-----------------", jsonObj);
      // Toast.show({
      //     type: "success",
      //     text1: jsonObj.notification.title,
      //     text2: jsonObj.notification.body
      //   });
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  return <View></View>;
};
