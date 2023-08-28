import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { getKeyboardRequest } from "../services/Keyboard"

const Context = React.createContext()

export function useKeyboard(){
    return useContext(Context)
}

export function KeyboardProvider ({children}){
    //Fetch from API
    const {value: Keyboard, errorGetKeyboard, loading:isLoadingKeyboard, execute: getKeyboard} = useAsyncFn((Id) => getKeyboardRequest(Id)) 

    return(
        <Context.Provider value = {{
            isLoadingKeyboard,
            errorGetKeyboard,
            Keyboard,
            getKeyboard
            
        }}>
            {children}
        </Context.Provider>
    )
}