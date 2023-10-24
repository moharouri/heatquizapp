import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../contexts/QuestionsContext";
import { CLICKABLE_QUESTION_PARAMETER, KEYBOARD_QUESTION_PARAMETER, MULTIPLE_CHOICE_QUESTION_PARAMETER } from "../List/constants";
import { PagesWrapper } from "../../../PagesWrapper";
import { Col, Divider, Dropdown, Row, Skeleton, Space, Spin, Statistic, Tooltip } from "antd";
import { useParams } from "react-router-dom";
import { beautifyDate, beautifyNumber } from "../../../services/Auxillary";
import {EditOutlined, TrophyOutlined, ApartmentOutlined, CommentOutlined, NotificationOutlined, FilePdfOutlined, DeleteOutlined} from '@ant-design/icons';

import './QuestionEditView.css'
import { useStudentFeedback } from "../../../contexts/StudentFeedbackContext";
import { ViewFeedbackList } from "../../StudentFeedback/ViewFeedbackList";
import { ViewQuestionComments } from "../ViewQuestionComments/ViewQuestionComments";
import { ViewQuestionRelations } from "../ViewQuestionRelations/ViewQuestionRelations";
import { QuestionPlayPocket } from "../QuestionPlayPocket/QuestionPlayPocket";
import { QuestionEditBasicInfo } from "./QuestionEditBasicInfo";
import { QuestionEditSupplementaryMaterial } from "./QuestionEditSupplementaryMaterial";
import { MultipleChoiceQuestionEditView } from "../MultipleChoiceQuestion/ViewEdit";
import { KeyboardQuestionEditView } from "../KeyboardQuestion/EditView";
import { ClickableQuestionEditView } from "../ClickableQuestion/ViewEdit";

export function QuestionEditView(){
    const {
        clickableQuestionPlay, errorGetClickableQuestionPlay, isLoadingClickableQuestionPlay, getClickableQuestionPlay,
        keyboardQuestionPlay, errorGetKeyboardQuestionPlay, isLoadingKeyboardQuestionPlay, getKeyboardQuestionPlay,
        multipleChoiceQuestionPlay, errorGetMultipleChoiceQuestionPlay, isLoadingMultipleChoiceQuestionPlay, getMultipleChoiceQuestionPlay,

        questionStatistics, errorGetQuestionStatistics, isLoadingGetQuestionStatistics, getQuestionStatistics,
    } = useQuestions()

    const { loadingQuestionFeedback, questionFeedback, getQuestionFeedbackError, getQuestionFeedback} = useStudentFeedback()

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [showViewFeedbackListModal, setShowViewFeedbackListModal] = useState(false)
    const [showViewQuestionCommentsModal, setShowQuestionCommentsModal] = useState(false)
    const [showViewQuestionRelationsModal, setShowQuestionRelationsModal] = useState(false)
    const [showEditBasicInfoModal, setShowEditBasicInfoModal] = useState(false)
    const [showEditSolutionModal, setShowEditSolutionModal] = useState(false)

    const {id, type} = useParams()

    const getQueryFunction = () => {
        switch (Number(type)) {
            case CLICKABLE_QUESTION_PARAMETER:{
                return getClickableQuestionPlay
            }

            case KEYBOARD_QUESTION_PARAMETER: {
                return getKeyboardQuestionPlay
            }

            case MULTIPLE_CHOICE_QUESTION_PARAMETER: {
                return getMultipleChoiceQuestionPlay
            }

            default:{
                return
            }
        }
    }

    const getQuestionBody = () => {
        switch (Number(type)) {
            case CLICKABLE_QUESTION_PARAMETER:{
                return <ClickableQuestionEditView reloadQuestion={() => getQueryFunction()(id)}/>
            }

            case KEYBOARD_QUESTION_PARAMETER: {
                return <KeyboardQuestionEditView reloadQuestion={() => getQueryFunction()(id)}/>
            }

            case MULTIPLE_CHOICE_QUESTION_PARAMETER: {
                return <MultipleChoiceQuestionEditView reloadQuestion={() => getQueryFunction()(id)}/>
            }

            default:{
                return <div/>
            }
        }
    }


    useEffect(() => {

        const questionLoader = getQueryFunction()

        questionLoader(id)

        getQuestionStatistics(id)

        setShowPlayQuestionModal(false)
        setShowViewFeedbackListModal(false)
        setShowQuestionCommentsModal(false)
        setShowQuestionRelationsModal(false)
    }, [type, id])

    const calculateIsLoading = () => {
    
        switch (Number(type)) {
            case CLICKABLE_QUESTION_PARAMETER:{
                return isLoadingClickableQuestionPlay
            }

            case KEYBOARD_QUESTION_PARAMETER: {
                return isLoadingKeyboardQuestionPlay
            }

            case MULTIPLE_CHOICE_QUESTION_PARAMETER: {
                return isLoadingMultipleChoiceQuestionPlay
            }

            default:{
                return false
            }
        }
    }

    const calculateQuestion = () => {
        switch (Number(type)) {
            case CLICKABLE_QUESTION_PARAMETER:{
                return clickableQuestionPlay
            }

            case KEYBOARD_QUESTION_PARAMETER: {
                return keyboardQuestionPlay
            }

            case MULTIPLE_CHOICE_QUESTION_PARAMETER: {
                return multipleChoiceQuestionPlay
            }

            default:{
                return null
            }
        }
    }  

    const isLoading = calculateIsLoading()
    let question = calculateQuestion()

    const renderQuestionStatistics = () => {
        
        const {TotalPlay, CorrectPlay, MedianPlayTime, MedianPlayTimeCorrect, MedianPlayTimeWrong, TotalPDFViews, TotalPDFViewsWrong} = questionStatistics
        
        const correctPerc = (CorrectPlay ? (100*(CorrectPlay/TotalPlay)).toFixed(0) : 0) + '%'
        const wrongPDFPerc = (TotalPDFViewsWrong ? (100*(TotalPDFViewsWrong/TotalPDFViews)).toFixed(0) : 0) + '%'

        return(
            <Space
                size={'large'}
            >
                <Tooltip
                    title={<p>{TotalPlay} total plays</p>}
                    color="white"
                    placement="bottom"
                >
                    <Statistic 
                        title='Total play'
                        value={beautifyNumber(TotalPlay)}
                        suffix = {
                        <Tooltip
                            title={<p>Percentage of correct plays ({beautifyNumber(CorrectPlay)})</p>}
                            color="white"
                        >
                            <span className="question-edit-view-info-card-green">{' '}{correctPerc}</span>
                        </Tooltip>}
                        valueStyle={{fontSize:'medium', color:'gray'}}
                    />
                 </Tooltip>
                <Tooltip 
                    color="white"
                    title={
                        <Space
                            direction="vertical"
                        >
                            <p>Median play time {' '} {MedianPlayTime} {' s'}</p>
                            <p>Median <span className="question-edit-view-info-card-green">{' correct '}</span>play time {' '} {MedianPlayTimeCorrect} {' s'}</p>
                            <p>Median <span className="question-edit-view-info-card-red">{' incorrect '}</span>play time {' '} {MedianPlayTimeWrong} {' s'}</p>
                        </Space>
                    }
                                                        
                >
                    <Statistic 
                        title='Median play time'
                        value={MedianPlayTime + ' s'}
                        valueStyle={{fontSize:'medium', color:'gray'}}
                    />
                 </Tooltip>
                

                <Statistic 
                    title='PDF views'
                    value={beautifyNumber(TotalPDFViews)}
                    valueStyle={{fontSize:'medium', color:'gray'}}
                    suffix = {
                        <Tooltip
                            title={<p>Percentage of PDF clicks following a wrong answer</p>}
                            color="white"
                        >
                            <span className="question-edit-view-info-card-red">{' '}{wrongPDFPerc}</span>
                        </Tooltip>}
                />
            </Space>
        )
    }

    const questionActionList = (q) => [
        {
            key: 'play_question',
            label: 'Play',
            icon: <TrophyOutlined style={{color:'green'}}/> ,
            onClick: () => setShowPlayQuestionModal(true)
        },
        q.PDFURL && {
            key: 'access_solution',
            label: 'Solution',
            icon: <FilePdfOutlined/> ,
            onClick: () => window.open(q.PDFURL)
        },
        q.PDFURL && {
            key: 'remove_solution',
            label: 'Remove solution',
            icon: <DeleteOutlined/> ,
            onClick: () => {}
        },
        {
            key: 'update_solution',
            label: 'Update solution',
            icon: <EditOutlined/>,
            onClick: () => setShowEditSolutionModal(true)
        },
        {
            key: 'edit_basic_info',
            label: 'Edit basic info',
            icon: <EditOutlined/> ,
            onClick: () => setShowEditBasicInfoModal(true)
        },
        {
            key: 'view_relations',
            label: 'Relations',
            icon: <ApartmentOutlined/> ,
            onClick: () => setShowQuestionRelationsModal(true)
        },
        {
            key: 'view_comments',
            label: 'Comments',
            icon: <CommentOutlined /> ,
            onClick: () => setShowQuestionCommentsModal(true)
        },
        {
            key: 'view_feedback',
            label: 'Student feedback',
            icon: <NotificationOutlined /> ,
            onClick: () => {
                getQuestionFeedback(question)
                setShowViewFeedbackListModal(true)
            }
        },].filter(a => a)

    const renderQuestionHeader = () => {
        let {Code, DateCreated, AddedByName, LevelOfDifficulty, Subtopic} = question

        if(!Code) {
            question = question.Question

            Code = question.Code
            DateCreated = question.DateCreated
            AddedByName = question.AddedByName
            LevelOfDifficulty = question.LevelOfDifficulty
            Subtopic = question.Subtopic
        }

        const {Name: LODName, HexColor} = LevelOfDifficulty
        const {Topic, Name: subtopicName} = Subtopic

        const {Name: topicName} = Topic
        return(
            <div>
                <Space
                    align="start"
                    className="question-edit-view-info-card-base"
                >
                    <div>
                    <Dropdown
                        menu={{
                            items:questionActionList(question),
                            title:'Actions'
                        }}
                    >
                        <p className="question-edit-view-info-title default-title hoverable">{Code}</p>
                    </Dropdown>

                    <p className="question-edit-view-info-card-gray">{AddedByName}</p>
                    <p className="question-edit-view-info-card-gray">{beautifyDate(DateCreated)}</p>
                    </div>
                    <Row
                    gutter={12}
                   >
                        <Col className="question-edit-view-info-card">
                            {isLoadingGetQuestionStatistics && <Spin/>}
                            {(!isLoadingGetQuestionStatistics && questionStatistics) && renderQuestionStatistics()}

                        </Col>
                        <Col className="question-edit-view-info-card">
                            <p><span style={{backgroundColor:HexColor, color:HexColor}}>.</span>{' '}{LODName}</p>
                            <p>{subtopicName} {' - '}{topicName}</p>
                        </Col>
                        
                   </Row>
                </Space>
                <Divider/>
            </div>
        )
    }

    const renderQuestionBody = () => getQuestionBody()
    
    return(
        <PagesWrapper>
            {isLoading && <Skeleton/>}

            {(!isLoading && question) && renderQuestionHeader()}
            {(!isLoading && question) && renderQuestionBody()}

            {(!isLoading && question && 
                <div>
                <QuestionPlayPocket 
                    open={showPlayQuestionModal}
                    onClose={() => setShowPlayQuestionModal(false)}

                    Id={question.Id}
                    Type={question.Type}
                    deadLoad={true}
                />
                <ViewFeedbackList
                    open={showViewFeedbackListModal}
                    onClose={()=> setShowViewFeedbackListModal(false)}
                    question={question}
                    
                    loading={loadingQuestionFeedback}
                    error={getQuestionFeedbackError}
                    data={questionFeedback}
                />

                <ViewQuestionComments 
                    open={showViewQuestionCommentsModal}
                    onClose={()=> setShowQuestionCommentsModal(false)}
                    question={question}
                />

                <ViewQuestionRelations 
                    open={showViewQuestionRelationsModal}
                    onClose={()=> setShowQuestionRelationsModal(false)}
                    question={question}
                />

                <QuestionEditBasicInfo 
                    open={showEditBasicInfoModal}
                    onClose={()=> setShowEditBasicInfoModal(false)}
                    question={question}

                    reloadQuestion={() => getQueryFunction()(id)}
                />

                <QuestionEditSupplementaryMaterial 
                    open={showEditSolutionModal}
                    onClose={()=> setShowEditSolutionModal(false)}
                    question={question}

                    reloadQuestion={() => getQueryFunction()(id)}
                />
            </div>)} 
            

        </PagesWrapper>
    )
}