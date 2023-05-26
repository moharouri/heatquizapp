import React, {useState } from "react";
import {MenuOutlined, BuildTwoTone, SettingTwoTone, IdcardTwoTone, SnippetsTwoTone, GoldTwoTone, BellTwoTone, SoundTwoTone} from '@ant-design/icons';
import { Button, Drawer, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const NavigationDrawer = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState('dashboard')

    const navigate = useNavigate()

    const onChangePage = (e) => {        
        setCurrentPage(e.key)
        navigate(e.key)
        setDrawerOpen(false)
    }


    const iconStyle = ({fontSize:'150%'})

    const navigationItems = [{
        label:'Dashboard',
        key:'/',
        icon: <BuildTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Settings',
        key:'settings',
        icon: <SettingTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Profile / Colleagues',
        key:'profile',
        icon: <IdcardTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Reports',
        key:'reports',
        icon: <SnippetsTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Courses',
        key:'courses',
        icon: <GoldTwoTone  style={{...iconStyle}}/>
    },    
    {
        label:'Notifications',
        key:'notifications',
        icon: <BellTwoTone  style={{...iconStyle}}/>
    },    
    {
        label:'Student feedback',
        key:'feedback',
        icon: <SoundTwoTone   style={{...iconStyle}}/>
    }
]
    return(
        <div>
            <Button
                type="light"
                onClick = {() => setDrawerOpen(!drawerOpen)}
            >
                <MenuOutlined /> 
            </Button>
            <Drawer
                title="Pages"
                placement="left"
                closable={false}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
            >
                <Menu 
                    onClick={onChangePage}
                    selectedKeys={[currentPage]}
                    mode="vertical"
                    theme="light"
                    items={navigationItems} 
                />
            </Drawer>
        </div>
    )
}

export default NavigationDrawer;