import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { useState } from "react";
import { Button, Col, Divider, Input, List, Row, Space, Steps, Tabs, Tooltip, message } from "antd";
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import {ScheduleTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, ProjectTwoTone, PlusOutlined,  ExclamationCircleOutlined , CloseCircleFilled, DragOutlined, InsertRowAboveOutlined, SmileTwoTone, FrownTwoTone} from '@ant-design/icons';
import { UploadImage } from "../../../../Components/UploadImage";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

import { UploadPDF } from "../../../../Components/UploadPDF";
const { TextArea } = Input;

export function AddDiagramQuestion(){

    const [currentTab, setCurrentTab] = useState(0)

    const [questionInfo, setQuestionInfo] = useState({
        Code:'',
        selectedSubtopic: null,
        selectedLOD: null,
        validation: 'Please fill data'
    })

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [newImageWidth, setNewImageWidth] = useState(0)
    const [newImageHeight, setNewImageHeight] = useState(0)

    const imageRef = React.createRef()
    const [leftOffset, setLeftOffset] = useState(0)

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [isMovingElement, setIsMovingElement] = useState(false)
    const [movedElement, setMovedElement] = useState(false)

    const [newParts, setNewParts] = useState([])
    const [hoverElement, setHoverElement] = useState(null) 

    const [currentSubtab, setCurrentSubtab] = useState(1)

    const [questionBody, setQuestionBody] = useState("")

    const [ebTerms, setEbTerms] = useState([])

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    const [api, contextHolder] = message.useMessage()

    const renderAddImage = () => {
        return(
            <div>
                <UploadImage 
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)

                    }}

                    imageURL={newImageURL}

                    className="clickable-question-add-image-container"
                    classNameImage="clickable-question-add-image-inside"
                />
            </div>
        )
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

    const renderPlots = () => {
        return(
            <div>
                
            </div>
        )
    }

    const validateContent_QuestionInfo = () => {
        if(!questionBody.trim()) return "Add question body"

        return null
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
        const validatePlots = validateContent_QuestionInfo()

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
                <p>Plots</p> 
            
                {validatePlots &&
                <Tooltip
                    color="white"
                    title={<p>{validatePlots}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderPlots()}</div>
        }]

        return(
            <div className="hq-full-width">
                <Row>
                    <Col>
                        <div>
                            <img 
                            alt="new-map"
                            style={{width:imageWidth, height:imageHeight, cursor:'crosshair'}}
                            src={newImageURL}

                            ref={imageRef}

                            onClick={(e) => {
                                if(!(isAddingElement || isMovingElement)) return;

                                e.persist()

                                const {pageX, pageY} = e

                                const imgRef = imageRef.current
                                const parentNode = imgRef.parentNode.parentNode
                                const styles = window.getComputedStyle(parentNode)
                                const offset = Number(styles.getPropertyValue('padding-right').replace('px', ''))

                                setLeftOffset(offset)

                                const {top, left} = imgRef.getBoundingClientRect()
                                
                                if(!isAddingElementSecond && !isMovingElement){

                                    let newPart = ({
                                        x: pageX - left + offset,
                                        y: pageY - top,
                                        offsetX: offset,
                                        width: 1,
                                        height: 1,
                                        correct: !newParts.length
                                    })


                                    setNewParts(prev => [...prev, newPart])
                                    setIsAddingElementSecond(true)

                                    return
                                }

                                if(isAddingElementSecond){
                                    let parts = [...newParts]

                                    const newX = pageX - left + offset
                                    const newY = pageY - top

                                    let Last =  parts[parts.length-1]
                                
                                    Last.width = Math.abs(Last.x - newX)
                                    Last.height = Math.abs(Last.y - newY)
        
                                    Last.x = Math.min(Last.x,newX)
                                    Last.y = Math.min(Last.y, newY)

                                    setNewParts(parts)

                                    setIsAddingElement(false)
                                    setIsAddingElementSecond(false)
                                    return
                                }

                                if(isMovingElement){
                                    let parts = [...newParts]

                                    const newX = pageX - left + offset
                                    const newY = pageY - top
                                        
                                    parts[movedElement].x = newX
                                    parts[movedElement].y = newY

                                    setNewParts(parts)

                                    setIsMovingElement(false)
                                    setMovedElement(null)
                                    return
                                }
                            }}

                            onLoad={(img) => {

                                img.persist()

                                setNewImageWidth(img.target.naturalWidth)
                                setNewImageHeight(img.target.naturalHeight)
                            }}
                        />

                        {newParts.map((p, pi) => {
                            const {x, y, width, height, backgroundImage} = p

                            return( 
                                <div
                                    key={pi}
                                    style={{position:'absolute', left:x, top:y, width: width, height: height}}
                                    className="clickable-question-add-element"

                                    onMouseEnter={() => setHoverElement(pi)}
                                    onMouseLeave={() => setHoverElement(null)}
                                >
                                    {backgroundImage && 
                                    <img 
                                        alt="background"
                                        src={backgroundImage.URL}
                                        style={{width: width, height: height}}
                                    />}
                                    <Space className="hq-full-width" direction="vertical" align="center">
                                        <p className="default-red default-larger">{pi+1}</p>
                                    </Space>
                                </div>
                            )
                        })}
                        </div>
                    </Col>
                    <Col xs={2}/>
                    <Col>
                        <Tabs
                            defaultActiveKey={1}
                            items={tabs}
                            onChange={(t) => setCurrentSubtab(t)}
                            activeKey={currentSubtab}
                        />
                    </Col>
                </Row>
            </div>)
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
            3: () => renderFinalPage()
        }

        return map[currentTab]()
    }

    const validateAddImage = () => {
        if(!newImage)
            return "Please add an image"
    
        return null
    }

    const validateQuestionContent = () => {
        return null
    }

    const selectImageValidation = validateAddImage()
    const questionContentValidation = validateQuestionContent()

    const canAdd = !questionInfo.validation && !selectImageValidation && !questionContentValidation

    const addQuestionClick = () => {

    }

    const renderFinalPage = () => {
        return(
            <Space direction="vertical">
                {!canAdd && <p className="default-red">Please fill all required data</p>}
                <br/>
                {canAdd && 
                    <Space size={'large'} align="start">
                        <div>
                            <p> Question solution (optional)</p>
                            <UploadPDF 
                                pdfURL={newPDFURL}

                                className="add-question-upload-pdf"
                                pdfClassName="add-question-upload-pdf-internal"

                                onSetPDF={(url, pdf) => {
                                    setNewPDFURL(url)
                                    setNewPDF(pdf)
                                }}
                            />
                        </div>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <Button
                            type="primary"
                            size="small" 
                            onClick={addQuestionClick}
                            loading={false}
                        >
                            Add question
                        </Button>
                    </Space>
                }
            </Space>
        )
    }

    const onChange = (newStep) => {setCurrentTab(newStep)}

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