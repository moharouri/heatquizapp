import React, { useContext} from "react"

import { useAsyncFn } from "../hooks/useAsync"
import {} from "../services/Topics"
import {addMapClickImageListRequest, addQuestionInformationRequest, editMapClickImageListImageRequest, editMapClickImageListNameRequest, editQuestionInformationDocumentRequest, editQuestionInformationLatexRequest, editQuestionInformationNameRequest, getAllMapClickImageListsRequest, getAllQuestionInformationRequest, getAllQuestionsAssignedInformationRequest, removeQuestionInformationDocumentRequest } from "../services/AssistanceObjects"

const Context = React.createContext()

export function useAssistanceObjects(){
    return useContext(Context)
}

export function AssistanceObjectsProvider ({children}){
    //Fetch from API
    const {value: mapClickImageLists, errorGetMapClickImageLists, loading:isLoadingMapClickImageLists, execute: getAllMapClickImageLists} = useAsyncFn(() => getAllMapClickImageListsRequest())
    
    const {value: addMapClickImageListResult, errorAddMapClickImageList, loading:isLoadingAddMapClickImageList, execute: addMapClickImageList} = useAsyncFn((b) => addMapClickImageListRequest(b))
    const {value: editMapClickImageListNameResult, errorEditMapClickImageListName, loading:isLoadingEditMapClickImageListName, execute: editMapClickImageListName} = useAsyncFn((b) => editMapClickImageListNameRequest(b))
    const {value: editMapClickImageListImageResult, errorEditMapClickImageListImage, loading:isLoadingEditMapClickImageListImage, execute: editMapClickImageListImage} = useAsyncFn((b) => editMapClickImageListImageRequest(b))

    const {value: informationList, errorGetAllQuestionInformation, loading:isLoadinginformationList, execute: getAllQuestionInformation} = useAsyncFn(() => getAllQuestionInformationRequest())
   
    const {value: addQuestionInformationResult, errorAddQuestionInformation, loading:isLoadingAddQuestionInformation, execute: addQuestionInformation} = useAsyncFn((b) => addQuestionInformationRequest(b))
    const {value: editQuestionInformationNameResult, errorEditQuestionInformationName, loading:isLoadingEditQuestionInformationName, execute: editQuestionInformationName} = useAsyncFn((b) => editQuestionInformationNameRequest(b))
    
    const {value: editQuestionInformationLatexResult, errorEditQuestionInformationLatex, loading:isLoadingEditQuestionInformationLatex, execute: editQuestionInformationLatex} = useAsyncFn((b) => editQuestionInformationLatexRequest(b))
    const {value: editQuestionInformationDocumentResult, errorEditQuestionInformationDocument, loading:isLoadingEditQuestionInformationDocument, execute: editQuestionInformationDocument} = useAsyncFn((b) => editQuestionInformationDocumentRequest(b))
    
    const {value: removeQuestionInformationDocumentResult, errorRemoveQuestionInformationDocument, loading:isLoadingRemoveQuestionInformationDocument, execute: removeQuestionInformationDocument} = useAsyncFn((b) => removeQuestionInformationDocumentRequest(b))

    const {value: QuestionsAssignedInformation, errorGetQuestionsAssignedInformation, loading:isLoadinggQuestionsAssignedInformation, execute: getAllQuestionsAssignedInformation} = useAsyncFn((b) => getAllQuestionsAssignedInformationRequest(b))


    return(
        <Context.Provider value = {{
            mapClickImageLists,
            isLoadingMapClickImageLists,
            errorGetMapClickImageLists,
            getAllMapClickImageLists,

            addMapClickImageListResult,
            errorAddMapClickImageList,
            isLoadingAddMapClickImageList,
            addMapClickImageList,

            editMapClickImageListNameResult,
            errorEditMapClickImageListName,
            isLoadingEditMapClickImageListName,
            editMapClickImageListName,

            editMapClickImageListImageResult,
            errorEditMapClickImageListImage,
            isLoadingEditMapClickImageListImage,
            editMapClickImageListImage,

            isLoadinginformationList,
            informationList,
            errorGetAllQuestionInformation,
            getAllQuestionInformation,

            addQuestionInformationResult,
            errorAddQuestionInformation,
            isLoadingAddQuestionInformation,
            addQuestionInformation,

            editQuestionInformationNameResult,
            errorEditQuestionInformationName,
            isLoadingEditQuestionInformationName,
            editQuestionInformationName,

            editQuestionInformationLatexResult, 
            errorEditQuestionInformationLatex,
            isLoadingEditQuestionInformationLatex,
            editQuestionInformationLatex,

            editQuestionInformationDocumentResult, 
            errorEditQuestionInformationDocument,
            isLoadingEditQuestionInformationDocument,
            editQuestionInformationDocument,

            removeQuestionInformationDocumentResult, 
            errorRemoveQuestionInformationDocument,
            isLoadingRemoveQuestionInformationDocument,
            removeQuestionInformationDocument,

            QuestionsAssignedInformation,
            errorGetQuestionsAssignedInformation,
            isLoadinggQuestionsAssignedInformation,
            getAllQuestionsAssignedInformation
        }}>
            {children}
        </Context.Provider>
    )
}