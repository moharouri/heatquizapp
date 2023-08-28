import { GET_REQUEST_API } from "./APIRequests";

export function getKeyboardRequest(Id){
    return GET_REQUEST_API('Keyboard/GetKeyboard_PORTAL_VIEW_EDIT', Id)
}