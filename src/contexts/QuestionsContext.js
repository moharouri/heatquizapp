import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import { GetQuestionStatisticsRequest, addClickableQuestionPartsRequest, addClickableQuestionRequest, addEnergyBalanceBCRequest, addEnergyBalanceEBT_Question_Request, addEnergyBalanceICRequest, addKeyboardQuestionAnswerRequest, addKeyboardQuestionRequest, addMultipleChoiceQuestionChoiceRequest, addMultipleChoiceQuestionRequest, addQuestionPDFStatisticRequest, addQuestionSolutionRequest, addQuestionStatisticRequest, copyQuestionRequest, deleteClickableQuestionPartRequest, editClickableQuestionAnswerRequest, editClickableQuestionImageRequest, editEnergyBalanceBCKeyboardRequest, editEnergyBalanceControlVolumeImageRequest, editEnergyBalanceControlVolumeStatusRequest, editEnergyBalanceEBT_Direction_Request, editEnergyBalanceEBT_Question_Latex_Request, editEnergyBalanceICKeyboardRequest, editEnergyBalanceTermCodeLatexTextRequest, editFBDObjectBodyColorRequest, editFBDVectorTermAssociationRequest, editFBDVectorTermColorRequest, editFBDVectorTermRequest, editKeyboardQuestionImageRequest, editKeyboardQuestionLatexRequest, editMultipleChoiceQuestionAdditionalInfoRequest, editMultipleChoiceQuestionChoiceRequest, editMultipleChoiceQuestionImageRequest, editMultipleChoiceQuestionLatexRequest, editQuestionBasicInfoRequest, flipEnergyBalanceEBT_Question_Direction_Request, getClickableQuestionPlayRequest, getDiagramQuestionPlayRequest, getEnergyBalanceQuestionPlayRequest, getFBDQuestionPlayRequest, getKeyboardQuestionPlayRequest, getKeyboardQuestionWrongAnswersRequest, getMultipleChoiceQuestionPlayRequest, getQuestionMedianTimeRequest, getQuestionRelationsRequest, removeEnergyBalanceBCRequest, removeEnergyBalanceControlVolumeRequest, removeEnergyBalanceEBT_Question_Request, removeEnergyBalanceICRequest, removeKeyboardQuestionAnswerRequest, removeMultipleChoiceQuestionChoiceImageRequest, removeMultipleChoiceQuestionChoiceLatexRequest, removeMultipleChoiceQuestionChoiceRequest, removeQuestionSolutionRequest, searchQuestionsByIdsRequest, searchQuestionsRequest } from "../services/Questions"

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

    //Energy balance question
    const {value: energyBalanceQuestionPlay, error:errorGetEnergyBalanceQuestionPlay, loading:isLoadingEnergyBalanceQuestionPlay, execute:getEnergyBalanceQuestionPlay} = useAsyncFn((Id) => getEnergyBalanceQuestionPlayRequest(Id)) 

    //FBD question
    const {value: FBDQuestionPlay, error:errorGetFBDQuestionPlay, loading:isLoadingFBDQuestionPlay, execute:getFBDQuestionPlay} = useAsyncFn((Id) => getFBDQuestionPlayRequest(Id)) 

     //Diagram question
     const {value: DiagramQuestionPlay, error:errorGetDiagramQuestionPlay, loading:isLoadingDiagramQuestionPlay, execute:getDiagramQuestionPlay} = useAsyncFn((Id) => getDiagramQuestionPlayRequest(Id)) 


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
    
    //Energy balance question
    const {value: editEnergyBalanceControlVolumeStatusResult, error:errorEditEnergyBalanceControlVolumeStatus, loading:isLoadingEditEnergyBalanceControlVolumeStatus, execute:editEnergyBalanceControlVolumeStatus} = useAsyncFn((b) => editEnergyBalanceControlVolumeStatusRequest(b))
    const {value: editEnergyBalanceControlVolumeImageResult, error:errorEditEnergyBalanceControlVolumeImage, loading:isLoadingEditEnergyBalanceControlVolumeImage, execute:editEnergyBalanceControlVolumeImage} = useAsyncFn((b) => editEnergyBalanceControlVolumeImageRequest(b))
    const {value: removeEnergyBalanceControlVolumeResult, error:errorRemoveEnergyBalanceControlVolume, loading:isLoadingRemoveEnergyBalanceControlVolume, execute:removeEnergyBalanceControlVolume} = useAsyncFn((b) => removeEnergyBalanceControlVolumeRequest(b))

    const {value: editEnergyBalanceTermCodeLatexTextResult, error:errorEditEnergyBalanceTermCodeLatexText, loading:isLoadingEditEnergyBalanceTermCodeLatexText, execute:editEnergyBalanceTermCodeLatexText} = useAsyncFn((b) => editEnergyBalanceTermCodeLatexTextRequest(b))
    const {value: editEnergyBalanceEBT_DirectionResult, error:errorEditEnergyBalanceEBT_Direction, loading:isLoadingEditEnergyBalanceEBT_Direction, execute:editEnergyBalanceEBT_Direction} = useAsyncFn((b) => editEnergyBalanceEBT_Direction_Request(b))

    const {value: addEnergyBalanceEBT_QuestionResult, error:errorAddEnergyBalanceEBT_Question, loading:isLoadingAddEnergyBalanceEBT_Question, execute:addEnergyBalanceEBT_Question} = useAsyncFn((b) => addEnergyBalanceEBT_Question_Request(b)) 
    const {value: editEnergyBalanceEBT_Question_LatexResult, error:errorEditEnergyBalanceEBT_Question_Latex, loading:isLoadingEditEnergyBalanceEBT_Question_Latex, execute:editEnergyBalanceEBT_Question_Latex} = useAsyncFn((b) => editEnergyBalanceEBT_Question_Latex_Request(b)) 
    const {value: flipEnergyBalanceEBT_Question_DirectionResult, error:errorFlipEnergyBalanceEBT_Question_Direction, loading:isLoadingFlipEnergyBalanceEBT_Question_Direction, execute:flipEnergyBalanceEBT_Question_Direction} = useAsyncFn((b) => flipEnergyBalanceEBT_Question_Direction_Request(b)) 
    const {value: removeEnergyBalanceEBT_QuestionResult, error:errorRemoveEnergyBalanceEBT_Question, loading:isLoadingRemoveEnergyBalanceEBT_Question, execute:removeEnergyBalanceEBT_Question} = useAsyncFn((b) => removeEnergyBalanceEBT_Question_Request(b)) 
    
    const {value: editEnergyBalanceBCKeyboardResult, error:errorEditEnergyBalanceBCKeyboard, loading:isLoadingEditEnergyBalanceBCKeyboard, execute:editEnergyBalanceBCKeyboard} = useAsyncFn((b) => editEnergyBalanceBCKeyboardRequest(b))
    const {value: addEnergyBalanceBCResult, error:errorAddEnergyBalanceBC, loading:isLoadingAddEnergyBalanceBC, execute:addEnergyBalanceBC} = useAsyncFn((b) => addEnergyBalanceBCRequest(b))
    const {value: removeEnergyBalanceBCResult, error:errorRemoveEnergyBalanceBC, loading:isLoadingRemoveEnergyBalanceBC, execute:removeEnergyBalanceBC} = useAsyncFn((b) => removeEnergyBalanceBCRequest(b))
     
    const {value: editEnergyBalanceICKeyboardResult, error:errorEditEnergyBalanceICKeyboard, loading:isLoadingEditEnergyBalanceICKeyboard, execute:editEnergyBalanceICKeyboard} = useAsyncFn((b) => editEnergyBalanceICKeyboardRequest(b)) 
    const {value: addEnergyBalanceICResult, error:errorAddEnergyBalanceIC, loading:isLoadingAddEnergyBalanceIC, execute:addEnergyBalanceIC} = useAsyncFn((b) => addEnergyBalanceICRequest(b)) 
    const {value: removeEnergyBalanceICResult, error:errorRemoveEnergyBalanceIC, loading:isLoadingRemoveEnergyBalanceIC, execute:removeEnergyBalanceIC} = useAsyncFn((b) => removeEnergyBalanceICRequest(b))

    //FBD Question
    const {value: editFBDObjectBodyColorResult, error:errorEditFBDObjectBodyColor, loading:isLoadingEditFBDObjectBodyColor, execute:editFBDObjectBodyColor} = useAsyncFn((b) => editFBDObjectBodyColorRequest(b))
    const {value: editFBDVectorTermColorResult, error:errorEditFBDVectorTermColor, loading:isLoadingEditFBDVectorTermColor, execute:editFBDVectorTermColor} = useAsyncFn((b) => editFBDVectorTermColorRequest(b))
    const {value:editFBDVectorTermResult, error:errorEditFBDVectorTerm, loading:isLoadingEditFBDVectorTerm, execute:editFBDVectorTerm} = useAsyncFn((b) => editFBDVectorTermRequest(b))
    const {value:editFBDVectorTermAssociationResult, error:errorEditFBDVectorTermAssociation, loading:isLoadingEditFBDVectorTermAssociation, execute:editFBDVectorTermAssociation} = useAsyncFn((b) => editFBDVectorTermAssociationRequest(b))


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

            energyBalanceQuestionPlay,
            errorGetEnergyBalanceQuestionPlay,
            isLoadingEnergyBalanceQuestionPlay,
            getEnergyBalanceQuestionPlay,

            FBDQuestionPlay,
            errorGetFBDQuestionPlay,
            isLoadingFBDQuestionPlay,
            getFBDQuestionPlay,

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

            //Clickable questions
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

            //Energy balance question
            editEnergyBalanceControlVolumeStatusResult,
            editEnergyBalanceControlVolumeStatus,
            errorEditEnergyBalanceControlVolumeStatus,
            isLoadingEditEnergyBalanceControlVolumeStatus,

            editEnergyBalanceControlVolumeImageResult,
            errorEditEnergyBalanceControlVolumeImage,
            isLoadingEditEnergyBalanceControlVolumeImage,
            editEnergyBalanceControlVolumeImage,
            
            removeEnergyBalanceControlVolumeResult,
            errorRemoveEnergyBalanceControlVolume,
            isLoadingRemoveEnergyBalanceControlVolume,
            removeEnergyBalanceControlVolume,

            editEnergyBalanceTermCodeLatexTextResult,
            errorEditEnergyBalanceTermCodeLatexText,
            isLoadingEditEnergyBalanceTermCodeLatexText,
            editEnergyBalanceTermCodeLatexText,

            editEnergyBalanceEBT_DirectionResult,
            errorEditEnergyBalanceEBT_Direction,
            isLoadingEditEnergyBalanceEBT_Direction,
            editEnergyBalanceEBT_Direction,

            addEnergyBalanceEBT_QuestionResult,
            errorAddEnergyBalanceEBT_Question,
            isLoadingAddEnergyBalanceEBT_Question,
            addEnergyBalanceEBT_Question,

            flipEnergyBalanceEBT_Question_DirectionResult,
            errorFlipEnergyBalanceEBT_Question_Direction,
            isLoadingFlipEnergyBalanceEBT_Question_Direction,
            flipEnergyBalanceEBT_Question_Direction,

            editEnergyBalanceEBT_Question_LatexResult,
            errorEditEnergyBalanceEBT_Question_Latex,
            isLoadingEditEnergyBalanceEBT_Question_Latex,
            editEnergyBalanceEBT_Question_Latex,

            removeEnergyBalanceEBT_QuestionResult,
            errorRemoveEnergyBalanceEBT_Question,
            isLoadingRemoveEnergyBalanceEBT_Question,
            removeEnergyBalanceEBT_Question,

            editEnergyBalanceBCKeyboardResult,
            errorEditEnergyBalanceBCKeyboard,
            isLoadingEditEnergyBalanceBCKeyboard,
            editEnergyBalanceBCKeyboard,

            editEnergyBalanceICKeyboardResult,
            errorEditEnergyBalanceICKeyboard,
            isLoadingEditEnergyBalanceICKeyboard,
            editEnergyBalanceICKeyboard,

            addEnergyBalanceBCResult,
            errorAddEnergyBalanceBC,
            isLoadingAddEnergyBalanceBC,
            addEnergyBalanceBC,

            removeEnergyBalanceBCResult,
            errorRemoveEnergyBalanceBC,
            isLoadingRemoveEnergyBalanceBC,
            removeEnergyBalanceBC,

            addEnergyBalanceICResult,
            errorAddEnergyBalanceIC,
            isLoadingAddEnergyBalanceIC,
            addEnergyBalanceIC,

            removeEnergyBalanceICResult,
            errorRemoveEnergyBalanceIC,
            isLoadingRemoveEnergyBalanceIC,
            removeEnergyBalanceIC,

            //FBD question
            editFBDObjectBodyColorResult,
            errorEditFBDObjectBodyColor,
            isLoadingEditFBDObjectBodyColor,
            editFBDObjectBodyColor,

            editFBDVectorTermColorResult,
            errorEditFBDVectorTermColor,
            isLoadingEditFBDVectorTermColor,
            editFBDVectorTermColor,

            editFBDVectorTermResult,
            errorEditFBDVectorTerm,
            isLoadingEditFBDVectorTerm,
            editFBDVectorTerm,

            editFBDVectorTermAssociationResult,
            errorEditFBDVectorTermAssociation,
            isLoadingEditFBDVectorTermAssociation,
            editFBDVectorTermAssociation,

            DiagramQuestionPlay,
            isLoadingDiagramQuestionPlay,
            errorGetDiagramQuestionPlay,
            getDiagramQuestionPlay,

            isLoadingGetQuestionMedianTime,
            getQuestionMedianTimeResult,
            errorGetQuestionMedianTime,
            getQuestionMedianTime
        }}>
            {children}
        </Context.Provider>
    )
}