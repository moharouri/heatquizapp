import React, { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getCurrentDatapool, getDatapools, setCurrentDatapool } from "../services/Datapools"

const Context = React.createContext()

export function useDatapools(){
    return useContext(Context)
}

export function DatapoolsProvider ({children}){
    //Fetch datapools from API
    const {data: datapools, error, isLoading} = useQuery('datapools', () => getDatapools())
    const [selectedDatapool, setSelectedDatapool] = useState(null)

    function changeDatapool(datapool){

        //Update datapool Id in Local storage
        setCurrentDatapool(datapool)

        //Update datapool name in the state
        setSelectedDatapool(datapool.label)
    }

    useEffect(() => {
        //Get datapool saved on local storage
        const currentDatapool = getCurrentDatapool()

        //when daatapools are received from the database (API)
        if(datapools && datapools.length){
            //see if datapool exists
            const corrospondingDatapool = datapools.filter((d) => d.Id === currentDatapool)[0]

            if(corrospondingDatapool) setSelectedDatapool(corrospondingDatapool.NickName);

            //if datapool saved in local storage is not in the list, default it to null
            else setCurrentDatapool({value:null});
        }
       

    }, [datapools])

    return(
        <Context.Provider value = {{
            datapools,
            error, 
            isLoading, 
            selectedDatapool,
            changeDatapool
        }}>
            {children}
        </Context.Provider>
    )
}