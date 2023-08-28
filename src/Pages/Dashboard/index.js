import React from "react"
import { PagesWrapper } from "../../PagesWrapper"
import { useAuth } from "../../contexts/AuthContext"
import { Input, QRCode, Space } from "antd"
import './Dashboard.css'

export function Dashboard(){
    const {currentPlayerKey} = useAuth()

    return(
        <PagesWrapper>
            
            <Space direction="vertical" align="center">
                <QRCode
                    value={currentPlayerKey||'-'}
                />
                <Input
                    value={currentPlayerKey}
                    disabled
                    style={{backgroundColor:'white', cursor:'text', textAlign:'center', color:'black'}}
                />
            </Space>
        </PagesWrapper>
    )
}