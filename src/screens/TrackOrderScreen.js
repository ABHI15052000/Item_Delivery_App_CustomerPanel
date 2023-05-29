import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "../../Api";
import BottomSheetContents from "./BottomSheetContents";
import styled from "styled-components/native";
import CustomSidebar from "../components/ModalComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLastNotificationResponse } from "expo-notifications";
import Titlebar from "../components/TitileBar";
import Mapbox from "@rnmapbox/maps";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CheckInternet from "../components/CheckInternet";

Mapbox.setWellKnownTileServer("Mapbox");

Mapbox.setAccessToken(
  "pk.eyJ1IjoiaGFyc2h1MTQxMiIsImEiOiJjbGdtMWN1MHMwMWMxM3FwcGZ3a3p2ajliIn0.sAqxecqbNtP8fVkl_9m9xQ"
);
const SBView = styled.View`
  flex-direction: row;
  // text-align:center;
  // align-content:center;
  // jusitfy-content:center;
  margin-horizontal: 5%;
  margin-top: 20px;
  padding: 10px;
  border: 1px;
  border-color: white;
  border-radius: 8px;
  background-color: white;
  elevation: 5;
`;
const AvatarView = styled.View`
  margin-left: 26%;
  margin-right: 3%;
`;

const bikeimage = require("../../assets/bike.png");
const TrackOrderScreen = ({ route }) => {
  const {
    driver_orderId,
    Pickup_from,
    Deliver_To,
    user_id,
    pickup_latitude,
    pickup_longitude,
    delivery_latitude,
    delivery_longitude,
    driver_id,
    distance,
  } = route.params;
  const [driverPhoto, setDriverPhoto] = useState("");
  const [carNumber, setCarNumber] = useState("ABC-123");
  const [pickupLocation, setPickupLocation] = useState("123 Main Street");
  const [dropLocation, setDropLocation] = useState("456 Park Avenue");
  const [authToken, setAuthToken] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverLong, setDriverLong] = useState("");
  const [driverLat, setDriverLat] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const bottomSheetRef = useRef();

  // variables
  const snapPoints = useMemo(() => ["15%", "40%", "50%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const navigation = useNavigation();
  AsyncStorage.getItem("token").then((token) => {
    setAuthToken(token);
  });

  const fetchLatestLocation = async () => {
    const locationDocRef = doc(db, "LocationData", `${driver_orderId}`);
    const locationDocSnapshot = await getDoc(locationDocRef);
    if (locationDocSnapshot.exists()) {
      const locationData = locationDocSnapshot.data();
      setDriverLat(locationData.latitude);
      setDriverLong(locationData.longitude);
      // return { driverLat, driverLong };
    }
  };

  useEffect(() => {
    fetchLatestLocation();
  }, [driverLong, driverLat]);
  setInterval(() => {
    fetchLatestLocation();
  }, 20000);
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    getDriverData();
  }, [authToken]);

  const getDriverData = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };
    try {
      await fetch(
        `${api}feedback/driver_feedback/${driver_orderId}`,
        requestOptions
      ).then((response) => {
        response.json().then((data) => {
          setDriverName(data.data.name);
          setDriverPhone(data.data.phone);
          setDriverPhoto(data.data.photo_uri);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ marginTop: 20 }}></View>

      <View style={styles.titleBarContainer}>
        <Titlebar title="Track Order" />
      </View>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Camera
            zoomLevel={10}
            centerCoordinate={[
              // pickup_latitude,
              // pickup_longitude
              driverLong || pickup_longitude,
              driverLat || pickup_latitude,
            ]}
          />
          {/* <Mapbox.PointAnnotation id="pickupLocation" coordinate={[ pickup_longitude,pickup_latitude]} >
            <Mapbox.Callout title="Pickup Location" />
             </Mapbox.PointAnnotation> */}
          <Mapbox.MarkerView
            id="markerId"
            coordinate={[pickup_longitude, pickup_latitude]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require("../../assets/pickup-loc.png")}
                style={styles.markerImage}
              />
            </View>
          </Mapbox.MarkerView>
          <Mapbox.MarkerView
            id="pickupLocation"
            coordinate={[delivery_longitude, delivery_latitude]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require("../../assets/hom-loc.png")}
                style={styles.markerImage2}
              />
            </View>
          </Mapbox.MarkerView>

          {driverLong !== "" && (
            <Mapbox.MarkerView
              id="currentLocation"
              coordinate={[driverLong, driverLat]}
              anchor={{ x: 0.5, y: 1 }}
            >
              <View style={styles.markerContainer}>
                <Image
                  source={require("../../assets/bike1.png")}
                  style={styles.markerImage2}
                />
              </View>
            </Mapbox.MarkerView>
          )}

          {/* <Mapbox.PointAnnotation id="pickupLocation" coordinate={[delivery_longitude, delivery_latitude]} /> */}
        </Mapbox.MapView>
        <Image source={bikeimage} style={{ width: 32, height: 32 }} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetContents
          driverPhoto={driverPhoto}
          driverOrderId={driver_orderId}
          driverName={driverName}
          carNumber={carNumber}
          pickupLocation={Pickup_from}
          dropLocation={Deliver_To}
          phone={driverPhone}
          distance={distance}
        />
      </BottomSheet>
      <CheckInternet />
    </GestureHandlerRootView>
  );
};

export default TrackOrderScreen;
const styles = StyleSheet.create({
  container: {
    // height:"100%",
    position: "relative",
    flex: 1,
  },
  map: {
    flex: 1,
  },
  titleBarContainer: {
    position: "absolute",
    top: 10,
    flex: 1,
    zIndex: 11,
    width: "90%",
    alignSelf: "center",
  },
  markerContainer: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    height: 40,
    width: 40,
  },
  markerImage2: {
    height: 50,
    width: 50,
  },
});
