import {Button, Drawer, Form, Input, Space, message,} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { LatexRenderer } from "../../../Components/LatexRenderer";

import './CopyQuestion.css'
import { useQuestions } from "../../../contexts/QuestionsContext";

export function CopyQuestion({open, onClose, question}){

    if(!open) return <div/>;

    const { errorCopyQuestion, isLoadingCopyQuestion, copyQuestion} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [newCode, setNewCode] = useState('')

    useEffect(() => {
        if(open){
            setNewCode('')
        }
    }, [open])

    useEffect(() => {
        if(errorCopyQuestion){
            api.destroy()
            api.error(errorCopyQuestion)
        }
    }, [errorCopyQuestion])

    return(
        <Drawer
        title="Copy question"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}

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
      </div>}

      maskClosable={false}
    >   
        {contextHolder}

        <Form>
            <Form.Item>
                <small>Code</small>
                <Input 
                    placeholder="New code"
                    value={newCode}
                    onChange={(v) => setNewCode(v.target.value)}
                />
            </Form.Item>
        </Form>

        <Button 
            size="small"
            type="primary"
            onClick={() => {
                if(!newCode.trim()){
                    api.destroy()
                    api.warning('Please add code')
                }

                const VM = ({
                    QuestionId: question.Id,
                    Code: newCode
                })

                copyQuestion(VM)
            }}

            loading={isLoadingCopyQuestion}
        >
            Copy
        </Button>
    </Drawer>
    )
}