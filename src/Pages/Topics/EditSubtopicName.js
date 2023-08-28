import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useTopics } from "../../contexts/TopicsContext";

export function EditSubtopicName({open, onClose, subtopic}){
    const [messageApi, contextHolder] = message.useMessage();

    const {loadingEditSubtopicName, getEditSubtopicNameError, updateSubtopicName} = useTopics()

    const [newName, setNewName] = useState('')

    useEffect(() => {   
        setNewName(subtopic.Name)
    }, [open])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit subtopic name"}
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
                            Id: subtopic.Id, 
                            Name: newName
                        })

                        updateSubtopicName(VM).then(() => {
                            if(getEditSubtopicNameError){
                                messageApi.destroy()
                                messageApi.error(getEditSubtopicNameError)
                            }
                        })

                        
                    }}
                    loading = {loadingEditSubtopicName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}