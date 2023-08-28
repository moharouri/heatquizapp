import {Button, Divider, Drawer, Form, Input, Spin, Upload } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import { ALLOWED_IMAGE_EXTENSIONS, MAX_ALLOWED_COURSE_CODE, MAX_ALLOWED_COURSE_NAME, dummyRequest, getBase64 } from "../../../services/Auxillary";

import './AddNewCourse.css'
const { Dragger } = Upload;

export function AddNewCourse({open, onClose}){
  const [loadingImage, setLoadingImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [newImageURL, setNewImageURL] = useState(null);

  const [newName, setNewName] = useState(null)
  const [newCode, setNewCode] = useState(null)


  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoadingImage(true);
      return;
    }

    if (info.file.status === 'done') {
      console.log(info.file.originFileObj)
      getBase64(info.file.originFileObj, (url) => {
        setLoadingImage(false);
        setNewImageURL(url);
        setNewImage(info.file.originFileObj);
      });
    }
  };


  return(
        <Drawer
        title={"Add course"}
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        maskClosable={false}
        closeIcon={<ArrowLeftOutlined />}
    >
    <Divider orientation="left">Course thumbnail </Divider>
    <div
      className="thumbnail-uploader"
    >
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
            className="new-course-photo"
            alt="course"
        />}
      </Dragger>
    </div>
    <Divider orientation="left">Course name/code</Divider>
    <div>
        <Form>
          <Form.Item>
            <small>Course name</small>
            <Input 
              placeholder="New course name"
              value={newName}
              onChange={(v) => setNewName(v.target.value)}
              maxLength={MAX_ALLOWED_COURSE_NAME}
              showCount 
            />
        
          </Form.Item>
          <Form.Item>
            <small>Course code</small>
            <Input 
              placeholder="New course code"
              value={newCode}
              onChange={(v) => setNewCode(v.target.value)}
              maxLength={MAX_ALLOWED_COURSE_CODE}
              showCount 
            />
          </Form.Item>
        </Form>
        <Button 
          type="primary" 
          onClick={() => {
            let data = new FormData()
            data.append('picture', newImage)
          }}
          loading = {false}
          >
            Add course
        </Button>
    </div>
  </Drawer>)
}