import { Layout } from 'antd';
import './PageHeader.css';
import React from 'react';
import NavigationDrawer from './NavigationDrawer';
import UserDrawer from './UserDrawer';

const PageHeader = () => {

    return( 
        <Layout.Header
        className='page-header'
        
        >
            <div className='navigation-drawer'>
                <NavigationDrawer />
            </div>
            <img 
                src='heatquizlogo_transparent.png'
                className="app-logo"
                alt='Heat quiz app logo'
            />

           <div className='user-datapool-navigation'>     
                    <UserDrawer />                    
           </div>
        </Layout.Header>
    )
}

export default PageHeader;