import React, { useEffect, useState } from "react";
import { Spin, Drawer, Timeline, Space, Pagination, Dropdown } from "antd";
import {ArrowLeftOutlined, InsertRowLeftOutlined, SolutionOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';
import { useReports } from "../../contexts/ReportsContext";
import './PlayerTimeline.css'
import { beautifyDatetime } from "../../services/Auxillary";

const QUESTION_TYPE = 0
const SERIES_TYPE = 2

export function PlayerTimeline({open, onClose, selectedPlayer}){

    const {
        loadingPlayerTimelineReport,
        playerTimelineReport,
    } = useReports()

    const [seriesRefs, setSeriesRefs] = useState([])
    const [currentSeriesIndex, setCurrentSeriesIndex] = useState(1)

    useEffect(() => {
        setSeriesRefs([])
        setCurrentSeriesIndex(1)

    }, [open])

    useEffect(() => {
        let newSeriesRefs = []

        if(playerTimelineReport){
            playerTimelineReport
            .filter((s) => s.Type === SERIES_TYPE)
            .forEach(() => {
                const newRef = React.createRef()
                newSeriesRefs.push(newRef)
            })


        }
       
        setSeriesRefs(newSeriesRefs)
        setCurrentSeriesIndex(1)

    }, [playerTimelineReport])


    const onSeriesChange = (p) => {
        console.log(seriesRefs[p-1])
        seriesRefs[p-1]
        .current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start"
        })

        setCurrentSeriesIndex(p)
    }   

    const questionActionList = (q) => [{
        key: 'view_edit_question',
        label: 'View edit question',
        icon: <EditOutlined/>,
        onClick: () => {}
    },
    {
        key: 'play_question',
        label: 'Play question',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {}
    }]

    const seriesActionList = (q) => [{
        key: 'view_edit_series',
        label: 'View edit series',
        icon: <EditOutlined/>,
        onClick: () => {}
    },
    {
        key: 'play_series',
        label: 'Play series',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {}
    }]
    
    return(
        <div>
            <Drawer
                title={
                <div className="player-timeline-header">
                    <p>Player timeline:  {' ' + selectedPlayer}</p>

                    {seriesRefs.length && 
                    <Space size={'middle'}>
                        <p>Series {' '}</p>
                        <Pagination
                            simple 
                            defaultCurrent={1} 
                            total={seriesRefs.length} 
                            current={currentSeriesIndex}
                            onChange={onSeriesChange}
                            pageSize={1}
                        />
                    </Space>}
                </div>}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{
                paddingBottom: 80,
                }}
                closeIcon={<ArrowLeftOutlined />}
            >
            {loadingPlayerTimelineReport && <Spin/>}
            <div className="timeline-container">
            {!loadingPlayerTimelineReport && playerTimelineReport && 
                <Timeline 
                    items={playerTimelineReport.map((r, ri) => {
                        const {
                            Type, Correct, DateCreated, Score, TotalTime,
                            SeriesCode, SeriesId,
                            QuestionId, QuestionCode, QuestionType, ImageURL,
                            Map, MapKey, MapElement
                        } = r

                        const seriesIndex = 
                        playerTimelineReport.slice(0, ri)
                        .filter((s) => s.Type === SERIES_TYPE)
                        .length

                        if(Type === QUESTION_TYPE) {
                            return({
                                color: Correct ? 'green' : 'red',
                                children: (
                                    <>
                                        <div className="player-timeline-info-line">
                                            <div>
                                                
                                                <Dropdown
                                                    menu={{
                                                        items:questionActionList(({
                                                            Id: QuestionId,
                                                            Type: QuestionType
                                                        })),
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <p className="player-timeline-code">{QuestionCode}</p>
                                                </Dropdown>
                                                <small className="player-timeline-datetime-score">
                                                    {Score} 
                                                    {' '} - {' '}{TotalTime}{' '} s                                                
                                                </small>
                                            </div>
                                            <div>
                                                <p className="player-timeline-datetime-score">{beautifyDatetime(DateCreated)}</p>
                                                {MapKey && 
                                                <Space size={'small'}>
                                                        <SolutionOutlined className="player-timeline-map-key"/>
                                                        <small className="player-timeline-datetime-score">
                                                            {MapKey}
                                                        </small>
                                                </Space>
                                                }
                                                
                                            </div>
                                        </div>
                                        <img 
                                            src={ImageURL}
                                            className="question-image-player-timeline"
                                            alt={QuestionCode}
                                        />
                                    </>
                                )
                            })
                        }

                        else if(Type === SERIES_TYPE){
                            return({
                                color: 'blue',
                                dot:<InsertRowLeftOutlined />,
                                children: (
                                    <div 
                                        ref={seriesRefs[seriesIndex]}
                                        className="player-timeline-series-line"
                                    >
                                        <div className="player-timeline-info-line">
                                            <div>
                                                <Dropdown
                                                    menu={{
                                                        items:seriesActionList(({
                                                            Id: SeriesId,
                                                            Code: SeriesCode
                                                        })),
                                                        title:'Actions'
                                                    }}
                                                >
                                                <p className="player-timeline-code">{SeriesCode}</p>
                                                </Dropdown>
                                                <small className="player-timeline-datetime-score">
                                                    {Score} 
                                                    {' '} - {' '}{TotalTime}{' '} s                                                
                                                </small>
                                            </div>
                                            <div>
                                                <p className="player-timeline-datetime-score">{beautifyDatetime(DateCreated)}</p>
                                                {MapKey && 
                                                <Space size={'small'}>
                                                        <SolutionOutlined className="player-timeline-map-key" />
                                                        <small className="player-timeline-datetime-score">
                                                            {MapKey}
                                                        </small>
                                                </Space>
                                                }
                                                
                                            </div>
                                        </div>
                                        <div className="player-timeline-info-line">
                                            <p>{Map} {' / '} {MapElement}</p>
                                        </div>
                                        <br/>
                                    </div>
                                )
                            })
                        }
                        else return null
                    }).filter(a => a)}
                />
            }
            </div>
        </Drawer>
        </div>
    )
}