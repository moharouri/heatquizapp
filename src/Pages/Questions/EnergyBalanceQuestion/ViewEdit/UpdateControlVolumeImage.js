import React, { useState } from "react";
import {Alert, Button, Drawer, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { UploadImage } from "../../../../Components/UploadImage";
import { FixURL } from "../../../../services/Auxillary";

export function UpdateControlVolumeImage({open, onClose, controlVolume}) {

    if(!open) return <div/>;

    const [api, contextHolder] = message.useMessage()

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const {Correct, Base_ImageURL, smallImageHeight, smallImageWidth, dimensions} = controlVolume

    return(
        <Drawer
        title="Update Control Volume Image"
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
                <Alert 
                    message={<p>Uploaded image dimensions <u>should</u> the same as the main question image and will <strong>not</strong> update to the new image!</p>}
                    type=""
                /> 
                    
                <br/>
                <UploadImage
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)

                    }}

                    imageURL={newImageURL}

                    className="eb-question-add-cv-image-container"
                    classNameImage="eb-question-add-cv-image-inside"
                />

                <br/>

                <p>Control volume & current image</p>
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
                    <div style={{...dimensions, position:'relative', border:Correct ? '1px dashed #28a745' : '1px dashed gray' }}>
                        <div style={{width:'100%', height:'100%', backgroundColor:'#f1f4f8', opacity:'40%'}}></div>
                    </div>    
                </div>
            </div>
    </Drawer>
    )
}