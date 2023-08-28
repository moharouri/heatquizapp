import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PagesWrapper } from "../../../PagesWrapper";
import { useCourses } from "../../../contexts/CoursesContext";
import {Col, Divider, Dropdown, List, Space, Spin, Tooltip } from "antd";
import {EditOutlined, MoreOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, TrophyOutlined} from '@ant-design/icons';

import './CourseView.css'

export function CourseView(){
    const { id } = useParams()

    const naviagate = useNavigate()

    const { 
        loadingCourse,
        Course,
        getCourseView
    } = useCourses()

    useEffect(() => {
        getCourseView(id)

    }, [id])

    const courseActionsDropdownList = [
        {
          key: 'edit_name_email',
          label: 'Edit name / email',
          icon: <EditOutlined/>,
          onClick: () => {}
        },
        {
          key: 'add_map',
          label: 'Add map',
          icon: <PlusOutlined  />,
          onClick: () => {}
        }
    ];


    return(
        <PagesWrapper>
            {loadingCourse && 
            <Spin tip=". . . loading course . . ." size="large">
                <div className="loading-section"/>
            </Spin>}

            {!loadingCourse && Course && 
            <div>
                <img 
                    src={Course.URL}
                    className="course-img"
                    alt={Course.Name}
                />
                <Divider orientation="left">
                    <Space>
                        <div className="course-card">
                            <div className="course-card-internal">
                                <Space>
                                    <p className="course-title-view">{Course.Name}</p>
                                    <Dropdown
                                       
                                        menu={{
                                            items:courseActionsDropdownList,
                                            title:'Settings'
                                        }}
                                    > 
                                        <Space>
                                            <EditOutlined /><PlusOutlined  />
                                        </Space>
                                    </Dropdown>
                                </Space>
                                <p>{Course.Code}</p>
                            </div>
                        </div>
                    </Space>
                </Divider>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 3,
                    }}
                    dataSource={Course.CourseMaps}
                    
                    renderItem={(m, mi) => {
                       const mapActionsDropdownList = [{
                            key: 'edit_map',
                            label: 'Edit map',
                            icon: <EditOutlined/>,
                            onClick: () => {}
                        },
                        {
                            key: 'play_map',
                            label: 'Play map',
                            icon: <TrophyOutlined style={{color:'green'}}/> ,
                            onClick: () => naviagate('/playcoursemap/'+m.Id)
                        },
                        {
                            key: 'delete_map',
                            label: 'Delete map',
                            icon: <DeleteOutlined style={{color:'red'}}/>,
                            onClick: () => {}
                        }]

                        return(
                            <List.Item>
                                <Col>
                                    <div className="map-box">
                                        <div className="map-box-internal">
                                            <div className="map-index-section">
                                                <p>{mi+1}</p>
                                            </div>
                                            <div className="map-info-section">
                                                <Space>
                                                <p className="map-title">{m.Title}</p>
                                                    <Tooltip 
                                                        color="white"
                                                        title={<img 
                                                            src={m.LargeMapURL}
                                                            alt={m.Title}
                                                            className="map-image-small"
                                                            onClick={() => naviagate('/playcoursemap/'+m.Id)}
                                                        />}
                                                        
                                                    > 
                                                        <EyeOutlined  
                                                        style={{color:'#777'}}/>
                                                    </Tooltip>
                                                </Space>
                                                <p>{m.DateCreated.substring(0,10)}</p>
                                            </div>
                                            <div className="map-action-section">
                                                <Dropdown
                                                    menu={{
                                                        items:mapActionsDropdownList,
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <MoreOutlined />
                                                </Dropdown>
                                            </div> 
                                        </div>
                                    </div>
                                </Col>
                            </List.Item>)
                    }}
                />
                
            </div>}

        </PagesWrapper>
    )
}