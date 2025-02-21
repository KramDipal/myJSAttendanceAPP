import { Text, View, FlatList, StyleSheet, ActivityIndicator, TextInput, Pressable, Alert, TouchableOpacity, Animated } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FirebaseContextStore } from "../store/firebaseContext";
import { AppStyle } from "../constants";

import Toast from "react-native-root-toast";

// import { Ionicons } from '@expo/vector-icons'
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
// import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
// import { Reanimated, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { ContextStoreAPI } from "../store/contextAPI";


export default function AttendanceSummary() {
    const firebaseContextStore = useContext(FirebaseContextStore);
    const contextStoreAPI = useContext(ContextStoreAPI);
    
    // const { loading: firebaseLoading } = firebaseContextStore;
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const { attendance } = firebaseContextStore.state; // Accessing state here
    const [attendanceList, setAttendanceList] = useState(attendance && attendance.attendance ? attendance.attendance : []);
    const [items, setItems] = useState([]);


    // Asynchronous Execution: The async keyword makes the function asynchronous, allowing you to use await within it. When await is used before a promise (like firebaseContextStore.getAttendanceRecord), it pauses the execution of the function until the promise resolves, without blocking the main thread.

    // Setting Loading State: In your updated code, when the handleSearch function is called, setLoading(true) is executed immediately, setting the loading state to true. This triggers a re-render of your component, displaying the ActivityIndicator.

    // Awaiting Promise: The await keyword pauses the execution of the handleSearch function until firebaseContextStore.getAttendanceRecord resolves. During this time, the loading state remains true, so the ActivityIndicator continues to render.

    // Resetting Loading State: Once the promise resolves or an error occurs, the finally block executes setLoading(false), resetting the loading state to false. This again triggers a re-render, which removes the ActivityIndicator and displays the search results.

    //So, the async and await keywords are essential for handling asynchronous operations correctly and ensuring that the loading indicator appears during the search process. If you have any further questions or need more assistance, feel free to ask!
    // Search triggered by Button pressed "onPress={handleSearch}"
    // const handleSearch = async () => {
    //     setLoading(true);
    //     try {
    //         await firebaseContextStore.getAttendanceRecord(10, value); 
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }  
    // }


    //load on form automatically
    // useEffect(() => {
    //     firebaseContextStore.getAttendanceRecord(10, value); 
    //   }, []);    
    // // Check if attendance and the nested attendance array are defined
    // const { attendance } = firebaseContextStore.state; // Accessing state here
    // const attendanceList = attendance && attendance.attendance ? attendance.attendance : [];
    // console.log("attendanceList " + attendanceList.length);

      //rev 2
    // this rouitne display the queried data from search arautomatically and display it on flatlist
    const handleSearch = async (text) => {
        setLoading(true);
        try {
            console.log('Searching for:', text); // Log the search text
        
            const snapshot = await firebaseContextStore.getAttendanceRecord(30, text);
        
            console.log('Snapshot:', JSON.stringify(snapshot, null, 2)); // Log the snapshot as a JSON string
        
            if (snapshot && snapshot.attendance) {
              const data = snapshot.attendance;
              console.log('Data:', data); // Log the fetched data
              setAttendanceList(data);
            } else {
              console.log('No data found');
              setAttendanceList([]);
            }
          } catch (error) {
            console.error('Error fetching attendance records:', error);
          } finally {
            setLoading(false);
          }
      };
    


    //  load on mount
      useEffect(() => {
        // if (value) {
        //     console.log("value: " + value);
        //   handleSearch(value);
        // }
        // else{
        //     console.log("AttendanceSummary No value found to search");
        //     //reset attendanceList, and not display last searched value.
        //     setAttendanceList([]);
        // }
        handleSearch(value);
      }, [value]);

    // console.log("AttendanceSummary attendanceList " + attendanceList);


    // const handlePress = (item) => {
    //     alert("Employee " + item.employee + " was selected");
    //   };


      const renderRightActions = (progress, dragX, id) => {
        const scale = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        });
    
        return (
          <TouchableOpacity onPress={() => handlePressDelete(id)} style={styles.deleteButton}>
            <Animated.Text style={[styles.deleteButtonText, { transform: [{ scale }] }]}>
              Delete
            </Animated.Text>
          </TouchableOpacity>
        );
      };

      const handlePressDelete = (id) => {

        console.log("handlePressDelete " + id);
        setAttendanceList((prevItems) => prevItems.filter((item) => item.id !== id));

        // alert(`Record deleted: ${employee}`);
        firebaseContextStore.deleteRecord(id);
        Toast.show('Record delete');
        
      };

      
      const renderItem = ({ item }) => {        
        return(
            <Swipeable
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
          >

            {/* <Pressable
                onPress={() => handlePress(item)}
            > */}
                <View style={styles.box}>
                    <Text style={{color:'blue'}}>Employee: {item.employee}</Text>
                    <Text style={{color:'blue'}}>ID: {item.id}</Text>
                    <Text style={{color:'blue'}}>Date: {new Date(item.created_at.seconds * 1000).toString()}</Text> 
                    {/* Converting Timestamp to Date */}

                    {/* <Pressable
                        style={styles.deleteItem}
                        onPress={()=>handlePressDelete(item)}
                    >
                        <Text style={{color:'blue', marginTop:10}}>
                            Delete
                        </Text>
                    </Pressable> */}
                </View>
            {/* </Pressable> */}
            </Swipeable>
        )
    };

    return (
        <GestureHandlerRootView style={styles.containerGesture}>        
            <View style={styles.container}>
                
                <Text style={styles.itemHeader}>
                    Attendance Summary
                </Text>

                <View style={styles.searchContent}>
                    <TextInput
                        value={value}
                        onChangeText={setValue}
                        placeholder="Enter a value"
                        style={{ backgroundColor:'#DDDDDD', width:'75%', margin:10 }}
                    />
                    <Pressable
                        onPress={handleSearch}           
                        style={styles.button}         
                    >
                        <Text>Search</Text>
                    </Pressable>    
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
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    containerGesture: {
        flex: 1,
        paddingTop: 50,
      },
    itemHeader:{
        padding:10,
        justifyContent:'space-between',
        borderBottomColor:AppStyle.purpLight,
        borderBottomWidth:1,
        fontSize:30,
        fontWeight:'bold',
        backgroundColor:AppStyle.coolBlue,
        color:AppStyle.gunMetal,
        textAlign:'center',
    },
    contentHeader:{
        marginTop:10,
        paddingVertical:10,
        borderBottomColor:AppStyle.gunMetal,
        borderBottomWidth:2,
        borderTopWidth:2,
        borderRadius:10,
        justifyContent:'space-between',
        padding:20,
    },
    searchContent:{
        paddingVertical:5,
        borderBottomColor:AppStyle.gunMetal,
        borderBottomWidth:2,
        flexDirection:'row',
    },
    button:{        
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin:10,
    },
    box: {
        width: '90%',
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginLeft: 20,
    },
    deleteItem:{
        flexDirection: 'row', 
        justifyContent:'flex-end'
    },
    swipeable: {
      height: 50,
      backgroundColor: 'papayawhip',
      alignItems: 'center',
    },
    rightAction: { width: 50, height: 50, backgroundColor: 'purple' },
    separator: {
      width: '100%',
      borderTopWidth: 1,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 90,
        borderRadius: 10,
        marginTop: 10,
        marginRight:20
      },
});
