import { Button, Divider, Drawer, Form, Input, message } from "antd";
import React, { useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useTopics } from "../../contexts/TopicsContext";

import './AddSubtopic.css'

export function AddSubtopic({open, onClose, topic}){
    const [messageApi, contextHolder] = message.useMessage();

    const {loadingAddSubtopic, getAddSubtopicError, addSubtopic, getAllTopics} = useTopics()

    const [newName, setNewName] = useState('')

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add subtopic"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{
                paddingBottom: 80,
                }}
                closeIcon={<ArrowLeftOutlined />}
            >
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
                <Button 
                    type="primary"
                    onClick={() => {
                        if(!newName.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add name')
                            return
                        }

                        const VM = ({
                            Name: newName,
                            TopicId: topic.Id
                        })

                        addSubtopic(VM).then(() => {
                            if(getAddSubtopicError){
                                messageApi.destroy()
                                messageApi.error(getAddSubtopicError)
                            }
                            else{
                                getAllTopics()
                            }
                        })

                        
                    }}
                    loading = {loadingAddSubtopic}
                >
                Add
                </Button>
                <Divider />
                <small className="add-image-tree-tree-word">Tree </small>
                <p className="tree-name-add-image-tree">
                    {topic.Name} 
                </p>
            </Drawer>
        </div>
    )
}