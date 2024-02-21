import React, { useState } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, Divider, Input, List, Row, Space, Steps, Tabs, Tooltip, message } from "antd";
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import {ScheduleTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, ProjectTwoTone, ExclamationCircleOutlined, CloseCircleFilled, DragOutlined} from '@ant-design/icons';
import { UploadImage } from "../../../../Components/UploadImage";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { FBD_VECTOR_LINEAR } from "../Shared/Constants";
import './index.css'

const { TextArea } = Input;

export function AddFBDQuestion(){

    const [api, contextHolder] = message.useMessage()

    const [currentTab, setCurrentTab] = useState(0)
    const [currentSubtab, setCurrentSubtab] = useState(1)

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

    const [questionBody, setQuestionBody] = useState("")
    const [arrowLength, setArrowLength] = useState(100)

    const [VTs, setVTs] = useState([])

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
                />

                <br/>
                <LatexRenderer 
                    latex={questionBody}
                />
                <br/>
                <p className="default-gray">Arrow length</p>

                <Input 
                    value={arrowLength}
                    type="number"
                    onChange={(v) => setArrowLength(v.target.value)}

                />

            </div>
        )
    }

    const renderObjectBodies = () => {
        return(
            <List 
                dataSource={newParts}

                renderItem={(p, pi) => {
                    return(
                        <div
                            key={pi}
                            className="hq-full-width">
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove body</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                if(isMovingElement){
                                                    api.destroy()
                                                    api.warning("Please finish moving element #" + (movedElement + 1))
                                                    return
                                                }
            
                                                if(isAddingElementSecond){
                                                    api.destroy()
                                                    api.warning("Please finish adding")
                                                    return
                                                } 

                                                let _newParts = [...newParts]

                                                _newParts = _newParts.filter((a, ai) => ai !== pi)

                                                if(_newParts.length === 1){
                                                    _newParts[0].correct = true
                                                }

                                                setNewParts(_newParts)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p className="default-gray">{pi+1}</p>
                               
                                
                                <Tooltip
                                    color="white"
                                    title={<p>Click to move</p>}
                                >
                                    <DragOutlined style={{color:'blue', cursor:'pointer'}} onClick={() => {
                                        if(isAddingElementSecond){
                                            api.destroy()
                                            api.warning("Please finish adding")
                                            return
                                        }

                                        if(isMovingElement){
                                            setIsMovingElement(false)
                                            setMovedElement(null)
                                            return
                                        }

                                        setIsMovingElement(true)
                                        setMovedElement(pi)
                                    }}/>
                                </Tooltip>
                                
                            </Space>
                        <Divider />
                    </div>
                    )
                }}
            />
        )
    }

    const renderVectorTerms = () => {
        return(
            <List 
                dataSource={VTs}

                renderItem={(vt, vti) => {
                    const {Code, Latex, LatexText, Keyboard, Answers, Color, Type, ObjectBody} = vt 

                    return(
                        <Space
                            className="hq-full-width"
                            key={vti}
                            direction="vertical"
                            align="start"
                        >
                            <Space>
                                &nbsp;
                                <Tooltip 
                                    title={<p>Click to remove term</p>}
                                    color="white"
                                >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                

                                                let _terms = [...VTs]

                                                _terms = _terms.filter((a, ai) => ai !== vti)

                                                setVTs(_terms)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p className="default-gray">{vti+1}</p>

                                    <Input 
                                        type="text"
                                        value={Code}
                                        className="hq-full-width"
                                        placeholder="Term code (must be unique)"
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...VTs]

                                            _terms[vti].Code = value

                                            setVTs(_terms)
                                        }}
                                    />
                                </Space>
                                <Space>
                                    &nbsp;
                                    <div className="add-fbd-question-hide-element">
                                        <Tooltip>
                                        <CloseCircleFilled />
                                        </Tooltip>
                                    </div>
                                    &nbsp;
                                    <p className="default-white">{vti+1}</p>
                                    <Input 
                                        type="text"
                                        value={Latex}
                                        className="hq-full-width"
                                        placeholder="Latex code (must be unique)"
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...VTs]

                                            _terms[vti].Latex = value

                                            setVTs(_terms)
                                        }}
                                    />

                                    <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                </Space>

                                <br/>
                                <p className="default-gray">Latex text (optional)</p>
                                <TextArea 
                                    value={LatexText}
                                    onChange={(v) => {
                                        const value = v.target.value

                                        let _terms = [...VTs]

                                        _terms[vti].LatexText = value

                                        setVTs(_terms)
                                    }}

                                    className="hq-full-width"
                                />
                                <LatexRenderer latex={LatexText || ""}/>
                        </Space>
                    )
                }}
            />
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

        const validateInfo = false
        const validateOBs = false
        const validateVTs = false

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

            children: <div>{renderAddQuestionBody()}</div>
        },
        {
            key:2,
            label:
            <Space> 
                <p>Object bodies</p> 
            
                {validateOBs &&
                <Tooltip
                    color="white"
                    title={<p>{validateOBs}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderObjectBodies()}</div>
        },
        {
            key:3,
            label:
            <Space> 
                <p>Vector terms</p> 
            
                {validateVTs &&
                <Tooltip
                    color="white"
                    title={<p>{validateVTs}</p>}
                >
                    <ExclamationCircleOutlined  style = {{color:'orange'}}/>
                </Tooltip>} 
            </Space>,
            children: <div>{renderVectorTerms()}</div>
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
                <Space>
                    <Button
                                size = "small"
                                type = "primary"
                                onClick = {() => {
                                    if(isMovingElement){
                                        api.destroy()
                                        api.warning("Please finish moving element #" + (movedElement + 1))
                                        return
                                    }

                                    if(isAddingElementSecond){
                                        api.destroy()
                                        api.warning("Please finish adding")
                                        return
                                    }                                   

                                    if(isAddingElement){
                                        setIsAddingElement(false)

                                        return
                                    }

                                    setIsAddingElement(true)
                                    setCurrentSubtab(2)
                                }}
                            >   
                                Add  object body
                            </Button>
                            
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => {
                                    const newTerm = ({
                                        Code:'',
                                        Latex:'',
                                        LatexText:'',

                                        ObjectBody:[],
                                        Keyboard: null,
                                        Answers:[],
                                        Color: 'green',
                                        Type: FBD_VECTOR_LINEAR
                                    })

                                    let _terms = [...VTs]

                                    _terms.push(newTerm)

                                    setVTs(_terms)
                                    setCurrentSubtab(3)

                                }}
                            >
                                Add vector term
                            </Button>

                           
                        </Space>

                        <br/>
                        <br/>
                        <Tabs
                            defaultActiveKey={1}
                            items={tabs}
                            onChange={(t) => setCurrentSubtab(t)}
                            activeKey={currentSubtab}
                        />
                </Col>
            </Row>
            </div>
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
        }

        return map[currentTab]()
    }   

    const validateAddImage = () => {
        if(!newImage)
            return "Please add an image"
    
        return null
    }

    const selectImageValidation = validateAddImage()
    const questionContentValidation = false

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
                        }
                    ]}
            />
            <br/>
            {selectContent()}

        </PagesWrapper>
    )
}