import React, { useEffect, useState } from "react";
import {Button, Drawer, Form, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";

export function UpdateEBTermLatexText({open, onClose, ebTerm}) {

    if(!open) return <div/>;
    const [newLatex, setNewLatex] = useState('')

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {LatexText} = ebTerm

            setNewLatex(LatexText)
        }
    }, [open])

    return(
        <Drawer
        title="Update EB Term LaTeX Text"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <Form>
            <Form.Item>
                <small className="default-gray">LaTeX text</small>
                <TextArea 
                    value={newLatex}
                    onChange={(v) => {
                        const value = v.target.value
                        setNewLatex(value)
                    }}
                />
            </Form.Item>
            <br/>
            <small className="default-gray">LaTeX rendering</small>
            <LatexRenderer latex={newLatex}/>
        </Form> 

        <br/>
        <Button 
            size="small"
            type="primary"
            onClick={() => {

            }}
        >
            Update
        </Button>
    </Drawer>
    )
}