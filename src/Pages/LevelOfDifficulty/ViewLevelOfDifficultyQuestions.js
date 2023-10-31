import {Col, Drawer, Dropdown, Row, Skeleton, Space} from "antd";
import React from "react";
import { useLevelsOfDifficulty } from "../../contexts/LevelOfDifficultyContext";
import { beautifyDate } from "../../services/Auxillary";
import {ArrowLeftOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';

import { QUESTION_TYPES_SEARCH_NAMES } from "../Questions/List/constants";

export function ViewLevelOfDifficultyQuestions({open, onClose, LOD}){
    const { isLoadingLODQuestions, errorGetLODQuestions, LODQuestions} = useLevelsOfDifficulty()

    if(!open) return <div/>;


    const colorLine = (color) => (
        <div style={{width:'100%', height:4, backgroundColor: color, marginTop:1, marginBottom:1}}></div>
    )


    const {Name, HexColor} = LOD


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

    const renderQuestions = () => {
        
        return(
            <Row
                gutter={12}
            >
                {LODQuestions.map((q, qi) => 
                    {
                        const {Code, Base_ImageURL, AddedByName, DateCreated, Type, Subtopic, DatapoolName} = q  
                        let qType = QUESTION_TYPES_SEARCH_NAMES.filter(a => a.value === Type)[0]
                        qType = qType ? qType.label : ''
                        const qTopic = Subtopic.Topic.Name

                        return(<Col 
                            key={q.Id}
                            xs={12}>
                                <div
                                    className={"series-edit-view-element"}
                                >
                                    <div
                                        className="series-edit-view-element-internal"
                                    >
                                            <Dropdown
                                               menu={{
                                                    items:questionActionList(q),
                                                    title:'Actions'
                                                }}
                                            >
                                            <p  className="series-edit-view-element-code"> {qi+1}{' '}{Code} </p>   
                                            </Dropdown>         
                                            <p className="series-edit-view-element-other-info">{AddedByName}</p>
                                            <p className="series-edit-view-element-other-info">{beautifyDate(DateCreated)}</p>
                
                
                                            <img
                                                alt={Code}
                                                src={Base_ImageURL}
                                                className="series-edit-view-element-img"
                                            />
                                            <div className="series-edit-view-element-other-info">
                                                            
                                                <Space
                                                    size={'large'}
                                                >   
                                                    <p>{qType}</p>
                                                    <p>-</p>
                                                    <p>{qTopic}</p>
                                                    <p>-</p>
                                                    <strong><p>{DatapoolName}</p></strong>
                                                </Space>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </Col>)
                    }
                )}
            </Row>
        )
    }

    return(
        <Drawer
        title="View level of difficulty questions"
        width={'80%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        footer={
            <div>
                 <p  className="lod-edit-view-element-code">{Name}</p>
                {colorLine(HexColor)}
            </div>
        }
        >
           
            {isLoadingLODQuestions && <Skeleton />}

            {(!isLoadingLODQuestions && LODQuestions) && renderQuestions()}
        </Drawer>
    )
}