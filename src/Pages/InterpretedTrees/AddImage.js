import { Button, Col, Divider, Drawer, Form, Input, Row, Select, Spin, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';

import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64 } from "../../services/Auxillary";
import Dragger from "antd/es/upload/Dragger";

import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";

export function AddImage({open, onClose, baseTree}){
    const {loadingAddImage, getAddImageError, addImage, getAllInterpretedTrees, 
        interpretedValues, errorGetInterpretedValues, isLoadingInterpretedValues, getAllInterpretedValues,
    } = useInterpretedTrees()
    
    

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')
    
    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

    const [selectedLeft, setSelectedLeft] = useState(null)
    const [selectedRight, setSelectedRight] = useState(null)
    const [selectedRatio, setSelectedRatio] = useState(null)
    const [selectedJump, setSelectedJump] = useState(null)

    useEffect(() => {
        getAllInterpretedValues()
    }, [open])

    useEffect(() => {
        if(errorGetInterpretedValues){
            messageApi.destroy()
            messageApi.error(errorGetInterpretedValues)
        }
    }, [errorGetInterpretedValues])

    useEffect(() => {
        if(getAddImageError){
            messageApi.destroy()
            messageApi.error(getAddImageError)
        }
    }, [getAddImageError])

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


    const renderChooseValues = () => {
         const {Left, Right, Jump, RatioOfGradients} = interpretedValues

         return(
            <Row 
            gutter={16}>
                <Col xs = {3}>
                    <small>Left</small>
                    <Select
                        onChange={(v, option) => {
                            const findOption = interpretedValues.Left.filter(v => v.Id === option.value)[0]

                            setSelectedLeft(findOption)
                        }}
                        defaultValue={'select'}
                        value={(selectedLeft || {Value:'select'}).Value}
                        className="add-interpreted-images-values-bar"
                        options={
                        Left.map((d) => ({
                            value: d.Id,
                            label: d.Value
                        }))
                    }
                    />
                </Col>
                <Col xs = {3}>
                    <small>Right</small>
                    <Select
                        onChange={(v, option) => {
                            const findOption = interpretedValues.Right.filter(v => v.Id === option.value)[0]

                            setSelectedRight(findOption)
                        }}
                        defaultValue={'select'}
                        value={(selectedRight || {Value:'select'}).Value}
                        className="add-interpreted-images-values-bar"
                        options={
                            Right.map((d) => ({
                            value: d.Id,
                            label: d.Value
                        }))
                    }
                    />
                </Col>
                <Col xs = {3}>
                    <small>Jump</small>
                    <Select
                        onChange={(v, option) => {
                            const findOption = interpretedValues.Jump.filter(v => v.Id === option.value)[0]

                            setSelectedJump(findOption)
                        }}
                        defaultValue={'select'}
                        value={(selectedJump || {Value:'select'}).Value}
                        className="add-interpreted-images-values-bar"
                        options={
                            Jump.map((d) => ({
                            value: d.Id,
                            label: d.Value
                        }))
                    }
                    />
                </Col>
                <Col xs = {3}>
                    <small>Ratio</small>
                    <Select
                        onChange={(v, option) => {
                            const findOption = interpretedValues.RatioOfGradients.filter(v => v.Id === option.value)[0]

                            setSelectedRatio(findOption)
                        }}
                        defaultValue={'select'}
                        value={(selectedRatio || {Value:'select'}).Value}
                        className="add-interpreted-images-values-bar"
                        options={
                            RatioOfGradients.map((d) => ({
                            value: d.Id,
                            label: d.Value
                        }))
                    }
                    />
                </Col>
            </Row>
         )
    }


    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add Image"}
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
                <Form>
                    <Form.Item>
                        <small>Name</small>
                        <Input 
                        placeholder="New name"
                        value={newName}
                        onChange={(v) => setNewName(v.target.value)}
                         
                        />
            
                    </Form.Item>
                </Form>

                {isLoadingInterpretedValues && <Spin />}
                {!isLoadingInterpretedValues && interpretedValues && renderChooseValues()}
                <br/>

                <Button 
                    type="primary"
                    onClick={() => {
                        if(!newImage){
                            messageApi.destroy()
                            messageApi.warning('Please upload a new image')
    
                            return
                        }

                        if(!newName.trim()){
                                messageApi.destroy()
                                messageApi.warning('Please add name')
                        }

                        if(!(selectedLeft && selectedRight && selectedRatio && selectedJump)){
                            messageApi.destroy()
                            messageApi.warning('Please select values')
                    }
                       
                        let data = new FormData()
                        data.append('Name', newName)
                        data.append('Picture', newImage)
                        data.append('GroupId', baseTree.Id)

                        data.append('LeftId', selectedLeft.Id)
                        data.append('RightId', selectedRight.Id)
                        data.append('RatioId', selectedRatio.Id)
                        data.append('JumpId', selectedJump.Id)

                        addImage(data).then(() => getAllInterpretedTrees())

                        
                    }}
                    loading = {loadingAddImage}
                >
                Add
                </Button>
                <Divider />
                <small className="add-image-tree-tree-word">Tree </small>
                <p className="tree-name-add-image-tree">
                    {(baseTree || {}).Name} 
                </p>
            </Drawer>
        </div>
    )
}