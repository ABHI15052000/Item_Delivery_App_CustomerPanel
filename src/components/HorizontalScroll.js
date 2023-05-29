import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const HorizontalScroll = ({inputSelect}) => {
  const [selectedButton, setSelectedButton] = useState('orders');

  const handleButtonPress = (button) => {
    if (selectedButton === button) {
      return; // Button is already selected, do nothing
    }
    setSelectedButton(button);
    inputSelect(button)
  };

  return (
    <View marginBottom={8}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'orders' ? styles.selectedButton : styles.notSelectedButton,
          ]}
          onPress={() => handleButtonPress('orders')}>
          <Text style={[styles.buttonText, selectedButton === 'orders' ? styles.selectedButtonColor : null,]}>All</Text>

        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Pending' ? styles.selectedButton : styles.notSelectedButton,
          ]}
          onPress={() => handleButtonPress('Pending')}>
          <Text style={[styles.buttonText, selectedButton === 'Pending' ? styles.selectedButtonColor : null,]}>Pending</Text>

        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Completed' ? styles.selectedButton : styles.notSelectedButton,
          ]}
          onPress={() => handleButtonPress('Completed')}>
          <Text style={[styles.buttonText, selectedButton === 'Completed' ? styles.selectedButtonColor : null,]}>Completed</Text>

        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Accepted' ? styles.selectedButton : styles.notSelectedButton,
          ]}
          onPress={() => handleButtonPress('Accepted')}>
          <Text style={[styles.buttonText, selectedButton === 'Accepted' ? styles.selectedButtonColor : null,]}>Accepted</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Cancelled' ? styles.selectedButton : styles.notSelectedButton,
          ]}
          onPress={() => handleButtonPress('Cancelled')}>
          <Text style={[styles.buttonText, selectedButton === 'Cancelled' ? styles.selectedButtonColor : null,]}>Cancelled</Text>

        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    paddingHorizontal: 25,
    paddingVertical: 10,
    margin: 10,
    borderRadius: 50,
  },
  selectedButton: {
    backgroundColor: "#0C8A7B",
    color:"#fff",
  },
  selectedButtonColor: {
    color:"#fff",
  },
  buttonText: {
    color: '#B8B8B8',
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",

  },
  notSelectedButton:{
    backgroundColor:'#F7F7F7'
  }
});
