import React from 'react';
import {Avatar, Badge, Button, Dropdown, Select, Space, Spin } from 'antd';
import {UserOutlined, BellOutlined, LogoutOutlined} from '@ant-design/icons';
import { useDatapools } from '../contexts/DatapoolsContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getShortenedName } from '../services/Auxillary';


const UserDrawer = () => {
  const {datapools, errorGetDatapools, isLoadingDatapools, selectedDatapool, changeDatapool} = useDatapools()
  const {username, userfullname, profilePicture, isStudent} = useAuth()

  const navigate = useNavigate()

  const onChangeDataPool = (option) => {
    changeDatapool(option)
  }

  const onUserClick = () => {

  }

  const onLogout = () => {
    navigate('/login')
  }

  const userDropdownList = [
    {
      key: 'username',
      label: <span>{username}</span>,
      icon: <UserOutlined/>,
      onClick: onUserClick
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined/>,
      onClick: onLogout
    }
  ];

  return (
    <Space
      
    >
      {!isStudent && 
      <div>

        {!(isLoadingDatapools || errorGetDatapools) && 
        <Select
          onChange={(v, option) => onChangeDataPool(option)}
          defaultValue={'please select'}
          value={selectedDatapool}
          className='navigation-bar-datapools-select'
          options={(datapools || []).map((d) => ({
              value: d.Id,
              label: d.NickName
            }))}
        />}

        {isLoadingDatapools && 
        <div className='navigation-bar-datapools-select-spin'>
          <Spin />
        </div>}
      </div>}

      <Space >
        
          <Dropdown
          menu={{
            items:userDropdownList,
            title:userfullname
          }}
          > 
          <Avatar 
                className='navigation-bar-user-avatar'
                src = {profilePicture}
                >
                     {getShortenedName(userfullname)}
                </Avatar>
          </Dropdown>
           
          {!isStudent && <Button
            type="light"
            onClick = {() => {}}
            icon = {
                <Badge
                    count={0}
                >
                <Avatar 
                    className='navigation-bar-notification-avatar'
                    icon={<BellOutlined />} />
                </Badge>
            }
          >
          </Button>}
          
      </Space>
    </Space>
  );
}

export default UserDrawer;