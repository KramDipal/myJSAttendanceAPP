import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth'
// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { AUTH } from '../firebaseConfig';


export const FirebaseContextStore = createContext();



export default function FireBaseAuthUserContextProvider(props){
    const [user, setUser] = useState(null);
    useEffect(() => {
      // Set up listener for authentication state changes.
      // When the user is signed in, update the user state.
      // When the user is signed out, update the user state to null.
      //Whenever the user's authentication state changes, Firebase calls the 
      // callback function [(user) => {setUser(user)] and passes the updated 'user' to the user parameter.
      //user parameter 'setUser(user)' is receiving the most up-to-date state of the user, whether they're signed in or signed out.
      const unsubscribe = onAuthStateChanged(AUTH, (user) => {
        setUser(user);
      });
      // Return the function to clean up when the component is unmounted.
      return () => unsubscribe();
    }, []);

    return(
        // console.log('FireBaseAuthUser')
        <FirebaseContextStore.Provider value={{user}}>
            {props.children}
        </FirebaseContextStore.Provider>
    )

}