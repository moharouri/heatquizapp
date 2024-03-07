import React, { useEffect, useState } from "react";
import {Button, Drawer, Form, Input, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function UpdateVTCodeLatex({open, onClose, vtTerm}) {

    if(!open) return <div/>;
    const [newCode, setNewCode] = useState('')
    const [newLatex, setNewLatex] = useState('')

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {Code, Latex} = vtTerm

            setNewCode(Code)
            setNewLatex(Latex)
        }
    }, [open])

    return(
        <Drawer
        title="Update Vector Term Code/LaTeX"
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
                <small className="default-gray">Code</small>
                <Input 
                    placeholder="New code"
                    value={newCode}
                    onChange={(v) => setNewCode(v.target.value)}
                />
            </Form.Item>
            <br/>
            <Form.Item>
                <small className="default-gray">LaTeX</small>
                <Input 
                    placeholder="New LaTeX"
                    value={newLatex}
                    onChange={(v) => setNewLatex(v.target.value)}
                />
            </Form.Item>
            <LatexRenderer latex={"$$" + newLatex + "$$"}/>
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