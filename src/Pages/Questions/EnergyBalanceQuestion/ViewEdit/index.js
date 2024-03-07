import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, Divider, Dropdown, List, Row, Space, Tabs, Tooltip, message } from "antd";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { FixURL, handleResponse } from "../../../../services/Auxillary";
import { ControlOutlined, InsertRowAboveOutlined, PlusOutlined } from '@ant-design/icons';
import './index.css'
import { UpdateControlVolumeImage } from "./UpdateControlVolumeImage";
import { UpdateEBTermCodeLatex } from "./UpdateEBTermCodeLatex";
import { UpdateEBTermLatexText } from "./UpdateEBTermLatexText";
import { UpdateEBTermDirections } from "./UpdateEBTermDirections";
import { UpdateEBTermQuestionLatex } from "./UpdateEBTermQuestionLatex";
import { AddEbTermQuestion } from "./AddEbTermQuestion";
import { AddEbTerm } from "./AddEbTerm";
import { SetKeyboardBCIC } from "./SetKeyboardBCIC";

export function EnergyBalanceQuestionEditView({reloadQuestion}){

    const {energyBalanceQuestionPlay: question,
        editEnergyBalanceControlVolumeStatus,
    } = useQuestions()

    const imageRef = React.createRef()
    const imageRef2 = React.createRef()
    const [offset, setOffset] = useState(0)

    const [api, contextHolder] = message.useMessage()

    const [currentTab, setCurrentTab] = useState(1)

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [isMovingElement, setIsMovingElement] = useState(false)
    const [movedElement, setMovedElement] = useState(false)

    const [leftOffset, setLeftOffset] = useState(0)

    const [newParts, setNewParts] = useState([])

    const [showEditCVImage, setShowEditCVImage] = useState(false)
    const [selectedCV, setSelectedCV] = useState(null)

    const [showEditTermCodeLatex, setShowEditTermCodeLatex] = useState(false)
    const [showEditTermLatexText, setShowEditTermLatexText] = useState(false)
    const [showEditTermDirections, setShowEditTermDirections] = useState(false)

    const [selectedEBTerm, setSelectedEBTerm] = useState(null)

    const [showEditTermQuestionLatex, setShowEditTermQuestionLatex] = useState(false)
    const [selectedEBTermQuestion, setSelectedEBTermQuestion] = useState(null)

    const [showAddTermQuestion, setShowAddTermQuestion] = useState(false)
    const [showAddTerm, setShowAddTerm] = useState(false)

    const [showSetKeyboardBCIC, setShowKeyboardBCIC] = useState(false)
    const [showSetKeyboardBCIC_IsBC, setShowKeyboardBCIC_IsBC] = useState(false)

    useEffect(() => {
        let _offset = 0

        if(imageRef){
            const div = imageRef.current
            
            _offset = parseInt(window.getComputedStyle(div).paddingRight.replace('px',''))

            setOffset(_offset)

        }
    }, [imageRef])

  
    const renderQuestionImage = () => {
        const {Code, Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height,} = question
        
        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
            border:'1px solid rgb(245, 245, 245)',
            cursor:'crosshair'
        })

        const itemStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
            position: 'absolute',
            border:'1px solid rgb(245, 245, 245)',
            cursor:'pointer'
           
        })

        return(
            <div>
                <img
                style = {{
                    ...backgroundImageStyle,
                    height:Base_ImageURL_Height,
                    width:Base_ImageURL_Width,
                }} 

                src = {Base_ImageURL}
                alt={Code}

                ref={imageRef2}

                onClick={(e) => {
                    if(!(isAddingElement || isMovingElement)) return;

                    e.persist()

                    const {pageX, pageY} = e

                    const imgRef2 = imageRef2.current
                    const parentNode = imgRef2.parentNode.parentNode
                    const styles = window.getComputedStyle(parentNode)
                    const offset = Number(styles.getPropertyValue('padding-right').replace('px', ''))

                    setLeftOffset(offset)

                    const {top, left} = imgRef2.getBoundingClientRect()
                                
                    if(!isAddingElementSecond  && !isMovingElement){

                        let newPart = ({
                            x: pageX - left + offset,
                            y: pageY - top,
                            offsetX: offset,
                            width: 1,
                            height: 1,
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
                />
               
            
            </div>
        )
    }

    const calculateCPdimensions = (imageWidth, imageHeight,specificedWidth, specificedHeight, element, Offset=0) => {
        return({            
            width: (element.Width)  * (specificedWidth/imageWidth),
            height: (element.Height)* (specificedHeight/imageHeight),
            left: (element.X) * (specificedWidth/imageWidth)  - 10,
            top: (element.Y) * (specificedHeight/imageHeight),
        })
    }

    const renderControlVolumeList = () => {
        const {ControlVolumes, Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL} = question
     
        const smallImageWidth = window.innerWidth * 0.20
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

        return(
            <div>
                <List 
                    dataSource={ControlVolumes.sort((a, b) => a.Id - b.Id)}

                    renderItem={(cv, cvi) => {
                        const {Id, Correct} = cv
                        const cvDimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, cv)

                        return(
                            <div
                                key={Id}
                            >
                                <Space align="start">
                                    <p className={Correct ? "default-green" : "default-gray"}>{cvi+1}</p>

                                    &nbsp;
                                    &nbsp;
                                    <p className={Correct ? "default-green" : "default-white"}>Correct</p>
                                    &nbsp;
                                    &nbsp;

                                    <div 
                                        style = {{
                                            height:smallImageHeight,
                                            width: smallImageWidth,
                                            backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                                            backgroundPosition:'center',
                                            backgroundRepeat:'no-repeat',
                                            backgroundSize:'contain',
                                            border:'1px solid gainsboro'
                                        }}
                                    >
                                        <div style={{...cvDimesions, position:'relative', border:Correct ? '1px dashed #28a745' : '1px dashed gray' }}>
                                            <div style={{width:'100%', height:'100%', backgroundColor:'#f1f4f8', opacity:'40%'}}></div>
                                        </div>    
                                    </div>

                                    <Dropdown
                                        menu={{
                                            items:[
                                            {
                                                key: 'set_as_correct',
                                                label: 'Set as correct',
                                                onClick: () => {
                                                    let data = new FormData()
                                                    data.append('Id', cv.Id)

                                                    editEnergyBalanceControlVolumeStatus(data).then((r) => handleResponse(r, api, 'Updated', 1, () => {
                                                        reloadQuestion()
                                                    }))
                                                }
                                            },
                                            {
                                                key: 'set_update_image',
                                                label: 'Set/Update image',
                                                onClick: () => {
                                                    setShowEditCVImage(true)
                                                    setSelectedCV({...cv, smallImageWidth, smallImageHeight, dimensions:cvDimesions, Base_ImageURL})
                                                }
                                            },
                                            {
                                                key: 'delete_cv',
                                                label: 'Delete',
                                                onClick: () => {}
                                            }],
                                            title:'Actions'
                                        }}
                                    >
                                        <ControlOutlined className="default-gray hoverable"/>
                                    </Dropdown>
                                </Space>
                                <br/>
                                <br/>
                            </div>
                        )
                    }}

                />
            </div>
        )
    }

    const renderItemBox = (t) => {
        const {Id, North: isNorthSelected, East: isEastSelected, West: isWestSelected, South: isSouthSelected, Center: isCenterSelected} = t

        const totalWidthHeight = 0.03*window.innerWidth
        const shapesGap = 0.1*totalWidthHeight
        const width1 = 0.125 * totalWidthHeight
        const width2 = totalWidthHeight - 2 * shapesGap - 2 * width1

        let selectedColor = 'rgba(2, 117, 216, 0.5)'

        const notSelectedStyle = {backgroundColor:'#f1f4f8', border:'1px solid #e6e6e6',}
        const selectedStyle = {backgroundColor:selectedColor, border:'1px solid #0275d8',} 

        return(
            <Space 
            key={Id}
            direction="vertical">
                <div style={{flexDirection:'row', display:'flex', width: totalWidthHeight, height:totalWidthHeight}}>
                
                    <div 
                        style={{width:width1, height: width2, marginRight:shapesGap, marginTop: (shapesGap + width1), ...(isEastSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* East */}
                    </div>

                    <div style={{width:width2, height: totalWidthHeight, marginRight:shapesGap}}>
                        <div 
                            style={{width:width2, height: width1, marginBottom:shapesGap, ...(isNorthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* North */}
                        </div>

                        <div
                            style={{width:width2, height: width2, marginBottom:shapesGap, ...(isCenterSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* Center */}
                        </div>

                        <div 
                            style={{width:width2, height: width1, ...(isSouthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* South */}
                        </div>
                    </div>

                    <div 
                        style={{width:width1, height: width2, marginTop: (shapesGap + width1), ...(isWestSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* West */}
                    </div>
                </div>
            </Space>
        )

    }

    const renderEnergyBalanceTerms = () => {
        const {EnergyBalanceTerms} = question

        return(
            <div>
                <Tooltip
                    color="white"
                    title={<p>Add new energy balance term</p>}
                >
                    <Button
                        size="small"
                        onClick={() => {
                            setShowAddTerm(true)
                        }}

                        icon={<PlusOutlined style={{color:'green'}}/>}
                    >
                        Add
                    </Button>
                </Tooltip>

                <br/>
                <br/>
                <List 
                    dataSource={EnergyBalanceTerms}

                    renderItem={(t, ti) => {
                        const {Id, Code, Latex, LatexText, Questions} = t

                        return(
                            <div
                                key={Id}
                                className="hq-element-container"
                            >
                                    <Space
                                        className="hq-full-width hq-opposite-arrangement"
                                    >
                                        <Space>
                                            <p className="default-title">{ti+1}</p>
                                            {renderItemBox(t)}
                                            <p className="default-title">{Code}</p>
                                            <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                        </Space>

                                        <Dropdown
                                        menu={{
                                            items:[
                                            {
                                                key: 'edit_code',
                                                label: 'Update code/LaTeX',
                                                onClick: () => {
                                                    setShowEditTermCodeLatex(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'edit_text',
                                                label: 'Update LaTeX text',
                                                onClick: () => {
                                                    setShowEditTermLatexText(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'edit_directions',
                                                label: 'Update directions',
                                                onClick: () => {
                                                    setShowEditTermDirections(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'set_dummy',
                                                label: 'Set as dummy',
                                                onClick: () => {}
                                            },
                                            {
                                                key: 'add_question',
                                                label: 'Add question',
                                                onClick: () => {
                                                    setShowAddTermQuestion(true)
                                                    setSelectedEBTerm(t)
                                                }
                                            },
                                            {
                                                key: 'delete_eb_term',
                                                label: 'Delete',
                                                onClick: () => {}
                                            }],
                                            title:'Actions'
                                        }}
                                    >
                                        <ControlOutlined className="default-gray hoverable"/>
                                    </Dropdown>
                                </Space>
                                    

                                <Divider/>

                                <small className="default-gray">
                                    Optional text
                                </small>
                                <p>{LatexText}</p>

                                <Divider/>
                                {Questions.map((q, qi) => {
                                    const {Id, LatexCode, Inflow, Keyboard, Answers} = q

                                    return(
                                        <Space
                                            key={Id}
                                            direction="vertical hq-full-width "
                                        >   
                                            <Space
                                                className="hq-full-width hq-opposite-arrangement"
                                            >
                                                <Space>
                                                    <p className="default-gray">{qi+1}</p>
                                                    {Inflow ? 
                                                        <div
                                                        className={"eb-question-view-edit-term-direction-green"}>
                                                            <span className="eb-question-view-edit-term-word">Inflow</span>
                                                        </div>
                                                        :
                                                        <div 
                                                        className={"eb-question-view-edit-term-direction-red"}>
                                                            <span className="eb-question-view-edit-term-word">Outflow</span>
                                                        </div>}
                                                    
                                                    <LatexRenderer latex={"$$" + LatexCode  + "$$"} />
                                                </Space>
                                                <Dropdown
                                                    menu={{
                                                        items:[{
                                                            key: 'edit_latex',
                                                            label: 'Update LaTeX',
                                                            onClick: () => {
                                                                setShowEditTermQuestionLatex(true)
                                                                setSelectedEBTermQuestion(q)
                                                            }
                                                        },
                                                        {
                                                            key: 'flip_flow',
                                                            label: 'Flip flow direction',
                                                            onClick: () => {
                                                              
                                                            }
                                                        },
                                                        {
                                                            key: 'delete',
                                                            label: 'Delete',
                                                            onClick: () => {
                                                               
                                                            }
                                                        }],
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <ControlOutlined className="default-gray hoverable"/>
                                                </Dropdown>
                                            </Space>
                                            <Space>
                                                <InsertRowAboveOutlined />
                                                <p> {Keyboard.Name} </p>
                                            </Space>
                                            {Answers.map((a, ai) => {

                                                const answerReduced = a.AnswerElements
                                                .sort((c,d) => c.Id > d.Id ? 1 : -1)
                                                .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                                                return(
                                                    <div
                                                        key={ai}
                                                        style={{width:'fit-content'}}
                                                    >
                                                        <LatexRenderer latex={"$$" + answerReduced + "$$"}/>
                                                    </div>
                                                )
                                            })}
                                            <br/>
                                        </Space>
                                    )
                                })}
                            </div>
                        )
                    }}
                />
            </div>
        )
    }

    const renderBoundaryConditions = () => {
        const {BoundaryConditionKeyboard} = question
        return(
            <div>
                <Space size={'large'}>
                    {BoundaryConditionKeyboard && 
                    <Space>
                        <InsertRowAboveOutlined className="default-title"/>
                        <p> {BoundaryConditionKeyboard.Name} </p>
                    </Space>}
                    {BoundaryConditionKeyboard && 
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                    }
                    <Button
                        size="small"
                        onClick={() => {
                            setShowKeyboardBCIC(true)
                            setShowKeyboardBCIC_IsBC(true)
                        }}
                    >
                        {!BoundaryConditionKeyboard && <InsertRowAboveOutlined className="default-title"/>}
                        Update keyboard
                    </Button>
                </Space>
            </div>
        )
    }

    const renderContent = () => {
        const {Question} = question
        const tabs = [
            {
                key:1,
                label:"Control volumes",
                children: <div>{renderControlVolumeList()}</div>
            },{
                key:2,
                label:"Energy balance terms",
                children: <div>{renderEnergyBalanceTerms()}</div>
            },{
                key:3,
                label:"Boundary conditions",
                children: <div>{renderBoundaryConditions()}</div>
            },{
                key:4,
                label:"Initial conditions",
                children: <div></div>
            }]

        return(
            <div>
                <Space
                direction="vertical"
                align="start" size={'large'}>
                    <p className="default-gray">Question</p>

                    <LatexRenderer 
                        latex={Question || ""}
                    />
                </Space>    

                <br/>
                <br/>
                <br/>
                <Tabs
                    defaultActiveKey={1}
                    items={tabs}
                    onChange={(t) => setCurrentTab(t)}
                    activeKey={currentTab}
                />
            </div>
        )
    }

    return(
        <div>
            {contextHolder}
            <Row
                gutter={12}
            >
                <Col
                    ref = {imageRef}
                >
                    {renderQuestionImage()}
                </Col>

                <Col xs={1}/>
                <Col
                    xs ={12}
                >
                    {renderContent()}
                </Col>
            </Row>

            <UpdateControlVolumeImage
                open={showEditCVImage}
                onClose={() => setShowEditCVImage(false)}
                controlVolume={selectedCV}
            />

            <UpdateEBTermCodeLatex 
                open={showEditTermCodeLatex}
                onClose={() => setShowEditTermCodeLatex(false)}
                ebTerm={selectedEBTerm}
            />

            <UpdateEBTermLatexText 
                open={showEditTermLatexText}
                onClose={() => setShowEditTermLatexText(false)}
                ebTerm={selectedEBTerm}
            />

            <UpdateEBTermDirections 
                open={showEditTermDirections}
                onClose={() => setShowEditTermDirections(false)}
                ebTerm={selectedEBTerm}
            />

            <UpdateEBTermQuestionLatex 
                open={showEditTermQuestionLatex}
                onClose={() => setShowEditTermQuestionLatex(false)}
                ebTermQuestion={selectedEBTermQuestion}
            />

            <AddEbTermQuestion 
                open={showAddTermQuestion}
                onClose={() => setShowAddTermQuestion(false)}
                ebTerm={selectedEBTerm}
            />

            <AddEbTerm 
                open={showAddTerm}
                onClose={() => setShowAddTerm(false)}
            />

            <SetKeyboardBCIC 
                open={showSetKeyboardBCIC}
                onClose={() => setShowKeyboardBCIC(false)}
                IsBC={showSetKeyboardBCIC_IsBC}
            />
        </div>
    )
}