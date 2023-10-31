import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Button, Col, List, Popconfirm, Row, Space, Tooltip, message } from "antd";
import {PlusOutlined, PictureOutlined} from '@ant-design/icons';

import './index.css'
import { FixURL } from "../../../../services/Auxillary";

export function ClickableQuestionEditView({reloadQuestion}){

    const {clickableQuestionPlay: question} = useQuestions()
    const [api, contextHolder] = message.useMessage()
    
    const imageRef = React.createRef()

    const [showAddPart, setShowAddPart] = useState(false)
    const [showEditImage, setShowEditImage] = useState(false)

    const [imageWidth, setImageWidth] = useState(0)
    const [offset, setOffset] = useState(0)

    const [hoveredElementIndex, setHoveredElementIndex] = useState(null)

    useEffect(() => {
        let _offset = 0

        if(imageRef){
            const div = imageRef.current
            const width = div.offsetWidth 
            setImageWidth(width)
            
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
        const {Code, Base_ImageURL, BackgroundImageHeight, BackgroundImageWidth, ClickImages, ClickCharts} = question.Question

        const imageHeight = (BackgroundImageHeight/BackgroundImageWidth) * imageWidth

        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
            border:'1px solid rgb(245, 245, 245)'
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
                    height:imageHeight,
                    width:imageWidth,
                }} 

                src = {Base_ImageURL}
                alt={Code}
                />
                {ClickImages.map((p, pi) => {
                    const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p)
                    const {Answer} = p
                    const {URL} = Answer

                    return (
                        <span 

                        key={p.Id}
                        style = {{
                            ...backgroundImageStyle,
                            ...itemStyle,
                           
                            ...itemPositionStyle,

                            [p.Background_ImageId ? "backgroundImage" : ""]:
                            p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                        }}
                        onMouseEnter={() => setHoveredElementIndex(pi)}
                        onMouseLeave={() => setHoveredElementIndex(null)}

                        >
                            <Space direction="vertical" align="center">
                                <p className="default-title highlighted">{pi+1}</p>

                                <img 
                                    src={URL}
                                    alt="Answer"
                                    className="clickable-element-img"
                                />
                            </Space>
                        </span>
                    )
                })}

                {ClickCharts.map((p, pi) => {
                    const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p)
                    const {Answer} = p
                    const {URL} = Answer

                    return (
                        <span         

                        key={p.Id}
                        style = {{
                            ...backgroundImageStyle,
                            ...itemStyle,
                            
                            ...itemPositionStyle,

                            [p.Background_ImageId ? "backgroundImage" : ""]:
                            p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                        }}

                        onMouseEnter={() => setHoveredElementIndex(pi + ClickImages)}
                        onMouseLeave={() => setHoveredElementIndex(null)}
                        >
                            <Space direction="vertical" align="center">
                            <p className="default-title highlighted">{ClickImages.length + pi+1}</p>

                                <img 
                                    src={URL}
                                    alt="Answer"
                                    className="clickable-element-img"
                                />
                            </Space>
                        </span>
                    )
                })}
            </div>
        )
    }

    const renderPartsList = () => {
        const {ClickImages, ClickCharts} = question.Question
        const partsCount = ClickImages.length + ClickCharts.length
        return(
            <Space
                align="start"
                direction="vertical"
            >
                {ClickImages.length ? 
                <List 
                    dataSource={ClickImages}
                    renderItem={(c, ci) => {
                        const {Id, Answer} = c
                        const {URL} = Answer
                        return(
                            <div
                                key={Id}
                                className={(hoveredElementIndex === ci) ? "highlighted" : ""}
                            >
                                <Tooltip
                                    placement="right"
                                    color="white"
                                    title={
                                        <Space
                                            direction="vertical"
                                        >
                                            {partsCount !== 1 && 
                                            <Popconfirm
                                                title="Delete part"
                                                description="Are you sure to delete this part?"
                                                onConfirm={() => {}}
                                                onCancel={() => {}}
                                                okText="Yes"
                                                cancelText="No"
                                                placement="right"
                                            >
                                                <Button
                                                    size="small"
                                                    loading={false}
                                                    className="hq-full-width"
                                                >
                                                    Remove part 
                                                </Button>
                                            </Popconfirm>}

                                            <Button
                                                className="hq-full-width"
                                            >
                                                Edit answer
                                            </Button>

                                            <Button
                                                className="hq-full-width"
                                            >
                                                Edit background image
                                            </Button>
                                        </Space>
                                    }
                                >
                                <Space>
                                    <p>{ci + 1}</p>
                                    <img 
                                        className="clickable-question-edit-view-part-img"
                                        alt={"part-"+ci}
                                        src={URL}
                                    />
                                </Space>
                                </Tooltip>
                            </div>
                        )
                    }}
                /> : <div/>}

                {ClickCharts.length ?
                <List 
                    dataSource={ClickCharts}
                    renderItem={(c, ci) => {
                        const {Id, Answer} = c
                        const {URL} = Answer
                        return(
                            <div
                                key={Id}
                                className={(hoveredElementIndex === (ci + ClickImages.length)) ? "highlighted" : ""}
                            >
                                <Space>
                                    <p>{ci+ClickImages.length}</p>
                                    <img 
                                        className="clickable-question-edit-view-part-img"
                                        alt={"part-"+ci}
                                        src={URL}
                                    />
                                </Space>
                            </div>
                        )
                    }}
                /> : <div/>}
            </Space>
        )
    }

    return(
        <div>
            {contextHolder}
            <Row
                gutter={12}
            >
                <Col 
                    xs={10}
                    ref={imageRef}
                >
                    {renderQuestionImage()}
                </Col>
                <Col
                    xs ={1}
                >
                </Col>
                <Col
                    xs ={12}
                >
                    {renderPartsList()}
                </Col>
                <Col
                    xs ={1}
                >
                    <Space
                    align="end"
                    direction="vertical">
                        <Tooltip
                            color="white"
                            title={<p>Add clickable part</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowAddPart(true)}
                            >
                                <PlusOutlined style={{color:'green'}} />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            color="white"
                            title={<p>Update image</p>}
                            placement="left"
                        >
                            <Button
                                onClick={() => setShowEditImage(true)}
                            >
                                 <PictureOutlined />
                            </Button>
                        </Tooltip>
                    </Space> 
                </Col>
            </Row>
        </div>
    )
}