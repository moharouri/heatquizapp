import React, { useContext } from "react"
import { addQuestionCommentRequest, getQuestionCommentsQuery } from "../services/Comments"
import { useAsyncFn } from "../hooks/useAsync"

const Context = React.createContext()

export function useComments(){
    return useContext(Context)
}

export function CommentsProvider ({children}){
    
    //Fetch Comments from API
    const {loading: loadingQuestionComments, value: questionComments, error: getQuestionCommentsError, execute: getQuestionComments} = useAsyncFn((q) => getQuestionCommentsQuery(q))
    const {loading: loadingAddComment, value: addCommentResult, error: addCommentError, execute: addComment} = useAsyncFn((f) => addQuestionCommentRequest(f))
   
    return(
        <Context.Provider value = {{
           
            loadingQuestionComments,
            questionComments,
            getQuestionCommentsError,
            getQuestionComments,

            loadingAddComment,
            addCommentResult,
            addCommentError,
            addComment
        }}>
            {children}
        </Context.Provider>
    )
}