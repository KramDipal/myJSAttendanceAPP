import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth'
// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { AUTH, DB } from '../firebaseConfig';
import { collection, query, orderBy, where, limit, getDocs } from 'firebase/firestore';


export const FirebaseContextStore = createContext();



export default function FireBaseAuthUserContextProvider(props){
    const [user, setUser] = useState(null);
    const [state, setState] = useState({
      attendance: [], // Initialize with an empty array
  });


  const setContextState = (newState) => {
      setState((prevState) => ({
          ...prevState,
          ...newState
      }));
  };
    let attendanceCol = collection(DB,'attendance');

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

    const getAttendanceRecord = async (docLimit, emp) => {
      console.log("getAttendanceRecord " + emp?.length);
      try {
          const user = AUTH.currentUser;
          let q;
  
          if (emp && emp.length > 0) {
              q = query(
                  attendanceCol,
                  orderBy('created_at', 'desc'),
                  where('owner', '==', user.uid),
                  where('status', '==', 'pending'),
                  where('employee', '==', emp),
                  limit(docLimit)
              );
          } else {
              q = query(
                  attendanceCol,
                  orderBy('created_at', 'desc'),
                  where('owner', '==', user.uid),
                  where('status', '==', 'pending'),
                  limit(docLimit)
              );
          }
  
          const querySnapshot = await getDocs(q);
          const attendance = getMoreHelper(querySnapshot);
  
          console.log("attendance structure: ", attendance);

          // Update the context with the retrieved attendance data
          setContextState({ attendance });
  
          // Return the updated attendance data as the result of the function
          return attendance;
  
      } catch (e) {
          console.log(e);
      }
    }
    
    function getMoreHelper(querySnapshot){
      // let lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const attendance = querySnapshot.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
      }));
  
      // if(lastVisible === undefined || lastVisible === null){
      //     lastVisible = false;
      // }
  
      return {
        attendance
      }
  }


    return(
        // console.log('FireBaseAuthUser')
        <FirebaseContextStore.Provider value={{
          user,
          state,
          getAttendanceRecord
        }}>
            {props.children}
        </FirebaseContextStore.Provider>
    )

}