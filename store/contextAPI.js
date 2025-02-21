import { createContext, useState, useEffect } from "react";
import * as Location from 'expo-location';


export const ContextStoreAPI = createContext();




export default function ContextProviderAPI(props){
    let [apiName, setApiName] = useState('Message Context APIs');
    const [location, seLocation] = useState(null);


    useEffect(() => {
        getLocation();
      }, []); // Empty dependency array means this runs only once when the component mounts

    const getLocation = async()=>{

        // console.log('getLocation');
        // await: wait till Location.requestForegroundPermissionsAsync() was resolved.
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("getLocation " + status) /// GRANTED and DENIED


        if(status !== 'granted'){
            Alert.alert(
                'Oops, no permission!!',
                'This app needs permission to access you location'
            )
            return;
        }

            console.log("getLocation: Here");

        const location2 = await Location.getCurrentPositionAsync();

        seLocation(location2)
    }
    
    
    function changeUserName(newName){
        setApiName(newName);
    }

    // console.log("ContextProvider " + props.user)
    //Your context data here
    return (
        <ContextStoreAPI.Provider value={{
            apiName: apiName,
            changeUserName:(name)=>changeUserName(name),
            location,
            getLocation
            //function to change user context:

        }}>
            {props.children}
        </ContextStoreAPI.Provider>
    )
}