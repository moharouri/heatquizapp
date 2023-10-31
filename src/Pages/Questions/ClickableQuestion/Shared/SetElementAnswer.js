import { Button, Drawer, Space, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function SetElementAnswer({open, onClose, element, reloadQuestion}){

    if(!open) return <div/>;

    const {} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    return(
        <Drawer
        title={
            <Space size={'large'}>
                <p>Edit answer</p>
                <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                    
                    }}

                    loading={false}
                >
                    Update
                </Button>
            </Space>}
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
        {contextHolder}
        
        
        </Drawer>
    )
}