import { Button, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";

import './index.css'
import { useQuestions } from "../../../../contexts/QuestionsContext";

export function EditQuestionAdditionalInformation({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const { isLoadingEditMultipleChoiceQuestionAdditionalInfo, editMultipleChoiceQuestionAdditionalInfo} = useQuestions()

    const [newInfo, setNewInfo] = useState('')

    const {AdditionalInfo} = question

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setNewInfo(AdditionalInfo)
        }
    }, [open])

    return(
        <Drawer
        title="Edit question additional information"
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
                value={newInfo}
                rows={4} 
                onChange={(v) => setNewInfo(v.target.value)}
            />
        </Space>

        <br/>
        <br/>
        
        <Button
            size="small"
            type="primary"
            onClick={() => {
                const VM = ({
                    Id: question.Id,
                    AdditionalInfo: newInfo
                })

                editMultipleChoiceQuestionAdditionalInfo(VM)
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

            loading={isLoadingEditMultipleChoiceQuestionAdditionalInfo}
        >
            Update
        </Button>
        </Drawer>
    )
}