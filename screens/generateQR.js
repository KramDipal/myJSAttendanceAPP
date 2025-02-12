import React, { useState, useRef, useEffect, useContext } from 'react'; 

import { useNavigation } from "@react-navigation/native";


// import { ContextStore } from "../store/context";
import { FirebaseContextStore } from "../store/firebaseContext";
import { ContextStore } from '../store/context';

import { View, Text, TextInput, TouchableOpacity, Share, StyleSheet} from 'react-native'; 
import QRCode from 'react-native-qrcode-svg'; 

// import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
export default function GenerateQR() { 

   const navigation = useNavigation();

	const [qrValue, setQRValue] = useState(''); 
    const [yearLevel, setYearLevel] = useState('');
    const [section, setSection] = useState('');
	const [isActive, setIsActive] = useState(false); 
    const qrCodeRef = useRef(null);
    let [students, setStudents] = useState([]);

    const firebaseContextStore = useContext(FirebaseContextStore);
    const { user } = firebaseContextStore;

    const contextStore = useContext(ContextStore);
    const { userName } = contextStore;

    console.log("GenerateQR ", user ? user.email : "No user logged in");


    //Permission to acces media or gallery.
    useEffect(() => {
        (async () => {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
          }
        })();
      }, []);

	const generateQRCode = () => { 
		if (!qrValue || !yearLevel || !section) return; 

        const getQRValue = getQRCodeValue();

        //console.log("getQRValue:" + getQRValue);

		    setIsActive(true); 

        //add new students to the list of array
        setStudents(prev=>[...prev,getQRValue]);
        // setStudents(prev=>[...prev,qrValue+yearLevel+section]);
	}; 

	const handleInputChange = (text) => { 
		setQRValue(text); 

		if (!text) { 
			setIsActive(false); 
		} 
	}; 

    const getQRCodeValue = () => {
        return `${qrValue}${yearLevel}${section}`;
      };

    const handleSaveQRCode = async () => {
        try {
          const uri = await captureRef(qrCodeRef.current, {
            format: 'png',
            quality: 1,
          });

          //console.log('QR Code captured and saved to:', uri);
    
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync('QRCode', asset, false);
          alert('QR Code saved to gallery!');
        } catch (error) {
          console.error('Error saving QR Code:', error);
        }
      };

      const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              'React Native | A framework for building native apps using React',
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          Alert.alert(error.message);
        }
      };


    return(
        <View style={{alignItems:'center'}}>

          <Text style={{fontSize: 15, margin:10, fontWeight: 'bold'}}>
            Description: {userName}
          </Text>
          <TouchableOpacity
                style={{margin:10}}
                  onPress={()=>navigation.navigate('LogIn/ LogOut')}
                >
                  <Text>
                    Go back Home
                  </Text>
            </TouchableOpacity>

            <View style={styles.wrapper}>
                <Text style={styles.description}>
                    Enter employee informations
                </Text>

                <TextInput 
                    style={styles.input} 
                    placeholder="Enter Employee Name"
                    value={qrValue} 
                    onChangeText={handleInputChange} 
                /> 
                 <TextInput 
                    style={styles.input} 
                    placeholder="Enter Employee ID"
                    value={yearLevel} 
                    onChangeText={setYearLevel} 
                /> 
                <TextInput 
                    style={styles.input} 
                    placeholder="Enter Department"
                    value={section} 
                    onChangeText={setSection} 
                /> 
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={generateQRCode} 
                > 
                    <Text style={styles.buttonText}> 
                        Generate QR Code 
                    </Text> 
                </TouchableOpacity>


                {isActive && (
                    <TouchableOpacity onPress={onShare}>
                        <View collapsable={false} ref={qrCodeRef} style={styles.qrCode}>
                            <QRCode
                            // value={qrValue+yearLevel+section}
                            //concatinated values from 3 Text fields
                            value={getQRCodeValue()}
                            size={100}
                            color="black"
                            backgroundColor="white"
                            // logo={}
                            // logoSize={}
                            // backgroundColor
                            />
                        </View>
                    </TouchableOpacity>

                )}

                {isActive && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveQRCode}>
                        <Text style={styles.buttonText}>Save QR Code to Gallery</Text>
                    </TouchableOpacity>
                )}


                

            </View>

        </View>
    )

} 

const styles = StyleSheet.create({ 
	container: { 
		// flex: 1, 
		// justifyContent: 'center', 
		// alignItems: 'center', 
		// backgroundColor: '#eee', 
	}, 
	wrapper: { 
		maxWidth: 600, 
		backgroundColor: '#fff', 
		borderRadius: 20, 
		padding: 20, 
		shadowColor: 'rgba(0, 0, 0, 0.1)', 
        shadowColor:'grey', 
		shadowOffset: { width: 0, height: 0 }, 
		shadowOpacity: 1, 
		shadowRadius: 50, 
        margin: 5,
	}, 
	title: { 
		fontSize: 21, 
		fontWeight: '500',
        margin:50,
	}, 
	description: { 
		color: '#575757', 
		fontSize: 16, 
        fontWeight:'bold',
        
	}, 
	input: { 
		fontSize: 15, 
		padding: 10, 
		borderWidth: 1, 
		borderColor: '#999', 
		borderRadius: 10, 
		marginBottom: 5,
        marginTop: 5, 
	}, 
	button: { 
		backgroundColor: '#3498DB', 
		borderRadius: 5, 
		padding: 5, 
		alignItems: 'center', 
	}, 
	buttonText: { 
		color: '#fff', 
		fontSize: 18, 
	}, 
	qrCode: { 
		marginTop: 20, 
		alignItems: 'center', 
	},
    saveButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        marginTop: 20,
  },
});
