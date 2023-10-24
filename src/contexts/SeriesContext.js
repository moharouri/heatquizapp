import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addQuestionsToSeriesRequest, addSeriesRequest, addSeriesStatisticRequest, assignQuestionsToPoolRequest, decreasePoolsNumberSeriesRequest, deselectQuestionFromSeriesRequest, editQuestionsInfoRequest, getSeriesAddersRequest, getSeriesRequest, getSeriesStatisticsRequest, getSeriesViewEditRequest, increasePoolsNumberSeriesRequest, searchSeriesByIdsRequest, searchSeriesRequest } from "../services/Series"

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
   
    const {value: addSeriesResult, errorAddSeries, loading:isLoadingAddSeries, execute: addSeries} = useAsyncFn((b) => addSeriesRequest(b)) 
    
    const {value: editQuestionsInfoResult, errorEditQuestionsInfo, loading:isLoadingEditQuestionsInfo, execute: editQuestionsInfo} = useAsyncFn((b) => editQuestionsInfoRequest(b)) 
    const {value: addQuestionsToSeriesResult, errorAddQuestionsToSeries, loading:isLoadingAddQuestionsToSeries, execute: addQuestionsToSeries} = useAsyncFn((b) => addQuestionsToSeriesRequest(b)) 
    const {value: assignQuestionsToPoolResult, errorAssignQuestionsToPool, loading:isLoadingAssignQuestionsToPool, execute: assignQuestionsToPool} = useAsyncFn((b) => assignQuestionsToPoolRequest(b)) 
    const {value: deselectQuestionFromSeriesResult, errorDeselectQuestionFromSeries, loading:isLoadingDeselectQuestionFromSeries, execute: deselectQuestionFromSeries} = useAsyncFn((b) => deselectQuestionFromSeriesRequest(b)) 
    const {value: decreasePoolsNumberSeriesResult, errorDecreasePoolsNumberSeries, loading:isLoadingDecreasePoolsNumberSeries, execute: decreasePoolsNumberSeries} = useAsyncFn((b) => decreasePoolsNumberSeriesRequest(b)) 
    const {value: increasePoolsNumberSeriesResult, errorIncreasePoolsNumberSeries, loading:isLoadingIncreasePoolsNumberSeries, execute: increasePoolsNumberSeries} = useAsyncFn((b) => increasePoolsNumberSeriesRequest(b)) 
    
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
            searchSeriesByIds,

            addSeriesResult,
            errorAddSeries,
            isLoadingAddSeries,
            addSeries,

            addQuestionsToSeriesResult,
            isLoadingAddQuestionsToSeries,
            errorAddQuestionsToSeries,
            addQuestionsToSeries,

            assignQuestionsToPoolResult,
            isLoadingAssignQuestionsToPool,
            errorAssignQuestionsToPool,
            assignQuestionsToPool,

            deselectQuestionFromSeriesResult,
            isLoadingDeselectQuestionFromSeries,
            errorDeselectQuestionFromSeries,
            deselectQuestionFromSeries,

            decreasePoolsNumberSeriesResult,
            isLoadingDecreasePoolsNumberSeries,
            errorDecreasePoolsNumberSeries,
            decreasePoolsNumberSeries,

            increasePoolsNumberSeriesResult,
            isLoadingIncreasePoolsNumberSeries,
            errorIncreasePoolsNumberSeries,
            increasePoolsNumberSeries,

            editQuestionsInfoRequest,
            editQuestionsInfo,
            isLoadingEditQuestionsInfo,
            errorEditQuestionsInfo
        }}>
            {children}
        </Context.Provider>
    )
}