import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { addQuestionStatisticRequest, getClickableQuestionPlayRequest, getKeyboardQuestionPlayRequest, getMultipleChoiceQuestionPlayRequest, searchQuestionsByIdsRequest, searchQuestionsRequest } from "../services/Questions"

const Context = React.createContext()

export function useQuestions(){
    return useContext(Context)
}

export function QuestionsProvider ({children}){
    //Fetch from API
    const {value: questions, errorGetQuestions, loading:isLoadingQuestions, execute: searchQuestions} = useAsyncFn((b) => searchQuestionsRequest(b)) 
    const {value: questionsByIds, errorGetQuestionsByIds, loading:isLoadingQuestionsByIds, execute: searchQuestionsByIds} = useAsyncFn((b) => searchQuestionsByIdsRequest(b)) 

    //Clickable question
    const {value: clickableQuestionPlay, errorGetClickableQuestionPlay, loading:isLoadingClickableQuestionPlay, execute:getClickableQuestionPlay} = useAsyncFn((Id) => getClickableQuestionPlayRequest(Id)) 
    
    //Multiple choice question
    const {value: multipleChoiceQuestionPlay, errorGetMultipleChoiceQuestionPlay, loading:isLoadingMultipleChoiceQuestionPlay, execute:getMultipleChoiceQuestionPlay} = useAsyncFn((Id) => getMultipleChoiceQuestionPlayRequest(Id)) 
    
    //Keyboard question 
    const {value: keyboardQuestionPlay, errorGetKeyboardQuestionPlay, loading:isLoadingKeyboardQuestionPlay, execute:getKeyboardQuestionPlay} = useAsyncFn((Id) => getKeyboardQuestionPlayRequest(Id)) 


    //Add statistic
    const {value: addQuestionStatisticResult, errorAddQuestionStatistic, loading:isLoadingAddQuestionStatistic, execute:postQuestionStatistic} = useAsyncFn((Id) => addQuestionStatisticRequest(Id)) 

    return(
        <Context.Provider value = {{
            questions,
            errorGetQuestions,
            isLoadingQuestions,
            searchQuestions,

            questionsByIds,
            errorGetQuestionsByIds,
            isLoadingQuestionsByIds,
            searchQuestionsByIds,

            clickableQuestionPlay,
            errorGetClickableQuestionPlay,
            isLoadingClickableQuestionPlay,
            getClickableQuestionPlay,

            multipleChoiceQuestionPlay,
            errorGetMultipleChoiceQuestionPlay,
            isLoadingMultipleChoiceQuestionPlay,
            getMultipleChoiceQuestionPlay,

            keyboardQuestionPlay,
            errorGetKeyboardQuestionPlay,
            isLoadingKeyboardQuestionPlay,
            getKeyboardQuestionPlay,

            addQuestionStatisticResult,
            errorAddQuestionStatistic,
            isLoadingAddQuestionStatistic,
            postQuestionStatistic
            
        }}>
            {children}
        </Context.Provider>
    )
}