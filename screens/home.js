
import { Text, View, StyleSheet,  } from "react-native";
// import { useContext } from "react";
// import { ContextStore } from "../store/context";
export default function Home(){

    // const contextStore = useContext(ContextStore);
    
    return(
        <View style={styles.container}>
            <Text style={{fontSize:20}}>
                Home
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
