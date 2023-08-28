import { Button, Divider, Drawer, Spin, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';

import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64 } from "../../services/Auxillary";
import Dragger from "antd/es/upload/Dragger";

import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";

export function EditImagePicture({open, onClose, node}){
    console.log(node)
    const {loadingEditImagePicture, getEditImagePictureError, editImagePicture, getAllInterpretedTrees} = useInterpretedTrees()
    
    const [messageApi, contextHolder] = message.useMessage();
    
    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);


    useEffect(() => {
        if(getEditImagePictureError){
            messageApi.destroy()
            messageApi.error(getEditImagePictureError)
        }
    }, [getEditImagePictureError])

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
          setLoadingImage(true);
          return;
        }
    
        if (info.file.status === 'done') {

            getBase64(info.file.originFileObj, (url) => {
            setLoadingImage(false);
            setNewImageURL(url);
            setNewImage(info.file.originFileObj);
          });
        }
    };


    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit Node Image"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{
                paddingBottom: 80,
                }}
                closeIcon={<ArrowLeftOutlined />}
            >   
                <div className="tree-picture-uploader">
                    <Dragger  
                        customRequest={dummyRequest}
                        accept={ALLOWED_IMAGE_EXTENSIONS}
                        onChange={handleChange}
                        showUploadList={false}
                    >
                        {!newImageURL && <>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </>}
                        {loadingImage && <Spin size="small"/>}
                        {newImageURL && 
                        <img 
                            src={newImageURL}
                            className="new-tree-picture"
                            alt="course"
                        />}
                    </Dragger>
                </div>
                <br/>

                <Button 
                    type="primary"
                    onClick={() => {
                        if(!newImage){
                            messageApi.destroy()
                            messageApi.warning('Please upload a new image')
    
                            return
                        }
                       
                        let data = new FormData()
                        data.append('Picture', newImage)
                        data.append('ImageId', node.Id)

                        editImagePicture(data).then(() => getAllInterpretedTrees())

                        
                    }}
                    loading = {loadingEditImagePicture}
                >
                Update
                </Button>
                <Divider />
                <small className="edit-image-tree-node-word">Node </small>
                <p className="edit-image-tree-node-code">
                    {(node || {}).Code} 
                </p>
            </Drawer>
        </div>
    )
}