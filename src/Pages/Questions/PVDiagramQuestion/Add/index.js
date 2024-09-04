import React, { useState } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, ColorPicker, Divider, message, Row, Space, Steps, Tabs, Tooltip } from "antd";
import {ScheduleTwoTone, ProjectTwoTone, FrownTwoTone, CheckCircleFilled, CloseCircleTwoTone, DeleteOutlined, ArrowLeftOutlined, ArrowRightOutlined, EyeOutlined, BorderOutlined, PictureTwoTone, PlusOutlined, SmileTwoTone, ExclamationCircleOutlined} from '@ant-design/icons';
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";

import "./index.css"
import { UploadImage } from "../../../../Components/UploadImage";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { AddPVDiagramQuestionInteractivePlot } from "../Shared/AddPVDiagramQuestionInteractivePlot";
import Input from "antd/es/input/Input";
import { moveElementInArray } from "../../../../services/Auxillary";

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

    const [newPoints, setNewPoints] = useState([])

    const [currentSubtab, setCurrentSubtab] = useState(1)

    const [questionBody, setQuestionBody] = useState("")

    const [isAdding, setIsAdding] = useState(false)

    const [currentPointsTab, setCurrentPointsTab] = useState(0)

    const [selectedHighlightPointIndex, setSelectedHighlightPointIndex] = useState(null)

    const [selectedPointMoveIndex, setSelectedPointMoveIndex] = useState(null)

    const [selectedCPPointMoveIndex, setSelectedCPPointMoveIndex] = useState(null)

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

    const renderPointInList = (p, pi) => {
        const {name, color, borderColor, marginY, marginX} = p
        const isHighlighted = (pi === selectedHighlightPointIndex)

        const canMoveLeft = (pi !== 0)
        const canMoveRight = ((pi + 1) !== newPoints.length)

        return(
            <div
                key={pi}
                className="hq-full-width"
            >
            <div>
                <small className="default-gray">Name</small>
                <Input
                    value={name}
                    className="hq-full-width"
                    onChange={(v) => {
                        const value = v.target.value

                        let _points = [...newPoints]

                        _points[pi].name = value
                        setNewPoints(_points)
                    }}

                    className="add-pv-d-question-tabs"
                />
            </div>
            <br/>
            <div>
                <small className="default-gray">Margin-X</small>
                <Input
                    value={marginX}
                    className="hq-full-width"
                    type="number"
                    min="0"

                    onChange={(v) => {
                        const value = v.target.value

                        if(value < 0) return;

                        let _points = [...newPoints]

                        _points[pi].marginX = value
                        setNewPoints(_points)
                    }}

                    className="add-pv-d-question-tabs"
                />
            </div>
            <br/>
            <div>
                <small className="default-gray">Margin-Y</small>
                <Input
                    value={marginY}
                    className="hq-full-width"
                    type="number"
                    min="0"

                    onChange={(v) => {
                        const value = v.target.value

                        if(value < 0) return;

                        let _points = [...newPoints]

                        _points[pi].marginY = value
                        setNewPoints(_points)
                    }}

                    className="add-pv-d-question-tabs"
                />
            </div>
            <br/>
            <div>
                <small className="default-gray">Inner color</small>
                <Space align="center" size="large">
                    <ColorPicker
                        value={color}
                        defaultValue={color} 

                        onChange={(c, h) => {
                            let _newPoints = [...newPoints]

                            _newPoints[pi].color = h
                            setNewPoints(_newPoints)
                        }}
                        showText = {true}
                        className="add-pv-d-question-tabs"
                    />
                    <p className="highlighted">{color}</p>
                </Space>
            </div>
            <br/>
            <div>
                <small className="default-gray">Outer color</small>
                <Space align="center" size="large">
                    <ColorPicker
                        value={borderColor}
                        defaultValue={borderColor} 

                        onChange={(c, h) => {
                            let _newPoints = [...newPoints]

                            _newPoints[pi].borderColor = h
                            setNewPoints(_newPoints)
                        }}
                        showText = {true}
                        className="add-pv-d-question-tabs"
                    />
                    <p className="highlighted">{borderColor}</p>
                </Space>
            </div>    
            <br/>
            <Space>
                <Space 
                    size="small" 
                    className="hq-clickable" 
                    onClick = {() => {
                        setSelectedHighlightPointIndex(isHighlighted ? null : pi)
                    }}
                >
                    <EyeOutlined className = {isHighlighted ? "default-title" : ""}/>
                    <p className="default-gray default-smaller">Highlight</p>
                </Space> 

                &nbsp;&nbsp;&nbsp;&nbsp;

                <Space 
                    size="small" 
                    className="hq-clickable" 
                    onClick = {() => {
                        let _points = [...newPoints]

                        _points = _points.filter((pp, ppi) => pi !== ppi)

                        setNewPoints(_points)
                        setCurrentPointsTab(0)
                        setSelectedHighlightPointIndex(null)
                    }}
                >
                    <DeleteOutlined />
                    <p className="default-gray default-smaller">Remove</p>
                </Space>   

                &nbsp;&nbsp;&nbsp;&nbsp;

                <Space 
                    size="small" 
                    className="hq-clickable" 
                    onClick = {() => {
                        if(!canMoveLeft) return;
                        const _movedPoints = moveElementInArray(pi, p, newPoints, true)
                 
                        setNewPoints(_movedPoints)
                        setCurrentPointsTab(pi-1)
                    }}
                >
                    <ArrowLeftOutlined className={canMoveLeft ? "default-title" : ""}/>
                    <p className="default-gray default-smaller">Move left</p>
                </Space>  

                &nbsp;&nbsp;&nbsp;&nbsp;

                <Space 
                    size="small" 
                    className="hq-clickable" 
                    onClick = {() => {
                        if(!canMoveRight) return;

                        const _movedPoints = moveElementInArray(pi, p, newPoints, false)                        

                        setNewPoints(_movedPoints)
                        setCurrentPointsTab(pi+1)
                    }}
                >
                    <ArrowRightOutlined className={canMoveRight ? "default-title" : ""}/>
                    <p className="default-gray default-smaller">Move right</p>
                </Space>   
            </Space>
            <Divider/>
        </div>
        )
    }

    const renderPointsList = () => {
        const pointsTabs = newPoints.map(
            (p, pi) => {
                const {name, color, borderColor} = p

                return ({
                    key: pi,
                    label: 
                    <Space align="center" size="large"> 
                        <small className="default-gray">{pi+1}</small> 
                        <small className="default-gray">{name}</small> 
                        <BorderOutlined  style={{color:borderColor, backgroundColor:color}}/>
                    </Space>,
                    children:
                     <div>{renderPointInList(p, pi)} </div>
                })
            }
        )

        return(
            <div>
                <Space>
                    <Button
                        type="default"
                        size="small"
                        icon={<PlusOutlined className="default-green"/>}

                        onClick={() => {
                            if(!Object.is(selectedPointMoveIndex, null)){
                                api.warning("Please finish moving selected point")
                                return
                            }

                            if(!Object.is(selectedCPPointMoveIndex, null)){
                                api.warning("Please finish moving selected control point point")
                                return
                            }

                            setIsAdding(!isAdding)
                        }}
                    >
                        New point
                    </Button>
                </Space>

                <br/>
                {newPoints.length ? 
                <Tabs
                    defaultActiveKey={0}
                    items={pointsTabs}
                    onChange={(t) => setCurrentPointsTab(t)}
                    activeKey={currentPointsTab}
                    className="add-pv-d-question-tabs"
                /> : <div/>}

               
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
                            
                        <AddPVDiagramQuestionInteractivePlot 
                            style={{width:imageWidth, height:imageHeight, border:'red solid 1px'}}
                           
                            isAdding = {isAdding}

                            imageURL = {newImageURL}

                            onAdd= {(p) => {
                                let _points = [...newPoints]
                                const {x, y} = p

                                //Update control points                                
                                if(_points.length){

                                    const lastIndex = _points.length - 1
                                    _points[lastIndex].cx = (_points[lastIndex].x + x) * 0.5
                                    _points[lastIndex].cy = (_points[lastIndex].y + y) * 0.5
                                }

                                _points.push({
                                    ...p,
                                    name:'point',
                                    color:'lightgreen',
                                    borderColor:'green',
                                    marginY: 0,
                                    marginX: 0, 
                                    cx: x, 
                                    cy: y
                                })

                                

                                setNewPoints(_points)
                                setCurrentPointsTab(_points.length - 1)

                                setIsAdding(false)
                            }}

                            points={newPoints}
                            selectedPointIndex = {selectedHighlightPointIndex}

                            onSelectedPointMove = {(pi) => {
                                setSelectedPointMoveIndex(pi)
                                setSelectedCPPointMoveIndex(null)
                            }}

                            selectedPointMoveIndex = {selectedPointMoveIndex}

                            onPointMove = {(p) => {
                                const {x,y} = p
                                let _points = [...newPoints]

                                _points[selectedPointMoveIndex].x = x
                                _points[selectedPointMoveIndex].y = y
                                
                                setNewPoints(_points)
                            }}

                            onSelectedCPPointMove = {(pi) => {
                                setSelectedPointMoveIndex(null)
                                setSelectedCPPointMoveIndex(pi)
                            }}

                            selectedCPPointMoveIndex = {selectedCPPointMoveIndex}

                            onCPPointMove = {(p) => {
                                const {x,y} = p
                                let _points = [...newPoints]

                                _points[selectedCPPointMoveIndex].cx = x
                                _points[selectedCPPointMoveIndex].cy = y
                                
                                setNewPoints(_points)
                            }}
                        />  

                        <img 
                            alt="new-map"

                            style={{width:0, height:0}}

                            src={newImageURL}

                            ref={imageRef}

                            onLoad={(img) => {

                                img.persist()

                                setNewImageWidth(img.target.naturalWidth)
                                setNewImageHeight(img.target.naturalHeight)
                            }}
                        />
                        
                        </div>
                    </Col>
                    <Col xs={2}/>
                    <Col>
                        <Tabs
                            defaultActiveKey={1}
                            items={tabs}
                            onChange={(t) => {
                                setCurrentSubtab(t)
                                setCurrentPointsTab(t === 1 ? -1 : 0)
                                setSelectedHighlightPointIndex(null)
                            }}
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