import './App.css';
import React from 'react';
import {Route, Routes } from 'react-router-dom';
import { Settings } from './Pages/Settings';
import { Content } from 'antd/es/layout/layout';
import { NotFoundPage } from './Pages/StatusPages/NotFoundPage';
import { Login } from './Pages/Login';
import { DatapoolsProvider } from './contexts/DatapoolsContext';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './Pages/Dashboard';

function App() {
  const {playerKey, token, username} = useAuth()

  return (
    <div className="App">
          <Content>

              <Routes>
                <Route path="/Login" exact element={
                  <DatapoolsProvider>
                    <Login />
                  </DatapoolsProvider>
                }/>
                <Route path="/" exact element={<Dashboard />}/>
                <Route path="/settings" element={<Settings />}/>
                <Route path="*" exact element={<NotFoundPage />}/>
              </Routes>
          </Content>
     </div>
  );
}

export default App;
