import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Col, Row, Space, Tabs, message } from "antd";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function EnergyBalanceQuestionEditView({reloadQuestion}){

    const {energyBalanceQuestionPlay: question} = useQuestions()

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

    useEffect(() => {
        let _offset = 0

        if(imageRef){
            const div = imageRef.current
            
            _offset = parseInt(window.getComputedStyle(div).paddingRight.replace('px',''))

            setOffset(_offset)

        }
    }, [imageRef])

    const getItemPositionStyle = (imageWidth, BackgroundImageWidth, p) => ({
        width: ((imageWidth * p.Width)/BackgroundImageWidth),
        height: ((imageWidth * p.Height)/BackgroundImageWidth),
        left: ((imageWidth * p.X)/BackgroundImageWidth) - offset,
        top:  ((imageWidth * p.Y)/BackgroundImageWidth),
    })

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

    const renderControlVolumeList = () => {
        return(
            <div>

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
                children: <div></div>
            },{
                key:3,
                label:"Boundary conditions",
                children: <div></div>
            },{
                key:4,
                label:"Initial conditions",
                children: <div></div>
            }]

        return(
            <div>
                <Space align="start" size={'large'}>
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
        </div>
    )
}