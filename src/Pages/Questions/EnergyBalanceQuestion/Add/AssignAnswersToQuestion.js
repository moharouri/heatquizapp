import { Button, Drawer, Form, Input } from "antd";
import React from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { handleResponse } from "../../services/Auxillary";

export function AssignAnswersToQuestion({open, onClose, onUpdateAnswer}){

    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Assign answers"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >
                <Form>
                    <Form.Item>
                        <small className="default-gray">Name</small>
                        <Input 
                        placeholder="New name"
                        value={newName}
                        onChange={(v) => setNewName(v.target.value)}
                         
                        />
            
                    </Form.Item>
                </Form>
                <Button 
                    type="primary"
                    size="small"
                    onClick={() => {
                        if(!newName.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add name')
                            return
                        }

                        const VM = ({
                            Name: newName
                        })

                        addTopic(VM).then((r) => 
                            handleResponse(r, messageApi, 'Added successfully', 1, () => {
                                reloadData()
                                onClose()
                            }))

                        
                    }}
                    loading = {loadingAddTopic}
                >
                Add
                </Button>
            </Drawer>
        </div>
    )
}