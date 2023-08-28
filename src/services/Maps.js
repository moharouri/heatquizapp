import { GET_REQUEST_API } from "./APIRequests";

const MAP_LS_STORAGE_NAME = 'MAP_HEAT_QUIZ_2023_ABCDEFG'

export function getMapRequest(Id){
    return GET_REQUEST_API('CourseMap/GetCourseMapPlayById_PORTAL/'+Id, null, false)
}


export function getMapPlayStatisticsRequest_LS(Id){
    const results_LS = localStorage.getItem(MAP_LS_STORAGE_NAME + Id)

    const result_JSON = results_LS ? JSON.parse(results_LS) : ({
        ElementsProgress:[]
    })

    return result_JSON
}

export function updateMapPlayStatisticsRequest_LS(data){
    const {Id, ElementsProgress} = data

    localStorage.setItem(MAP_LS_STORAGE_NAME + Id, JSON.stringify(({
        ElementsProgress:ElementsProgress
    })))

    const result_JSON = localStorage.getItem(MAP_LS_STORAGE_NAME + Id)

    return JSON.parse(result_JSON)
}