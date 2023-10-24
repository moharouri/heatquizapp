import { Button, Drawer, Form, Input, Switch, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useEffect } from "react";
import { MAX_SERIES_CODE } from "./Constants";
import { useSeries } from "../../../contexts/SeriesContext";
import { useNavigate } from "react-router-dom";

export function EditSeriesBasicInfo({open, onClose, Series}){

    if(!open) return <div/>;

    const {editQuestionsInfo, isLoadingEditQuestionsInfo} = useSeries()

    const navigate = useNavigate()

    const [code, setCode] = useState('')
    const [isRandom, setIsRandom] = useState(false)
    const [randomSize, setRandomSize] = useState(0)
    const [messageApi, contextHolder] = message.useMessage();
    
    useEffect(() => {
        const {Code, IsRandom, RandomSize} = Series
        
        setCode(Code)
        setIsRandom(IsRandom)
        setRandomSize(RandomSize)

        console.log(IsRandom, Series)
    }, [open])

    return(
        <Drawer
        title="Edit series"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            <div>
                {contextHolder}
                <Form>
                    <Form.Item>
                        <small>Code</small>
                        <Input 
                            placeholder="New course code"
                            value={code}
                            onChange={(v) => setCode(v.target.value)}
                            maxLength={MAX_SERIES_CODE}
                            showCount
                        />
                    </Form.Item>
                    <Form.Item>
                        <small>Random ?{' '} {' '}</small>
                        <Switch 
                        checked={isRandom}
                        onChange={(v) => setIsRandom(v)}
                        checkedChildren="Yes" 
                        unCheckedChildren="No" />
                    </Form.Item>
                    <Form.Item>
                        <small>Random sample size</small>
                        <Input 
                            placeholder="Random sample size"
                            value={randomSize}
                            type="number"
                            onChange={(v) => {
                                const value = v.target.value
                                if(value > Series.Elements.length) return;
                                if(value < 1) return;

                                setRandomSize(value)
                            }}
                        />
                    </Form.Item>
                </Form>

                <Button 
                type="primary" 
                size='small'
                onClick={() => {
                    if(!code.trim()){
                        messageApi.destroy()
                        messageApi.warning('Code cannot be empty')
                        return
                    }

                    const VM = ({
                        Id: Series.Id,
                        Code: code,
                        IsRandom: isRandom,
                        RandomSize: randomSize,
                      })
      
                      editQuestionsInfo(VM)
                      .then(
                        (r) => {
                            const {Id} = r
                            
                            if(Id){
                                messageApi.destroy()
                                messageApi.success('Series info updated successfully', 1)
                                .then(() => {
                                    navigate('/series_edit_view/'+code)
                                    onClose()
                                })
                            }
                            else{
                                messageApi.destroy()
                                messageApi.error(r)
                            }
                    })
                }}
                loading = {isLoadingEditQuestionsInfo}
                >
                    Update
                </Button>
            </div>
        </Drawer>
    )
}