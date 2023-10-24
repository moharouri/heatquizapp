import { ADD_REQUEST_FILE_API, GET_REQUEST_API } from "./APIRequests";


export function getQuestionCommentsQuery(q){
    return GET_REQUEST_API('QuestionComments/GetQuestionComments', q.Id, false)
}

export function addQuestionCommentRequest(b){
    return ADD_REQUEST_FILE_API('QuestionComments/AddQuestionComment', b, false)
}