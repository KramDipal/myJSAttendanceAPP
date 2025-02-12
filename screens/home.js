
import { Text, View, StyleSheet,  } from "react-native";


import { FirebaseContextStore } from "../store/firebaseContext";
import { useContext } from "react";


export default function Home(){

    const firebaseContextStore = useContext(FirebaseContextStore);
    const { user } = firebaseContextStore
    console.log(user.email)
    
    return(
        <View style={styles.container}>
            <Text style={{fontSize:20}}>
                Home
            </Text>
            <Text style={{fontSize:20}}>
                Welcome, {user.email}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop:10,
        paddingHorizontal:20
    },
})
