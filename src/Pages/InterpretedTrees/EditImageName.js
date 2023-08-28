import { Button, Drawer, Form, Input, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";

export function EditImageName({open, onClose, node}){
    console.log(node)
    const {loadingEditImageName, getEditImageNameError, editImageName, getAllInterpretedTrees} = useInterpretedTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    useEffect(() => {
        setNewName((node || {}).Code)
    }, [open])

    useEffect(() => {
        if(getEditImageNameError){
            messageApi.destroy()
            messageApi.error(getEditImageNameError)
        }
    }, [getEditImageNameError])

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
                        let data = new FormData()
                        data.append('Code',  newName)
                        data.append('ImageId', node.Id)

                        editImageName(data).then(() => getAllInterpretedTrees())
                       
                    }}
                    loading = {loadingEditImageName}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}