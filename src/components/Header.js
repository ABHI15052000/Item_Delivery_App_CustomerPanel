import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const Header = (props) => {
  const { title = "Change me", profilepic } = props;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>

        <AntDesign 
        onPress={()=>navigation.goBack()} 
        marginRight="auto" name="left" size={24} color="black" />
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: "#fff",
    padding:14,
    width:"90%",
    borderRadius: 8,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection: 'row',
    elevation:5
  },
  text: {
    textAlign: 'center',
    flex: 1,
    fontSize:16,
    // marginLeft:-30,
    fontFamily:'Montserrat_600SemiBold'
  }
})