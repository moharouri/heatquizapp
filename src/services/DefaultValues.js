import { GET_REQUEST_API } from "./APIRequests";

export function getDefaultImagesRequest(){
    return GET_REQUEST_API('QuestionImage/GetAllImages', null, true)
}


export function getBackgroundImagesRequest(){
    return GET_REQUEST_API('BackgroundImage/GetAllImages', null, true)
}

export function getClickImagesListsRequest(){
    return GET_REQUEST_API('CourseMapElementImages/GetAllImages', null, true)
}

