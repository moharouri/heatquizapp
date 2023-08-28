import { Button, Drawer, Form, Input, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useTopics } from "../../contexts/TopicsContext";

export function AddTopic({open, onClose}){
    const [messageApi, contextHolder] = message.useMessage();

    const {loadingAddTopic, getAddTopicError, addTopic, getAllTopics} = useTopics()

    const [newName, setNewName] = useState('')

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add topic"}
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
                            Name: newName
                        })

                        addTopic(VM).then(() => {
                            if(getAddTopicError){
                                messageApi.destroy()
                                messageApi.error(getAddTopicError)
                            }
                            else{
                                getAllTopics()
                            }
                        })

                        
                    }}
                    loading = {loadingAddTopic}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}