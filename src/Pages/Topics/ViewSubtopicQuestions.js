import {Divider, Drawer, Dropdown, List} from "antd";
import React from "react"
import {ArrowLeftOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';

import './ViewSubtopicQuestions.css'

export function ViewSubtopicQuestions({open, onClose, subtopic}){

    if(!open) return <div/>;

    const questionActionList = (q) => [{
        key: 'view_edit_question',
        label: 'View edit question',
        icon: <EditOutlined/>,
        onClick: () => {}
    },
    {
        key: 'play_question',
        label: 'Play question',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {}
    }]

    return(
        <div>
            <Drawer
                title={"View subtopic questions"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{
                paddingBottom: 80,
                }}
                closeIcon={<ArrowLeftOutlined />}
            >
                <div className="subtopic-questions-modal-list">
                    <List 
                        dataSource={subtopic.Questions.sort((a, b) => a.Code > b.Code ? 1:-1)}
                        renderItem={(q, qi) => (
                            <div key={q.Id} className="info-line-subtopic-view-questions">
                                <Dropdown
                                    menu={{
                                        items:questionActionList(q),
                                        title:'Actions'
                                    }}
                                >
                                    <p className="question-code-subtopic-view-questions">
                                        <span 
                                        className="question-index-subtopic-view-questions"
                                        >{qi+1}</span>
                                        {q.Code}
                                    </p>
                                </Dropdown>
                                
                                <img 
                                    src={q.Base_ImageURL}
                                    className="question-image-subtopic-view-questions"
                                    alt={q.Code}
                                /> 
                            </div>
                        )}
                    />
                </div>
                <Divider />
                <p className="topic-name-view-question-modal">
                    {subtopic.Topic.Name} 
                    <span className="subtopic-name-view-question-modal">
                        {subtopic.Name}
                    </span>
                </p>
            </Drawer>
        </div>
    )
}