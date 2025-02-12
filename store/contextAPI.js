import { createContext, useState } from "react";
export const ContextStoreAPI = createContext();




export default function ContextProviderAPI(props){
    let [apiName, setApiName] = useState('Message Context API');


    function changeUserName(newName){
        setApiName(newName);
    }

    // console.log("ContextProvider " + props.user)
    //Your context data here
    return (
        <ContextStoreAPI.Provider value={{
            apiName: apiName,
            changeUserName:(name)=>changeUserName(name),
            //function to change user context:

        }}>
            {props.children}
        </ContextStoreAPI.Provider>
    )
}