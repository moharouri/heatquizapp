import {Button, ColorPicker, Drawer, Form, Input, Space} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";

export function AddLevelOfDifficulty({open, onClose}){

    if(!open) return <div/>;

    useEffect(() => {
      setName('')
      setColor('green')
    }, [open])

    const [name, setName] = useState('')
    const [color, setColor] = useState('green')

    return(
        <Drawer
        title="Add level of difficulty"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
          <Form>
            <Form.Item>
              <small>Name</small>
              <Input 
                placeholder="New level of difficulty name"
                value={name}
                onChange={(v) => setName(v.target.value)}
              />
          
            </Form.Item>
            <Form.Item>
              <Space
                direction="vertical"
                size={'small'}
              >
                <small>Color</small>
                <Space
                  size={'small'}
                >
                  <ColorPicker 
                  defaultValue={color}
                  onChange={(v,h) => {
                    console.log(v)
                    console.log(h)

                    setColor(h)
                  }}
                  size="large" 
                  showText = {true} />

                  <p>{color}</p>
                </Space>
              </Space>
            </Form.Item>
          </Form>
          <Button 
            type="primary" 
            size="small"
            onClick={() => {
             
            }}
            loading = {false}
            >
              Add
          </Button>
        </Drawer>
    )
}