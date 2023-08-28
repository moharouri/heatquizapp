import { Button, Drawer, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useUsers } from "../../contexts/UsersContext";

export function EditUserNameEmail({user, open, onClose}){
    const {loadingEditNameEmail,
            getEditNameEmailError,
            updateUserNameEmail} = useUsers()
    
    console.log(getEditNameEmailError)

    const [messageApi, contextHolder] = message.useMessage();


    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')

    useEffect(() => {   
        setNewName(user.Name)
        setNewEmail(user.Email)
    }, [open])

    

    return(
        <div>
            {contextHolder}
            <Drawer
            title={"Edit name / email"}
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
        >
            <div>
                <Form>
                    <Form.Item>
                        <small>Name</small>
                        <Input 
                        placeholder="New name"
                        value={newName}
                        onChange={(v) => setNewName(v.target.value)}
                         
                        />
            
                    </Form.Item>
                    <Form.Item>
                        <small>Email</small>
                        <Input 
                        placeholder="New email"
                        value={newEmail}
                        onChange={(v) => setNewEmail(v.target.value)}
                         
                        />
                    </Form.Item>
                </Form>
                <Button 
                    type="primary" 
                    onClick={() => {
                        if(!newName.trim() || !newEmail.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add name and email')
                            return
                        }

                        const VM = ({
                            NewUsername: user.Username,
                            Username: user.Username,
                            Name: newName,
                            Email: newEmail
                        })

                        updateUserNameEmail(VM).then(() => {

                            if(getEditNameEmailError){
                                messageApi.destroy()
                                messageApi.error(getEditNameEmailError)
                            }
                        })
                    }}
                    loading = {loadingEditNameEmail}
                >
                Update
                </Button>
            </div>
        </Drawer>
        </div>
    )
}