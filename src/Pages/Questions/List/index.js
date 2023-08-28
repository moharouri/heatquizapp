import React, { useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { Divider, Dropdown, List, Skeleton, Space } from "antd";
import { QuestionsSearchTool } from "./QuestionsSearchTool";
import { useQuestions } from "../../../contexts/QuestionsContext";
import { beautifyDatetime, beautifyNumber } from "../../../services/Auxillary";
import {EditOutlined, TrophyOutlined, CopyOutlined, DeleteOutlined, ApartmentOutlined, CommentOutlined, NotificationOutlined} from '@ant-design/icons';
import { QuestionPlayPocket } from "../QuestionPlayPocket/QuestionPlayPocket";

export function QuestionList(){

    const {questions, isLoadingQuestions, questionsByIds, isLoadingQuestionsByIds} = useQuestions()

    const [firstIndex, setFirstIndex] = useState(0)

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)

    const questionActionList = (q) => [{
        key: 'view_edit_question',
        label: 'View / edit',
        icon: <EditOutlined/>,
        onClick: () => {}
    },
    {
        key: 'play_question',
        label: 'Play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowPlayQuestionModal(true)
        }
    },
    {
        key: 'copy_question',
        label: 'Copy',
        icon: <CopyOutlined/> ,
        onClick: () => {}
    },
    {
        key: 'view_relations',
        label: 'Relations',
        icon: <ApartmentOutlined/> ,
        onClick: () => {}
    },
    {
        key: 'view_comments',
        label: 'Comments',
        icon: <CommentOutlined /> ,
        onClick: () => {}
    },
    {
        key: 'view_feedback',
        label: 'Student feedback',
        icon: <NotificationOutlined /> ,
        onClick: () => {}
    },
    {
        key: 'delete_question',
        label: 'Delete',
        icon: <DeleteOutlined/> ,
        onClick: () => {}
    }]

    const renderQuestions = () => {
        let Questions = []
        if(questions){
            Questions = questions.Questions
        }

        if(questionsByIds){
            Questions = questionsByIds
        }
        
        return(
           <div>
                <List 
                    dataSource={Questions}
                    renderItem={(q, qi) => {
                        const correctPlayPerc = (q.TotalGames ? (100 *  (q.TotalCorrectGames/(q.TotalGames || 1))).toFixed(0) + '%' : '')

                        return (
                        <Space 
                            size={'large'}
                            className="question-list-item-container-0"
                        >
                            <div className="question-list-item-container-0-internal">
                                <div className="question-list-item-container-1">
                                    <Dropdown
                                        menu={{
                                            items:questionActionList(({
                                                Id: q.Id,
                                                Type: q.Type
                                            })),
                                            title:'Actions'
                                        }}
                                    >
                                        <p className="question-list-item-code">
                                            <span className="question-list-item-index">{firstIndex + qi+1}</span>
                                            {q.Code}
                                        </p>
                                    </Dropdown>
                                    <br/>

                                    <p className="question-list-item-code-adder-date-stats">{q.AddedByName}</p>
                                    <p className="question-list-item-code-adder-date-stats">{beautifyDatetime(q.DateCreated)}</p>

                                    <br/>

                                    <p className="question-list-item-code-adder-date-stats">{q.LevelOfDifficulty.Name}</p>
                                    <p className="question-list-item-code-adder-date-stats">{q.Subtopic.Topic.Name} - {q.Subtopic.Name}</p>

                                </div>

                                <img 
                                    className="question-list-item-img"
                                    src={q.Base_ImageURL}
                                    alt={q.Code}
                                />

                                <div className="question-list-item-stats">
                                    <small className="question-list-item-code-adder-date-stats">Play statistics</small>
                                    <Space size={'large'}>
                                        <p>{beautifyNumber(q.TotalGames)}</p>
                                        <p className="question-list-item-play-numbers-correct">
                                            {beautifyNumber(q.TotalCorrectGames)}
                                            <small className="question-list-item-code-adder-date-stats"> {' '}({correctPlayPerc}) </small>
                                        </p>
                                    </Space>


                                    {q.PDFURL && 
                                    <>
                                        <br/>
                                        <small className="question-list-item-code-adder-date-stats">PDF view statistics</small>
                                        <Space size={'large'}>
                                            <p>{beautifyNumber(q.TotalPDFViews)} <small className="question-list-item-code-adder-date-stats"> views </small></p>
                                            <p>{beautifyNumber(q.TotalPDFViewsWrong)}</p>
                                        </Space>
                                    </>}

                                    <br/>

                                    <small className="question-list-item-code-adder-date-stats">Median play time</small>
                                    <Space size={'large'}>
                                        <p>{q.MedianPlayTime} <small className="question-list-item-code-adder-date-stats"> seconds </small></p>
                                    </Space>
                                </div>
                            </div>
                            
                        </Space>)
                    }}
                
                />
           </div>
        )
    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                Questions List
            </Divider>
                <QuestionsSearchTool onSetFirstIndex = {(i) => setFirstIndex(i)}/>
            <br/>
            {(isLoadingQuestions || isLoadingQuestionsByIds) && <Skeleton />}
            {(!(isLoadingQuestions || isLoadingQuestionsByIds) && questions) && renderQuestions()}

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />
        </PagesWrapper>
    )
}