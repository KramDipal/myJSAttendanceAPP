// 

import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button, Animated, Easing } from "react-native";
// import { CameraView, Camera } from "expo-camera/next";
import { CameraView, Camera } from "expo-camera";

import { createAttendance } from "../auth/addRecord";
import { FirebaseContextStore } from "../store/firebaseContext";

import { useContext } from "react";
import Toast from "react-native-root-toast";

export default function QRcodeReader() {

  const firebaseContextStore = useContext(FirebaseContextStore);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeType, setBarcodeType] = useState('');
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();

    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [moveAnim]);

  
  //Save scanned record to collection 'attendance'
  const handleEventSubmit = (values) => {
    // setLoading(true);
    // await createAttendance(values).then(()=>{ - original
    try{
      const addRecord = firebaseContextStore.createAttendance(values)
      // console.log("handleEventSubmit success");
      Toast.show('Attendance created');
      Toast
    }catch(e){
      Toast.show('Ooops! Something went wrong');
      console.error(e)
    }
    finally{
      // setLoading(false)
      console.log("handleEventSubmit failed");
    }

  }

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeType(type);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    handleEventSubmit(data);
  };


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
      
        //onBarcodeScanned - return callbacks of type and data
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View
        style={[
          styles.scannerLine,
          {
            transform: [
              {
                translateY: moveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 200], // Adjust as needed
                }),
              },
            ],
          },
        ]}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => {
          setScanned(false);
          setBarcodeType('');
        }} />
      )}
      {/* <View style={styles.overlay}>
        <Text style={styles.instructionText}>Scan a QR Code or PDF417 Code</Text>
        {barcodeType && <Text style={styles.barcodeTypeText}>{`Type: ${barcodeType}`}</Text>}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  instructionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  barcodeTypeText: {
    color: 'yellow',
    fontSize: 16,
    marginTop: 10,
  },
  scannerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'red',
  },
  absoluteFillObject: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'white',
  },
});
