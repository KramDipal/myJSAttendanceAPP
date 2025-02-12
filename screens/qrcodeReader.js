// import React, { useState, useEffect } from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
// import { Camera } from 'expo-camera';

// const QrCodeReader = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [qrCodeData, setQrCodeData] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     setQrCodeData(data);
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={styles.camera}
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//       >
//         <View style={styles.buttonContainer}>
//           {scanned && (
//             <Button
//               title={'Tap to Scan Again'}
//               onPress={() => setScanned(false)}
//             />
//           )}
//           {qrCodeData && (
//             <Text style={styles.text}>QR Code Data: {qrCodeData}</Text>
//           )}
//         </View>
//       </Camera>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   camera: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     flex: 0.1,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     margin: 20,
//   },
//   text: {
//     fontSize: 18,
//     color: 'white',
//     padding: 10,
//   },
// });

// export default QrCodeReader;
