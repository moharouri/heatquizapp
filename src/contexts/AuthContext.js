import React, { useContext, useEffect, useState } from "react"
import { checkAuthData, getAuthData, login, setPlayerKey } from "../services/Auth"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

const Context = React.createContext()

export function useAuth(){
    return useContext(Context)
}

export function AuthProvider ({children}){
    const [currentPlayerKey, setCurrentPlayerKey] = useState('')

    const [isLogging, setIsLogging] = useState(false)
    const [loginError, setLoginError] = useState('')

    const [isStudent, setIsStudent] = useState(false)
    const [username, setUsername] = useState('')
    const [currentToken, setCurrentToken] = useState('')
    
    const navigate = useNavigate()

    useEffect(() => {
        
        try{
            //Authenticate the token saved to LS
            useQuery('AuthDataValid', () => checkAuthData())
        }
        catch{
            //navigate('/Login')
        }
        const {token, playerKey} = getAuthData()

        setCurrentToken(token)
        setCurrentPlayerKey(playerKey)
    }, [])



    function attemptLogin(username, password, datapoolId){
        const {data: userInfo, isLoading, error} = useQuery('Login',() => login(username, password, datapoolId))

        setIsLogging(isLoading)
        setLoginError(error)

        if(!error && !isLoading){

        }
    }

    function playAsStudent(){
        setIsStudent(true)
        navigate('/')

    }

    return(
        <Context.Provider value = {{
            currentPlayerKey,

            isLogging,
            loginError,

            username,
            currentToken,

            isStudent,
            
            playAsStudent,
            attemptLogin
        }}>
            {children}
        </Context.Provider>
    )
}