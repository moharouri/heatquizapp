import {Button, Drawer, Form, Input, Space, Switch, message} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { useDatapools } from "../../contexts/DatapoolsContext";

export function EditDatapool({open, onClose, DP}){

    if(!open) return <div/>;

    const { errorEditDataPool, isLoadingEditDataPool, EditDataPoolResult, EditDataPool, getAllDatapoolsAdmin} = useDatapools()
    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
      const {Name, NickName, IsHidden} = DP
      setName(Name)
      setNickName(NickName)
      setIsHidden(IsHidden)
    }, [open])

    useEffect(() => {
      if(errorEditDataPool)
      {
        api.destroy()
        api.error(errorEditDataPool)
      }
    }, [errorEditDataPool])

    const [name, setName] = useState('')
    const [nickName, setNickName] = useState('')
    const [isHidden, setIsHidden] = useState(false)

    return(
        <Drawer
        title="Edit datapool"
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
                placeholder="datapool's name"
                value={name}
                onChange={(v) => setName(v.target.value)}
              />
          
            </Form.Item>
            <Form.Item>
              <small>Nickname</small>
              <Input 
                placeholder="datapool's nickname"
                value={nickName}
                onChange={(v) => setNickName(v.target.value)}
              />
          
            </Form.Item>

            <Form.Item>
                <Space
                    direction='vertical'
                >
                    <small>Is hidden</small>
                    <Switch
                        checked={isHidden}
                        checkedChildren={'Datapool is hidden'}
                        unCheckedChildren={'Datapool is visible'}
                        onChange={() => {setIsHidden(!isHidden)}}
                    />
                </Space>
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
                ...DP,
                Name: name,
                NickName: nickName,
                IsHidden: isHidden

              })

              EditDataPool(VM).then(() => {
                getAllDatapoolsAdmin()
              })
            }}
            loading = {isLoadingEditDataPool}
            >
              Update
          </Button>
        </Drawer>
    )
}