import { GET_REQUEST_API } from "./APIRequests";

export function getAllCourses(){
    return GET_REQUEST_API('Course/GetAllCourses_PORTAL', null, true)
}

export function getMyCourses(){
    return GET_REQUEST_API('Course/GetAllMyCourses_PORTAL', null, true)
}

export function getCourse(Id){
    return GET_REQUEST_API('Course/GetCourseById_PORTAL/'+Id, null, false)
}
