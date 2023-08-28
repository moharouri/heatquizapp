import React, { useContext, useEffect, useState } from "react"
import { getCurrentDatapool, getDatapools, setCurrentDatapool } from "../services/Datapools"
import { useAsyncFn } from "../hooks/useAsync"

const Context = React.createContext()

export function useDatapools(){
    return useContext(Context)
}

export function DatapoolsProvider ({children}){
    //Fetch datapools from API
    const {value: datapools, errorGetDatapools, loading:isLoadingDatapools, execute: getAllDatapools} = useAsyncFn(() => getDatapools())
    const [selectedDatapool, setSelectedDatapool] = useState(null)

    function changeDatapool(datapool){

        //Update datapool Id in Local storage
        setCurrentDatapool(datapool)

        //Update datapool name in the state
        setSelectedDatapool(datapool.label)
    }

    useEffect(() => {
        getAllDatapools().then((data) => {
            //Get datapool saved on local storage
            const currentDatapool = getCurrentDatapool()

            //when daatapools are received from the database (API)
            if(data && data.length){
                //see if datapool exists
                const corrospondingDatapool = data.filter((d) => d.Id === currentDatapool)[0]

                if(corrospondingDatapool) setSelectedDatapool(corrospondingDatapool.NickName);

                //if datapool saved in local storage is not in the list, default it to null
                else setCurrentDatapool({value:null});
            }
        })
    }, [])

    return(
        <Context.Provider value = {{
            datapools,
            errorGetDatapools, 
            isLoadingDatapools, 
            selectedDatapool,
            changeDatapool
        }}>
            {children}
        </Context.Provider>
    )
}