import React, { useEffect, useState } from "react";
import {Button, Drawer, Form, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function UpdateEBTermLatexText({open, onClose, ebTerm, reloadQuestion}) {

    if(!open) return <div/>;
    const [newLatex, setNewLatex] = useState('')

    const { isLoadingEditEnergyBalanceTermCodeLatexText, editEnergyBalanceTermCodeLatexText,} = useQuestions()

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

            loading={isLoadingEditEnergyBalanceTermCodeLatexText}

            onClick={() => {
                if(!newLatex.trim()){
                    api.destroy()
                    api.warning("Please add values for code and LaTeX")

                    return
                }

                const VM = ({
                    ...ebTerm,
                    LatexText: newLatex
                })

                editEnergyBalanceTermCodeLatexText(VM).then(r => handleResponse(r, api, 'Updated', 1, () => {
                    reloadQuestion()
                    onClose()
                }))
            }}
        >
            Update
        </Button>
    </Drawer>
    )
}