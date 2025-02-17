import { NavigationContainer } from "@react-navigation/native";
import { 
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from "@react-navigation/drawer";



// import ContextProvider from "./store/context";
import FireBaseAuthUserContextProvider from "./store/firebaseContext";
import { FirebaseContextStore } from "./store/firebaseContext";



import ContextProvider from "./store/context";
import ContextProviderAPI from "./store/contextAPI";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons'

// // Firebase
// import { onAuthStateChanged } from "firebase/auth";
// import { AUTH } from "./firebaseConfig";
import { signOutWithMsg } from "./auth/signOut";

// Screens
import Home from './screens/home';
import SignIn from './screens/signIn';
import { useState, useEffect, useContext } from "react";
import { Alert, Text, View, ImageBackground, StyleSheet} from "react-native";


import PostComp from "./screens/utils";
import GenerateQR from "./screens/generateQR";
import QrCodeReader from "./screens/qrcodeReader";
import FireBaseAuthUser from "./store/firebaseContext";
import QRcodeReader from "./screens/qrcodeReader";
import AttendanceSummary from "./screens/attendanceSummary";

// import Pattern from './assets/bg_image.jpg';
const Drawer = createDrawerNavigator();

//Bottom Tab Navigator
const Tab = createBottomTabNavigator()

// const signOutWithMsg = async (user) => {
//   Alert.alert('Goodbye! ' + (user ? user.email : 'User'));
//   try {
//     await AUTH.signOut();
//   } catch (error) {
//     console.error('Error signing out: ', error);
//   }
// };


function CustomDrawerContent(props) {
    const firebaseContextStore = useContext(FirebaseContextStore);
    const { user } = firebaseContextStore
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />      
      {user && (
        <DrawerItem label="Sign out" onPress={() => signOutWithMsg(user)} />
      )}
    </DrawerContentScrollView>
  );
}


const Utils = () => (
  // const { user } = route.params; // Accessing user from route.params
  // console.log("Utils " + route.params);
  // <FireBaseAuthUserContextProvider>
  <Tab.Navigator
      screenOptions={{ headerShown:false}}
    >
        <Tab.Screen name="LogIn/ LogOut" component={PostComp}
            options={{
                tabBarIcon: ({color,size})=> (
                <Ionicons name="alarm" color={color} size={size}/>
                ),
                headerTitle:'Post'
              }}
              // initialParams={{ user: "useContext(FirebaseContextStore).user" }} // Passing the user prop as initialParams
                        
        />
        <Tab.Screen name="Register" component={QRcodeReader}
            options={{
                tabBarIcon: ({color,size})=> (
                <Ionicons name="list" color={color} size={size}/>
                ),
                headerTitle:'Register'
            }}
        >
          {/* { (props)=> <Text>QR Code Scanner</Text>} */}
        </Tab.Screen>


        <Tab.Screen name="Generate QR" component={GenerateQR}
            options={{
                tabBarIcon: ({color,size})=> (
                <Ionicons name="qr-code" color={color} size={size}/>
                ),
                headerTitle:'Generate QR'
            }}
            // initialParams={{ user: useContext(FirebaseContextStore).user }}
        />
        <Tab.Screen name="Summary" component={AttendanceSummary}
            options={{
                tabBarIcon: ({color,size})=> (
                <Ionicons name="people" color={color} size={size}/>
                ),
                headerTitle:'Attendance Summary'
            }}
            // initialParams={{ user: useContext(FirebaseContextStore).user }}
        />
    </Tab.Navigator>
  // </FireBaseAuthUserContextProvider>
)

const DrawerNavigator = (props) => {
  // console.log("DrawerNavigator " + props);
  const { user } = useContext(FirebaseContextStore);

  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Utils} />

      {!user && <Drawer.Screen name="Auth" component={SignIn} />}
    </Drawer.Navigator>
  );
};

export default function App() {
  return (

      <ContextProviderAPI>
        <ContextProvider>
          <FireBaseAuthUserContextProvider>
              <NavigationContainer>
                <DrawerNavigator/>
              </NavigationContainer>
          </FireBaseAuthUserContextProvider>
        </ContextProvider>
      </ContextProviderAPI>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
});
