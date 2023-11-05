import { Layout } from 'antd';
import './PageHeader.css';
import React from 'react';
import NavigationDrawer from './NavigationDrawer';
import UserDrawer from './UserDrawer';
import logoLarge from '../Sources/heatquizlogo_transparent.png'; 
import logoSmall from '../Sources/heatquizlogo_transparent_small.png'; 

const PageHeader = () => {

    return( 
        <Layout.Header
        className='page-header'
        
        >
            <div className='navigation-drawer'>
                <NavigationDrawer />
            </div>
            <img 
                src={logoLarge}
                className="hq-app-logo-large"
                alt='Heat quiz app logo'
            />

            <img 
                src={logoSmall}
                className="hq-app-logo-small"
                alt='Heat quiz app logo'
            />

           <div className='user-datapool-navigation'>     
                <UserDrawer />                    
           </div>
        </Layout.Header>
    )
}

export default PageHeader;