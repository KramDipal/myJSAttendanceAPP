import { Text, View, FlatList, StyleSheet, ActivityIndicator, TextInput, Pressable, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FirebaseContextStore } from "../store/firebaseContext";
import { AppStyle } from "../constants";

import { Ionicons } from '@expo/vector-icons'

import { ContextStoreAPI } from "../store/contextAPI";

export default function AttendanceSummary() {
    const firebaseContextStore = useContext(FirebaseContextStore);
    const contextStoreAPI = useContext(ContextStoreAPI);
    
    // const { loading: firebaseLoading } = firebaseContextStore;
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Asynchronous Execution: The async keyword makes the function asynchronous, allowing you to use await within it. When await is used before a promise (like firebaseContextStore.getAttendanceRecord), it pauses the execution of the function until the promise resolves, without blocking the main thread.

    // Setting Loading State: In your updated code, when the handleSearch function is called, setLoading(true) is executed immediately, setting the loading state to true. This triggers a re-render of your component, displaying the ActivityIndicator.

    // Awaiting Promise: The await keyword pauses the execution of the handleSearch function until firebaseContextStore.getAttendanceRecord resolves. During this time, the loading state remains true, so the ActivityIndicator continues to render.

    // Resetting Loading State: Once the promise resolves or an error occurs, the finally block executes setLoading(false), resetting the loading state to false. This again triggers a re-render, which removes the ActivityIndicator and displays the search results.

    //So, the async and await keywords are essential for handling asynchronous operations correctly and ensuring that the loading indicator appears during the search process. If you have any further questions or need more assistance, feel free to ask!
    const handleSearch = async () => {
        setLoading(true);
        try {
            await firebaseContextStore.getAttendanceRecord(10, value); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }  
    }

    console.log("AttendanceSummary loading " + loading);
    const { attendance } = firebaseContextStore.state; // Accessing state here

    // Check if attendance and the nested attendance array are defined
    const attendanceList = attendance && attendance.attendance ? attendance.attendance : [];
    console.log("attendanceList " + attendanceList.length);

    const renderItem = ({ item }) => (
        <View style={styles.box}>
            <Text>Employee: {item.employee}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Date: {new Date(item.created_at.seconds * 1000).toString()}</Text> 
            {/* Converting Timestamp to Date */}
        </View>
    );

    return (
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
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
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
});
