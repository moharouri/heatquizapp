import React from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSeries } from "../../../contexts/SeriesContext";
import { Button, Col, Divider, Dropdown, Empty, Row, Skeleton, Space, Spin, Statistic, Tooltip } from "antd";
import { beautifyDate, beautifyNumber } from "../../../services/Auxillary";
import {TrophyOutlined, EditOutlined, ApartmentOutlined, PlusOutlined, AreaChartOutlined, ClockCircleOutlined, NotificationOutlined, DeleteOutlined, GroupOutlined} from '@ant-design/icons';

import './EditView.css'
import { useState } from "react";
import { QUESTION_TYPES_SEARCH_NAMES } from "../../Questions/List/constants";
import { QuestionPlayPocket } from "../../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { SeriesPlayPocket } from "../Play/SeriesPlayPocket";
import { EditSeriesBasicInfo } from "./EditSeriesBasicInfo";
import { SeriesRelations } from "./SeriesRelations";
import { useStudentFeedback } from "../../../contexts/StudentFeedbackContext";
import { ViewFeedbackList } from "../../StudentFeedback/ViewFeedbackList";
import { AddQuestionsToSeries } from "./AddQuestionsToSeries";
import { AssignQuestionsToPool } from "./AssignQuestionsToPool";
import { ReorderQuestionsInSeries } from "./ReorderQuestionsInSeries";

export function SeriesEditViewPage(){
    const {code} = useParams()
    const naviagate = useNavigate()

    const { 
        isLoadingSeriesViewEdit: isLoadingSeries, errorGetSeriesViewEdit: errorGetSeries, SeriesViewEdit: Series, getSeriesViewEdit,
        isLoadingSeriesStatistics, errorGetSeriesStatistics, SeriesStatistics, getSeriesStatistics,
        postSeriesStatistic
    } = useSeries()

    const { loadingQuestionFeedback, questionFeedback, getQuestionFeedbackError, getQuestionFeedback} = useStudentFeedback()


    const [showPlaySeriesModal, setShowPlaySeriesModal] = useState(false)
    const [selectedSeries, setSelectedSeries] = useState({Code:''})

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)


    const [showEditBasicInfo, setShowEditBasicInfo] = useState(false)
    const [showSeriesRelations, setShowSeriesRelations] = useState(false)
    const [showViewFeedbackListModal, setShowViewFeedbackListModal] = useState(false)
    const [showAddQuestionsToSeries, setShowAddQuestionsToSeries] = useState(false)
    const [showAssignQuestionsToPool, setShowAssignQuestionsToPool] = useState(false)
    const [showReorderElements, setShowReorderElements] = useState(false)

    const [selectedAddQuestions, setSelectedAddQuestions] = useState([])

    useEffect(() => {
        getSeriesViewEdit(code)
        setShowEditBasicInfo(false)
        setShowSeriesRelations(false)
        setShowAddQuestionsToSeries(false)
        setShowAssignQuestionsToPool(false)
        setShowReorderElements(false)
    }, [code])

    useEffect(() => {
        if(Series){
            getSeriesStatistics(Series.Id)
        }
    }, [Series])

    const renderSeriesStatistics = () => {
        const {TotalPlay, TotalPlayOnMobile, MedianPlayTime} = SeriesStatistics
        
        const onMobilePerc = (TotalPlayOnMobile ? (100*(TotalPlayOnMobile/TotalPlay)).toFixed(0) : 0) + '% on mobile'

        return(
            <Space
                size={'large'}
            >
                <Statistic 
                    title='Total play'
                    value={beautifyNumber(TotalPlay)}
                    suffix = {<span className="series-edit-view-info-card-gray">{' '}{onMobilePerc}</span>}
                    valueStyle={{fontSize:'medium', color:'gray'}}
                />
                <Statistic 
                    title='Median play time'
                    value={MedianPlayTime}
                    valueStyle={{fontSize:'medium', color:'gray'}}
                />
            </Space>
        )
    }

    const elementActionList = (e) => [{
        key: 'play_question',
        label: 'Play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setSelectedQuestion(e.Question)
            setShowPlayQuestionModal(true)
        }
    },
    {
        key: 'view_edit_question',
        label: 'View / edit question',
        icon: <EditOutlined/> ,
        onClick: () => {
        }
    },
    {
        key: 'view_question_feedback',
        label: 'View feedback',
        icon: <NotificationOutlined style={{color:'blueviolet'}}/> ,
        onClick: () => {
            setSelectedQuestion(e.Question)
            getQuestionFeedback(e.Question)
            setShowViewFeedbackListModal(true)
        }
    },
    {
        key: 'remove_element',
        label: 'Remove from series',
        icon: <DeleteOutlined /> ,
        onClick: () => {}
    }]

    const getPoolNumbersList = (e) => {
        const {PoolNumber} = e
        const {NumberOfPools} = Series

        let finalList = []

        for(let i = 0; i < NumberOfPools; i++){
            if(PoolNumber === (i+1)) continue;
            
            finalList.push({
                key: 'pool_number'+(1+i),
                label: 'Select Pool #' + (1+i),
                onClick: () => {}
            })
        }

        return finalList
    }

    const renderElement = (e, ei) => {
        const {Question, PoolNumber} = e

        const {Code, Base_ImageURL, Type, LevelOfDifficulty, Subtopic} = Question

        const elementStat = seriesElementStats && seriesElementStats[e.Id]

        const qType = QUESTION_TYPES_SEARCH_NAMES.filter(a => a.value === Type)[0].label

        const TotalPlay = elementStat ? elementStat.TotalPlay : ''
        const TotalSuccessPlay = elementStat ? elementStat.TotalSuccessPlay : ''

        const successPercentage = elementStat ?(100*TotalSuccessPlay/(TotalPlay+1)).toFixed(0) + "%" : '-'
        const medianPlayTime = elementStat ? elementStat.MedianPlayTime : '-'

        const qTopic = Subtopic.Topic.Name

        return(
            <Col 
            key={e.Id}
            
            xs={6}>
                <div
                    className="series-edit-view-element"
                >
                    <div
                        className="series-edit-view-element-internal"
                    >
                        <Dropdown
                             menu={{
                                items:elementActionList(e),
                                title:'Actions'
                                }}
                        >
                            <p
                                className="series-edit-view-element-code"
                            >{ei+1}{' '}{Code}</p>
                        </Dropdown>

                        <img
                            alt={Code}
                            src={Base_ImageURL}
                            className="series-edit-view-element-img"
                        />
                        {elementStat &&
                        <div className="series-edit-view-element-other-info">
                            <Divider
                                orientation='center'
                            >
                                <Dropdown
                                menu={{
                                    items: getPoolNumbersList(e),
                                    title:'Change pool number'
                                }}
                                >
                                    <small>Pool #{PoolNumber}</small>
                                </Dropdown>
                            </Divider>
                            <Space
                                size={'large'}
                            >   
                                <p>{qType}</p>
                                <p>-</p>
                                <p>{qTopic}</p>
                                <p>-</p>
                                <p style={{borderBottom:1, borderBottomStyle:'solid', borderBottomColor:LevelOfDifficulty.HexColor}}>{LevelOfDifficulty.Name}</p>
                            </Space>
                            <Space
                                size={'large'}
                            >
                                <Space>
                                    <AreaChartOutlined  style={{color:'green'}}/>
                                    <Tooltip
                                        title='Success rate (%)'
                                    >
                                    <p>{successPercentage}</p>
                                    </Tooltip>
                                </Space>
                                <Space>
                                    <ClockCircleOutlined />
                                    <Tooltip
                                        title='Median play time (seconds)'
                                    >
                                        <p>{medianPlayTime}
                                            <i><small>{' '}seconds </small></i>
                                        </p>
                                    </Tooltip>
                                </Space>
                            </Space>

                        </div>}
                    </div>
                </div>
                
            </Col>
        )
    }

    const actionList = (Series) => [
        {
            key: 'play_series',
            label: 'Play',
            icon: <TrophyOutlined style={{color:'green'}}/> ,
            onClick: () => {
                setShowPlaySeriesModal(true)
                setSelectedSeries(Series)
            }
        },
        {
            key: 'play_series_with_link',
            label: 'Play with link',
            icon: <TrophyOutlined style={{color:'green'}}/> ,
            onClick: () => naviagate('/series_play/'+Series.Code)
        },
        {
            key: 'edit_basic_info',
            label: 'Edit basic info',
            icon: <EditOutlined/> ,
            onClick: () => {
                setShowEditBasicInfo(true)
            }
        },
        {
            key: 'view_relations',
            label: 'View relations',
            icon: <ApartmentOutlined /> ,
            onClick: () => {
                setShowSeriesRelations(true)
            }
        },
        {
            key: 'add_questions',
            label: 'Add questions',
            icon: <PlusOutlined  style = {{color:'green'}}/> ,
            onClick: () => {
                setShowAddQuestionsToSeries(true)
            }
        },
        !Series.IsRandom && {
            key: 'reorder_questions',
            label: 'Reorder questions',
            icon: <GroupOutlined /> ,
            onClick: () => {
                setShowReorderElements(true)
            }
        }
    ].filter(a => a)  


    const getStatistics = () => {
        let stats_element_Id = {}
        const {ElementStats} = SeriesStatistics

        for(let stat of ElementStats){
            stats_element_Id[stat.Id] = stat
        } 
    
        return stats_element_Id
    }  

    const seriesElementStats = SeriesStatistics ? getStatistics() : null

    const renderSeries = () => {

        const {Code, AddedByName, DateCreated, Elements, IsRandom, RandomSize, NumberOfPools } = Series

        const nElements = Elements.length        

        return(
            <div>
                <Space
                    size={'large'}
                    align="start"
                    className="series-edit-view-info-card-base"
                >
                    <div className="series-edit-view-info-card">
                        <Dropdown
                            menu={{
                                items:actionList(Series),
                                title:'Actions'
                                }}
                        >
                            <p className="series-edit-view-info-title">{Code}</p>
                        </Dropdown>
                        <p className="series-edit-view-info-card-gray">{AddedByName}</p>
                        <p className="series-edit-view-info-card-gray">{beautifyDate(DateCreated)}</p>
                                
                        {IsRandom 
                        && 
                        <Space 
                        className="series-edit-view-pools-number"
                        size={'small'}>
                            <p >{NumberOfPools} Pools</p>
                            <Button
                                size='small'
                                style={{color:'green'}}
                            >
                                +
                            </Button>
                            <Button
                                size='small'
                                style={{color:'red'}}
                            >
                                -
                            </Button>
                            <Button
                                size='small'
                                className="series-edit-view-pools-number-assign"
                                onClick={() => setShowAssignQuestionsToPool(true)}
                            >
                                assign
                            </Button>
                        </Space>}
                    </div>
                   <Row
                    gutter={12}
                   >
                        <Col className="series-edit-view-info-card series-edit-view-info-other-card">
                            {isLoadingSeriesStatistics && <Spin/>}
                            {(!isLoadingSeriesStatistics && SeriesStatistics) && renderSeriesStatistics()}
                        </Col>
                        <Col className="series-edit-view-info-card series-edit-view-info-other-card">
                            <Space
                                size={'large'}
                            >
                                <Statistic 
                                    title='Total questions'
                                    value={nElements}
                                    valueStyle={{fontSize:'medium', color:'gray'}}
                                />
                                {IsRandom && <Statistic 
                                    title='Random series'
                                    style={{color:'orange'}}
                                    valueStyle={{fontSize:'medium', color:'gray'}}
                                    value={' '}
                                    suffix = {<span className="series-edit-view-info-card-gray">sample size:  {RandomSize} </span>}
                                />}
                            </Space>
                        </Col>
                        
                   </Row>
                </Space>
                <Divider/>
                {Elements.length ? 
                <Row
                    gutter={12}
                >
                    {Elements.map((e, ei) => renderElement(e, ei))}
                </Row>
                :
                <Space
                    align='center'
                >
                    <Empty />
                </Space>}
            </div>
        )
    }

    return(
        <PagesWrapper>
            {isLoadingSeries && <Skeleton />}
            {!isLoadingSeries && Series && renderSeries()}

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />

            <SeriesPlayPocket 
                open={showPlaySeriesModal}
                onClose={() => setShowPlaySeriesModal(false)}
                Code={selectedSeries.Code}
            />  

            <EditSeriesBasicInfo 
                open={showEditBasicInfo}
                onClose={() => setShowEditBasicInfo(false)}
                Series={Series}
            />  

            <SeriesRelations 
                open={showSeriesRelations}
                onClose={() => setShowSeriesRelations(false)}
                Series={Series}
            />  

            <AddQuestionsToSeries 
                open={showAddQuestionsToSeries}
                onClose={() => setShowAddQuestionsToSeries(false)}
                Series={Series}

                selectedQuestions={selectedAddQuestions}
                onSelectQuestions={(d) => setSelectedAddQuestions(d)}
            /> 

            <AssignQuestionsToPool 
                open={showAssignQuestionsToPool}
                onClose={() => setShowAssignQuestionsToPool(false)}
                Series={({...Series, Stats: seriesElementStats})}
            /> 

            <ReorderQuestionsInSeries 
                open={showReorderElements}
                onClose={() => setShowReorderElements(false)}
                Series={({...Series, Stats: seriesElementStats})}
            />

            <ViewFeedbackList
                open={showViewFeedbackListModal}
                onClose={()=> setShowViewFeedbackListModal(false)}
                question={selectedQuestion}
                
                loading={loadingQuestionFeedback}
                error={getQuestionFeedbackError}
                data={questionFeedback}
            />
        </PagesWrapper>
    )
}