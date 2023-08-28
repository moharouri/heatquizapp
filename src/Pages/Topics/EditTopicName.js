import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useTopics } from "../../contexts/TopicsContext";

export function EditTopicName({open, onClose, topic}){
    const [messageApi, contextHolder] = message.useMessage();

    const {loadingEditName, getEditNameError, updateTopicName} = useTopics()

    const [newName, setNewName] = useState('')

    useEffect(() => {   
        setNewName(topic.Name)
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit topic name"}
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
                            Id: topic.Id, 
                            Name: newName
                        })

                        updateTopicName(VM).then(() => {
                            if(getEditNameError){
                                messageApi.destroy()
                                messageApi.error(getEditNameError)
                            }
                        })

                        
                    }}
                    loading = {loadingEditName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}