import {Button, Drawer, Form, Input, message} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { useDatapools } from "../../contexts/DatapoolsContext";

export function AddDatapool({open, onClose}){

    if(!open) return <div/>;

    const { errorAddDataPool, isLoadingAddDataPool, AddDataPoolResult, AddDataPool, getAllDatapoolsAdmin} = useDatapools()
    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
      setName('')
      setNickName('')
    }, [open])

    useEffect(() => {
      if(errorAddDataPool)
      {
        api.destroy()
        api.error(errorAddDataPool)
      }
    }, [errorAddDataPool])

    const [name, setName] = useState('')
    const [nickName, setNickName] = useState('')

    return(
        <Drawer
        title="Add datapool"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
          {contextHolder}
          <Form>
            <Form.Item>
              <small>Name</small>
              <Input 
                placeholder="New datapool's name"
                value={name}
                onChange={(v) => setName(v.target.value)}
              />
          
            </Form.Item>
            <Form.Item>
              <small>Nickname</small>
              <Input 
                placeholder="New datapool's nickname"
                value={nickName}
                onChange={(v) => setNickName(v.target.value)}
              />
          
            </Form.Item>
           
          </Form>
          <Button 
            type="primary" 
            size="small"
            onClick={() => {

              if(!name.trim() || !nickName.trim()){
                  api.destroy()
                  api.warning('Please add name and nickname')

                  return
              }

              const VM = ({
                Name: name,
                NickName: nickName
              })

              AddDataPool(VM).then(() => {
                getAllDatapoolsAdmin()
              })
            }}
            loading = {isLoadingAddDataPool}
            >
              Add
          </Button>
        </Drawer>
    )
}