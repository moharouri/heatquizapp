import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import {getAllKeyListsRequest, getKeyboardRequest, searchKeyboardsByIdsRequest, searchKeyboardsRequest } from "../services/Keyboard"

const Context = React.createContext()

export function useKeyboard(){
    return useContext(Context)
}

export function KeyboardProvider ({children}){
    //Fetch from API
    const {value: Keyboard, errorGetKeyboard, loading:isLoadingKeyboard, execute: getKeyboard} = useAsyncFn((Id) => getKeyboardRequest(Id)) 
    const {value: keyLists, errorGetKeyLists, loading:isLoadingKeyLists, execute: getAllKeyLists} = useAsyncFn((Id) => getAllKeyListsRequest(Id)) 

    const {value: keyboards, errorGetKeyboards, loading:isLoadingKeyboards, execute: searchKeyboards} = useAsyncFn((b) => searchKeyboardsRequest(b)) 
    

    const {value: keyboardsIds, errorGetKeyboardsIds, loading:isLoadingKeyboardsIds, execute: searchKeyboardsIds} =  useAsyncFn((b) => searchKeyboardsByIdsRequest(b)) 

    return(
        <Context.Provider value = {{
            isLoadingKeyboard,
            errorGetKeyboard,
            Keyboard,
            getKeyboard,

            isLoadingKeyLists,
            keyLists,
            errorGetKeyLists,
            getAllKeyLists,

            isLoadingKeyboards,
            keyboards,
            errorGetKeyboards,
            searchKeyboards,

            keyboardsIds,
            isLoadingKeyboardsIds,
            errorGetKeyboardsIds,
            searchKeyboardsIds

        }}>
            {children}
        </Context.Provider>
    )
}