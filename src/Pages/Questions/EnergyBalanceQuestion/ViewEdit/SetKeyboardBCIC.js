import {Button, Drawer, Space, message} from "antd";
import React, {useState } from "react";
import {ArrowLeftOutlined, InsertRowAboveOutlined } from '@ant-design/icons';
import { SelectKeyboardList } from "../../../Keyboards/Shared/SelectKeyboardList";

export function SetKeyboardBCIC({open, onClose, IsBC}){

    if(!open) return <div/>;

    const [selectedKeyboard, setSelectedKeyboard] = useState(null)

    const [messageApi, contextHolder] = message.useMessage()


    return(
        <Drawer
        title={
            <Space size={'large'}>
                <p>Set keyboard for {IsBC ? "Boundary conditions" : "Initial conditions"}</p>

                <Button
                    size="small"
                    type="primary"

                    onClick={() => {
                       
                    }}

                >
                    Update
                </Button>
            </Space>
        }
        width={'70%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        footer={
        <div>
            {selectedKeyboard && 
            <Space>
                <InsertRowAboveOutlined className="default-title default-larger"/>
                <p className="default-title default-larger"> {selectedKeyboard.Name} </p>
            </Space>}
        </div>}
    >   
        {contextHolder}
        <SelectKeyboardList 
            onSelect={(k) => setSelectedKeyboard(k)}
        />

        
    </Drawer>
    )
}