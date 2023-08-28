import React, { useContext } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import {getMapRequest } from "../services/Maps"

const Context = React.createContext()

export function useMaps(){
    return useContext(Context)
}

export function MapsProvider ({children}){
    
    //Fetch courses from API
    const {loading: loadingMap, value: map, error: getMapError, execute: getMap} = useAsyncFn((Id) => getMapRequest(Id))

    return(
        <Context.Provider value = {{
            loadingMap,
            getMapError,
            map,
            getMap,
        }}>
            {children}
        </Context.Provider>
    )
}