import {ADD_REQUEST_FILE_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";


export function getSeriesRequest(Code){
    return GET_REQUEST_API('QuestionSeries/GetSeries', Code)
}

export function getSeriesViewEditRequest(Code){
    return GET_REQUEST_API('QuestionSeries/GetSeries_EXTENDED', Code)
}

export function getSeriesStatisticsRequest(Id){
    return GET_REQUEST_API('QuestionSeries/GetSeriesElementStatistics_EXTENDED', Id)
}

export function getSeriesAddersRequest(){
    return GET_REQUEST_API('QuestionSeries/GetSeriesAdders', null, true)
}

export function searchSeriesRequest(b){
    return GET_REQUEST_BODY_API('QuestionSeries/SearchSeries_ADVANCED', b, true)
}

export function searchSeriesByIdsRequest(b){
    return GET_REQUEST_BODY_API('QuestionSeries/SearchSeriesByIds_ADVANCED', b, true)
}


export function addSeriesStatisticRequest(b){
    return ADD_REQUEST_FILE_API('QuestionSeries/AddStatistic', b)
}
