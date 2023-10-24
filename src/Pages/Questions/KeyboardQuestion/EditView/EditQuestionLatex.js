import { Button, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";

import './index.css'
import { useQuestions } from "../../../../contexts/QuestionsContext";

export function EditQuestionLatex({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const {isLoadingEditKeyboardQuestionLatex, editKeyboardQuestionLatex} = useQuestions()

    const [newLatex, setNewLatex] = useState('')

    const {Latex} = question

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setNewLatex(Latex)
        }
    }, [open])

    return(
        <Drawer
        title="Edit question LaTeX"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <div>
            <p className="question-code">{question.Code}</p>
            <Space size={'large'} align="start">
                <div>
                    <img
                        src = {question.Base_ImageURL}
                        alt="question"
                        className="question-feedback-image"
                        
                    />
                </div>
                <div>
                    {question.Latex && <LatexRenderer latex={question.Latex}/>}
                </div>
            </Space>
        </div>
        }
        >
        {contextHolder}
        <Space
            direction="vertical"
            size={'large'}
            className="multiple-choice-question-edit-latex"
        >
            <TextArea 
                value={newLatex}
                rows={4} 
                onChange={(v) => setNewLatex(v.target.value)}
            />

            <LatexRenderer latex={newLatex} />
        </Space>

        <br/>
        <br/>
        
        <Button
            size="small"
            type="primary"
            onClick={() => {
                if(!newLatex.trim()){
                    api.destroy()
                    api.warning('Please add LaTeX question content')

                    return
                }

                const VM = ({
                    Id: question.Id,
                    Latex: newLatex
                })

                editKeyboardQuestionLatex(VM)
                .then(
                (r) => {
                    const {Id} = r
                    
                    if(Id){
                        api.destroy()
                        api.success('Edited successfully', 1)
                        .then(() => {
                            onClose()
                            reloadQuestion()
                        })
                    }
                    else{
                        api.destroy()
                        api.error(r)
                    }})
            }}

            loading={isLoadingEditKeyboardQuestionLatex}
        >
            Update
        </Button>
        </Drawer>
    )
}