import React, { useState } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, message, Row, Space, Steps, Tabs, Tooltip } from "antd";
import {ScheduleTwoTone, ProjectTwoTone, FrownTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, PlusOutlined, SmileTwoTone, ExclamationCircleOutlined} from '@ant-design/icons';
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";

import "./index.css"
import { UploadImage } from "../../../../Components/UploadImage";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { AddPVDiagramQuestionInteractivePlot } from "../Shared/AddPVDiagramQuestionInteractivePlot";

export function AddPVDiagramQiestion(){

    const [api, contextHolder] = message.useMessage()
    const [currentTab, setCurrentTab] = useState(0)
    const onChange = (value) => setCurrentTab(value);

    const [questionInfo, setQuestionInfo] = useState({
        Code:'',
        selectedSubtopic: null,
        selectedLOD: null,
        validation: 'Please fill data'
    })

    const imageRef = React.createRef()

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [newImageWidth, setNewImageWidth] = useState(0)
    const [newImageHeight, setNewImageHeight] = useState(0)

    const [newPoints, setNewParts] = useState([])

    const [currentSubtab, setCurrentSubtab] = useState(1)

    const [questionBody, setQuestionBody] = useState("")

    const [isAdding, setIsAdding] = useState(false)

    const renderAddImage = () => {
        return(
            <div>
                <UploadImage 
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)

                    }}

                    imageURL={newImageURL}

                    className="pv-question-add-image-container"
                    classNameImage="pv-question-add-image-inside"
                />
            </div>
        )
    }

    const validateContent_QuestionInfo = () => {
        if(!questionBody.trim()) return "Add question body"

        return null
    }

    const renderAddQuestionBody = () => {
        return(
            <div className="hq-full-width">
                <p className="default-gray">Question body</p>

                <TextArea 
                    value={questionBody}
                    onChange={(v) => setQuestionBody(v.target.value)}
                    className="hq-full-width"

                />

                <br/>
                <LatexRenderer 
                    latex={questionBody}
                />
            </div>
        )
    }

    const renderPointsList = () => {
        return(
            <div>
                <Space>
                    <Button
                        type="default"
                        size="small"
                        icon={<PlusOutlined className="default-green"/>}

                        onClick={() => {
                            setIsAdding(!isAdding)
                        }}
                    >
                        New point
                    </Button>
                </Space>

                <br/>
                
            </div>
        )
    }

    const renderQuestionContent = () => {
        if(!newImage) {
            return (
                <div>
                    <p className="default-red">Please add an image</p>
                </div>
            )
        }

        const imageWidth = 0.35*window.innerWidth
        const imageHeight = ((newImageHeight*imageWidth)/newImageWidth)


        const validateInfo = validateContent_QuestionInfo()
        const validatePoints = false

        const tabs = [{
            key:1,
            label:
            <Space> 
                <p>Question text/info</p> 
            
                {validateInfo &&
                <Tooltip
                    color="white"
                    title={<p>{validateInfo}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,

            children: <div>{renderAddQuestionBody()} </div>
        },
        {
            key:2,
            label:
            <Space> 
                <p>Plot Points</p> 
            
                {validatePoints &&
                <Tooltip
                    color="white"
                    title={<p>{validatePoints}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderPointsList()}</div>
        }]

        return(
            <div> 
                <Row>
                    <Col>
                        <div>
                        <img 
                            alt="new-map"
                            style={{width:imageWidth, height:imageHeight, position:'absolute'}}
                            src={newImageURL}

                            ref={imageRef}

                            onClick={(e) => {
                                if(!isAdding) return;

                            }}

                            onLoad={(img) => {

                                img.persist()

                                setNewImageWidth(img.target.naturalWidth)
                                setNewImageHeight(img.target.naturalHeight)
                            }}
                        />
                        <AddPVDiagramQuestionInteractivePlot 
                            style={{width:imageWidth, height:imageHeight, cursor:'crosshair',/* position:'absolute', top:0, left:0,*/ border:'red solid 1px'}}
                           
                            isAdding = {isAdding}

                            onAdd= {(p) => {

                                setIsAdding(false)
                            }}
                        />  
                        </div>
                    </Col>
                    <Col xs={2}/>
                    <Col>
                        <Tabs
                            defaultActiveKey={1}
                            items={tabs}
                            onChange={(t) => setCurrentSubtab(t)}
                            activeKey={currentSubtab}
                            className="add-pv-d-question-tabs"
                        />
                    </Col>
                </Row>
            </div>
        )
    }

    const renderFinalPage = () => {
        return(
            <div/>
        )
    }

    const selectContent = () => {
        const map = {
            0: () => 
            <AddQuestionFormSheet 
                existingInfo={questionInfo}
                onSetInfo = {(i) => setQuestionInfo(i)}
            />,
            1: () => renderAddImage(),
            2: () => renderQuestionContent(),
            3: () => renderFinalPage(),
        }

        return map[currentTab]()
    }

    const validateAddImage = () => {
        if(!newImage)
            return "Please add an image"
    
        return null
    }

    const validateQuestionContent = () => {
        if(newPoints.length < 2)
            return "Please add points"
        
        const noAddedAnswers = newPoints.filter(a => !a.answer).length

        if(noAddedAnswers)
            return "Atleast one part has no answer"

        return null
    }

    const selectImageValidation = validateAddImage()
    const questionContentValidation = validateQuestionContent()

    const canAdd = !questionInfo.validation && !selectImageValidation && !questionContentValidation

    return(
        <PagesWrapper>
            {contextHolder}
            <Steps

                onChange={onChange}
                current={currentTab}
                items={[
                        {
                            title: 
                            <Space className={questionInfo.validation ? "highlighted" : "hoverable"}>
                                <p>Meta data{' '}</p>

                                {(!questionInfo.validation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{questionInfo.validation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                            </Space>,
                            icon:<ScheduleTwoTone />
                        },
                        {
                            title:
                            <Space className={(!questionInfo.validation && selectImageValidation) ? "highlighted" : "hoverable"}>
                                <p>Add image{' '}</p>
                                {(!selectImageValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{selectImageValidation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                           </Space>,
                            icon:<PictureTwoTone />
                        },
                        {
                            title:
                            <Space className={(!questionInfo.validation && !selectImageValidation && questionContentValidation) ? "highlighted" : "hoverable"}>
                                <p>Question content</p>
                                {(!questionContentValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{questionContentValidation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                           </Space>,
                            icon:<ProjectTwoTone />
                        },
                        {
                            title: 'Final',
                            icon: canAdd ? <SmileTwoTone /> : <FrownTwoTone />
                        },
                ]}
            />
            <br/>
            {selectContent()}

        </PagesWrapper>
    )
}