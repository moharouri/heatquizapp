import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { useTopics } from "../../contexts/TopicsContext";
import { useDatapools } from "../../contexts/DatapoolsContext";
import { Button, Divider, Dropdown, List, Skeleton, Space, message } from "antd";
import {PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';

import './Topics.css'
import { EditTopicName } from "./EditTopicName";
import { EditSubtopicName } from "./EditSubtopicName";
import { ViewSubtopicQuestions } from "./ViewSubtopicQuestions";
import { AddTopic } from "./AddTopic";
import { AddSubtopic } from "./AddSubtopic";

export function Topics(){

    const {topics, errorGetTopics, isLoadingTopics, getAllTopics} = useTopics()
    const {selectedDatapool} = useDatapools()

    const [showAddTopicModal, setShowAddTopicModal] = useState(false)
    const [showAddSubtopicModal, setShowAddSubtopicModal] = useState(false)

    const [showEditTopicNameModal, setShowEditTopicNameModal] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState({})

    const [showEditSubtopicNameModal, setShowEditSubtopicNameModal] = useState(false)
    const [selectedSubtopic, setSelectedSubtopic] = useState({})

    const [showViewSubtopicQuestionsModal, setShowViewSubtopicQuestionsModal] = useState(false)

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getAllTopics().then(() => {
            if(errorGetTopics){
                messageApi.destroy()
                messageApi.error(errorGetTopics)
                return
            }
        })
    }, [selectedDatapool])

    
    const topicActionList = (t) => [
        {
            key: 'edit_topic_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setShowEditTopicNameModal(true)
                setSelectedTopic(t)
            }
        },
        {
            key: 'add_subtopic',
            label: 'Add subtopic',
            icon: <PlusOutlined />,
            onClick: () => {
                setSelectedTopic(t)
                setShowAddSubtopicModal(true)
            }
        },
        !t.Subtopics.reduce((r, c) => r += c.Questions.length, 0)
        &&
        {
            key: 'delete_topic',
            label: 'Delete',
            icon: <DeleteOutlined />,
            onClick: () => {
               
            }
        }
    ]

    const subtopicActionList = (s, t) => [{
        key: 'edit_subtopic_name',
        label: 'Edit name ',
        icon: <EditOutlined/>,
        onClick: () => {
            setShowEditSubtopicNameModal(true)
            setSelectedSubtopic(s)
        }
    },
    s.Questions.length
    &&
    {
        key: 'view_questions',
        label: 'View questions',
        icon: <EyeOutlined />,
        onClick: () => {
            setShowViewSubtopicQuestionsModal(true)
            setSelectedSubtopic({...s, Topic: t})
        }
    },
    !s.Questions.length
    &&
    {
        key: 'delete_subtopic',
        label: 'Delete',
        icon: <DeleteOutlined />,
        onClick: () => {}
    }]

    return(
        <PagesWrapper>
            {contextHolder}

            <AddTopic 
                open={showAddTopicModal}
                onClose={() => setShowAddTopicModal(false)}
            />

            <AddSubtopic 
                open={showAddSubtopicModal}
                onClose={() => setShowAddSubtopicModal(false)}
                topic={selectedTopic}
            />


            <EditTopicName 
                open={showEditTopicNameModal}
                onClose={() => setShowEditTopicNameModal(false)}
                topic={selectedTopic}
            />

            <EditSubtopicName 
                open={showEditSubtopicNameModal}
                onClose={() => setShowEditSubtopicNameModal(false)}
                subtopic={selectedSubtopic}
            />

            <ViewSubtopicQuestions 
                open={showViewSubtopicQuestionsModal}
                onClose={() => setShowViewSubtopicQuestionsModal(false)}
                subtopic={selectedSubtopic}
            />

            <Divider orientation="left">
            
                <Space>
                    <span className="page-title">
                        Topics
                    </span>
                    <Button
                        type={'default'}
                        onClick={() => setShowAddTopicModal(true)}
                    >
                        <PlusOutlined style={{color:'green'}}/>
                        New topic
                    </Button>
                </Space>
            </Divider>
            {isLoadingTopics && <Skeleton/>}
            
            {!isLoadingTopics && topics &&
               <List
                dataSource={topics}
                renderItem={(t, ti) => (
                    <div 
                                key={t.Id}
                                className="topic-box">
                                    <div className="topic-box-internal">
                                        <div className="topic-info-header">
                                            <div className="topic-index-section">
                                                <p>{ti+1}</p>
                                            </div>
                                            <div className="topic-info-section">
                                                <Dropdown
                                                    menu={{
                                                        items:topicActionList(t),
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <p className="topic-title topic-subtopic-title">{t.Name}</p>
                                                </Dropdown>
                                                <small className="subtopic-adder-date-number-questions">{t.AddedByName}</small>
                                                <small className="subtopic-adder-date-number-questions">{t.DateCreated.substring(0,10)}</small>

                                            </div>
                                            
                                        </div>  
                                        <div className="subtopic-list">
                                            <br/>
                                            {t.Subtopics.map((s) => 
                                            <div 
                                            key={s.Id}
                                            className="subtopic-box">
                                                <Dropdown
                                                    menu={{
                                                        items:subtopicActionList(s, t),
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <p 
                                                    className="topic-subtopic-title"
                                                    >
                                                        {s.Name}
                                                    </p>
                                                </Dropdown>
                                                <small className="subtopic-adder-date-number-questions">
                                                    {s.Questions.length} {' '} questions
                                                </small>
                                            </div>
                                            )}
                                        </div> 
                                        <div className="topic-action-section">
                                                
                                        </div>
                                    </div>
                                </div>
                )}
               />
            }
        </PagesWrapper>
    )
}