import { TextInput, Text,StyleSheet } from "react-native";

export default function CustomInput({
    field:{ name, onBlur, onChange, value},
    form:{ errors, touched, setFieldTouched },
    ...props
}){

    const inputError = errors[name] && touched[name];

    return(
        <>
            <TextInput
                style={[
                    styles.inputStyle,
                    props.multiline && styles.isMultiline,
                    inputError && styles.inputError
                ]}
                value={value}
                onChangeText={(text)=> onChange(name)(text)}
                onBlur={()=>{
                    setFieldTouched(name)
                    onBlur(name)
                }}
                {...props}
            />
            {inputError && 
                <Text style={styles.errorLabel}>
                    {errors[name]}
                </Text>
            }
        </>
    )
}


const styles = StyleSheet.create({
    errorLabel:{
        fontSize:15,
        marginBottom:20,
        color:'red'
    },
    inputError:{
        borderColor:'red'
    },
    isMultiline:{
        minHeight:100,
        verticalAlign:'top'
    },
    inputStyle:{
        borderRadius:10,
        borderWidth:1,
        borderColor:'grey',
        padding:10,
        fontSize:15,
        marginBottom:10
    }
})