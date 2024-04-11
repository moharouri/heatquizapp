import { Button, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";

import './index.css'
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function EditQuestionLatex({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const {isLoadingEditFBDQuestionBody, editFBDQuestionBody,} = useQuestions()

    const [newLatex, setNewLatex] = useState('')

    const {QuestionText} = question

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setNewLatex(QuestionText || "")
        }
    }, [open])

    return(
        <Drawer
        title="Edit Question Body"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <div>
            <p className="default-title">{question.Code}</p>
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
            className="hq-full-width"
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
                    api.warning('Please add question body')

                    return
                }

                const VM = ({
                    ...question,
                    QuestionText: newLatex
                })

                editFBDQuestionBody(VM)
                .then((r) => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadQuestion()
                }))
                
            }}

            loading={isLoadingEditFBDQuestionBody}
        >
            Update
        </Button>
        </Drawer>
    )
}