import { GET_REQUEST_API, GET_REQUEST_BODY_API } from "./APIRequests";

export function getKeyboardRequest(Id){
    return GET_REQUEST_API('Keyboard/GetKeyboard_PORTAL_VIEW_EDIT', Id)
}

export function getAllKeyListsRequest(){
    return GET_REQUEST_API('KeysList/GetAllKeyLists', null, true)
}

export function searchKeyboardsRequest(b){
    return GET_REQUEST_BODY_API('Keyboard/SearchKeyoards_ADVANCED_UPDATED_PORTAL', b, true)
}

export function searchKeyboardsByIdsRequest(b){
    return GET_REQUEST_BODY_API('Keyboard/SearchKeyoardsByIds_ADVANCED', b)
}
