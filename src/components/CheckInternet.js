import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo';
import { Snackbar } from 'react-native-paper';


const CheckInternet = () => {

    const [isConnected, setIsConnected] = useState(true);
    const [show, setShow] = useState(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  const renderSnackbar = () => (
    <Snackbar visible={!isConnected} onDismiss={() => setShow(false)}>
      No internet connection. Please turn on your internet.
    </Snackbar>
  );
  

    return (
    <View style={{position:'absolute', bottom:10}}>
      <Text>

        {renderSnackbar()}
      </Text>
    </View>
  )
}

export default CheckInternet