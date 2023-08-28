import React, {useState } from "react"
import './Login.css';

import { Alert, Button, Form, Input, Select, Space, Spin } from "antd";
import {RocketTwoTone } from '@ant-design/icons';
import {useDatapools } from "../../contexts/DatapoolsContext";
import { useAuth } from "../../contexts/AuthContext";
import { login, setIsStudent_LS, setToken_LS, setUserFullname_LS, setUsername_LS } from "../../services/Auth";
import {useAsyncFn} from '../../hooks/useAsync'
import {useNavigate } from "react-router-dom";

export function Login(){

    const {datapools, isLoading , error} = useDatapools()

    const navigate = useNavigate()

    const {
        setIsStudent,
        setUsername,
        setUserfullname,
        setProfilePicture,
        setRoles,
        playAsStudent} = useAuth()

    const { loading: isLogging, value: loginResponse, error: loginResponseError, execute: loginAttempt } = useAsyncFn(login, [])

    const [loginInfo, setloginInfo] = useState({
        username:'',
        password:'',
        datapoolId:0
    })

    const [loginError, setLoginError] = useState('')
   
    const onValuesChange = (v) => {
        setloginInfo(prev => ({...prev, ...v}))
    }

    const onLogin = () => {
        //const {value: userInfo, isLoading, error} = useAsync(() => 
        loginAttempt({...loginInfo, username: loginInfo.username.trim()}).then(() => {

            if(loginResponse){
                const {name, username,  access_token, profilePicture, roles} = loginResponse
                setUsername(username)
                setUserfullname(name)

                setUsername_LS(username)
                setUserFullname_LS(name)

                setToken_LS(access_token)

                setProfilePicture(profilePicture)
                setRoles(roles)

                setIsStudent_LS(false)
                setIsStudent(false)

                setLoginError('')
                navigate('/')
            }   
            else {
                setLoginError('Failed login')
            }
        })
        
    }

    const onStudentLogin = () => {
        playAsStudent()
    }


    return(
        <div className="login-container">
            <Space.Compact
            >
                <Form                
                    layout="vertical"
                    className="login-form"
                    initialValues={{remember: true,}}

                    onValuesChange={(values) => onValuesChange(values)}
                    autoComplete="off"
                >
                    <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                        required: true,
                        message: 'Please provide username',
                        whitespace: true
                        }
                        ]}
                    >
                    <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                            required: (loginInfo.username.trim()),
                            message:  'Please provide password',
                            },
                        ]}
                    >
                    <Input.Password />
                    </Form.Item>
                    <Form.Item 
                    label="Datapool"
                    name="datapoolId"
                    rules={[
                        {
                        required: (loginInfo.username.trim() && loginInfo.password),
                        message: 'Please select a datapool',
                        },
                    ]}
                    >
                        {!(isLoading || error) && 
                            <Select
                            options={(datapools||[]).map((d) => ({
                                        value: d.Id,
                                        label: d.NickName
                                    }))}
                            />}

                        {isLoading && <Spin />}
                    </Form.Item>
                                
                    <Form.Item >
                        <Space>
                            <Button 
                            type="primary" 
                            htmlType="submit"
                            onClick={() => onLogin()}
                            loading = {isLogging}
                            >
                                Login
                            </Button>

                            {!isLogging && <Button
                                icon={<RocketTwoTone  />}
                                htmlType="submit" 
                                onClick={() => onStudentLogin()}
                            >
                                Login as student
                            </Button>}
                        </Space>
                    </Form.Item>
                    {loginError && 
                    <Form.Item>
                        <Alert message={loginError + ": " + (loginResponseError || '')} type="error" />
                    </Form.Item>}
                </Form>
                <div className="login-welcome">
                    <img 
                        src='heatquizlogo_transparent.png'
                        className="app-logo"
                        alt='Heat quiz app logo'
                    />
                    <small >Heat Quiz App</small>
                    <br/>
                    <p>An educational platform developed by <a href="https://www.rwth-aachen.de/">RWTH Aachen University</a></p>
                </div>
            </Space.Compact>
        </div>
    )
}