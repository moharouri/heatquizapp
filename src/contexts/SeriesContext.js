import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addSeriesStatisticRequest, getSeriesAddersRequest, getSeriesRequest, getSeriesStatisticsRequest, getSeriesViewEditRequest, searchSeriesByIdsRequest, searchSeriesRequest } from "../services/Series"

const Context = React.createContext()

export function useSeries(){
    return useContext(Context)
}

export function SeriesProvider ({children}){
    //Fetch from API
    const {value: Series, errorGetSeries, loading:isLoadingSeries, execute: getSeries} = useAsyncFn((code) => getSeriesRequest(code)) 
    const {value: SeriesViewEdit, errorGetSeriesViewEdit, loading:isLoadingSeriesViewEdit, execute: getSeriesViewEdit} = useAsyncFn((code) => getSeriesViewEditRequest(code)) 


    const {value: SeriesStatistics, errorGetSeriesStatistics, loading:isLoadingSeriesStatistics, execute: getSeriesStatistics} = useAsyncFn((code) => getSeriesStatisticsRequest(code))
    const {value: SeriesAdders, errorGetSeriesAdders, loading:isLoadingSeriesAdders, execute: getSeriesAdders} = useAsyncFn(() => getSeriesAddersRequest())

    const {value: addSeriesStatisticResult, errorAddSeriesStatistic, loading:isLoadingAddSeriesStatistic, execute: postSeriesStatistic} = useAsyncFn((b) => addSeriesStatisticRequest(b)) 
    
    const {value: SeriesQuery, errorGetSeriesQuery, loading:isLoadingSeriesQuery, execute: searchSeries} = useAsyncFn((b) => searchSeriesRequest(b))
    const {value: SeriesByIdsQuery, errorGetSeriesByIdsQuery, loading:isLoadingSeriesByIdsQuery, execute: searchSeriesByIds} = useAsyncFn((b) => searchSeriesByIdsRequest(b))

    return(
        <Context.Provider value = {{
            isLoadingSeries,
            errorGetSeries,
            Series,
            getSeries,

            isLoadingSeriesViewEdit,
            errorGetSeriesViewEdit,
            SeriesViewEdit,
            getSeriesViewEdit,

            isLoadingSeriesStatistics,
            errorGetSeriesStatistics,
            SeriesStatistics,
            getSeriesStatistics,    

            isLoadingSeriesAdders,
            errorGetSeriesAdders,
            SeriesAdders,
            getSeriesAdders,
            
            addSeriesStatisticResult,
            errorAddSeriesStatistic,
            isLoadingAddSeriesStatistic,
            postSeriesStatistic,

            isLoadingSeriesQuery,
            errorGetSeriesQuery,
            SeriesQuery,
            searchSeries,

            isLoadingSeriesByIdsQuery,
            errorGetSeriesByIdsQuery,
            SeriesByIdsQuery,
            searchSeriesByIds
        }}>
            {children}
        </Context.Provider>
    )
}