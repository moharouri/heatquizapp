import { Button, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";
import { useQuestions } from "../../../../contexts/QuestionsContext";

import './index.css'

export function EditChoiceLatex({open, onClose, choice, question, reloadQuestion}){

    if(!open) return <div/>;

    const [newLatex, setNewLatex] = useState('')

    const {Latex, Correct, ImageURL, index} = choice

    const [api, contextHolder] = message.useMessage()
    const {isLoadingEditMultipleChoiceQuestionChoice, editMultipleChoiceQuestionChoice} = useQuestions()

    useEffect(() => {
        if(open){
            setNewLatex(Latex)
        }
    }, [open])

    return(
        <Drawer
        title="Edit choice LaTeX"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <Space
                size={'large'}
                align="start"
            >
                <p 
                    className={Correct ? 'multiple-choice-question-edit-view-correct-choice' : 'multiple-choice-question-edit-view-incorrect-choice'}
                >
                    {index+1}
                </p>

                {Latex && <LatexRenderer latex={Latex} />}
                {ImageURL && 
                <img 
                    alt={'Choice' + index + 1}
                    className="multiple-choice-question-edit-view-choice-img"
                    src={ImageURL}
                />}
            </Space>
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
                if(!newLatex.trim() && !ImageURL){
                    api.destroy()
                    api.warning('Please provide a LaTeX since this choice has no image')

                    return
                }

                const data = new FormData()
                data.append("QuestionId", question.Id)
                data.append("AnswerId", choice.Id)
                data.append("Latex", newLatex)
                data.append("Correct", Correct)

                editMultipleChoiceQuestionChoice(data)
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
                    }
            })


            }}

            loading={isLoadingEditMultipleChoiceQuestionChoice}
        >
            Update
        </Button>
        </Drawer>
    )
}