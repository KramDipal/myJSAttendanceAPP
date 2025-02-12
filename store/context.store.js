import { createContext } from "react";
export const ContextStore = createContext();




export default function ContextProvider(props){
    //Your context data here
    return (
        <ContextStore.Provider value={{
            username: 'Test User'
        }}>
            {props.children}
        </ContextStore.Provider>
    )
}