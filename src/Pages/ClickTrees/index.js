import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { Button, Divider, Dropdown, List, Select, Skeleton, Space, message } from "antd";
import { useClickTrees } from "../../contexts/ClickTreesContext";
import { useDatapools } from "../../contexts/DatapoolsContext";
import {PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined} from '@ant-design/icons';

import './ClickTrees.css'
import { AddTree } from "./AddTree";
import { AddImageTree } from "./AddImageTree";
import { AddLeaf } from "./AddLeaf";
import { EditTreeName } from "./EditTreeName";
import { EditNodeName } from "./EditNodeName";
import { EditNodeImage } from "./EditNodeImage";

export function ClickTrees(){
    const {clickTrees, errorGetClickTrees, isLoadingClickTrees, getAllClickTrees} = useClickTrees()
    const {selectedDatapool} = useDatapools()

    const [selectedTree, setSelectedTree] = useState(null)
    const [showAddTreeModal, setShowAddTreeModal] = useState(false)
    const [showEditTreeNameModal, setShowEditTreeNameModal] = useState(false)

    const [showAddImageTreeModal, setShowAddImageTreeModal] = useState(false)
    const [showAddLeafModal, setShowAddLeafModal] = useState(false)
    const [selectedBaseImage, setSelectedBaseImage] = useState(null)

    const [showEditNodeNameModal, setShowEditNodeNameModal] = useState(false)
    const [showEditNodeImageModal, setShowEditNodeImageModal] = useState(false)
    const [selectedNode, setSelectedNode] = useState(null)

    const [messageApi, contextHolder] = message.useMessage()



    useEffect(() => {
        getAllClickTrees().then(() => {
            if(errorGetClickTrees){
                messageApi.destroy()
                messageApi.error(errorGetClickTrees)
            }
            
        })
    }, [selectedDatapool])

    useEffect(() => {
        if(clickTrees && clickTrees.length){
            setSelectedTree(clickTrees[0])
        }
        else{
            setSelectedTree(null)
        }
    }, [clickTrees])

    const baseImageActionList = (t) => [
        {
            key: 'edit_tree_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setSelectedNode(t)
                setShowEditNodeNameModal(true)
            }
        },
        {
            key: 'edit_tree_image',
            label: 'Edit image ',
            icon: <PictureOutlined/>,
            onClick: () => {
                setSelectedNode(t)
                setShowEditNodeImageModal(true)
            }
        },
        {
            key: 'add_image',
            label: 'Add leaf',
            icon: <PlusOutlined />,
            onClick: () => {
                setSelectedBaseImage(t)
                setShowAddLeafModal(true)
            }
        },
        !(t.ClickImages.length + t.Leafs.reduce((r, c) => r += c.ClickImages.length, 0))
        &&
        {
            key: 'delete_tree',
            label: 'Delete',
            icon: <DeleteOutlined />,
            onClick: () => {}
        }
    ]

    const leafImageActionList = (l) => [
        {
            key: 'edit_leaf_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setSelectedNode(l)
                setShowEditNodeNameModal(true)
            }
        },
        {
            key: 'edit_leaf_image',
            label: 'Edit image ',
            icon: <PictureOutlined />,
            onClick: () => {
                setSelectedNode(l)
                setShowEditNodeImageModal(true)
            }
        },
        !l.ClickImages.length
        &&
        {
            key: 'delete_leaf',
            label: 'Delete',
            icon: <DeleteOutlined />,
            onClick: () => {}
        }
    ]

    const renderSelectTree = () => {

        return(
            <Space size={"large"}>
            {!(isLoadingClickTrees || errorGetClickTrees) && clickTrees 
            && 
                <Select
                    onChange={(v, option) => {
                        const findSelectedTree = clickTrees.filter(t => t.Id === option.value)[0]

                        setSelectedTree(findSelectedTree)
                    }}
                    defaultValue={'please select'}
                    value={(selectedTree || {Name:'Please select/add'}).Name}
                    className='navigation-bar-click-trees-select'
                    options={
                    (clickTrees || [])
                        .map((d) => ({
                        value: d.Id,
                        label: d.Name
                    }))
                }
                />}

            {!isLoadingClickTrees && selectedTree && 
                <Space size={'small'}>
                    <Button
                        onClick={() =>  setShowEditTreeNameModal(true)}
                    >
                        <EditOutlined/>
                        Edit name
                    </Button>

                    <Button
                        onClick={() => setShowAddImageTreeModal(true)}
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
                <List 
                    dataSource={Images}
                    renderItem={(img, imgIndex) => {

                        return(
                            <List.Item
                                key={img.Id}
                            >
                                <div className="click-tree-item-container">
                                    <div className="click-tree-head-container">
                                        <Dropdown
                                            menu={{
                                                items:baseImageActionList(img),
                                                title:'Actions'
                                            }}
                                        >
                                            <p className="click-tree-head-title click-tree-clickable-title">{img.Name}</p>
                                        </Dropdown>
                                        
                                        <small className="click-tree-usage-times">{ img.ClickImages.length ? img.ClickImages.length + ' usage times' : ''} </small>
                                        <img 
                                            src={img.URL}
                                            className="click-tree-head-img"
                                            alt={img.Name}
                                        />
                                    </div>
                                    <div className="click-tree-leaf-container">

                                        {img.Leafs.map(l => {
                                            return(
                                                <div className="click-tree-leaf">
                                                    <Dropdown
                                                        menu={{
                                                            items:leafImageActionList(l),
                                                            title:'Actions'
                                                        }}
                                                    >
                                                        <p className="click-tree-leaf-title click-tree-clickable-title">{l.Name}</p>
                                                    </Dropdown>
                                                    <small className="click-tree-usage-times">{ l.ClickImages.length ? l.ClickImages.length + ' usage times' : ''} </small>
                                                    <img 
                                                        src={l.URL}
                                                        className="click-tree-leaf-img"
                                                        alt={l.Name}
                                                    />
                                                </div>
                                            )
                                            })}
                                    </div>
                                </div>
                            </List.Item>
                        )
                    }}
                />
            </div>
        )
    }

    return(
        <PagesWrapper>
            {contextHolder}

            <AddTree 
                open={showAddTreeModal}
                onClose={()=>setShowAddTreeModal(false)}
            />

            <EditTreeName 
                open={showEditTreeNameModal}
                onClose={() => setShowEditTreeNameModal(false)}
                tree={selectedTree}
            />

            <AddImageTree 
                open={showAddImageTreeModal}
                onClose={()=>setShowAddImageTreeModal(false)}
                baseTree={selectedTree}

            />

            <EditNodeName 
                open={showEditNodeNameModal}
                onClose={() => setShowEditNodeNameModal(false)}
                node={selectedNode}
            />

            <EditNodeImage 
                open={showEditNodeImageModal}
                onClose={() => setShowEditNodeImageModal(false)}
                node={selectedNode}
            />

            <AddLeaf 
                open={showAddLeafModal}
                onClose={() => setShowAddLeafModal(false)}
                baseTree={selectedTree}
                baseImage={selectedBaseImage}
            />

            <Divider orientation="left">
                    <span className="page-title">
                        Click trees
                    </span>
                    <Button
                        type={'default'}
                        onClick={() => setShowAddTreeModal(true)}
                    >
                        <PlusOutlined style={{color:'green'}}/>
                        New tree
                    </Button>
            </Divider>

            {isLoadingClickTrees && <Skeleton />}
            
            {renderSelectTree()}
            {!isLoadingClickTrees && selectedTree && renderSelectedTree()}
        </PagesWrapper>
    )
}