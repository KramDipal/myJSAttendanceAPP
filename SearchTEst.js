import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, ActivityIndicator, FlatList } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/database';
import { FirebaseContext } from './FirebaseContext'; // Assuming you have a context provider

// Initialize Firebase
const firebaseConfig = {
  apiKey: '<API_KEY>',
  authDomain: '<AUTH_DOMAIN>',
  databaseURL: '<DATABASE_URL>',
  projectId: '<PROJECT_ID>',
  storageBucket: '<STORAGE_BUCKET>',
  messagingSenderId: '<MESSAGING_SENDER_ID>',
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const App = () => {
  const firebaseContextStore = useContext(FirebaseContext);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { attendance } = firebaseContextStore.state; // Accessing state here
  const [attendanceList, setAttendanceList] = useState(attendance && attendance.attendance ? attendance.attendance : []);

  const handleSearch = async (text) => {
    setLoading(true);
    try {
      const snapshot = await firebaseContextStore.getAttendanceRecord(10, text);

      console.log("snapshot" + snapshot);
      const data = snapshot.val();
      setAttendanceList(data ? Object.values(data) : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (value) {
      handleSearch(value);
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <Text style={styles.itemHeader}>Attendance Summary</Text>
      <View style={styles.searchContent}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Enter a value"
          style={{ backgroundColor:'#DDDDDD', width:'75%', margin:10 }}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={attendanceList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default App;
