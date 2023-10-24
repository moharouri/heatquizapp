import {Divider, Drawer, Dropdown, List, Skeleton, Space, Table, message} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { useEffect } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function ViewWrongAnswers({open, onClose, question}){

    if(!open) return <div/>;

    const {getKeyboardQuestionWrongAnswersResult, errorGetKeyboardQuestionWrongAnswers, isLoadingKeyboardQuestionWrongAnswers, getKeyboardQuestionWrongAnswers} = useQuestions()
    
    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
       if(open){
        const {Id} = question

        getKeyboardQuestionWrongAnswers(Id)
       }
    }, [open])

    useEffect(() => {
        if(errorGetKeyboardQuestionWrongAnswers){
            api.destroy()
            api.error(errorGetKeyboardQuestionWrongAnswers)
        }
     }, [errorGetKeyboardQuestionWrongAnswers])


    const renderWrongAnswers = () => {
        const totalAnswers = (getKeyboardQuestionWrongAnswersResult.reduce((r, c) => r += c.Count, 0))
        const columns = [
            {
                title: 'Name',
                dataIndex: 'Latex',
                render: (Latex) => {
                   return(
                    <Space
                        align="start"
                    >
                        <LatexRenderer latex={"$$"+Latex+"$$"} />
                    </Space>
                   )
                },
              },
              {
                title: 'Count',
                dataIndex: 'Count',
                render: (Count) => {
                    const perc = ((Count/(totalAnswers + 1)) * 100).toFixed(1) + '%'

                    return(
                    <Space size={'large'}>
                        <p>{Count}</p>
                        <small className="question-edit-view-gray">{perc}</small>
                    </Space>)
                },

              },
        ]

        return(
            <Table
                columns={columns}
                dataSource={getKeyboardQuestionWrongAnswersResult}
                pagination={false}
            />
        )
        
    }

    return(
        <Drawer
        title="Question wrong answers"
        width={'65%'}
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
        >
            {contextHolder}

            {isLoadingKeyboardQuestionWrongAnswers && <Skeleton />}

            {(!isLoadingKeyboardQuestionWrongAnswers && getKeyboardQuestionWrongAnswersResult) && renderWrongAnswers()}

        </Drawer>
    )
}