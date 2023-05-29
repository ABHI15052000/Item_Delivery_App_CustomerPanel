import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,  } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Avatar } from 'react-native-elements';
import call from 'react-native-phone-call';
import { Button } from '../components/Button';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { api } from '../../Api';

const BottomSheetContents = ({ driverOrderId,driverPhoto, carNumber, pickupLocation, dropLocation,driverName, phone, distance}) => {
  const bottomSheetRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const navigation = useNavigation();
  AsyncStorage.getItem('token').then((token) => {
    setAuthToken(token)
  });
  const getProfilePicture = async () => {
    const photoUri = await AsyncStorage.getItem(`-photo`);
    setPhoto(photoUri);

  };
  useFocusEffect(
    useCallback(() => {
      getProfilePicture();
    }, [])
  );

  const args = {
    number: phone, // String value with the number to call
    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
    skipCanOpen: true // Skip the canOpenURL check
  }
  
  const onCallHandler = () =>{
    call(args).catch(console.error)
  } 


  return (
    <Animatable.View
      // ref={bottomSheetRef}
      style={styles.bottomSheet}
      animation="slideInUp">
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          elevation: 4,
          padding: 15,
          backgroundColor: "white",
          marginBottom: 10,
          borderRadius:12,
          
        }}>
        <View style={{flexDirection:'row'}}>
        {photo !== null ? 
        <Avatar
            size="medium"
            rounded
            source={{uri: api+driverPhoto}}
          />
          :
          <Avatar
            size="medium"
            rounded
            source={{
              uri:"https://img.freepik.com/premium-vector/avatar-profile-colorful-illustration-2_549209-82.jpg"
            }}
          />
        }
        <View marginLeft={10} justifyContent="center">
          <Text  style={{fontSize:20}}>{driverName} </Text>
          <Text style={{fontSize:11}}># {driverOrderId}</Text>
        </View>
          </View>
        <TouchableOpacity onPress={onCallHandler}>
          <Avatar
            size={40}
            rounded
            // source={{uri:photo}}
            source={require("../../assets/call.png")}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          backgroundColor: "white",
          marginLeft: -10,
          marginBottom:-5
        }}>
        <Avatar
          size={40}
          rounded
          source={require("../../assets/clock.png")}
        />
       
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, color: "#101817" }}>
            Pickup address
          </Text>
          <Text style={{ color: "#828A89" ,fontSize: 11 }}>{pickupLocation}</Text>
        </View>
      </View>
      <View marginLeft={20} flexDirection="row">
      <Image
          source={require("../../assets/line.png")}
        />
        <Text style={{alignSelf:'center', marginLeft:10}}>{distance} Km</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          backgroundColor: "white",
          marginLeft: -10,
          marginBottom:-5
        }}>
        <Avatar
          size={40}
          rounded
          source={require("../../assets/location-icon.png")}
        />
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, color: "#101817" }}>
            Drop off Address
          </Text>
          <Text style={{ color: "#828A89",fontSize: 11 }}>{dropLocation}</Text>
        </View>
      </View>
      <View paddingVertical={20}>

      {/* <Button title="Home" onPress={()=> navigation.navigate('Main')} /> */}
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: "5%",
    
  },
  driverInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverInfoText: {
    fontSize: 16,
  },
  locationInfoContainer: {
    marginBottom: 20,
  },
  locationInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default BottomSheetContents;
