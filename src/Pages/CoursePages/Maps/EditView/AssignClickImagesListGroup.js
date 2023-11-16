import {Button, Drawer, Space, message} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';

export function AssignClickImagesListGroup({open, onClose}){
    
    if(!open) return <div/>;

    const [selectedList, setSelectedList] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);

    const [api, contextHolder] = message.useMessage()

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space
                align="start"
                className="hq-opposite-arrangement"
            >
                <Space>
                    <p>Assign list</p>

                    <Button
                        size="small"
                        type="primary"
                        loading={false}
                        onClick={() => {
                          
                        }}
                    >
                        Assign
                    </Button>
                </Space>
            </Space>}
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >

            </Drawer>
        </div>
    )
}