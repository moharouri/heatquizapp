import React, { useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { Button, Divider, Input, Space, DatePicker, message, Spin, Col, Badge, List } from "antd";
import './StudentFeedback.css'
import { useStudentFeedback } from "../../contexts/StudentFeedbackContext";
import {MessageOutlined} from '@ant-design/icons';
import { ViewFeedbackList } from "./ViewFeedbackList";

const { RangePicker } = DatePicker;


export function StudentFeedback(){
    const [showViewFeedbackListModal, setShowViewFeedbackListModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState({})

    const [debugCode, setDebugCode] = useState('')
    const [showDebugCodeList, setShowDebugCodeList] = useState(false)

    const [messageApi, contextHolder] = message.useMessage();

    const { 
        loadingStudentFeedback,
        studentFeedback,
        getStudentFeedbackError,
        getStudentFeedback,

        loadingQuestionFeedback,
        questionFeedback,
        getQuestionFeedbackError,
        getQuestionFeedback,

        loadingDebugCodeDecryption,
        debugCodeDecryption,
        decryptDebugCodeError,
        decryptDebugCode
    } = useStudentFeedback()

    const [fromData, setFromData] = useState(null)
    const [toData, setToData] = useState(null)

    const searchFeedback = () => {
        if(!(fromData && toData)) {
            messageApi.destroy()
            messageApi.error('Please add date range for search')
            
            return
        } 

        let VM = ({
            encryption:"-",
            FromDate: fromData,
            ToDate: toData
        })

        getStudentFeedback(VM)
    }

    function QRSearchLine(){
        return(
            <Space align="start" className="qr-search-line">
                 <div className="qr-code-input">
                    <p>Debug code</p>
                    <Input 
                        value={debugCode}
                        onChange={(v) => setDebugCode(v.target.value)}
                        placeholder="Debug code sent by student"
                    />
                    <Button 
                        className="search-btn"
                        onClick={() => {
                            setShowDebugCodeList(true)
                            decryptDebugCode(debugCode)
                        }}
                    >
                        Search 
                    </Button>
                 </div>
            </Space>
        )
    }

    function FeedbackSearchLine(){
        return(
                <div className="feedback-search-input">
                    <p>Feedback date range</p>
                    <RangePicker 
                    
                    onChange={(v) => {
                        const fromData = v[0].format('DD.MM.YYYY') + ' 00:00:00'
                        const toData = v[1].format('DD.MM.YYYY') + ' 23:59:59'

                        setFromData(fromData)
                        setToData(toData)
                    }}/>
                    <Space align="center">
                        <Button 
                            className="search-btn"
                            onClick={() => {
                                setShowDebugCodeList(false)    
                                searchFeedback()
                            }}
                        >
                            Search 
                        </Button>
                        <p>
                            {studentFeedback && (studentFeedback.reduce((r, c) => r += c.feedback.length, 0) + " comments")} 
                        </p>
                    </Space>
                </div>
        )
    }

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider orientation="left">
                Student feedback
            </Divider>
            <Space align="start">
            {FeedbackSearchLine()}
            {QRSearchLine()}
            </Space>

            <Divider/>
            {loadingStudentFeedback && <Spin tip="Loading..."/>}
            {!(loadingStudentFeedback || getStudentFeedbackError) && studentFeedback && !showDebugCodeList &&
            <List 

            grid={{
                gutter: 16,
                column: 4
            }}

            dataSource={studentFeedback}

            renderItem={(f, fi) => {
                const {data, feedback} = f
                return(
                    <List.Item>
                        <Col> 
                            <div className="feedback-box">
                                <div className="feedback-box-internal">
                                    <div className="question-info-section">
                                        <p>{data.Code}</p>
                                        <img
                                            src = {data.Base_ImageURL}
                                            alt="question"
                                            className="question-image"
                                        />
                                    </div>
                                    <Space 
                                    align="start" 
                                    className="sample-feedback-section" 
                                    onClick={() => {
                                        setShowViewFeedbackListModal(true)
                                        setSelectedQuestion(data)
                                        getQuestionFeedback(data)
                                    }}
                                    >
                                            <div className="sample-feedback-icon">
                                                <Badge 
                                                count={feedback.length} size="small">
                                                    <MessageOutlined />
                                                </Badge>
                                            </div>
                                            
                                            <p className="sample-feedback">
                                            {feedback[0].FeedbackContent}
                                            </p>
                                    </Space>
                                </div>
                            </div>
                        </Col>
                    </List.Item>
                )
            }}
            />}

            {loadingDebugCodeDecryption && <Spin tip="loading..."/>}

            {!(loadingDebugCodeDecryption || decryptDebugCodeError) && debugCodeDecryption && showDebugCodeList &&
            'debugCodeDecryption'}           
          
            <ViewFeedbackList 
                open={showViewFeedbackListModal}
                onClose={()=> setShowViewFeedbackListModal(false)}
                question={selectedQuestion}
                
                loading={loadingQuestionFeedback}
                error={getQuestionFeedbackError}
                data={questionFeedback}
            />
        </PagesWrapper>
    )
}