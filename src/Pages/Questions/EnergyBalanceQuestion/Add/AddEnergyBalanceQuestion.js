import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { useState } from "react";
import { Button, Col, Divider, Input, List, Row, Space, Steps, Tabs, Tooltip, message } from "antd";
import { AddQuestionFormSheet } from "../../Shared/AddQuestionFormSheet";
import {ScheduleTwoTone, CheckCircleFilled, CloseCircleTwoTone, PictureTwoTone, ProjectTwoTone, PlusOutlined, CloseCircleFilled, DragOutlined, InsertRowAboveOutlined} from '@ant-design/icons';
import { UploadImage } from "../../../../Components/UploadImage";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

import './index.css'
import { CENTER_DIRECTION, EAST_DIRECTION, NORTH_DIRECTION, SOUTH_DIRECTION, WEST_DIRECTION } from "../Play/Constants";
import { SelectKeyboard } from "../../KeyboardQuestion/Add/SelectKeyboard";
import { AddAnswersToList } from "../Shared/AddAnswersToList";

export function AddEnergyBalanceQuestion(){

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

    const [BCKeyboard, setBCKeyboard] = useState(null)
    const [showSelectKeyboardBC, setShowSelectKeyboardBC] = useState(false)
    const [showAddBCTerms, setAddBCTerms] = useState(false)
    const [bcTerms, setBCTerms] = useState([])


    const [ICKeyboard, setICKeyboard] = useState(null)
    const [showSelectKeyboardIC, setShowSelectKeyboardIC] = useState(false)
    const [showAddICTerms, setAddICTerms] = useState(false)
    const [icTerms, setICTerms] = useState([])

    const [showAddQAnswers, setShowAddQAnswers] = useState(false)

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

    const renderControlVolumeList = () => {

        return(
            <div className="hq-full-width">
                <List 
                    dataSource={newParts}

                    renderItem={(p, pi) => {
                        const {correct} = p
                        return(
                            <div
                            key={pi}
                            className="hq-full-width">
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove control volume</p>}
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
                                        
                                    <div className="add-eb-question-correct-field">
                                    <p
                                        onClick={() => {
                                            let _newParts = [...newParts]

                                            _newParts = _newParts.map((a) => ({...a, correct: false}))

                                            _newParts[pi].correct = true

                                            setNewParts(_newParts)
                                        }}
                                        className={"hq-clickable " + (correct ? "default-green" : "default-gray")}>
                                            {correct ? "Correct" : "Incorrect"}
                                    </p>
                                </div>
                                
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
            </div>
        )
    }

    const setDirectionForEBTerms = (ti, direction) => {

        let _terms = [...ebTerms]

        _terms[ti][direction] = !_terms[ti][direction]

        _terms[ti].IsDummy = false

        setEbTerms(_terms)
    }
    
    const setDirectionIsDummyForEBTerms = (ti) => {

        let _terms = [...ebTerms]

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            _terms[ti][d] = false

        }

        _terms[ti].IsDummy = true

        setEbTerms(_terms)
    }

    const renderEnergyBalanceTerms = () => {

        return(
            <div className="hq-full-width">
                <List 
                    dataSource={ebTerms}
                    
                    renderItem={(t, ti) => {
                        const {Code, Latex, LatexText, North, South, East, West, Center, IsDummy, Questions} = t 
                        return(
                            <Space
                                key={ti}

                                direction="vertical"

                                className="hq-full-width"
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
                                                

                                                let _terms = [...ebTerms]

                                                _terms = _terms.filter((a, ai) => ai !== ti)

                                                setEbTerms(_terms)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p className="default-gray">{ti+1}</p>

                                    <Input 
                                        type="text"
                                        value={Code}
                                        className="hq-full-width"
                                        placeholder="Term code (must be unique)"
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...ebTerms]

                                            _terms[ti].Code = value

                                            setEbTerms(_terms)
                                        }}
                                    />
                                </Space>
                                <Space>
                                &nbsp;
                                <div className="add-eb-question-hide-element">
                                    <Tooltip>
                                    <CloseCircleFilled />
                                    </Tooltip>
                                </div>
                                &nbsp;
                                    <p className="default-white">{ti+1}</p>
                                    <Input 
                                        type="text"
                                        value={Latex}
                                        className="hq-full-width"
                                        placeholder="Latex code (must be unique)"
                                        onChange={(v) => {
                                            const value = v.target.value

                                            let _terms = [...ebTerms]

                                            _terms[ti].Latex = value

                                            setEbTerms(_terms)
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

                                        let _terms = [...ebTerms]

                                        _terms[ti].LatexText = value

                                        setEbTerms(_terms)
                                    }}
                                />
                                <LatexRenderer latex={LatexText || ""}/>

                                <p className="default-gray">Possible directions</p>
                                <Space>
                                    <p 
                                        className={North ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, NORTH_DIRECTION)}
                                    >
                                        North
                                    </p>
                                    <p 
                                        className={South ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, SOUTH_DIRECTION)}
                                    >
                                        South
                                    </p>
                                    <p
                                        className={West ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, WEST_DIRECTION)}
                                    >
                                        West
                                    </p>
                                    <p
                                        className={East ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, EAST_DIRECTION)}
                                    >
                                        East
                                    </p>
                                    <p 
                                        className={Center ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}
                                        onClick={() => setDirectionForEBTerms(ti, CENTER_DIRECTION)}
                                    >
                                        Center
                                    </p>
                                    <p 
                                        onClick={() => setDirectionIsDummyForEBTerms(ti)}
                                        className={IsDummy ? "add-eb-question-direction-field-selected" : "add-eb-question-direction-field"}>
                                        IsDummy
                                    </p>                                                                
                                </Space>
                                <br/>
                                <Space>
                                    <p className="default-gray">Questions</p>
                                    <PlusOutlined 
                                        style={{color:'green', cursor:'pointer'}} 
                                        onClick={() => {
                                            let _terms = [...ebTerms]

                                            _terms[ti].Questions.push({
                                                Latex:'',
                                                Keyboard: null,
                                                Answers: []
                                            })

                                            setEbTerms(_terms)
                                        }}
                                    />

                                </Space>
                                {Questions.map((q, qi) => {
                                    const {Keyboard, Latex} = q

                                    return(
                                        <div key={qi}>
                                            <Space>
                                                &nbsp;
                                                <Tooltip 
                                                    title={<p>Click to remove question</p>}
                                                    color="white"
                                                >
                                                        <CloseCircleFilled 
                                                            style={{cursor:'pointer', color:'red'}}

                                                            onClick={() => {
                                                                
                                                                let _terms = [...ebTerms]

                                                                _terms[ti].Questions = _terms[ti].Questions.filter((a, ai) => qi !== ai)

                                                                setEbTerms(_terms)

                                                            }}
                                                        />
                                                    </Tooltip>
                                                    &nbsp;
                                                    <p className="default-gray">{qi+1}</p>
                                                    <Input 
                                                        type="text"
                                                        value={Latex}
                                                        className="hq-full-width"
                                                        placeholder="Latex code (must be unique)"
                                                        onChange={(v) => {
                                                            const value = v.target.value

                                                            let _terms = [...ebTerms]

                                                            _terms[ti].Questions[qi].Latex = value

                                                            setEbTerms(_terms)
                                                        }}
                                                    />

                                                    <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                                                    
                                                </Space>

                                                    
                                                <p className="hq-clickable hoverable-plus"
                                                        onClick={() => {
                                                            
                                                        }}
                                                    >Add answers</p>
                                        </div>
                                    )
                                })}
                                <Divider />
                            </Space>
                        )
                    }}
                />
            </div>
        )
    }


    const renderBoundaryConditions = () => {
        return(
            <div>
                <p>Keyboard</p>
                            
                <div 
                    className="please-select-area" 
                    onClick={() => setShowSelectKeyboardBC(true)}
                >
                    {!BCKeyboard ? 
                        <Space>
                            <InsertRowAboveOutlined />
                            <small>Click to select a keyboard</small>
                        </Space> : 
                        <Space>
                            <InsertRowAboveOutlined />
                            <p> {BCKeyboard.Name} </p>
                        </Space>}
                </div> 
                        
                <br/>
                {BCKeyboard && <Space>
                    <p className="default-gray">Terms</p>
                    <PlusOutlined 
                        style={{color:'green', cursor:'pointer'}} 
                        onClick={() => {
                            setAddBCTerms(true)
                            setAddICTerms(false)
                        }}
                    />
                </Space>}
                {BCKeyboard &&
                <List 
                    dataSource={bcTerms}

                    renderItem={(bc, bci) => {
                        const {List} = bc 
                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        return(
                            <div
                                key={bci}
                                className="hq-full-width"
                            >
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove condition</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                let _terms = [...bcTerms]

                                                _terms = _terms.filter((t, ti) => bci !== ti)
                                                setBCTerms(_terms)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p>{bci+1}</p>
                                    &nbsp;
                                    <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                </Space>
                            </div>
                        )
                    }}
                />}
            </div>
        )
    }

    const renderInitialConditions = () => {
        return(
            <div>
                <p>Keyboard</p>
                            
                <div 
                    className="please-select-area" 
                    onClick={() => setShowSelectKeyboardIC(true)}
                >
                    {!ICKeyboard ? 
                        <Space>
                            <InsertRowAboveOutlined />
                            <small>Click to select a keyboard</small>
                        </Space> : 
                        <Space>
                            <InsertRowAboveOutlined />
                            <p> {ICKeyboard.Name} </p>
                        </Space>}
                </div> 
                        
                <br/>
                {ICKeyboard && <Space>
                    <p className="default-gray">Terms</p>
                    <PlusOutlined 
                        style={{color:'green', cursor:'pointer'}} 
                        onClick={() => {
                            setAddBCTerms(false)
                            setAddICTerms(true)
                        }}
                    />
                </Space>}
                <br/>
                {ICKeyboard &&
                <List 
                    dataSource={icTerms}

                    renderItem={(bc, bci) => {
                        const {List} = bc 

                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        return(
                            <div
                                key={bci}
                                className="hq-full-width"
                            >
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove condition</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                let _terms = [...icTerms]

                                                _terms = _terms.filter((t, ti) => bci !== ti)
                                                setICTerms(_terms)

                                            }}
                                        />
                                    </Tooltip>
                                    &nbsp;
                                    <p>{bci+1}</p>
                                    &nbsp;
                                    <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                </Space>
                            </div>
                        )
                    }}
                />}
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


        const tabs = [{
            key:1,
            label:'Question text/info',
            children: <div>{renderAddQuestionBody()} </div>
        },
        {
            key:2,
            label:'Control volumes',
            children: <div>{renderControlVolumeList()}</div>
        },
        {
            key:3,
            label:'EB terms',
            children: <div>{renderEnergyBalanceTerms()}</div>
        },
        {
            key:4,
            label:'Boundary conditions',
            children: <div>{renderBoundaryConditions()}</div>
        },
        {
            key:5,
            label:'Initial conditions',
            children: <div>{renderInitialConditions()}</div>
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
                                Add  control volume
                            </Button>
                            
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => {
                                    const newTerm = ({
                                        Code:'',
                                        Latex:'',
                                        LatexText:'',

                                        North: false,
                                        South: false,
                                        East: false,
                                        West: false,
                                        Center: false,
                                        IsDummy: false,

                                        Questions:[]

                                    })

                                    let _terms = [...ebTerms]

                                    _terms.push(newTerm)

                                    setEbTerms(_terms)
                                    setCurrentSubtab(3)

                                }}
                            >
                                Add energy balance term
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
            2: () => renderQuestionContent()
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
                    ]}
            />

            <br/>
            {selectContent()}

            <SelectKeyboard 
                open={showSelectKeyboardBC || showSelectKeyboardIC}
                onClose={() => {
                    setShowSelectKeyboardBC(false)
                    setShowSelectKeyboardIC(false)
                }}
                onSelect={(k) => {
                    setShowSelectKeyboardBC(false)
                    setShowSelectKeyboardIC(false)

                    if(showSelectKeyboardBC){
                        setBCKeyboard(k)
                        setBCTerms([])
                    }

                    else if(showSelectKeyboardIC){
                        setICKeyboard(k)
                        setICTerms([])
                    }
                }}
            />

            <AddAnswersToList 
                open={showAddBCTerms || showAddICTerms}
                selectedKeyboard={showAddBCTerms ? BCKeyboard : ICKeyboard}
                existingList={showAddBCTerms ? bcTerms : icTerms}
                onClose={() => {
                    setAddBCTerms(false)
                    setAddICTerms(false)
                }}

                onUpdateList={(l) => {
                    if(showAddBCTerms){
                       let _terms = [...bcTerms, ...l]
                        
                       setBCTerms(_terms)
                    }

                    else if(showAddICTerms){
                        let _terms = [...icTerms, ...l]
                        
                       setICTerms(_terms)
                    }

                }}
            />

        </PagesWrapper>
    )
}