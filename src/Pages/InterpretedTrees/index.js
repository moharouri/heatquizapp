import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { Button, Col, Divider, Dropdown, Row, Select, Skeleton, Space, message } from "antd";
import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";
import { useDatapools } from "../../contexts/DatapoolsContext";
import {PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined, SlidersOutlined} from '@ant-design/icons';
import './InterpretedTrees.css'
import { EditTreeName } from "./EditTreeName";
import {AddTree} from "./AddTree"
import { AddImage } from "./AddImage";
import { EditImageName } from "./EditImageName";
import { EditImagePicture } from "./EditImagePicture";
import { EditImageValues } from "./EditImageValues";

export function InterpretedTrees(){

    const {interpretedTrees, errorGetInterpretedTrees, isLoadingInterpretedTrees, getAllInterpretedTrees} = useInterpretedTrees()
    const {selectedDatapool} = useDatapools()
    const [selectedTree, setSelectedTree] = useState(null)

    const [showAddTreeModal, setShowAddTreeModal] = useState(false)
    const [showEditTreeNameModal, setShowEditTreeNameModal] = useState(false)

    const [showAddImageModal, setShowAddImageModal] = useState(false)
    const [showEditImageNameModal, setShowEditImageNameModal] = useState(false)
    const [showEditImagePictureModal, setShowEditImagePictureModal] = useState(false)
    const [showEditImageValuesModal, setShowEditImageValuesModal] = useState(false)

    const [selectedNode, setSelectedNode] = useState(null)


    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        getAllInterpretedTrees()
    }, [selectedDatapool])

    useEffect(() => {
        if(interpretedTrees && interpretedTrees.length){
            setSelectedTree(interpretedTrees[0])
        }
        else{
            setSelectedTree(null)
        }
    }, [interpretedTrees])

    useEffect(() => {
        if(errorGetInterpretedTrees){
            messageApi.destroy()
            messageApi.error(errorGetInterpretedTrees)
        }
    }, [errorGetInterpretedTrees])

    const imageActionList = (t) => [
        {
            key: 'edit_tree_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setSelectedNode(t)
                setShowEditImageNameModal(true)
            }
        },
        {
            key: 'edit_tree_image',
            label: 'Edit image ',
            icon: <PictureOutlined/>,
            onClick: () => {
                setSelectedNode(t)
                setShowEditImagePictureModal(true)
            }
        },
        {
            key: 'edit_image',
            label: 'Edit values ',
            icon: <SlidersOutlined />,
            onClick: () => {
                setSelectedNode(t)
                setShowEditImageValuesModal(true)
            }
        },
        !(t.ClickCharts.length)
        &&
        {
            key: 'delete_tree',
            label: 'Delete',
            icon: <DeleteOutlined />,
            onClick: () => {}
        }
    ]

    const renderSelectTree = () => {
        const {Name, Images} = (selectedTree || {Name:'Please select/add', Images:[]})
        return(
            <Space size={"large"}>
            {!(isLoadingInterpretedTrees || errorGetInterpretedTrees) && interpretedTrees 
            && 
                <Select
                    onChange={(v, option) => {
                        const findSelectedTree = interpretedTrees.filter(t => t.Id === option.value)[0]

                        setSelectedTree(findSelectedTree)
                    }}
                    defaultValue={'please select'}
                    value={Name + ' ' + (Images.length ? '( ' + Images.length + ' images )' : '')}
                    className='navigation-bar-interpreted-trees-select'
                    options={
                    (interpretedTrees || [])
                        .map((d) => ({
                        value: d.Id,
                        label: d.Name
                    }))
                }
                />}

            {!isLoadingInterpretedTrees && selectedTree && 
                <Space size={'small'}>
                    <Button
                        onClick={() =>  {
                            setShowEditTreeNameModal(true)
                        }}
                    >
                        <EditOutlined/>
                        Edit name
                    </Button>

                    <Button
                        onClick={() => setShowAddImageModal(true)}
                    >
                        <PlusOutlined style={{color:'green'}}/>
                        New image
                    </Button>

                </Space>
            }
        </Space>
        )
    }

    const renderSelectedTree = () => {
        const {Images} = selectedTree

        return(
            <div>
            <br/>
                <Row >
                    {Images.map((img) => 
                    <Col 
                        xs ={4}
                        lg={6}
                        md={4}
                        key={img.Id}
                    >
                        <div className="interpreted-tree-item-container">
                            <div className="interpreted-tree-head-container">
                                <Dropdown
                                    menu={{
                                        items:imageActionList(img),
                                        title:'Actions'
                                    }}
                                >
                                    <p className="interpreted-tree-head-title interpreted-tree-clickable-title">{img.Code}</p>
                                </Dropdown>
                                <small className="interpreted-tree-usage-times">{ img.ClickCharts.length ? img.ClickCharts.length + ' usage times' : ''} </small>
                                <Space size={'large'}>
                                <img 
                                    src={img.URL}
                                    className="interpreted-tree-head-img"
                                    alt={img.Name}
                                />
                                <div className="interpreted-tree-values-list">
                                    <p><small className="interpreted-tree-values-type">Left</small>{img.Left.Value}</p>
                                    
                                    <p><small className="interpreted-tree-values-type">Right</small>{img.Right.Value}</p>
                                 
                                    <p><small className="interpreted-tree-values-type">Ratio</small>{img.RationOfGradients.Value}</p>
                                    
                                    <p><small className="interpreted-tree-values-type">Jump</small>{img.Jump.Value}</p>
                                </div>
                                </Space>
                            </div>
                                    
                        </div>
                    </Col>
                    )}
                </Row>
            </div>
        )
    }

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider orientation="left">
                <span className="page-title">
                    Interpreted Trees
                </span>
                <Button
                    type={'default'}
                    onClick={() => setShowAddTreeModal(true)}
                >
                    <PlusOutlined style={{color:'green'}}/>
                    New tree
                </Button>
            </Divider>

            <AddTree 
                open={showAddTreeModal}
                onClose={()=>setShowAddTreeModal(false)}
            />

            <EditTreeName 
                open={showEditTreeNameModal}
                onClose={() => setShowEditTreeNameModal(false)}
                tree={selectedTree}
            />

            <AddImage 
                open={showAddImageModal}
                onClose={()=>setShowAddImageModal(false)}
                baseTree={selectedTree}

            />

            <EditImageName 
                open={showEditImageNameModal}
                onClose={() => setShowEditImageNameModal(false)}
                node={selectedNode}
            />

            <EditImagePicture 
                open={showEditImagePictureModal}
                onClose={() => setShowEditImagePictureModal(false)}
                node={selectedNode}
            />

            <EditImageValues 
                open={showEditImageValuesModal}
                onClose={() => setShowEditImageValuesModal(false)}
                node={selectedNode}
            />

            {isLoadingInterpretedTrees && <Skeleton />}
            
            {renderSelectTree()}
            {!isLoadingInterpretedTrees && selectedTree && renderSelectedTree()}
            
        </PagesWrapper>
    )
}