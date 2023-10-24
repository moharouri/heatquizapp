import {Avatar, Button, Divider, Drawer, Space, Spin } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { LatexRenderer } from "../../Components/LatexRenderer";
import { beautifyDatetime, getShortenedName } from "../../services/Auxillary";

export function ViewFeedbackList({open, onClose, question, loading, error, data}){

    console.log(question, data)

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
        {loading && <Spin/>}
        {!loading && data && 
        data.map((d, di) => 
          {
            const {Player, DateCreated, FeedbackContent} = d

            const shortenedName = getShortenedName(Player)
            return(
              <div 
                key={di}
              >
                <Space
                  size={'large'}
                >
                  <Space
                    size={'small'}
                  >
                    <Avatar 
                      className='commenter-avatar'
                    >
                      {shortenedName}
                    </Avatar>
                    <p>{Player}</p>
                  </Space>

                  <p>{beautifyDatetime(DateCreated)}</p>
                </Space>
                <p>{d.FeedbackContent}</p>
                <Divider/>
              </div>)
          })
        }

        <br/>
        
    </Drawer>
    )
}