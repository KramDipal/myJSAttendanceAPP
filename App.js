import { NavigationContainer } from "@react-navigation/native";
import { 
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from "@react-navigation/drawer";



import ContextProvider from "./store/context";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons'

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { AUTH } from "./firebaseConfig";

// Screens
import Home from './screens/home';
import SignIn from './screens/signIn';
import { useState, useEffect } from "react";
import { Alert, Text, View, ImageBackground, StyleSheet} from "react-native";


import PostComp from "./screens/utils";
import GenerateQR from "./screens/generateQR";
import QrCodeReader from "./screens/qrcodeReader";

// import Pattern from './assets/bg_image.jpg';
const Drawer = createDrawerNavigator();



//Bottom Tab Navigator
const Tab = createBottomTabNavigator()

const signOutWithMsg = async (user) => {
  Alert.alert('Goodbye! ' + (user ? user.email : 'User'));
  try {
    await AUTH.signOut();
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};
const signOutWithMsg2 = async (user) => {
  Alert.alert('signOutWithMsg2! ' + (user ? user.email : 'User'));
  try {
    console.log('async OKEY!!!!');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};

function CustomDrawerContent(props) {
  // console.log("CustomDrawerContent xxxx: " + props.user)
  // signOutWithMsg2(props.user);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      
      {props.user && (
        <DrawerItem label="Sign out" onPress={() => signOutWithMsg(props.user)} />
      )}
    </DrawerContentScrollView>
  );
}


const Utils = () => (
  // const { user } = route.params; // Accessing user from route.params
  // console.log("Utils " + route.params);

  <Tab.Navigator
    screenOptions={{ headerShown:false}}
  >
      <Tab.Screen name="LogIn/ LogOut" component={PostComp}
          options={{
              tabBarIcon: ({color,size})=> (
              <Ionicons name="alarm" color={color} size={size}/>
              )
          }}
          // initialParams={ 'user' } // Passing the user prop as initialParams
      />
      <Tab.Screen name="Register"
          options={{
              tabBarIcon: ({color,size})=> (
              <Ionicons name="list" color={color} size={size}/>
              )
          }}
      >
        { (props)=> <Text>Feeds</Text>}
      </Tab.Screen>


      <Tab.Screen name="Generate QR" component={GenerateQR}
          options={{
              tabBarIcon: ({color,size})=> (
              <Ionicons name="qr-code" color={color} size={size}/>
              )
          }}
      />
  </Tab.Navigator>
)


export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up listener for authentication state changes.
    // When the user is signed in, update the user state.
    // When the user is signed out, update the user state to null.
    //Whenever the user's authentication state changes, Firebase calls the 
    // callback function [(user) => {setUser(user)] and passes the updated 'user' to the user parameter.
    //user parameter 'setUser(user)' is receiving the most up-to-date state of the user, whether they're signed in or signed out.
    const unsubscribe = onAuthStateChanged(AUTH, (user) => {
      // console.log("here " + user.email);
      setUser(user);
    });
    // Return the function to clean up when the component is unmounted.
    return () => unsubscribe();
  }, []);

  console.log("here2 " + user);
  return (

    // <ImageBackground
    //   source={Pattern}
    //   resizeMode='cover'
    //   style={styles.container}
    // >


      <ContextProvider>
      <NavigationContainer>
        <Drawer.Navigator          
          //The drawerContent prop is used to customize the contents of the drawer.
          drawerContent={(props) => (
              //add 'user' property(in blue) to props
            <CustomDrawerContent {...props} user={user} />
          )}
        >
          <Drawer.Screen name="Home" component={Utils}/>

          {!user && <Drawer.Screen name="Auth" component={SignIn} />}
        </Drawer.Navigator>
      </NavigationContainer>
      </ContextProvider>

    // </ImageBackground>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
});
