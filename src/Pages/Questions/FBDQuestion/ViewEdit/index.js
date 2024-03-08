import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Col, Divider, Dropdown, List, Row, Space, Tabs, message } from "antd";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { FixURL } from "../../../../services/Auxillary";
import { ControlOutlined, InsertRowAboveOutlined } from '@ant-design/icons';
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { UpdateVTCodeLatex } from "./UpdateVTCodeLatex";
import { UpdateVTLatexText } from "./UpdateVTLatexText";
import { UpdateVTAssociation } from "./UpdateVTAssociation";
import { UpdateVTAngle } from "./UpdateVTAngle";
import { UpdateVTColor } from "./UpdateVTColor";
import { UpdateOBColor } from "./UpdateOBColor";
import { calculateCPdimensions } from "./Functions";

export function FBDQuestionEditView({reloadQuestion}){

    const {FBDQuestionPlay: question} = useQuestions()


    const imageRef = React.createRef()
    const imageRef2 = React.createRef()
    const [offset, setOffset] = useState(0)
    const [leftOffset, setLeftOffset] = useState(0)

    const [newParts, setNewParts] = useState([])
    
    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)

    const [isMovingElement, setIsMovingElement] = useState(false)
    const [movedElement, setMovedElement] = useState(false)

    const [api, contextHolder] = message.useMessage()
    const [currentTab, setCurrentTab] = useState(1)

    const [showEditTermCodeLatex, setShowEditTermCodeLatex] = useState(false)
    const [showEditTermLatexText, setShowEditTermLatexText] = useState(false)
    const [showEditTermAssociation, setShowEditTermAssociation] = useState(false)
    const [showEditTermColor, setShowEditTermColor] = useState(false)

    const [selectedVTTerm, setSelectedVTTerm] = useState(null)


    const [showEditOBColor, setShowEditOBColor] = useState(false)
    const [selectedOB, setSelectedOB] = useState(null)

    useEffect(() => {
        let _offset = 0

        if(imageRef){
            const div = imageRef.current
            
            _offset = parseInt(window.getComputedStyle(div).paddingRight.replace('px',''))

            setOffset(_offset)

        }
    }, [imageRef])

    const renderQuestionImage = () => {
        const {Code, Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height, ObjectBodies} = question
        
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
               {ObjectBodies.map((o, oi) => {
                const dimesions = calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL_Width, Base_ImageURL_Height, o )
                const {Id, Color} = o
                return(
                    <div
                    key={Id}
                    style={{...dimesions, position:'absolute', border:'1px solid #28a745' }}>
                        <div style={{width:'100%', height:'100%', backgroundColor:Color}}></div>
                    </div>    
                )
               })}
            
            </div>
        )
    }

    const renderOBs = () => {
        const {ObjectBodies, Base_ImageURL_Height, Base_ImageURL_Width, Base_ImageURL} = question

        const smallImageWidth = window.innerWidth * 0.2
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

        return(
            <div>
                <List 
                    dataSource={ObjectBodies}
                    renderItem={(o, oi) => {
                        const {Id, Color} = o

                        const dimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, o)

                        return(
                            <div
                                className="hq-full-width"
                                key={Id}
                            >
                                <Space
                                    align="start"
                                >
                                    <p className="default-gray">{oi+1}</p>

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
                                        <div style={{...dimesions, position:'relative', border:'1px solid #28a745' }}>
                                            <div style={{width:'100%', height:'100%', backgroundColor:Color,}}></div>
                                        </div>    
                                    </div>

                                    <Dropdown
                                        menu={{
                                            items:[
                                            {
                                                key: 'edit_color',
                                                label: 'Update color',
                                                onClick: () => {
                                                    setShowEditOBColor(true)
                                                    setSelectedOB(o)
                                                }
                                            },
                                            {
                                                key: 'delete_ob',
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

    const renderVTs = () => {
        const {ObjectBodies, Base_ImageURL_Height, Base_ImageURL_Width, Base_ImageURL} = question

        const VTs = ObjectBodies.map(a => a.VectorTerms).flat()

        const smallImageWidth = window.innerWidth * 0.10
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth
        return(
            <div>
                <List 
                    dataSource={VTs}

                    renderItem={(vt, vti) => {
                        console.log(vt)
                        const {Id, Code, ArrowColor, Latex, LatexText, Keyboard, Answers, Linear, Angle, BodyObjectId} = vt

                        const OB = ObjectBodies.filter(a => a.Id === BodyObjectId)[0]

                        const dimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, OB)

                        return(
                            <div
                                key={Id}
                                className="hq-full-width hq-element-container"    
                            >
                                <Space
                                    className="hq-full-width hq-opposite-arrangement"
                                    align="start"
                                >
                                    <Space size={"large"} align="start">
                                        <p>{vti+1}</p>
                                        <div>
                                            <p className="default-title">{Code}</p>
                                            <LatexRenderer latex={"$$" + Latex + "$$"} />
                                        </div>
                                        &nbsp;
                                        &nbsp;
                                        {Linear ? 
                                        <VectorDirectionComponent 
                                            angleStep={5}
                                            currentAngle={Angle}
                                            widthHeight={0.03*window.innerWidth}
                                            onUpdateAngle={(a) => {
                                                
                                            }}
                                        /> : <div/>}
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
                                            <div style={{...dimesions, position:'relative', border:'1px solid #28a745' }}>
                                                <div style={{width:'100%', height:'100%', backgroundColor:OB.Color,}}></div>
                                            </div>    
                                        </div>
                                        &nbsp;
                                        &nbsp; 
                                        &nbsp;
                                        &nbsp;
                                    <div>
                                        <p className="default-gray">Arrow color</p>
                                        <div style={{width: '100%', height: 4, backgroundColor: ArrowColor}}/>
                                    </div>

                                    </Space>
                                    <Dropdown
                                        menu={{
                                            items:[{
                                                key: 'edit_latex',
                                                label: 'Update Code/LaTeX',
                                                onClick: () => {
                                                    setShowEditTermCodeLatex(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },
                                            {
                                                key: 'edit_latex_text',
                                                label: 'Update LaTeX text',
                                                onClick: () => {
                                                    setShowEditTermLatexText(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },
                                            {
                                                key: 'edit_association',
                                                label: 'Update association',
                                                onClick: () => {
                                                    setShowEditTermAssociation(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },{
                                                key: 'edit_color',
                                                label: 'Update color',
                                                onClick: () => {
                                                    setShowEditTermColor(true)
                                                    setSelectedVTTerm(vt)
                                                }
                                            },{
                                                key: 'edit_angle',
                                                label: Linear ? 'Update angle' : 'Flip direction',
                                                onClick: () => {}
                                            },
                                            {
                                                key: 'delete',
                                                label: 'Delete',
                                                onClick: () => {}
                                            }],
                                                        title:'Actions'
                                        }}
                                        >
                                            <ControlOutlined className="default-gray hoverable"/>
                                        </Dropdown>
                                </Space>
                                <Divider />
                                <small className="default-gray">
                                    Optional text
                                </small>
                                <p>{LatexText}</p>
                                <Divider />
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
                            </div>
                        )
                    }}
                />
            </div>
        )
    }

    const renderContent = () => {
        const {QuestionText} = question

        const tabs = [
            {
                key:1,
                label:"Object bodies",
                children: <div>{renderOBs()}</div>
            },{
                key:2,
                label:"Vector terms",
                children: <div>{renderVTs()}</div>
            }]

        return(
            <div>
                <p className="default-gray">Question</p>
                <LatexRenderer latex={QuestionText || ""} />

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

            <UpdateVTCodeLatex 
                open={showEditTermCodeLatex}
                onClose={() => setShowEditTermCodeLatex(false)}
                vtTerm={selectedVTTerm}
            />

            <UpdateVTLatexText 
                open={showEditTermLatexText}
                onClose={() => setShowEditTermLatexText(false)}
                vtTerm={selectedVTTerm}
            />

            <UpdateVTAssociation 
                open={showEditTermAssociation}
                onClose={() => setShowEditTermAssociation(false)}
                vtTerm={selectedVTTerm}
                question={question}
            />

            <UpdateVTColor
                open={showEditTermColor}
                onClose={() => setShowEditTermColor(false)}
                vtTerm={selectedVTTerm}
                question={question}
            />

            <UpdateOBColor 
                open={showEditOBColor}
                onClose={() => setShowEditOBColor(false)}
                OB={selectedOB}
                question={question}
            />
        </div>
    )
}