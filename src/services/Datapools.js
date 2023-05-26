import { GET_REQUEST_API } from "./APIRequests";

const DATAPOOL_LS_ID_KEY = 'USER_DATA_POOL_ID_HEAT_QUIZ_APP'

export function getDatapools(){
    return GET_REQUEST_API('DataPools/GetDataPools')
}

export function getCurrentDatapool(){
    const datapoolId = localStorage.getItem(DATAPOOL_LS_ID_KEY)

    return Number(datapoolId)
}

export function setCurrentDatapool(datapool){
    localStorage.setItem(DATAPOOL_LS_ID_KEY, datapool.value) 
}