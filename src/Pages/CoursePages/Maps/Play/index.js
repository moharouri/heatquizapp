import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { useParams } from "react-router-dom";
import { useMaps } from "../../../../contexts/MapsContext";
import { useEffect } from "react";
import { Button, FloatButton, Input, Modal, Result, Skeleton, Space, message, notification } from "antd";
import { useState } from "react";
import { ZoomInOutlined, ZoomOutOutlined, FlagTwoTone, LockTwoTone, PushpinOutlined } from '@ant-design/icons';
import { MAP_SCALE_REDUCTION } from "./constants";
import { SeriesPlay } from "../../../../Components/SeriesPlay";
import { FixURL, goToMapPlay } from "../../../../services/Auxillary";

import './Play.css'
import { getMapKey_LS, getMapPlayStatisticsRequest_LS, updateMapKey_LS, updateMapPlayStatisticsRequest_LS } from "../../../../services/Maps";
import { useAuth } from "../../../../contexts/AuthContext";

export function MapPlay(){
    const {
        loadingMap, getMapError, map, getMap,
        addMapPDFStatistic
    } = useMaps()
    const {id} = useParams()

    const [api, contextHolder] = message.useMessage()
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const {currentPlayerKey} = useAuth()

    const [playStats, setPlayStats] = useState(null)

    const [imageIntialWidth, setImageIntialWidth] = useState(0)
    const [imageBaseWidth, setImageBaseWidth] = useState(0)
    const [topOffset, setTopOffset] = useState(0)

    const baseRef = React.createRef()
    const [zoomScaleIndex, setZoomScaleIndex] = useState(0)

    const [playSeries, setPlaySeries] = useState(false)
    const [selectedMapElement, setSelectedMapElement] = useState(null)
    const [selectedPlaySeries, setSelectedPlaySeries] = useState(null)

    const [localMapKey, setLocalMapKey] = useState(null)
    const [showSetLocalKey, setShowSetLocalKey] = useState(false)
    const [newKey, setNewKey] = useState(null)

    const initialize = () => {
        getMap(id)
        
        //Get map play statistics on this device
        const result = getMapPlayStatisticsRequest_LS(id) 
        setPlayStats(result)

        setPlaySeries(false)
        setSelectedPlaySeries(null)

        const key = getMapKey_LS(id)

        setLocalMapKey(key)
    }

    useEffect(() => {
        initialize()
    }, [id])

    useEffect(() => {
        if(getMapError){
            api.destroy()
            api.error(getMapError)
        }
    }, [getMapError])

    useEffect(() => {
        if(map && baseRef){
            const styles = baseRef.current.getBoundingClientRect()
            const width = styles.width
            
            const parentStyles = window.getComputedStyle(baseRef.current.parentNode)
            const offset = parseInt(parentStyles.getPropertyValue('padding-top').replace('px', ' '))

            setImageIntialWidth(width)
            setImageBaseWidth(width)
            setTopOffset(offset)
        }
    }, [map])

    const getElementPositionStyle = (imageWidth, BackgroundImageWidth, p) => ({
        width: ((imageWidth)/BackgroundImageWidth)* p.Width,
        height: ((imageWidth)/BackgroundImageWidth)*p.Length ,
        left: ((imageWidth)/BackgroundImageWidth)*p.X,
        top:  ((imageWidth)/BackgroundImageWidth)*p.Y + topOffset,
    })

    const getBadgePositionStyle = (imageWidth, BackgroundImageWidth, p) => ({
        width: ((imageWidth)/BackgroundImageWidth)* p.Badge_Width,
        height: ((imageWidth)/BackgroundImageWidth)*p.Badge_Length ,
        left: ((imageWidth)/BackgroundImageWidth)*p.Badge_X,
        top:  ((imageWidth)/BackgroundImageWidth)*p.Badge_Y + topOffset,
    })

    const playSeriesActivate = (s, e) => {
        notificationApi.destroy()
        setPlaySeries(true)
        setSelectedPlaySeries(s)
        setSelectedMapElement(e)
    }   

    const renderRequiredElement = (e) => {
        const {RequiredElement, Title, Threshold} = e

        const requiredElementFull = map.Elements.filter(a => a.Id === RequiredElement.Id)[0]

        notificationApi.open({
            message: Title,
            style:{width:'25vw'},
            description:
            <Result 
                icon={<LockTwoTone />}
                subTitle={
                    <div>
                        <p>Solve at least <u>{Threshold}%</u> of question series of element </p>
                        <strong
                        className="map-required-element-modal-click"
                        onClick={() => onClickElement(requiredElementFull)}>
                            {RequiredElement.Title}
                        </strong>
                        <p>successfully to unlock</p>
                    </div>
                }
            />
             ,
             duration: 0,
             placement:'top',
             icon:<FlagTwoTone/>
        })
    }

    const addPDFStat = (e) => {
        const data = new FormData()
        data.append('ElementId', e.Id)
        data.append('Player', currentPlayerKey)

        addMapPDFStatistic(data)
    }

    const onClickElement = (e) => {
        notificationApi.destroy()
        setSelectedMapElement(e)

        const {QuestionSeries, PDFURL, ExternalVideoLink, VideoURL, RequiredElement, Threshold, MapAttachment} = e

        if(RequiredElement){
            let existingElementIndex = playStats.ElementsProgress.map((a, ai) => a.Id === e.Id ? (ai) : null)[0]

            const progress = playStats.ElementsProgress[existingElementIndex]

            if(!progress){

                renderRequiredElement(e)

                return
            }
        
            const finalProgress = evaluateElementProgress(QuestionSeries, progress)
            
            if(finalProgress < Threshold){
                renderRequiredElement(e)
                return
            }
        }

        //Only question series 
        if(QuestionSeries && !(PDFURL || ExternalVideoLink || VideoURL || MapAttachment)){
            playSeriesActivate(QuestionSeries, e)
            return
        }

        //Only pdf
        if(PDFURL && !(QuestionSeries || ExternalVideoLink || VideoURL|| MapAttachment)){
            window.open(PDFURL)
            addPDFStat(e)
            return
        }   

        //Only link
        if(ExternalVideoLink && !(PDFURL || QuestionSeries || VideoURL|| MapAttachment)){
            window.open(ExternalVideoLink)
            return
        }

        //Only video
        if(VideoURL && !(PDFURL || QuestionSeries || ExternalVideoLink|| MapAttachment)){
            window.open(VideoURL)
            return
        }

        const {Title, CourseMapElementImages} = e

        let seriesImage = null
        let pdfImage = null
        let videoImage = null
        let linkImage = null

        if(CourseMapElementImages){
            seriesImage = CourseMapElementImages.Play
            pdfImage = CourseMapElementImages.PDF
            videoImage = CourseMapElementImages.Video
            linkImage = CourseMapElementImages.Link
        }

        notificationApi.open({
            style:{width:'36vw'},
            message: Title,
            description:
             <Space
                size={'large'}
                align="center"
             >
                {QuestionSeries && 
                (!seriesImage ? 
                <Button onClick={() => playSeriesActivate(QuestionSeries, e)}>Series </Button> 
                : 
                <img 
                    alt="series"
                    className="map-element-modal-img"
                    src={seriesImage}
                    onClick={() => playSeriesActivate(QuestionSeries, e)}
                />)}

                {PDFURL && 
                (!pdfImage ? 
                <Button onClick={() => {
                    addPDFStat(e)
                    window.open(PDFURL)
                }}>PDF</Button>
                :
                <img 
                    alt="pdf"
                    className="map-element-modal-img"
                    src={pdfImage}
                    onClick={() => {
                        addPDFStat(e)
                        window.open(PDFURL)
                    }}
                />)}
                
                {ExternalVideoLink && 
                (!linkImage ?
                <Button  onClick={() => window.open(ExternalVideoLink)}>Link</Button>
                :
                <img 
                    alt="link"
                    className="map-element-modal-img"
                    src={linkImage}
                    onClick={() => window.open(ExternalVideoLink)}
                />)}
                
                {VideoURL && 
                (!videoImage ? 
                <Button  onClick={() => window.open(VideoURL)}>VideoURL</Button> 
                : 
                <img 
                    alt="video"
                    className="map-element-modal-img"
                    src={videoImage}
                    onClick={() => window.open(VideoURL)}
                />)}

            {MapAttachment && 
                <Space direction="vertical" align="center">
                    <img 
                        alt="map"
                        className="map-element-modal-img"
                        src={MapAttachment.Map.LargeMapURL}
                        onClick={() => goToMapPlay(MapAttachment.Map)}
                    />
                    <small className="default-gray">{MapAttachment.Map.Title}</small>
                </Space>}
             </Space>,
             duration: 0,
             placement:'top',
             icon:<FlagTwoTone/>
        })
       

    }

    const getBadgeForElement = (badges, element) => {
        if(!playStats) return null;

        const {QuestionSeries} = element
        let existingElementIndex = playStats.ElementsProgress.map((a, ai) => a.Id === element.Id ? (ai) : null)[0]

        if([null, undefined].includes(existingElementIndex)) return null;

        const progress = playStats.ElementsProgress[existingElementIndex]

        const finalProgress = evaluateElementProgress(QuestionSeries, progress)

        const findBadge = badges.filter(a => a.Progress <= finalProgress).sort((a, b) => b.Progress - a.Progress)[0]

        return findBadge
    }

    const evaluateElementProgress = (targetSeries, progress) => {

        const targetSeriesQuestions = targetSeries.Elements.map(e => e.QuestionId)

        const questionsPlayedCorrectlyInsideSeries = progress.Progress.filter(a => a.Correct).filter(a => targetSeriesQuestions.includes(a.QuestionId))

        const positiveScore = (questionsPlayedCorrectlyInsideSeries.length)

        const targetPlayScore = targetSeries.IsRandom ? targetSeries.RandomSize : targetSeries.Elements.length

        const finalProgress = Math.trunc((100 * positiveScore)/targetPlayScore)

        return finalProgress
    }

    const renderElement = (e) => {
        const {BackgroundImage, Badges, QuestionSeries} = e
        const {LargeMapWidth, ShowBorder} = map

        let toBeDrawBadge = Badges.length  && QuestionSeries ? getBadgeForElement(Badges, e) : null

        const positionStyle = getElementPositionStyle(imageBaseWidth, LargeMapWidth, e)

        const elementStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
            cursor:'pointer',
            position: 'absolute',

            [BackgroundImage ? "backgroundImage" : ""]:  "url(" + FixURL(BackgroundImage) + ")",

            border:ShowBorder ? 1 : 0, 
            borderColor: 'gray',
            borderStyle: 'solid'
        })

        return(
            <span
                key={e.Id}
                style={{
                    ...elementStyle,
                    ...positionStyle
                }}

                onClick={() => onClickElement(e)}
            >
                
            </span>
        )
    }

    const renderBadge = (e) => {
        
        const {Badges} = e
        const {LargeMapWidth, ShowBorder} = map

        let toBeDrawBadge = getBadgeForElement(Badges, e)

        if(!toBeDrawBadge) return <span/>;

        const positionStyle = getBadgePositionStyle(imageBaseWidth, LargeMapWidth, e)

        const elementStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
            position: 'absolute',

            border:ShowBorder ? 1 : 0, 
            borderColor: 'green',
            borderStyle: 'solid'
        })

        return(
        <span 
            key = {'badge-' + e.Id}
            style = {{
                ...elementStyle,
                ...positionStyle
            }}
        >
             <img 
                src = {toBeDrawBadge.URL}
                alt="badge"
                style = {{
                    width: '100%',
                    height:'100%'
                }}
                />
        </span>)

    }

    const renderMap = () => {
        const {LargeMapURL, LargeMapWidth, LargeMapLength, Title, Elements} = map

        const imageWidth = imageBaseWidth 
        const imageHeight = (LargeMapLength/LargeMapWidth) * imageWidth

        return(
            <div style={{width: imageWidth, height: imageHeight}}>
                <img 
                    src={LargeMapURL}
                    alt={Title}
                    style={{width: imageWidth, height: imageHeight}}
                />

                {Elements.map((e) => renderElement(e))}
                {Elements.filter(e => e.Badge_X && e.Badge_Y && e.Badges.length).map((e) => renderBadge(e))}

                
            </div>
        )
    }

    const ZoomIn = () => {
        const newIndex = zoomScaleIndex === (MAP_SCALE_REDUCTION.length - 1) ? zoomScaleIndex : zoomScaleIndex + 1
        setZoomScaleIndex(newIndex)
        
        const scale = MAP_SCALE_REDUCTION[newIndex]

        setImageBaseWidth(imageIntialWidth/scale)
    }

    const ZoomOut = () => {
        const newIndex = zoomScaleIndex === (0) ? zoomScaleIndex : zoomScaleIndex - 1
        setZoomScaleIndex(newIndex)

        const scale = MAP_SCALE_REDUCTION[newIndex]

        setImageBaseWidth(imageIntialWidth/scale)
    }

    const renderActionList = () => (
    <FloatButton.Group
        shape="circle"
        style={{
            right: 94,
        }}
        >
        <FloatButton
            tooltip={(localMapKey ? localMapKey : "click to set a local key for this map")}
            onClick={() => setShowSetLocalKey(true)} icon={<PushpinOutlined />} 
        />
        <FloatButton onClick={() => ZoomOut()} icon={<ZoomInOutlined  />} />
        <FloatButton onClick={() => ZoomIn()} icon={<ZoomOutOutlined />} />
    </FloatButton.Group>)

const setLocalKey = () => {
        
    return(
        <Modal
            open={showSetLocalKey}
            footer={null}
            onCancel={() => setShowSetLocalKey(false)}
        >
            <small className="default-gray">Key</small>
            <Input
                placeholder="Local key"
                type="text"
                onChange={(v) => setNewKey(v.target.value)}
                value={newKey}
            />
            <br/>
            <br/>
            <Button
                size="small"
                type="primary"
                onClick={() => {
                    updateMapKey_LS(id, newKey)
                    
                    initialize()
                    setShowSetLocalKey(false)
                }}
            >
                Update
            </Button>
          
        </Modal>
    )
}

    return(
        <PagesWrapper>
            <div
                ref={baseRef}
            >
                {contextHolder}
                {notificationContextHolder}
                {loadingMap && <Skeleton />}
                {map && !playSeries && !loadingMap && 
                <div>
                    {renderMap()}
                    {renderActionList()}
                </div>}
                    
                {playSeries && 
                    <SeriesPlay 
                        Code={selectedPlaySeries.Code}
                        onExitSeries = {() => setPlaySeries(false)}
                        onFinishPlaySeries = {(data) => {
                            let _selectedMapElement = ({...selectedMapElement})

                            const {QuestionSeries} = _selectedMapElement

                            let _playStats = ({...playStats})

                            const progress =
                            ({
                                Id: selectedMapElement.Id,
                                Progress: (data.map((a) => ({QuestionId: a.Question.Id, Correct: a.Correct})))
                            })
                           
                            
                            let existingElementIndex = _playStats.ElementsProgress
                            .map((a, ai) => (a.Id === _selectedMapElement.Id) ? ai : null)
                            .filter(a => a !== null)[0]

                            const exsitingProgress = playStats.ElementsProgress[existingElementIndex]

                            //value in (0 - 100)%
                            const finalProgressPercentage = evaluateElementProgress(QuestionSeries, progress)

                            if(exsitingProgress){
                                    const existingProgressPercentage = evaluateElementProgress(QuestionSeries, exsitingProgress)

                                    if(finalProgressPercentage > existingProgressPercentage){
                                        _playStats.ElementsProgress[existingElementIndex] = progress
                                    }
                            }
                            else{
                                _playStats.ElementsProgress.push(progress)

                            }

                            const updatedPlayStats = updateMapPlayStatisticsRequest_LS(({..._playStats, Id: id}))
                            setPlayStats(updatedPlayStats)
                        }}

                        mapKey = {localMapKey}
                        mapName={map.Title}
                        mapElementName={selectedMapElement.Title}
                    />
                }

                {setLocalKey()}
            </div>
        </PagesWrapper>
    )
}