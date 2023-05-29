import React from "react";
import { View, Text, TouchableOpacity,StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';

const CustomCheckbox = ({ item, isChecked, onToggle }) => {
  return (
    <TouchableOpacity style={{position:"absolute",right:20}} onPress={() => onToggle(item)}>
      <View style={[styles.checkbox, isChecked ? styles.checkboxChecked : null]}>
        {isChecked && (<Entypo name="check" size={18} color="orange" />)}
      </View> 
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: 'black',
      justifyContent:"center",
      alignItems:"center"
    },
    checkboxChecked: {
      backgroundColor: 'white',
      borderColor: 'orange',
    },
  });
  

export default CustomCheckbox;