import { GET_REQUEST_API, LOGIN_REQUEST_API } from "./APIRequests";

const PLAYER_KEY_KEY = 'PLAYER_KEY_HEAT_QUIZ_APP'
const TOKEN_KEY = 'TOKEN_HEAT_QUIZ_APP'

//Function to add player key to local storage (5 random chars + date now)
export function setPlayerKey(){
    const newPlayerKey = makeid(5) +  Date.now()

    localStorage.setItem(PLAYER_KEY_KEY, newPlayerKey)

    return newPlayerKey
}

//Function to get player key from local storage
export function getPlayerKey(){
    let playerKey = localStorage.getItem(PLAYER_KEY_KEY)

    if(!playerKey) playerKey = setPlayerKey()

    return playerKey
}

//Function to login
export function login({username, password, datapoolId}){
    return LOGIN_REQUEST_API(username, password, datapoolId)
}

//Function to check login status
export function getAuthData(){
    const playerKey = getPlayerKey()
    const token = getToken()

    return {playerKey, token}
}

//Function to check login status
export function checkAuthData(){
    return GET_REQUEST_API('Account/CheckUserToken')
}

//Function to add token to local storage 
export function setToken(token){
    localStorage.getItem(TOKEN_KEY, token)
}

//Function get add token from local storage 
export function getToken(){
    return localStorage.getItem(TOKEN_KEY)
}

//Function to create and Id of 5 charactars - randomly selected
function makeid(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

   return result;
}