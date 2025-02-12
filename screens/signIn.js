import { View ,StyleSheet} from "react-native";
import FormComp from "../components/form";

export default function CreateUser(){
    return(
        <View style={styles.container}>
            <FormComp/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop:10,
        paddingHorizontal:20
    }
})