import React from 'react';
import {Avatar, Badge, Button, Dropdown, Select, Space, Spin } from 'antd';
import {UserOutlined, BellOutlined, LogoutOutlined} from '@ant-design/icons';
import { useDatapools } from '../contexts/DatapoolsContext';


const UserDrawer = () => {
  const {datapools, isLoading , error, selectedDatapool, changeDatapool} = useDatapools()

  const onChangeDataPool = (option) => {
    changeDatapool(option)
  }

  const onUserClick = () => {

  }

  const onLogout = () => {

  }

  const userDropdownList = [
    {
      key: 'username',
      label: <span>Mohannad Alarouri</span>,
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
      <div>

        {!(isLoading || error) && 
        <Select
          onChange={(v, option) => onChangeDataPool(option)}
          defaultValue={'please select'}
          value={selectedDatapool}
          className='navigation-bar-datapools-select'
          options={datapools.map((d) => ({
              value: d.Id,
              label: d.NickName
            }))}
        />}

        {isLoading && 
        <div className='navigation-bar-datapools-select-spin'>
          <Spin />
        </div>}
      </div>

      <Space >
        
          <Dropdown
          menu={{
            items:userDropdownList,
            title:'Mohannad Alarouri'
          }}
          > 
          <Avatar 
                className='navigation-bar-user-avatar'
                src = 'http://167.86.98.171:6001/Files//Users/User_ProfWilko/iahahawd.twq.jpg'
                >
                    MA
                </Avatar>
          </Dropdown>
           
          <Button
            type="light"
            onClick = {() => {}}
            icon = {
                <Badge
                    count={9}
                >
                <Avatar 
                    className='navigation-bar-notification-avatar'
                    icon={<BellOutlined />} />
                </Badge>
            }
          >
          </Button>
          
      </Space>
    </Space>
  );
}

export default UserDrawer;