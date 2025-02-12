// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzrjnChQG5v1kTeBdoMuO8CUCNNdsXnPM",
  authDomain: "jsattendanceapp.firebaseapp.com",
  projectId: "jsattendanceapp",
  storageBucket: "jsattendanceapp.firebasestorage.app",
  messagingSenderId: "1093810914721",   
  appId: "1:1093810914721:web:3fce772c27220d0bddf7e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const AUTH = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  
export  { AUTH }