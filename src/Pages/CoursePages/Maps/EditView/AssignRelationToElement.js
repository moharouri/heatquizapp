import {Button, Drawer, Space, message, Form, Input, Select} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AssignRelationshipToElement({open, onClose, element, elements, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingAssignRelationToMapElement, assignRelationToMapElement} = useMaps()

    const [selectedElement, setSelectedElement] = useState(null)
    const [threshold, setThreshold] = useState(1)

    const [api, contextHolder] = message.useMessage()

    const selectableElements = elements.filter(a => a.Id !== element.Id)

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space>
                <p>Assign relation to element {' '}{element.Title}</p>

                <Button
                    size="small"
                    type="primary"
                    loading={loadingAssignRelationToMapElement}
                    onClick={() => {
                        if(!selectedElement){
                            api.destroy()
                            api.warning("Please select required element")

                            return
                        }

                        if(threshold < 1 || threshold > 100){
                            api.destroy()
                            api.warning("Threshold should between 1 and 100")

                            return
                        }

                        const VM = ({
                            ...element,
                            RequiredElementId: selectedElement.Id,
                            Threshold: threshold
                        })

                        assignRelationToMapElement(VM)
                        .then(
                            (r) =>
                            handleResponse(
                                r,
                                api,
                                'Relationship assigned successfuly',
                                1,
                                () => {
                                    reloadMap()
                                    onClose()
                                }))
                    }}
                >
                    Assign
                </Button>
            </Space>}
            width={'40%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
            <Form>
                <Form.Item>
                    <small>Threshold</small>
                    <Input 
                        placeholder="Relationship threshold"
                        value={threshold}
                        type="number"
                        onChange={(v) => {
                            const value = v.target.value

                            if(value < 1) return;
                            if(value > 100) return;
                            
                            setThreshold(value)
                        }}
                        min={1}
                        max={100}
                    />
                </Form.Item>
                <Form.Item>
                    <small>Required element</small>
                    <Select
                            
                        onChange={(v, option) => {
                            const findE = selectableElements.filter(l => l.Id === option.value)[0]

                            setSelectedElement(findE)
                        }}
                        
                        defaultValue={'please select'}
                        value={(selectedElement || {'Title': 'please select'}).Title}

                        options={(selectableElements || []).map((d) => ({
                            value: d.Id,
                            label: d.Title
                        }))}
                    />
                </Form.Item>
            </Form>
            </Drawer>
        </div>
    )
}