import React, { useState } from "react";
import { PagesWrapper } from "../../PagesWrapper"
import { useLevelsOfDifficulty } from "../../contexts/LevelOfDifficultyContext";
import { useEffect } from "react";
import { Button, Col, ColorPicker, Divider, Dropdown, Empty,  Input,  Row, Skeleton, Space, message, notification } from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';

import './LevelOfDifficulty.css'

export function LevelOfDifficulty(){
    
    const {isLoadingLODsExtended, errorGetLODsExtended, LODsExtended, getAllLODsExtended,
        isLoadingAddLOD, addLODResult, errorAddLOD, addLOD
    } = useLevelsOfDifficulty()

    const [messageApi, contextHolder] = message.useMessage()
    const [notificationApi, notificationHolder] = notification.useNotification()

    const [code, setCode] = useState('')
    const [color, setColor] = useState('blue')

    useEffect(() => {
        getAllLODsExtended()
        setCode('')
        setColor('blue')
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
            const {Name, HexColor} = lod
            
            notificationApi.destroy()

            notificationApi.open({
                message: 'Add level of difficulty',
                description:
                <Space
                    align='end'
                    size={'large'}
                >
                    <div>
                        <small>Name</small>
                        <Input 
                            type="text"
                            value={code}
                            onChange={(v) => setCode(v.target.value)}
                        />
                    </div>
                    <div>
                        <small>Color</small>
                        <ColorPicker 
                        defaultValue={HexColor}
                        size="small" 
                        showText={true} onChange={(v, h) => {
                            setColor(h)
                        }}/>
                    </div>
                    <div>
                        <Button
                            size='small'
                            type='primary'
                            onClick={() => {
                                if(!code.trim()){
                                    messageApi.destroy()
                                    messageApi.warning('Please add a name')
                                    return
                                }

                                const VM =({
                                    Name: code,
                                    HexColor: color
                                })

                                /*addLOD(VM).then(() => {
                                    getAllLODsExtended()
                                })*/
                            }}

                            loading={isLoadingAddLOD}
                        >
                            Update
                        </Button>
                    </div>
                </Space>,
                 duration: 0,
                 placement:'topRight'
            })
            
            setTimeout(() => {
                setColor(HexColor)
                setCode(Name)
            }, 100)
        }
    },
    {
        key: 'delete_lod',
        label: 'Delete',
        icon: <DeleteOutlined/> ,
        onClick: () => {}
    }]

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
                                    <p className="lod-edit-view-element-used-questions">{NUsedQuestions} questions</p>
                                </div>
                            </Col>)
                    })
                : <Empty />}
            </Row>)
    }

    return(
        <PagesWrapper>
            {contextHolder}
            {notificationHolder}
            <Divider
                orientation="left"
            >
                <Space>
                    LevelOfDifficulty   

                    <Button
                        size="small"
                        onClick={() => {
                            setColor('blue')
                            setCode('')

                            notificationApi.destroy()

                            notificationApi.open({
                                message: 'Add level of difficulty',
                                description:
                                <Space
                                    align='end'
                                    size={'large'}
                                >
                                    <div>
                                        <small>Name</small>
                                        <Input 
                                            type="text"
                                            value={code}
                                            onChange={(v) => setCode(v.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <small>Color</small>
                                        <ColorPicker 
                                        defaultValue={'blue'}
                                        size="small" 
                                        showText={true} onChange={(v, h) => {
                                            setColor(h)
                                        }}/>
                                    </div>
                                    <div>
                                        <Button
                                            size='small'
                                            type='primary'
                                            onClick={() => {
                                                if(!code.trim()){
                                                    messageApi.destroy()
                                                    messageApi.warning('Please add a name')
                                                    return
                                                }

                                                const VM =({
                                                    Name: code,
                                                    HexColor: color
                                                })

                                                /*addLOD(VM).then(() => {
                                                    getAllLODsExtended()
                                                })*/
                                            }}

                                            loading={isLoadingAddLOD}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </Space>,
                                 duration: 0,
                                 placement:'topRight'
                            })

                        }}
                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                        
                        Add
                    </Button>
                </Space>

            </Divider>
            {isLoadingLODsExtended && <Skeleton/>}
            {(!isLoadingLODsExtended && LODsExtended) && renderLODs()}
        </PagesWrapper>
    )
}