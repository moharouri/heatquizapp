import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { GetQuestionStatisticsRequest, addClickableQuestionPartsRequest, addClickableQuestionRequest, addKeyboardQuestionAnswerRequest, addKeyboardQuestionRequest, addMultipleChoiceQuestionChoiceRequest, addMultipleChoiceQuestionRequest, addQuestionPDFStatisticRequest, addQuestionSolutionRequest, addQuestionStatisticRequest, copyQuestionRequest, deleteClickableQuestionPartRequest, editClickableQuestionAnswerRequest, editClickableQuestionImageRequest, editKeyboardQuestionImageRequest, editKeyboardQuestionLatexRequest, editMultipleChoiceQuestionAdditionalInfoRequest, editMultipleChoiceQuestionChoiceRequest, editMultipleChoiceQuestionImageRequest, editMultipleChoiceQuestionLatexRequest, editQuestionBasicInfoRequest, getClickableQuestionPlayRequest, getKeyboardQuestionPlayRequest, getKeyboardQuestionWrongAnswersRequest, getMultipleChoiceQuestionPlayRequest, getQuestionMedianTimeRequest, getQuestionRelationsRequest, removeKeyboardQuestionAnswerRequest, removeMultipleChoiceQuestionChoiceImageRequest, removeMultipleChoiceQuestionChoiceLatexRequest, removeMultipleChoiceQuestionChoiceRequest, removeQuestionSolutionRequest, searchQuestionsByIdsRequest, searchQuestionsRequest } from "../services/Questions"

const Context = React.createContext()

export function useQuestions(){
    return useContext(Context)
}

export function QuestionsProvider ({children}){
    //Fetch from API
    const {value: questions, error:errorGetQuestions, loading:isLoadingQuestions, execute: searchQuestions} = useAsyncFn((b, substream) => {
        if(substream){
            return searchQuestionsByIdsRequest(b)
        }
        else{
            return searchQuestionsRequest(b)
        }
    }) 

    //Clickable question
    const {value: clickableQuestionPlay, error: errorGetClickableQuestionPlay, loading:isLoadingClickableQuestionPlay, execute:getClickableQuestionPlay} = useAsyncFn((Id) => getClickableQuestionPlayRequest(Id)) 
    
    //Multiple choice question
    const {value: multipleChoiceQuestionPlay, error:errorGetMultipleChoiceQuestionPlay, loading:isLoadingMultipleChoiceQuestionPlay, execute:getMultipleChoiceQuestionPlay} = useAsyncFn((Id) => getMultipleChoiceQuestionPlayRequest(Id)) 
    
    //Keyboard question 
    const {value: keyboardQuestionPlay, error:errorGetKeyboardQuestionPlay, loading:isLoadingKeyboardQuestionPlay, execute:getKeyboardQuestionPlay} = useAsyncFn((Id) => getKeyboardQuestionPlayRequest(Id)) 

    //Question relations 
    const {value: questionRelations, error:errorGetQuestionRelations, loading:isLoadingGetQuestionRelations, execute:getQuestionRelations} = useAsyncFn((Id) => getQuestionRelationsRequest(Id)) 
    
    //Question statistics 
    const {value: questionStatistics, error:errorGetQuestionStatistics, loading:isLoadingGetQuestionStatistics, execute:getQuestionStatistics} = useAsyncFn((Id) => GetQuestionStatisticsRequest(Id)) 

    //Add statistic
    const {value: addQuestionStatisticResult, error:errorAddQuestionStatistic, loading:isLoadingAddQuestionStatistic, execute:postQuestionStatistic} = useAsyncFn((Id) => addQuestionStatisticRequest(Id)) 
    const {value: addQuestionPDFStatisticResult, error:errorAddQuestionPDFStatistic, loading:isLoadingAddQuestionPDFStatistic, execute:postQuestionPDFStatistic} = useAsyncFn((b) => addQuestionPDFStatisticRequest(b)) 
    
    //Copy question
    const {value: copyQuestionResult, error:errorCopyQuestion, loading:isLoadingCopyQuestion, execute:copyQuestion} = useAsyncFn((b) => copyQuestionRequest(b)) 
    
    //Edit basic info
    const {value: editQuestionBasicInfoResult, error:errorEditQuestionBasicInfo, loading:isLoadingEditQuestionBasicInfo, execute:editQuestionBasicInfo} = useAsyncFn((b) => editQuestionBasicInfoRequest(b)) 
    
    //Edit solution
    const {value: editQuestionSolutionResult, error:errorEditQuestionSolution, loading:isLoadingEditQuestionSolution, execute:editQuestionSolution} = useAsyncFn((b) => addQuestionSolutionRequest(b)) 
    const {value: removeQuestionSolutionResult, error:errorRemoveQuestionSolution, loading:isLoadingRemoveQuestionSolution, execute:removeQuestionSolution} = useAsyncFn((b) => removeQuestionSolutionRequest(b)) 


    //Multiple choice edit question actions
    const {value: editMultipleChoiceQuestionLatexResult, error:errorEditMultipleChoiceQuestionLatex, loading:isLoadingEditMultipleChoiceQuestionLatex, execute:editMultipleChoiceQuestionLatex} = useAsyncFn((b) => editMultipleChoiceQuestionLatexRequest(b)) 
    const {value: editMultipleChoiceQuestionAdditionalInfoResult, error:errorEditMultipleChoiceQuestionAdditionalInfo, loading:isLoadingEditMultipleChoiceQuestionAdditionalInfo, execute:editMultipleChoiceQuestionAdditionalInfo} = useAsyncFn((b) => editMultipleChoiceQuestionAdditionalInfoRequest(b)) 
    const {value: editMultipleChoiceQuestionImageResult, error:errorEditMultipleChoiceQuestionImage, loading:isLoadingEditMultipleChoiceQuestionImage, execute:editMultipleChoiceQuestionImage} = useAsyncFn((b) => editMultipleChoiceQuestionImageRequest(b)) 

    const {value: addMultipleChoiceQuestionChoiceResult, error:errorAddMultipleChoiceQuestionChoice, loading:isLoadingAddMultipleChoiceQuestionChoice, execute:addMultipleChoiceQuestionChoice} = useAsyncFn((b) => addMultipleChoiceQuestionChoiceRequest(b)) 
    const {value: editMultipleChoiceQuestionChoiceResult, error:errorEditMultipleChoiceQuestionChoice, loading:isLoadingEditMultipleChoiceQuestionChoice, execute:editMultipleChoiceQuestionChoice} = useAsyncFn((b) => editMultipleChoiceQuestionChoiceRequest(b)) 
    const {value: removeMultipleChoiceQuestionChoiceResult, error:errorRemoveMultipleChoiceQuestionChoice, loading:isLoadingRemoveMultipleChoiceQuestionChoice, execute:removeMultipleChoiceQuestionChoice} = useAsyncFn((b) => removeMultipleChoiceQuestionChoiceRequest(b)) 
    const {value: removeMultipleChoiceQuestionChoiceLatexResult, error:errorRemoveMultipleChoiceQuestionChoiceLatex, loading:isLoadingRemoveMultipleChoiceQuestionChoiceLatex, execute:removeMultipleChoiceQuestionChoiceLatex} = useAsyncFn((b) => removeMultipleChoiceQuestionChoiceLatexRequest(b)) 
    const {value: removeMultipleChoiceQuestionChoiceImageResult, error:errorRemoveMultipleChoiceQuestionChoiceImage, loading:isLoadingRemoveMultipleChoiceQuestionChoiceImage, execute:removeMultipleChoiceQuestionChoiceImage} = useAsyncFn((b) => removeMultipleChoiceQuestionChoiceImageRequest(b)) 

    const {value: addMultipleChoiceQuestionResult, error:errorAddMultipleChoiceQuestion, loading:isLoadingAddMultipleChoiceQuestion, execute:addMultipleChoiceQuestion} = useAsyncFn((b) => addMultipleChoiceQuestionRequest(b)) 


    //Keyboard question edit actions
    const {value: addKeyboardQuestionAnswerResult, error:errorAddKeyboardQuestionAnswer, loading:isLoadingAddKeyboardQuestionAnswer, execute:addKeyboardQuestionAnswer} = useAsyncFn((b) => addKeyboardQuestionAnswerRequest(b)) 
    const {value: removeKeyboardQuestionAnswerResult, error:errorRemoveKeyboardQuestionAnswer, loading:isLoadingRemoveKeyboardQuestionAnswer, execute:removeKeyboardQuestionAnswer} = useAsyncFn((b) => removeKeyboardQuestionAnswerRequest(b)) 
    const {value: editKeyboardQuestionLatexResult, error:errorEditKeyboardQuestionLatex, loading:isLoadingEditKeyboardQuestionLatex, execute:editKeyboardQuestionLatex} = useAsyncFn((b) => editKeyboardQuestionLatexRequest(b)) 
    const {value: editKeyboardQuestionImageResult, error:errorEditKeyboardQuestionImage, loading:isLoadingEditKeyboardQuestionImage, execute:editKeyboardQuestionImage} = useAsyncFn((b) => editKeyboardQuestionImageRequest(b)) 
    const {value: getKeyboardQuestionWrongAnswersResult, error:errorGetKeyboardQuestionWrongAnswers, loading:isLoadingKeyboardQuestionWrongAnswers, execute:getKeyboardQuestionWrongAnswers} = useAsyncFn((b) => getKeyboardQuestionWrongAnswersRequest(b)) 

    const {value: addKeyboardQuestionResult, error:errorAddKeyboardQuestion, loading:isLoadingAddKeyboardQuestion, execute:addKeyboardQuestion} = useAsyncFn((b) => addKeyboardQuestionRequest(b)) 


    //Clickable question
    const {value: addClickableQuestionResult, error:errorAddClickableQuestion, loading:isLoadingAddClickableQuestion, execute:addClickableQuestion} = useAsyncFn((b) => addClickableQuestionRequest(b)) 
    const {value: editClickableQuestionAnswerResult, error:errorEditClickableQuestionAnswer, loading:isLoadingEditClickableQuestionAnswer, execute:editClickableQuestionAnswer} = useAsyncFn((b) => editClickableQuestionAnswerRequest(b)) 
    const {value: deleteClickableQuestionPartResult, error:errorDeleteClickableQuestionPart, loading:isLoadingDeleteClickableQuestionPart, execute:deleteClickableQuestionPart} = useAsyncFn((b) => deleteClickableQuestionPartRequest(b)) 
    const {value: addClickableQuestionPartsResult, error:errorAddClickableQuestionParts, loading:isLoadingAddClickableQuestionParts, execute:addClickableQuestionParts} = useAsyncFn((b) => addClickableQuestionPartsRequest(b)) 
    const {value: editClickableQuestionImageResult, error:errorEditClickableQuestionImage, loading:isLoadingEditClickableQuestionImage, execute:editClickableQuestionImage} = useAsyncFn((b) => editClickableQuestionImageRequest(b)) 
    
    //Question median time statistics
    const {value: getQuestionMedianTimeResult, error:errorGetQuestionMedianTime, loading:isLoadingGetQuestionMedianTime, execute:getQuestionMedianTime} = useAsyncFn((Id) => getQuestionMedianTimeRequest(Id)) 

    return(
        <Context.Provider value = {{
            questions,
            errorGetQuestions,
            isLoadingQuestions,
            searchQuestions,

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
            postQuestionStatistic,

            addQuestionPDFStatisticResult,
            errorAddQuestionPDFStatistic,
            isLoadingAddQuestionPDFStatistic,
            postQuestionPDFStatistic,

            questionRelations,
            errorGetQuestionRelations,
            isLoadingGetQuestionRelations,
            getQuestionRelations,

            questionStatistics,
            errorGetQuestionStatistics,
            isLoadingGetQuestionStatistics,
            getQuestionStatistics,

            copyQuestionResult,
            errorCopyQuestion,
            isLoadingCopyQuestion,
            copyQuestion,

            editQuestionBasicInfoResult,
            errorEditQuestionBasicInfo,
            isLoadingEditQuestionBasicInfo,
            editQuestionBasicInfo,

            editQuestionSolutionResult,
            errorEditQuestionSolution,
            isLoadingEditQuestionSolution,
            editQuestionSolution,

            removeQuestionSolutionResult,
            errorRemoveQuestionSolution,
            isLoadingRemoveQuestionSolution,
            removeQuestionSolution,

            //multiple choice question
            addMultipleChoiceQuestionResult,
            errorAddMultipleChoiceQuestion,
            isLoadingAddMultipleChoiceQuestion,
            addMultipleChoiceQuestion,
            
            editMultipleChoiceQuestionLatexResult, 
            errorEditMultipleChoiceQuestionLatex,
            isLoadingEditMultipleChoiceQuestionLatex,
            editMultipleChoiceQuestionLatex,

            editMultipleChoiceQuestionAdditionalInfoResult, 
            errorEditMultipleChoiceQuestionAdditionalInfo,
            isLoadingEditMultipleChoiceQuestionAdditionalInfo,
            editMultipleChoiceQuestionAdditionalInfo,

            editMultipleChoiceQuestionImageResult,
            errorEditMultipleChoiceQuestionImage,
            isLoadingEditMultipleChoiceQuestionImage,
            editMultipleChoiceQuestionImage,

            editMultipleChoiceQuestionChoiceResult,
            errorEditMultipleChoiceQuestionChoice,
            isLoadingEditMultipleChoiceQuestionChoice,
            editMultipleChoiceQuestionChoice,


            addMultipleChoiceQuestionChoiceResult,
            isLoadingAddMultipleChoiceQuestionChoice,
            errorAddMultipleChoiceQuestionChoice,
            addMultipleChoiceQuestionChoice,

            removeMultipleChoiceQuestionChoiceResult,
            errorRemoveMultipleChoiceQuestionChoice,
            isLoadingRemoveMultipleChoiceQuestionChoice,
            removeMultipleChoiceQuestionChoice,
            
            removeMultipleChoiceQuestionChoiceLatexResult,
            errorRemoveMultipleChoiceQuestionChoiceLatex,
            isLoadingRemoveMultipleChoiceQuestionChoiceLatex,
            removeMultipleChoiceQuestionChoiceLatex,

            removeMultipleChoiceQuestionChoiceImageResult,
            errorRemoveMultipleChoiceQuestionChoiceImage,
            isLoadingRemoveMultipleChoiceQuestionChoiceImage,
            removeMultipleChoiceQuestionChoiceImage,

            //Keyboard question

            addKeyboardQuestionResult,
            isLoadingAddKeyboardQuestion,
            errorAddKeyboardQuestion,
            addKeyboardQuestion,

            editKeyboardQuestionLatexResult, 
            errorEditKeyboardQuestionLatex,
            isLoadingEditKeyboardQuestionLatex,
            editKeyboardQuestionLatex,

            editKeyboardQuestionImageResult,
            errorEditKeyboardQuestionImage,
            isLoadingEditKeyboardQuestionImage,
            editKeyboardQuestionImage,

            getKeyboardQuestionWrongAnswersResult,
            errorGetKeyboardQuestionWrongAnswers,
            isLoadingKeyboardQuestionWrongAnswers,
            getKeyboardQuestionWrongAnswers,

            addKeyboardQuestionAnswerResult,
            errorAddKeyboardQuestionAnswer,
            isLoadingAddKeyboardQuestionAnswer,
            addKeyboardQuestionAnswer,

            removeKeyboardQuestionAnswerResult,
            errorRemoveKeyboardQuestionAnswer,
            isLoadingRemoveKeyboardQuestionAnswer,
            removeKeyboardQuestionAnswer,

            isLoadingAddClickableQuestion,
            addClickableQuestionResult,
            errorAddClickableQuestion,
            addClickableQuestion,

            isLoadingEditClickableQuestionAnswer,
            editClickableQuestionAnswerResult,
            errorEditClickableQuestionAnswer,
            editClickableQuestionAnswer,

            isLoadingDeleteClickableQuestionPart,
            deleteClickableQuestionPartResult,
            errorDeleteClickableQuestionPart,
            deleteClickableQuestionPart,

            isLoadingAddClickableQuestionParts,
            addClickableQuestionPartsResult,
            errorAddClickableQuestionParts,
            addClickableQuestionParts,

            isLoadingEditClickableQuestionImage,
            errorEditClickableQuestionImage,
            editClickableQuestionImageResult,
            editClickableQuestionImage,

            isLoadingGetQuestionMedianTime,
            getQuestionMedianTimeResult,
            errorGetQuestionMedianTime,
            getQuestionMedianTime
        }}>
            {children}
        </Context.Provider>
    )
}