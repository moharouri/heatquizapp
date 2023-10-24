import React, { useState } from "react";
import { PagesWrapper } from "../../PagesWrapper"
import { useLevelsOfDifficulty } from "../../contexts/LevelOfDifficultyContext";
import { useEffect } from "react";
import { Button, Col, Divider, Dropdown, Empty,  Row, Skeleton, Space, message } from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';

import './LevelOfDifficulty.css'
import { AddLevelOfDifficulty } from "./AddLevelOfDifficulty";
import { EditLevelOfDifficulty } from "./EditLevelOfDifficulty";
import { ViewLevelOfDifficultyQuestions } from "./ViewLevelOfDifficultyQuestions";

export function LevelOfDifficulty(){
    
    const {isLoadingLODsExtended, errorGetLODsExtended, LODsExtended, getAllLODsExtended,
        getLODQuestions,
        isLoadingAddLOD, addLODResult, errorAddLOD, addLOD
    } = useLevelsOfDifficulty()

    const [messageApi, contextHolder] = message.useMessage()

    const [showAddLODModal, setShowAddLODModal] = useState(false)
    const [showEditLODModal, setShowEditLODModal] = useState(false)
    const [showViewLODQuestionsModal, setShowViewLODQuestionsModal] = useState(false)
    const [selectedLOD, setSelectedLOD] = useState(false)

    useEffect(() => {
        getAllLODsExtended()
    
    }, [])

    useEffect(() => {
        if(errorGetLODsExtended){
            messageApi.destroy()
            messageApi.error(errorGetLODsExtended)
        }

        if(errorAddLOD){
            messageApi.destroy()
            messageApi.error(errorAddLOD)
        }
    }, [errorGetLODsExtended, errorAddLOD])

    const colorLine = (color) => (
        <div style={{width:'100%', height:4, backgroundColor: color, marginTop:1, marginBottom:1}}></div>
    )


    const LODAction = (lod) => [{
        key: 'edit_name_color',
        label: 'Edit name / color',
        icon: <EditOutlined/>,
        onClick: () => {
            setShowEditLODModal(true)
            setSelectedLOD(lod)
        }
    },
    {
        key: 'delete_lod',
        label: 'Delete',
        icon: <DeleteOutlined/> ,
        onClick: () => {}
    }]

    const viewQuestions = (lod) => {
        setShowViewLODQuestionsModal(true)
        setSelectedLOD(lod)
        getLODQuestions(lod.Id)
    }

    const renderLODs = () => {

        return(
            <Row
                gutter={12}
            >
                {LODsExtended.length ? 
                    LODsExtended.map((lod, lodi) => {
                        const {Name, HexColor, NUsedQuestions} = lod

                        return(
                            <Col 
                            key={lod.Id}
                            
                            xs={3}>
                                <div
                                    className="lod-edit-view-element"
                                >
                                    <div
                                        className="lod-edit-view-element-internal"
                                    >
                                        <Dropdown
                                            menu={{
                                                items:LODAction(lod),
                                                title:'Actions'
                                                }}
                                        >
                                            <p
                                                className="lod-edit-view-element-code"
                                            >{lodi+1}{' '}{Name}</p>
                                        </Dropdown>

                                    </div>

                                    {colorLine(HexColor)}
                                    <br/>
                                    <p 
                                    onClick={() => viewQuestions(lod)}
                                    className="lod-edit-view-element-used-questions">{NUsedQuestions} questions</p>
                                </div>
                            </Col>)
                    })
                : <Empty />}
            </Row>)
    }

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider
                orientation="left"
            >
                <Space>
                    LevelOfDifficulty   

                    <Button
                        size="small"
                        onClick={() => setShowAddLODModal(true)}
                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                        
                        Add
                    </Button>
                </Space>

            </Divider>
            {isLoadingLODsExtended && <Skeleton/>}
            {(!isLoadingLODsExtended && LODsExtended) && renderLODs()}

            <AddLevelOfDifficulty 
                open={showAddLODModal}
                onClose={() => setShowAddLODModal(false)}
            />

            <EditLevelOfDifficulty 
                open={showEditLODModal}
                onClose={() => setShowEditLODModal(false)}
                LOD={selectedLOD}
            />

            <ViewLevelOfDifficultyQuestions 
                open={showViewLODQuestionsModal}
                onClose={() => setShowViewLODQuestionsModal(false)}
                LOD={selectedLOD}
            />
        </PagesWrapper>
    )
}