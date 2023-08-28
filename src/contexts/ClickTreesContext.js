import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addImageTreeRequest, addTreeRequest, editNodeRequest, editTreeRequest, getClickTrees } from "../services/ClickTrees"

const Context = React.createContext()

export function useClickTrees(){
    return useContext(Context)
}

export function ClickTreesProvider ({children}){
    //Fetch from API
    const {value: clickTrees, errorGetClickTrees, loading:isLoadingClickTrees, execute: getAllClickTrees} = useAsyncFn(() => getClickTrees())
    const {loading: loadingAddTree, error: getAddTreeError, execute: addTree} = useAsyncFn((b) => addTreeRequest(b))
    const {loading: loadingEditTree, error: getEditTreeError, execute: editTree} = useAsyncFn((b) => editTreeRequest(b))


    const {loading: loadingAddImageTree, error: getAddImageTreeError, execute: addImageTree} = useAsyncFn((b) => addImageTreeRequest(b))
    const {loading: loadingEditNode, error: getEditNodeError, execute: editNode} = useAsyncFn((b) => editNodeRequest(b))


    return(
        <Context.Provider value = {{
            clickTrees,
            errorGetClickTrees, 
            isLoadingClickTrees, 

            getAllClickTrees,

            loadingAddTree,
            getAddTreeError,
            addTree,

            loadingAddImageTree,
            getAddImageTreeError,
            addImageTree,

            loadingEditTree,
            getEditTreeError,
            editTree,

            loadingEditNode,
            getEditNodeError,
            editNode
        }}>
            {children}
        </Context.Provider>
    )
}