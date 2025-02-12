import { View, Button, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";

import CustomInput from "./utils/input.custom";
import { useState } from "react";

/// firebase
import { AUTH } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function FormComp(){
    const [type,setType] = useState(true);
    const navigation = useNavigation();

    const schema = yup.object({
        email:yup
        .string()
        .email("Please enter valid email")
        .required("Email is required"),
        password:yup.
        string()
        .min(8,({min})=> `Password must be at least ${min} characters`)
        .required("Password is required"),
    })

    const registerUser = async({email,password}) => {
        try{
            await createUserWithEmailAndPassword(AUTH,email,password);
            navigation.navigate('Home')
        } catch(e){
            console.log(e)
        }
    }

    const signInUser = async({email,password}) => {
        try{
            await signInWithEmailAndPassword(AUTH,email,password);
            navigation.navigate('Home')
        } catch(e){
            console.log(e)
        }
    }

    return(
        <KeyboardAvoidingView
            behavior={ Platform.OS === 'ios'?'padding':'position'}
            style={{flex:1}}
        >
        <ScrollView>
        <Formik
            initialValues={{email:'',password:''}}
            onSubmit={(values,{ resetForm })=>{
                if(type){
                    /// REGISTER
                    registerUser(values)
                } else {
                    // SIGN IN
                    signInUser(values)
                }
            }}
            validationSchema={schema}
        >
        { ({ handleSubmit })=> (
        <View>

            <Field
                component={CustomInput}
                name="email"
                placeholder="Enter your email"
                keyboardType="email-address"
            />

            <Field
                component={CustomInput}
                name="password"
                placeholder="Enter your password"
                secureTextEntry={true}
            />

            <Button
                title={ type ? ' Register':'Sign in'}
                onPress={handleSubmit}
            />
        </View>
        )}
        </Formik>
        <View style={{marginTop:10}}>
            <Button
                onPress={()=> setType(!type)}
                title="Change type"
                color='black'
            />
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}