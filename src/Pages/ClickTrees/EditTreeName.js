import { Button, Drawer, Form, Input, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useClickTrees } from "../../contexts/ClickTreesContext";

export function EditTreeName({open, onClose, tree}){
    const {loadingEditTree, getEditTreeError, editTree, getAllClickTrees} = useClickTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    useEffect(() => {
        setNewName((tree || {}).Name)
    }, [open])

    useEffect(() => {
        if(getEditTreeError){
            messageApi.destroy()
            messageApi.error(getEditTreeError)
        }
    }, [getEditTreeError])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit Tree Name"}
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

                       const VM = ({
                        ...tree,
                        Name:newName
                       })

                       editTree(VM).then(() => getAllClickTrees())

                    }}
                    loading = {loadingEditTree}
                >
                Update
                </Button>
            </Drawer>
        </div>
    )
}