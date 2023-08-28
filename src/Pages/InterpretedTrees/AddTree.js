import { Button, Drawer, Form, Input, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";

export function AddTree({open, onClose}){
    const {loadingAddTree, getAddTreeError, addTree, getAllInterpretedTrees} = useInterpretedTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

    useEffect(() => {
        if(getAddTreeError){
            messageApi.destroy()
            messageApi.error(getAddTreeError)
        }
    }, [getAddTreeError])

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Add tree"}
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
                       }

                       const VM = ({
                        Name:newName
                       })
                      
                       addTree(VM).then(() => getAllInterpretedTrees())
                        
                    }}
                    loading = {loadingAddTree}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}