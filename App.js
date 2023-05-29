import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { OtpScreen } from "./src/screens/OTPScreen";
import { OrdersScreen } from "./src/screens/OrdersScreen";
import { OrderDetailScreen } from "./src/screens/OrderDetailScreen";
// import AppLoading from 'expo-app-loading';
import MainScreen from "./src/screens/MainScreen";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import EditProfile from "./src/screens/EditProfile";
import Toast from "react-native-toast-message";
import { ChatScreen } from "./src/screens/ChatScreen";
import TaskScreen from "./src/screens/TaskScreen";
import PlaceOrderDetailScreen from "./src/screens/PlaceOrderDetailScreen";
import Payment from "./src/screens/PayTo";
import Feedback from "./src/screens/FeedbackPage";
import Notifications from "./src/screens/Notifications";
import Ratings from "./src/screens/Rating";
import TrackOrderScreen from "./src/screens/TrackOrderScreen";
import { RegisterOtpScreen } from "./src/screens/RegisterOtpScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    // return <AppLoading />;
    return <></>;
  } else {
    return (
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OTP"
              component={OtpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ROTP"
              component={RegisterOtpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Orders"
              component={OrdersScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Orderdetail"
              component={OrderDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Task"
              component={TaskScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PlaceOrderDetial"
              component={PlaceOrderDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Pay"
              component={Payment}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TrackOrder"
              component={TrackOrderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Notifications"
              component={Notifications}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Ratings"
              component={Ratings}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Feedback"
              component={Feedback}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          {/* <StatusBar style="auto" /> */}
        </NavigationContainer>
        <Toast />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
    // paddingBottom: Platform.OS === 'android' ? 25 : 0,
  },
});
