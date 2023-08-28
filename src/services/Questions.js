import {ADD_REQUEST_BODY_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";

export function searchQuestionsRequest(b){
    return GET_REQUEST_BODY_API('SimpleClickable/GetQuestions_ADVANCED2_PORTAL', b, true)
}

export function searchQuestionsByIdsRequest(b){
    return GET_REQUEST_BODY_API('SimpleClickable/GetQuestionsByIds_ADVANCED_PORTAL', b, true)
}


export function getClickableQuestionPlayRequest(Id){
    return GET_REQUEST_API('SimpleClickable/GetQuestion_APP', Id)
}

export function getMultipleChoiceQuestionPlayRequest(Id){
    return GET_REQUEST_API('MultipleChoiceQuestion/GetQuestion_PORTAL', Id)
}

export function getKeyboardQuestionPlayRequest(Id){
    return GET_REQUEST_API('KeyboardQuestion/GetQuestion_PORTAL', Id)
}

export function addQuestionStatisticRequest(b){
    return ADD_REQUEST_BODY_API('SimpleClickable/PostStatistic', b)
}

