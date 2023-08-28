import { Button, Drawer, Form, Input, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useClickTrees } from "../../contexts/ClickTreesContext";

export function AddTree({open, onClose}){
    const {loadingAddTree, getAddTreeError, addTree, getAllClickTrees} = useClickTrees()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')

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
                      

                       addTree(VM).then(() => {

                            if(getAddTreeError){
                                messageApi.destroy()
                                messageApi.error(getAddTreeError)
                            }
                            else{
                                getAllClickTrees()
                            }

                       })

                        
                    }}
                    loading = {loadingAddTree}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}