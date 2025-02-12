import { Alert, Button, Text, View, StyleSheet, Pressable, ImageBackground } from "react-native";
import * as Location from 'expo-location';

import { useState, useEffect, useContext } from "react";
import { ContextStore } from "../store/context";


import Pattern from "../assets/bg_image.jpg";


export default function PostComp(){
    // const { user } = route.params || {}; // Add a fallback to avoid undefined errors
    const [location, seLocation] = useState(null)
     const contextStore = useContext(ContextStore);

    useEffect(() => {
        getLocation();
      }, []); // Empty dependency array means this runs only once when the component mounts

    const getLocation = async()=>{
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log(status) /// GRANTED and DENIED


        if(status !== 'granted'){
            Alert.alert(
                'Oops, no permission!!',
                'This app needs permission to access you location'
            )
            return;
        }


        const location = await Location.getCurrentPositionAsync();
        // console.log(location)
        seLocation(location)
    }

    return(
        <>
            <ImageBackground
                source={Pattern}
                resizeMode='cover'
                style={styles.container}
            >
                <Text>
                    {/* Welcome {contextStore.userName}! */}
                    {/* <Text>{user ? user : 'No user logged in'}</Text> */}
                </Text>
                
            <Pressable 
                style={styles.button}

                //change the test user of context provider
                // onPress={()=>Alert.alert('pressd')}
                // onPress={()=>contextStore.changeUserName('lapid kiko')}
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
        paddingTop:200,
        flexDirection: 'row',
        justifyContent:'space-evenly',
        alignItems:'stretch',
        // height:200
      },
      button:{        
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin:30,
    }

})