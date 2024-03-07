import React, {useEffect, useState } from "react";
import {Button, Drawer, List, Space, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { FixURL } from "../../../../services/Auxillary";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import './index.css'

export function UpdateVTAssociation({open, onClose, vtTerm, question}) {

    if(!open) return <div/>;
    const [selectedOB, setSelectedOB] = useState(null)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const OB = ObjectBodies.filter(a => a.Id === vtTerm.BodyObjectId)[0]
            setSelectedOB(OB)
        }
    }, [open])

    const calculateCPdimensions = (imageWidth, imageHeight,specificedWidth, specificedHeight, element, Offset=0) => {
        return({            
            width: (element.Width)  * (specificedWidth/imageWidth),
            height: (element.Height)* (specificedHeight/imageHeight),
            left: (element.X) * (specificedWidth/imageWidth)  - 10,
            top: (element.Y) * (specificedHeight/imageHeight),
        })
    }

    const {Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height, ObjectBodies} = question
    const {Linear, Code, Latex, Angle} = vtTerm

    const smallImageWidth = window.innerWidth * 0.10
    const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

    return(
        <Drawer
        title={
            <Space size={"large"}>
                <p>Update Vector Term Association</p>

                <Button
                    size="small"
                    type="primary"
                    onClick={() => {}}
                >
                    Update
                </Button>
            </Space>
        }
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <div>
            <Space size={"large"} align="start">
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
                        onUpdateAngle={(a) => {}}
                /> : <div/>}
            </Space>
            <br/>
            <List 
                    dataSource={ObjectBodies}
                    renderItem={(o, oi) => {
                        const {Id, Color} = o

                        const dimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, o)

                        const isSelected = selectedOB && selectedOB.Id === Id

                        return(
                            <div
                                key={Id}
                            >
                                <Space
                                    align="start"
                                    className={"edit-fbd-vt-term-association-ob clickable hoverable " + (isSelected ? "highlighted default-title" : "")}
                                    onClick={() => setSelectedOB(o)}
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
                                </Space>
                                <br/>
                                <br/>
                            </div>
                        )
                    }}
                />
            </div>
        <br/>
        <Button 
            size="small"
            type="primary"
            onClick={() => {

            }}
        >
            Update
        </Button>
    </Drawer>
    )
}