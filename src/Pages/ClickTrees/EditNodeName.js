import { Button, Drawer, Form, Input, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useClickTrees } from "../../contexts/ClickTreesContext";

export function EditNodeName({open, onClose, node}){
    const {loadingEditNode, getEditNodeError, editNode, getAllClickTrees} = useClickTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    useEffect(() => {
        setNewName((node || {}).Name)
    }, [open])

    useEffect(() => {
        if(getEditNodeError){
            messageApi.destroy()
            messageApi.error(getEditNodeError)
        }
    }, [getEditNodeError])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit Node Name"}
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
                        <small>Updated name</small>
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
                        }

                        let data = new FormData()
                        data.append('Name', newName)
                        data.append('AnswerId', node.Id)
                        data.append('Picture', null)
                        data.append('SameImage', true)

                       editNode(data).then(() => getAllClickTrees())
                       
                    }}
                    loading = {loadingEditNode}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}