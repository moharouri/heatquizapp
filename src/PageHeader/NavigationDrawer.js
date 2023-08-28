import React, {useState } from "react";
import {MenuOutlined, BuildTwoTone, SettingTwoTone, IdcardTwoTone, SnippetsTwoTone, BellTwoTone, SoundTwoTone,DatabaseTwoTone, ContainerTwoTone, FlagTwoTone, AppstoreTwoTone, ControlTwoTone, SlidersTwoTone} from '@ant-design/icons';
import { Button, Drawer, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCourses } from "../contexts/CoursesContext";
import { useAuth } from "../contexts/AuthContext";

const NavigationDrawer = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState('dashboard')
    const {roles, isStudent,} = useAuth()

    const navigate = useNavigate()

    const {myCourses} = useCourses()

    const onChangePage = (e) => {        
        setCurrentPage(e.key)
        navigate(e.key)
        setDrawerOpen(false)
    }


    const iconStyle = ({fontSize:'150%'})

    const studentNavigationItems = [{
        label:'Dashboard',
        key:'/',
        icon: <BuildTwoTone style={{...iconStyle}}/>
    }]

    const adminNavigationItems = [{
        label:'Dashboard',
        key:'/',
        icon: <BuildTwoTone style={{...iconStyle}}/>
    },
    {
        label:'Level of difficulty',
        key:'/level_of_difficulty',
        icon: <SlidersTwoTone style={{...iconStyle}}/>
    }]

    const navigationItems = [{
        label:'Dashboard',
        key:'/',
        icon: <BuildTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Settings',
        key:'/settings',
        icon: <SettingTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Profile / Colleagues',
        key:'/profile',
        icon: <IdcardTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Reports',
        key:'/reports',
        icon: <SnippetsTwoTone style={{...iconStyle}}/>
    }, 
    {
        label:'Courses',
        children:[
            {
                label:'Courses list',
                key:'/courses',
                icon:<DatabaseTwoTone style={{...iconStyle}}/>
            },
            ...(myCourses || []).map((c, ci) => 
            ({
                label:c.Name,
                key:'/viewcourse/'+c.Id,
                icon:<ContainerTwoTone   style={{...iconStyle}}/>
            }))
        ],
        type:'group'
    },    
    {
        label:'Notifications',
        key:'/notifications',
        icon: <BellTwoTone  style={{...iconStyle}}/>
    },    
    {
        label:'Student feedback',
        key:'/feedback',
        icon: <SoundTwoTone style={{...iconStyle}}/>
    },    
    {
        label:'Topics',
        key:'/topics',
        icon: <FlagTwoTone  style={{...iconStyle}}/>
    },    
    {
        label:'Click trees',
        key:'/click_trees',
        icon: <AppstoreTwoTone   style={{...iconStyle}}/>
    },    
    {
        label:'Interpreted trees',
        key:'/interpreted_trees',
        icon: <ControlTwoTone     style={{...iconStyle}}/>
    },    
    {
        label:'Questions',
        children:[
        {
            label:'Questions list',
            key:'/questions_list',
            icon:<DatabaseTwoTone style={{...iconStyle}}/>
        }
        ],
        type:'group'
    },    
    {
        label:'Series',
        children:[
        {
            label:'Series list',
            key:'/series_list',
            icon:<DatabaseTwoTone style={{...iconStyle}}/>
        }
        ],
        type:'group'
    }
]   

    let navigationList = navigationItems
    const isAdmin = roles.includes('admin')
    const isNormalUser = roles.includes('course_editor')

    if(isStudent) navigationList = studentNavigationItems
    if(isAdmin) navigationList = adminNavigationItems
    //if(isNormalUser) navigationList = navigationItems

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
                    items={navigationList} 
                />
            </Drawer>
        </div>
    )
}

export default NavigationDrawer;