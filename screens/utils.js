import { Alert, Button, Text, View, StyleSheet, 
    Pressable, ImageBackground } from "react-native";
import * as Location from 'expo-location';

import { signOutWithMsg } from "../auth/signOut";

import { useState, useEffect, useContext } from "react";

//context stores
import { FirebaseContextStore } from "../store/firebaseContext";
import  { ContextStoreAPI } from "../store/contextAPI";


import Pattern from "../assets/bg_image.jpg";


export default function PostComp(){
  
    // const [location, seLocation] = useState(null)
    const firebaseContextStore = useContext(FirebaseContextStore);
    const { user } = firebaseContextStore;

    const contextStoreAPI = useContext(ContextStoreAPI);
    const { apiName, location } = contextStoreAPI;
    // const { location } = contextStoreAPI.getLocation();


  
    // console.log("PostComp" + JSON.stringify(contextStoreAPI.location));
    // console.log("PostComp ", user ? user.email : "No user logged in");
    // console.log("PostComp ", user ? user.uid : "No user logged in");

    // useEffect(() => {
    //     getLocation();
    //     // contextStoreAPI.getLocation();   // get location from context store API
    //   }, []); // Empty dependency array means this runs only once when the component mounts


    // //   console.log("PostComp " + location);

    // const getLocation = async()=>{
    //     let { status } = await Location.requestForegroundPermissionsAsync();
    //     console.log(status) /// GRANTED and DENIED


    //     if(status !== 'granted'){
    //         Alert.alert(
    //             'Oops, no permission!!',
    //             'This app needs permission to access you location'
    //         )
    //         return;
    //     }


    //     const location = await Location.getCurrentPositionAsync();
    //     // console.log(location)
    //     seLocation(location)
    // }

    const signOutWithMsg = async (user) => {
        Alert.alert('Goodbye! ' + (user ? user.email : 'User'));
        try {
          await AUTH.signOut();
        } catch (error) {
          console.error('Error signing out: ', error);
        }
      };

    const handleSearchLocation = () => {
        console.log('Searching')
        contextStoreAPI.getLocation();  
    }

    return(
        <>
            <ImageBackground
                source={Pattern}
                resizeMode='cover'
                style={styles.container}
            >
                <Text style={{fontSize:20}}>
                    {/* Welcome {user.email} */}
                    Welcome {user ? user.email : "No user logged in"}
                </Text>

                <Text style={{fontSize:20, marginBottom:10}}>
                    User ID: {user ? user.uid : "No user logged in"}
                </Text>

                <Text style={{fontSize:20}}>
                    API Name: {apiName}
                </Text>
                
            <Pressable 
                style={styles.button}
                //change the test user of context provider
                // onPress={()=>Alert.alert('pressd')}
                // onPress={()=>contextStoreAPI.changeUserName('lapid kiko')}
                onPress={handleSearchLocation}
            >
                <Text>Change User Name</Text>
            </Pressable>

            <Pressable 
                style={styles.button}
                //change the test user of context provider
                // onPress={()=>QrCodeReader()}
            >
                <Text>Scan QR Code</Text>
            </Pressable>


            {/* log out Button */}
            <Pressable 
                style={styles.button}
                onPress={()=>signOutWithMsg(user)}
            >
                <Text>
                    Log out
                </Text>
            </Pressable>

            <View style={styles.latlong}>            
                
                <Text>
                    Latitude: {location?.coords.latitude}
                </Text>
                <Text>
                    Longitude: {location?.coords.longitude}
                </Text>
            </View>
            </ImageBackground>

        </>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
      },
    latlong:{
        paddingTop:100,
        flexDirection: 'row',
        justifyContent:'space-evenly',
        alignItems:'stretch',
        // height:200
      },
      button:{        
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin:20,
    }

})