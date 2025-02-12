import { createContext, useState } from "react";
export const ContextStore = createContext();




export default function ContextProvider(props){
    let [userName, setUserName] = useState('kiko lapid');


    function changeUserName(newName){
        setUserName(newName);
    }

    // console.log("ContextProvider " + props.user)
    //Your context data here
    return (
        <ContextStore.Provider value={{
            userName: userName,
            changeUserName:(name)=>changeUserName(name),
            //function to change user context:

        }}>
            {props.children}
        </ContextStore.Provider>
    )
}