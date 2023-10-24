import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import {getBackgroundImagesRequest, getClickImagesListsRequest, getDefaultImagesRequest } from "../services/DefaultValues"

const Context = React.createContext()

export function useDefaultValues(){
    return useContext(Context)
}

export function DefaultValuesProvider({children}){
    //Fetch from API
    const {value: DefaultImages, errorGetDefaultImages, loading:isLoadingDefaultImages, execute: getDefaultImages} = useAsyncFn(() => getDefaultImagesRequest())
    const {value: BackgroundImages, errorGetBackgroundImages, loading:isLoadingBackgroundImages, execute: getBackgroundImages} = useAsyncFn(() => getBackgroundImagesRequest())
    const {value: ClickImagesLists, errorGetClickImagesLists, loading:isLoadingClickImagesLists, execute: getClickImagesLists} = useAsyncFn(() => getClickImagesListsRequest())

    return(
        <Context.Provider value = {{
            DefaultImages,
            errorGetDefaultImages, 
            isLoadingDefaultImages, 
            getDefaultImages,

            BackgroundImages,
            errorGetBackgroundImages,
            isLoadingBackgroundImages,
            getBackgroundImages,

            ClickImagesLists,
            errorGetClickImagesLists,
            isLoadingClickImagesLists,
            getClickImagesLists
        }}>
            {children}
        </Context.Provider>
    )
}