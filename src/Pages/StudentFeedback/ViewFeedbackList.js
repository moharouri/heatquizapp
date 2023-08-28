import {Button, Divider, Drawer, Space, Spin } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { LatexRenderer } from "../../Components/LatexRenderer";

export function ViewFeedbackList({open, onClose, question, loading, error, data}){

    return(
        <Drawer
        title="Student feedback"
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
    >   
        {loading && <Spin tip="loading ..."/>}
        {!loading && data && 
        data.map((d, di) => 
          <div 
            key={di}
          >
            
            <Space>
              <p className="comment-player-name">{d.Player}</p>
              <p className="comment-player-date">{`${d.DateCreated.substring(0,10)} ${d.DateCreated.substring(11,19)}`}</p>
            </Space>
            
            <p>{d.FeedbackContent}</p>
            <Divider/>
          </div>)
        }

        <br/>
        
    </Drawer>
    )
}