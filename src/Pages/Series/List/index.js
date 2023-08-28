import React from "react"
import { PagesWrapper } from "../../../PagesWrapper"
import { Col, Divider, Dropdown, Empty, List, Row, Skeleton, Space, Tooltip } from "antd"
import { SeriesSearchTool } from "./SeriesSearchTool"
import { useSeries } from "../../../contexts/SeriesContext"
import { beautifyDatetime } from "../../../services/Auxillary"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {EditOutlined, TrophyOutlined, DeleteOutlined} from '@ant-design/icons';
import { SeriesPlayPocket } from "../Play/SeriesPlayPocket"

export function SeriesList(){
    const {
        isLoadingSeriesQuery, errorGetSeriesQuery, SeriesQuery,
        isLoadingSeriesByIdsQuery, errorGetSeriesByIdsQuery, SeriesByIdsQuery
    } = useSeries() 

    const [firstIndex, setFirstIndex] = useState(0)

    const [showPlaySeriesModal, setShowPlaySeriesModal] = useState(false)
    const [selectedSeries, setSelectedSeries] = useState({Code:''})

    const naviagate = useNavigate()

    const seriesActionList = (s) => [{
        key: 'view_edit_series',
        label: 'View / edit',
        icon: <EditOutlined/>,
        onClick: () => naviagate('/series_edit_view/'+s.Code)
    },
    {
        key: 'play_series',
        label: 'Play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setShowPlaySeriesModal(true)
            setSelectedSeries(s)
        }
    },
    {
        key: 'play_series_with_link',
        label: 'Play with link',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => naviagate('/series_play/'+s.Code)
    },
    {
        key: 'delete_series',
        label: 'Delete',
        icon: <DeleteOutlined/> ,
        onClick: () => {}
    }]

    const renderSeries = () => {
        let series = []
        if(SeriesQuery && !isLoadingSeriesQuery){
            series = SeriesQuery.Series
        }

        if(SeriesByIdsQuery && !isLoadingSeriesByIdsQuery){
            series = SeriesByIdsQuery
        }
        
        return(
           <div>
            {series.length ? 
            <Row
                gutter={24}
            >
                {series.map((q, qi) => {

                const {Code, AddedByName, DateCreated, IsRandom, Elements, MapElements} = q

                return(
                    <Col
                        xs={12}
                        className="series-list-item-container-0"
                    >
                    <div className="series-list-item-container-0-internal">
                            <div className="series-list-item-container-1">
                                <Dropdown
                                    menu={{
                                        items:seriesActionList(q),
                                        title:'Actions'
                                    }}
                                >
                                    <p className="series-list-item-code">
                                        <span className="series-list-item-index">{firstIndex + qi+1}</span>
                                        {Code}
                                    </p>
                                </Dropdown>
                                <br/>

                                <p className="series-list-item-code-adder-date-stats">{AddedByName}</p>
                                <p className="series-list-item-code-adder-date-stats">{beautifyDatetime(DateCreated)}</p>


                            </div>
                            <div>
                                <p className="series-list-item-code-adder-date-stats">{Elements.length} elements</p>
                                {IsRandom && <p className="series-list-item-random-series">Random series</p>}
                                <br/>
                                {MapElements.length
                                ?
                                <List 
                                    dataSource={MapElements}
                                    renderItem={(me, mei) => (
                                        <div 
                                            key={mei}
                                            size={'large'}> 
                                                
                                                <Tooltip 
                                                        color="white"
                                                        title={<img 
                                                            src={me.Map.LargeMapURL}
                                                            alt={me.Title}
                                                            className="map-image-small"
                                                            onClick={() => naviagate('/playcoursemap/'+me.Map.Id)}
                                                        />}
                                                        
                                                    > 
                                                        <p className="series-list-item-map">{me.Map.Title}</p>
                                                    </Tooltip>
                                            </div>
                                        )}
                                /> : <div/>}

                            </div>
                    </div>
                    
                </Col>
                )
                })}
                </Row> : <Space align="center">{!(isLoadingSeriesByIdsQuery || isLoadingSeriesQuery) && <Empty />}</Space>}
           </div>
        )
    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                Series List
            </Divider>
            <SeriesSearchTool  onSetFirstIndex={(i) => setFirstIndex(i)}/>

            <br/>
            {(isLoadingSeriesQuery || isLoadingSeriesByIdsQuery) && <Skeleton />}
            {(!(isLoadingSeriesByIdsQuery || isLoadingSeriesByIdsQuery) && (SeriesQuery || SeriesByIdsQuery)) && renderSeries()}

            <SeriesPlayPocket 
                open={showPlaySeriesModal}
                onClose={() => setShowPlaySeriesModal(false)}
                Code={selectedSeries.Code}
            />
        </PagesWrapper>
    )
}