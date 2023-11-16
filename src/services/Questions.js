import {ADD_REQUEST_BODY_API, ADD_REQUEST_FILE_API, EDIT_REQUEST_BODY_API, EDIT_REQUEST_FILE_API, GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";

export function searchQuestionsRequest(b){
    return GET_REQUEST_BODY_API('SimpleClickable/GetQuestions_ADVANCED2_PORTAL', b, true)
}

export function searchQuestionsByIdsRequest(b){
    return GET_REQUEST_BODY_API('SimpleClickable/GetQuestionsByIds_ADVANCED_PORTAL', b, true)
}

export function getQuestionMedianTimeRequest(Id){
    return GET_REQUEST_API('Statistics/GetQuestionStatisticDetailed', Id)
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


export function addQuestionPDFStatisticRequest(b){
    return ADD_REQUEST_FILE_API('SimpleClickable/AddQuestionPDFStatistic', b)
}

export function copyQuestionRequest(b){
    return ADD_REQUEST_BODY_API('SimpleClickable/CopyQuestion', b)
}

export function editQuestionBasicInfoRequest(b){
    return ADD_REQUEST_BODY_API('SimpleClickable/EditQuestionBaseInfo', b, true)
}

export function removeQuestionSolutionRequest(b){
    return EDIT_REQUEST_FILE_API('SimpleClickable/RemoveQuestionSolution', b)
}

export function addQuestionSolutionRequest(b){
    return ADD_REQUEST_FILE_API('SimpleClickable/AddEditQuestionPDF', b, true)
}


export function getQuestionRelationsRequest(Id){
    return GET_REQUEST_API('SimpleClickable/GetQuestionSeriesMapRelations_PORTAL', Id)
}

export function GetQuestionStatisticsRequest(Id){
    return GET_REQUEST_API('SimpleClickable/GetQuestionStatisticTotal', Id)
}

//Mutliple choice question edit functions
export function addMultipleChoiceQuestionRequest(b){
    return ADD_REQUEST_FILE_API('MultipleChoiceQuestion/AddQuestionSingleStep', b, true)
}

export function addMultipleChoiceQuestionChoiceRequest(b){
    return ADD_REQUEST_FILE_API('MultipleChoiceQuestion/AddQuestionAnswer', b)
}

export function removeMultipleChoiceQuestionChoiceLatexRequest(b){
    return EDIT_REQUEST_FILE_API('MultipleChoiceQuestion/RemoveQuestionAnswerLatex', b) // should be changed later
}

export function removeMultipleChoiceQuestionChoiceImageRequest(b){
    return EDIT_REQUEST_FILE_API('MultipleChoiceQuestion/RemoveQuestionAnswerImage', b) // should be changed later
}

export function editMultipleChoiceQuestionLatexRequest(b){
    return EDIT_REQUEST_BODY_API('MultipleChoiceQuestion/EditQuestionLatex', b)
}


export function editMultipleChoiceQuestionAdditionalInfoRequest(b){
    return EDIT_REQUEST_BODY_API('MultipleChoiceQuestion/EditQuestionAdditionalInfo', b)
}

export function editMultipleChoiceQuestionImageRequest(b){
    return EDIT_REQUEST_FILE_API('MultipleChoiceQuestion/AddEditQuestionImage', b)
}

export function editMultipleChoiceQuestionChoiceRequest(b){
    return EDIT_REQUEST_FILE_API('MultipleChoiceQuestion/EditQuestionAnswer', b)
}

export function removeMultipleChoiceQuestionChoiceRequest(b){
    return EDIT_REQUEST_BODY_API('MultipleChoiceQuestion/RemoveQuestionAnswer', b) // should be changed later
}

//Keyboard question edit functions
export function addKeyboardQuestionRequest(b){
    return ADD_REQUEST_FILE_API('KeyboardQuestion/AddQuestionSingleStep', b, true)
}

export function addKeyboardQuestionAnswerRequest(b){
    return EDIT_REQUEST_BODY_API('KeyboardQuestion/AddQuestionAnswer', b)
}

export function removeKeyboardQuestionAnswerRequest(b){
    return EDIT_REQUEST_BODY_API('KeyboardQuestion/RemoveQuestionAnswer', b)
}

export function editKeyboardQuestionLatexRequest(b){
    return EDIT_REQUEST_BODY_API('KeyboardQuestion/EditQuestionLatex', b)
}


export function editKeyboardQuestionImageRequest(b){
    return EDIT_REQUEST_FILE_API('KeyboardQuestion/AddEditQuestionImage', b)
}

export function getKeyboardQuestionWrongAnswersRequest(b){
    return GET_REQUEST_API('KeyboardQuestion/GetKeyboardQuestionWrongAnswers_PORTAL', b)
}

//Clickable question edit functions
export function addClickableQuestionRequest(b){
    return ADD_REQUEST_FILE_API('SimpleClickable/AddQuestionSingleStep', b, true)
}

export function editClickableQuestionAnswerRequest(b){
    return EDIT_REQUEST_BODY_API('SimpleClickable/UpdateClickableImageAnswer', b, true)
}

export function deleteClickableQuestionPartRequest(b){
    return EDIT_REQUEST_BODY_API('SimpleClickable/RemoveClickable', b)
}

export function addClickableQuestionPartsRequest(b){
    return ADD_REQUEST_FILE_API('SimpleClickable/AddNewQuestionParts', b)
}

export function editClickableQuestionImageRequest(b){
    return EDIT_REQUEST_FILE_API('SimpleClickable/AddEditQuestionBackgroundImage', b)
}






