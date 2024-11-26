import React, { useState } from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Button, Col, ColorPicker, Divider, Input, List, Row, Select, Space, Steps, Tabs, Tooltip, message } from "antd";
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import {ScheduleTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, ProjectTwoTone, ExclamationCircleOutlined, CloseCircleFilled, DragOutlined, InsertRowAboveOutlined, SmileTwoTone, FrownTwoTone} from '@ant-design/icons';
import { UploadImage } from "../../../../Components/UploadImage";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { FBD_VECTOR_LINEAR, FBD_VECTOR_ROTATIONAL } from "../Shared/Constants";
import './index.css'
import { AssignAnswersToVectorTerm } from "./AssignAnswersToVectorTerm";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { MomentDirectionComponent } from "../Shared/MomentDirectionComponent";
import { validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { UploadPDF } from "../../../../Components/UploadPDF";

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

    const [showAddVTAnswers, setShowAddVTAnswers] = useState(false)
    const [selectedVT, setSelectedVT] = useState(null)
    const [selectedVTIndex, setSelectedVTIndex] = useState(0)

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)


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
                    className="add-fbd-input"
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
                    className="add-fbd-input"
                />

            </div>
        )
    }

    const renderObjectBodies = () => {
        return(
        !newParts.length ? <div/> 
        : <List 
                dataSource={newParts}

                renderItem={(p, pi) => {
                    const {Color} = p

                    const isHovered = (![null, undefined].includes(hoverElement)) && hoverElement === pi

                    return(
                        <div
                            key={pi}
                            className={"hq-full-width " + (isHovered ? "highlighted" : "") }>
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
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    
                                    <Space>
                                            <ColorPicker
                                                value={Color}

                                                defaultValue={Color} 

                                                onChange={(c, h) => {
                                                    let _newParts = [...newParts]

                                                    _newParts[pi].Color = h

                                                    setNewParts(_newParts)
                                                }}

                                                showText = {true}
                                            />
                                            <p className="highlighted">{Color}</p>
                                       </Space>
                                       &nbsp;
                                       &nbsp;
                                       &nbsp;
                                       &nbsp;
                                       &nbsp;
                                       &nbsp;
                                
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
            !VTs.length ? <div/> :
            <List 
                dataSource={VTs}

                renderItem={(vt, vti) => {
                    const {Code, Latex, LatexText, Keyboard, Answers, Color, Type, Angle, Clockwise, ObjectBody} = vt 

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
                                        className="add-fbd-input"
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
                                        className="add-fbd-input"
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
                                <Space>
                                    &nbsp;
                                    <div className="add-fbd-question-hide-element">
                                        <Tooltip>
                                        <CloseCircleFilled />
                                        </Tooltip>
                                    </div>
                                    &nbsp;
                                    <p className="default-white">{vti+1}</p>
                                    <div>
                                       <Space>
                                            <p className="default-gray">Color</p>
                                            <ColorPicker
                                                value={Color}

                                                defaultValue={Color} 

                                                onChange={(c, h) => {
                                                    let _terms = [...VTs]

                                                    _terms[vti].Color = h

                                                    setVTs(_terms)
                                                }}

                                                showText = {true}
                                            />
                                            <p className="highlighted">{Color}</p>
                                       </Space>

                                    </div>
                                   
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

                                    className="add-fbd-input"
                                    />
                                <LatexRenderer latex={LatexText || ""}/>
                                <br/>
                                <p className="default-gray">Answers</p>
                                <p className="hq-clickable hoverable-plus highlighted"
                                    onClick={() => {
                                        setShowAddVTAnswers(true)
                                        setSelectedVTIndex(vti)
                                        setSelectedVT(vt)
                                    }}
                                >Set keyboard/answers</p>
                                {Keyboard && 
                                <Space>
                                    <InsertRowAboveOutlined />
                                    <p> {Keyboard.Name} </p>
                                </Space>}
                                {Answers.map((ans, ans_i) => {
                                                const {List} = ans 
                                                const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'
                        
                                                return(
                                                    <div
                                                        key={ans_i}
                                                        className="hq-full-width"
                                                    >
                                                        <Space>
                                                            &nbsp;
                                                            <Tooltip 
                                                                title={<p>Click to remove answer</p>}
                                                                color="white"
                                                            >
                                                                <CloseCircleFilled 
                                                                    style={{cursor:'pointer', color:'red'}}
                        
                                                                    onClick={() => {
                                                                        let _terms = [...VTs]
                        
                                                                        _terms[vti].Answers = 
                                                                        _terms[vti].Answers.filter((a, ai) => ans_i !== ai)

                                                                        setVTs(_terms)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            &nbsp;
                                                            <p>{ans_i+1}</p>
                                                            &nbsp;
                                                            <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                                        </Space>
                                                    </div>
                                                )
                                            })}
                            <p className="default-gray">Type</p>
                            <Space size={"large"} align="center">
                                <Select 
                                    value={Type}
                                    onChange={(v) => {
                                        let _terms = [...VTs]

                                        _terms[vti].Type = v

                                        setVTs(_terms)                                
                                    }}

                                    className="add-fbd-vt-term-type"
                                >
                                    <Select.Option value={FBD_VECTOR_LINEAR}>Linear</Select.Option>
                                    <Select.Option value={FBD_VECTOR_ROTATIONAL}>Rotational</Select.Option>
                                </Select>

                                {Type === FBD_VECTOR_LINEAR ? 
                                
                                <VectorDirectionComponent
                                    widthHeight={window.innerWidth * 0.025}
                                    currentAngle={Angle}
                                    angleStep={5}
                                    onUpdateAngle={(a) => {
                                        let _terms = [...VTs]

                                        _terms[vti].Angle = a

                                        setVTs(_terms)
                                    }}
                                />

                                : <MomentDirectionComponent
                                    clockwise={Clockwise}
                                    onFlip={() => {
                                        let _terms = [...VTs]

                                        _terms[vti].Clockwise = !_terms[vti].Clockwise

                                        setVTs(_terms)
                                    }}
                                />}
                            </Space>
                            <p className="default-gray">Association</p>
                            <Select 
                                value={(ObjectBody || {}).Id}
                                onChange={(v) => {
                                    let _terms = [...VTs]

                                    const ob = newParts[v]

                                    _terms[vti].ObjectBody = ob

                                    setVTs(_terms)                                
                                }}

                                className="add-fbd-vt-term-type"
                            >
                                {newParts.map((p, pi) => {
                                    return(
                                        <Select.Option value={pi}>Object #{pi+1}</Select.Option>
                                    )
                                })}
                                
                            </Select>
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

                            if(isMovingElement){
                                setIsMovingElement(false)
                                return;
                            }

                            e.persist()

                            const {pageX, pageY} = e

                            const imgRef = imageRef.current
                            const parentNode = imgRef.parentNode.parentNode
                            const styles = window.getComputedStyle(parentNode)
                            const offset = Number(styles.getPropertyValue('padding-right').replace('px', ''))

                            setLeftOffset(offset)

                            const {top, left} = imgRef.getBoundingClientRect()
                            
                            if(!isAddingElementSecond){

                                let newPart = ({
                                    x: pageX - left + offset,
                                    y: pageY - top,
                                    offsetX: offset,
                                    width: 1,
                                    height: 1,
                                    correct: !newParts.length,
                                    Color: '#00FF00',
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

                        }}

                        onLoad={(img) => {

                            img.persist()

                            setNewImageWidth(img.target.naturalWidth)
                            setNewImageHeight(img.target.naturalHeight)
                        }}

                        onMouseMove={(e) => {
                            if(!(isAddingElement || isMovingElement)) return;

                            e.persist()

                            const {pageX, pageY} = e

                            const imgRef = imageRef.current
                            const parentNode = imgRef.parentNode.parentNode
                            const styles = window.getComputedStyle(parentNode)
                            const offset = Number(styles.getPropertyValue('padding-right').replace('px', ''))

                            setLeftOffset(offset)

                            const {top, left} = imgRef.getBoundingClientRect()

                            if(isMovingElement){
                                let parts = [...newParts]

                                const newX = pageX - left + offset
                                const newY = pageY - top
                                    
                                parts[movedElement].x = newX
                                parts[movedElement].y = newY

                                setNewParts(parts)                                
                            }
                        }}
                    />

                    {newParts.map((p, pi) => {
                        const {x, y, width, height, Color} = p

                        return( 
                            <div
                                key={pi}
                                style={{position:'absolute', left:x, top:y, width: width, height: height}}
                                className="clickable-question-add-element"

                                onMouseEnter={() => setHoverElement(pi)}
                                onMouseLeave={() => setHoverElement(null)}

                                onClick={() => {
                                    if(isMovingElement){
                                        setIsMovingElement(false)
                                        return;
                                    }
                                }}
                            >
                               
                                <div
                                    style={{width:'100%', height:'100%', backgroundColor:Color, flexDirection:'column', alignItems:'center', justifyContent:'center', display:'flex'}}
                                >
                                     
                                    <p className="default-red">+</p>
                                </div>
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
                                        Color: '#00FF00',

                                        ObjectBody:[],

                                        Keyboard: null,
                                        Answers:[],
                                        
                                        Type: FBD_VECTOR_LINEAR,
                                        Angle: 0,
                                        Clockwise: true
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
                            moreIcon = {null}
                        />
                </Col>
            </Row>
            </div>
        )
    }

    const addQuestionClick = () => {

        if(!canAdd){
            api.destroy()
            api.warning("Please fill all required data")
            return
        }

        const imageWidth = 0.35*window.innerWidth
        const imageHeight = ((newImageHeight*imageWidth)/newImageWidth)       
        

        //Meta data
        const data = new FormData()
        data.append('Code', questionInfo.Code)
        data.append('SubtopicId', questionInfo.selectedSubtopic.Id)
        data.append('LODId', questionInfo.selectedLOD.Id)

        //Question text
        data.append('QuestionText', questionBody)
        data.append('ArrowLength', arrowLength)

        //Picture
        data.append('Picture', newImage)
        data.append('Width', Number.parseInt(imageWidth))
        data.append('Height', Number.parseInt(imageHeight))

        //Supplementary materials
        data.append('PDF', newPDF)

        //Object bodies
        const OBs_VM = (newParts.map((cp) => ({

                X: Math.trunc(cp.x),
                Y: Math.trunc(cp.y),

                Width: Math.trunc(cp.width),
                Height: Math.trunc(cp.height),

                Color: cp.Color,

                VectorTerms: VTs
                .filter((t) => t.ObjectBody.Id === cp.Id)
                .map((t,ti) => ({
                    Code: t.Code,
                    LaTex: t.LaTeXCode,
                    LaTexText: t.LaTeXText, 
                    ArrowColor: t.Color,

                    KeyboardId: t.Keyboard.Id,

                    Linear: t.Type.Type == FBD_VECTOR_LINEAR,
                    Angle: t.Angle,
                    Clockwise: t.Clockwise,

                    Answers: t.Answers.map((a) => ({
                        AnswerElements: a.List.map((e,i) => (
                            {
                                NumericKeyId: e.NumericKeyId,
                                ImageId: e.VariableImageId,
                                Value:e.char,
                                Id: i,
                                Order:i
                            }))}
                        )) 
                }))
                
        })))

        data.append('ObjectBodies',JSON.stringify(OBs_VM))

    }

    const renderFinalPage = () => {
        return(
            <div>
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
        if(!questionBody.trim()) return "Add question body"

        if(!newParts.length) return "Please add at least one object body"

        if(!VTs.length) return "Please add terms"

        if(VTs.filter(a => !a.Code.trim()).length) return "Atleast one terms has no code"
        if(VTs.filter(a => !a.Latex.trim()).length) return "Atleast one terms has no LaTeX code"

        if(VTs.filter(a => !a.Keyboard).length) return "Atleast one terms has no a question with no Keyboard"
        if(VTs.filter(a =>!a.Answers.length).length) return "Atleast one terms has no  answers"
        if(VTs.filter(a =>a.Answers.filter(x => validateKeyboardAnswer(x)).length).length) return "Atleast one terms has invalid answer(s)"

        if(VTs.filter(a => !a.ObjectBody).length) return "Atleast one terms has no association"


        return null

    }

    const selectImageValidation = validateAddImage()
    const questionContentValidation = validateQuestionContent()

    const canAdd = !questionInfo.validation && (!selectImageValidation && !questionContentValidation)

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
                        }
                    ]}
            />
            <br/>
            {selectContent()}

            <AssignAnswersToVectorTerm 

                open={showAddVTAnswers}

                onClose={() => {
                    setSelectedVT(null)
                    setShowAddVTAnswers(false)
                }}

                usedKeyboard = {(selectedVT || {}).Keyboard}
                addedAnswers={(selectedVT || {}).Answers}

                onUpdateAnswers={(a) => {
                    let _terms = [...VTs]

                    _terms[selectedVTIndex].Answers = a

                    setVTs(_terms)
                }} 

                onUpdateKeyboard = {(k) => {
                    let _terms = [...VTs]

                    _terms[selectedVTIndex].Keyboard = k

                    setVTs(_terms)
                }}
            />
        </PagesWrapper>
    )
}