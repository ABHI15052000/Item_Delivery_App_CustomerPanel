import { KeyboardAvoidingView, View } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';

export const Inputs = (props) => {
  const { label = 'Name', value, onChangeText, placeholder, secureTextEntry } = props;
  const isPassword = secureTextEntry === true;
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View marginBottom={20}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        underlineColor="transparent"
        theme={{ colors: { primary: '#0C8A7B', background: 'black' } }}
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderWidth: 1,
          borderColor: isFocused ? '#0C8A7B' : '#808080',
          color: 'black',
          fontFamily: "Montserrat_400Regular" 
        }}
        secureTextEntry={isPassword && !showPassword}
        right={
          isPassword ? (
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={togglePasswordVisibility}
            />
          ) : null
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const TextInputs = (props) => {
  const { label, value, onChangeText, placeholder, secureTextEntry,marginRight ,marginLeft ,disabled ,mode} = props;
  const isPassword = secureTextEntry === true;
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibilty = () => {
    setShowPassword(!showPassword)
  }

  const handleFocus = () => {
    setIsFocused(true);
  }

  const handleBlur = () => {
    setIsFocused(false);
  }

  return (
    <View style={{marginBottom:8,marginTop:8, }}>
      <TextInput
       mode={mode}
        label={label}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        theme={{ colors: { primary: "#0C8A7B", background: "white", },
        // fonts: {
        //   regular: {
        //     fontFamily: "Montserrat_500Medium",
        //     fontWeight: "normal"
        //   },
        // },
       }}
        style={{ 
          backgroundColor: "white", 
          // borderRadius: 20, 
          // borderWidth: 1, 
          borderColor: isFocused ? "#0C8A7B" : "gray", 
          color: "black",
          fontFamily: "Montserrat_400Regular" 
          
        }}
        disabled={disabled}
        marginRight={marginRight} 
        marginLeft={marginLeft} 
        
        underlineColor="transparent"
        onFocus={handleFocus}
        onBlur={handleBlur}
        right={
          isPassword ? (
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress ={togglePasswordVisibilty}
            />
          ) : null
        }
      />
    </View>
  )
}

export default TextInputs