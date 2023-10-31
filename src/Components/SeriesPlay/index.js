import React, { useEffect, useState } from "react";
import { useSeries } from "../../contexts/SeriesContext";
import { Button, Col, Divider, Dropdown, FloatButton, Input, List, Progress, QRCode, Row, Skeleton, Space, Spin, Tooltip, message, notification } from "antd";
import { red, green } from '@ant-design/colors';
import { getRandomSeriesElements } from "./Functions";
import { FixURL, convertSecondsToHHMMSS, goToQuestionViewEdit, goToSeriesViewEdit } from "../../services/Auxillary";

import { CLICKABLE_QUESTION_PARAMETER, KEYBOARD_QUESTION_PARAMETER, MULTIPLE_CHOICE_QUESTION_PARAMETER } from "../../Pages/Questions/List/constants";
import { ClickableQuestionPlay } from "../../Pages/Questions/ClickableQuestion/Play";
import { KeyboardQuestionPlay } from "../../Pages/Questions/KeyboardQuestion/Play";
import { MultipleChoiceQuestion } from "../../Pages/Questions/MultipleChoiceQuestion/Play";
import { ForwardOutlined, QuestionCircleOutlined, FilePdfOutlined, CheckCircleFilled, CloseCircleFilled,
     ClockCircleOutlined, StarFilled, AreaChartOutlined, TrophyOutlined, NotificationOutlined, QrcodeOutlined, RollbackOutlined, MoreOutlined, EyeOutlined, RocketTwoTone, BuildTwoTone } from '@ant-design/icons';

import './SeriesPlay.css'
import { LatexRenderer } from "../LatexRenderer";
import { getItemPositionStyle } from "../../Pages/Questions/ClickableQuestion/Functions";
import { QuestionPlayPocket } from "../../Pages/Questions/QuestionPlayPocket/QuestionPlayPocket";
import { useStudentFeedback } from "../../contexts/StudentFeedbackContext";
import { SendFeedback } from "../../Pages/StudentFeedback/SendFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { ViewSolutionComponent } from "../ViewSolutionComponent";
import { ErrorComponent } from "../ErrorComponent";
var timer

export function SeriesPlay({Code, onExitSeries, onFinishPlaySeries}){

    const { 
        isLoadingSeries, Series, getSeries, errorGetSeries,
        isLoadingSeriesStatistics, SeriesStatistics, getSeriesStatistics,
        postSeriesStatistic
    } = useSeries()

    const {
        loadingReferenceQuestion, referenceQuestionResult, referenceQuestionError, referenceQuestion
    } = useStudentFeedback()

    const {isStudent} = useAuth()

    const baseDiv = React.createRef()

    const [topOffset, setTopOffset] = useState(0)

    const [seriesElements, setSeriesElements] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [playedElements, setPlayedElements] = useState([])

    const [playTime, setPlayTime] = useState(0)

    const [showFinalPage, setShowFinalPage] = useState(false)

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [showSendFeedbackModal, setShowSendFeedbackModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)
    const {currentPlayerKey} = useAuth()

    const [messageApi, contextHolder] = message.useMessage();
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const loadData = () => {
        getSeries(Code)
        setSeriesElements([])
        setCurrentIndex(0)

        setShowFinalPage(false)
    }

    useEffect(() => {
       loadData()
    }, [Code])

    useEffect(() => {
        if(Series){

            //Get series data from server
            getSeriesStatistics(Series.Id)

            let elements = []
            const {IsRandom, Elements, RandomSize} = Series

            //Generate random questions from question pools out of question collection assigned in the series
            if(IsRandom){
                elements = getRandomSeriesElements(Elements, RandomSize)
            }
            else{
                elements = Elements
            }

            setSeriesElements(elements)

            const baseDivCurrent = baseDiv.current

            if(baseDivCurrent){
                setTopOffset(baseDivCurrent.getBoundingClientRect().top)
            }


            //Set a 1 second interval timer
            timer = setInterval(() => {
                setPlayTime(seconds => seconds + 1)
              }, 1000);

              return () => clearInterval(timer);

           
        }
    }, [Series])

    useEffect(() => {
        //Stop timer
        if(playedElements.length === seriesElements.length){
            clearInterval(timer)
        }
    }, [playedElements])

    useEffect(() => {
        if(showFinalPage){

            //Post series play statistics to the database
            let statData = new FormData()

            statData.append('SeriesId', Series.Id)
            statData.append('Player', currentPlayerKey)
            statData.append('SuccessRate', playedElements.filter(a => a.Correct).length+"/"+playedElements.length)
            statData.append('TotalTime', playTime)
            statData.append('OnMobile',  false)

            postSeriesStatistic(statData)


            //Update series progress saved locally 
            if(onFinishPlaySeries){
                onFinishPlaySeries(playedElements)
            }

        }
    }, [showFinalPage])

    const canGoNext = (playedElements.length === (currentIndex+1))
    const shouldGoToFinalPage = (playedElements.length === seriesElements.length)


    //Go to final page
    //Show gained points
    const goToFinalPage = () => {
        setShowFinalPage(true)
        let totalScore = 0

        notificationApi.destroy()
        
        notificationApi.open({
            message: 'Summary',
            description:
            <div>
                {playedElements.map((e, ei) => {
                    const {Question, Score} = e
                    const {Code} = Question
                    const score = Math.trunc(parseFloat(Score) * 10)
                    totalScore += score

                    return(
                        <div key={e.Id}>
                            <p >{ei + 1} {'- '} {Code}{' '} <span className="default-green">{' '}{score.toFixed(0) + ' XP'}</span></p>
                        </div>
                    )
                })}
                <Divider/>
                <small >
                    Total
                </small>

                <p className="default-green">{totalScore.toFixed(0) + ' XP'}</p>
            </div>,
            duration: 0,
        })
    }

    //Go to next question
    const goNext = () => {
        if(shouldGoToFinalPage){
            goToFinalPage()
            return
        }

        //Increment current index 
        setCurrentIndex(index => index+1)
    }


    //Update played series elements with stats regarding success, selected answers and play time
    const updateSeriesPlayElements = (el) => {
        const _playedElements = [...playedElements]

        _playedElements.push(el)

        setPlayedElements(_playedElements)
    }

    //Side action buttons
    const renderActionButtons = () => {
        const currentElement = seriesElements[currentIndex]

        if(!currentElement) return <div/>;

        const qInfo = currentElement.Question.Information

        const question = currentElement.Question
        
        return(
        <FloatButton.Group
            shape="square"
            style={{
                top:topOffset,
                height:'fit-content',
            }}
            >
            {onExitSeries && 
            <FloatButton 
                tooltip="Go back to map"
                onClick={() => onExitSeries()}
                icon={<RollbackOutlined />} 
            
            />
                
            }
            {!showFinalPage &&
            <FloatButton 

            badge={{count:canGoNext ? 'Next' : ''}}
            onClick={() => {

                if(shouldGoToFinalPage){
                    goToFinalPage()
                    return
                }

                if(canGoNext){
                    goNext()
                }
                else{
                    messageApi.destroy()
                    messageApi.warning('Please finish playing current question!')
                }
            }}
            icon={<ForwardOutlined />} 
            
            />}

            {qInfo && !showFinalPage && 
            <FloatButton 
            onClick={() => {
                const {PDFURL, Latex} = qInfo

                if(!Latex){
                    window.open(PDFURL)
                }

                notificationApi.destroy()
                

                notificationApi.open({
                    message: 'Explanation',
                    description:
                    <div>
                        <LatexRenderer 
                            latex={Latex}
                        />
                        {PDFURL && 
                        <span>
                            <br/>
                            <Button
                                size="small"
                                onClick={() => window.open(PDFURL)}
                                icon={<FilePdfOutlined />}
                            >
                                Help document
                            </Button>
                        </span>}
                    </div>,
                    duration: 0,
                })
            }}  
            icon={<QuestionCircleOutlined  />} 
            tooltip='Help'
            />
            }

            {!showFinalPage && !isStudent && 
            <Tooltip
                color="white"
                placement="left"

                title={
                    <Space direction="vertical">
                        <Button
                            className="hq-fill-width"
                            onClick={() => goToQuestionViewEdit(question)}
                            size="small"
                        >
                            <Space> 
                                <RocketTwoTone />
                                View/Edit question
                            </Space>
                        </Button>
                        <Button
                            className="hq-fill-width"
                            onClick={() => goToSeriesViewEdit(Series)}
                            size="small"
                        >
                            <Space> 
                                <BuildTwoTone />
                                View/Edit series
                            </Space>
                        </Button>
                    </Space>
                }
            >
                <FloatButton 
                icon={<EyeOutlined />} 
            />
            </Tooltip>}
            
        </FloatButton.Group>
        )
    }

    const renderQuestion = () => {
        if(!seriesElements.length) return <div/>;

        const question = seriesElements[currentIndex].Question
        const {Type, Id} = question


        const selectionList = {
            [CLICKABLE_QUESTION_PARAMETER]: () => 
            <ClickableQuestionPlay 
                Id={Id}
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                showSolution={true}

                nextAction = {() => goNext()}
            />,
            [KEYBOARD_QUESTION_PARAMETER]: () => 
            <KeyboardQuestionPlay 
                Id={Id} 
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                showSolution={true}

                nextAction = {() => goNext()}
            />,
            [MULTIPLE_CHOICE_QUESTION_PARAMETER]: () => 
            <MultipleChoiceQuestion 
                Id={Id}
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                showSolution={true}
                
                nextAction = {() => goNext()}
            />,
        }
        
        return selectionList[Type]() 
    }

    const renderMultipleChoiceQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question, Answers} = element
        const {Code, Base_ImageURL, Choices, Latex} = Question

        return(
            <Space 
                size={'large'}
            >
                <img 
                    src={Base_ImageURL}
                    alt={Code}
                    className="series-play-final-page-item-img"
                />

                <div>
                    <LatexRenderer 
                        latex={Latex}
                    />
                    <br/>
                    <Row>
                        {Choices.map((c, ci) => {
                        const {ImageURL, Latex, Id, Correct} = c
                        const isSelected = Answers.map(a => a.Id).includes(Id)

                        const choiceCorrectness = (Correct)   

                        let className = !isSelected ? "multiple-choice-question-play-choice-container-final-page" : "multiple-choice-question-play-choice-container-selected-final-page"

                        className += choiceCorrectness ? ' multiple-choice-question-play-choice-container-correct' : ' multiple-choice-question-play-choice-container-incorrect'

                        return(
                            <Col
                                key={c.Id}
                                className={className}
                            >
                                <div
                                    className="multiple-choice-question-play-choice-container-inner"
                                >
                                    <p
                                        className="multiple-choice-question-play-index"
                                    >
                                        {ci+1}
                                    </p>
                                    <Space
                                    direction="vertical"
                                    >
                                        {ImageURL && 
                                        <img 
                                            alt={"choice"+ci+1}
                                            src={ImageURL}
                                            className="multiple-choice-question-play-choice-img"
                                        />}

                                        {Latex &&
                                        <LatexRenderer 
                                            latex={Latex}
                                        />}
                                    </Space>

                                    
                                </div>
                            </Col>)
                    })}
                    </Row>
                </div>
            </Space>
        )
    }

    const renderKeyboardQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question, Answers} = element
        const {Code, Base_ImageURL, Latex, Answers: correctAnswers} = Question

        const reducedLatex = Answers[0].List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

        return(
            <Space 
                size={'large'}
            >
                <img 
                    src={Base_ImageURL}
                    alt={Code}
                    className="series-play-final-page-item-img"
                />

                <div>
                    <LatexRenderer 
                        latex={Latex}
                    />
                    <br/>
                    <small className="default-gray">Your answer</small>
                    <LatexRenderer latex={"$$"+reducedLatex+"$$"} />

                    <small className="default-gray">Correct answer(s)</small>
                    <List 
                        dataSource={correctAnswers}
                        renderItem={(a, ai) => {
                            const answerReduced = a.AnswerElements
                            .sort((c,d) => c.Id > d.Id ? 1 : -1)
                            .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                            return(
                                <div 
                                    key={ai}
                                >
                                    <LatexRenderer 
                                        latex={"$$"+answerReduced+"$$"}
                                    />
                                </div>
                            )
                        }}
                    />
                </div>
            </Space>
        )
    }

    const renderClickableQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question} = element
        const {Code, BackgroundImageURL, BackgroundImageHeight, BackgroundImageWidth, ClickImages, ClickCharts} = Question

        const imageWidth = window.innerWidth*0.20
        const imageHeight = (BackgroundImageHeight/BackgroundImageWidth) * imageWidth

        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
        })

        const itemStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            position: 'absolute',
           
        })

        return(
            <Space 
                size={'large'}
            >
                <div>
                    <img
                        style = {{
                            ...backgroundImageStyle,
                            height:imageHeight,
                            width:imageWidth,
                        }} 

                        src = {BackgroundImageURL}
                        alt={Code}
                    />

                    {ClickImages.map((p) => {
                        const {Answer} = p

                        const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p, 0)

                        return (
                            <span 
                            key={p.Id}
                            style = {{
                                ...backgroundImageStyle,
                                ...itemStyle,
                            
                                ...itemPositionStyle,

                                [p.Background_ImageId ? "backgroundImage" : ""]:
                                p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                            }}
                                                    >
                                
                                <img 
                                    style={itemPositionStyle}
                                    src={Answer.URL}
                                    alt="answer"
                                />
                            </span>
                        )
                    })}

                    {ClickCharts.map((p) => {
                        const {Answer} = p 

                        const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p)

                        return (
                            <span 
                            className="clickable-question-play-clickable-item"
                            key={p.Id}
                            style = {{
                                ...backgroundImageStyle,
                                ...itemStyle,
                                
                                ...itemPositionStyle,
    
                                [p.Background_ImageId ? "backgroundImage" : ""]:
                                p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                            }}
    
                            >
                                
                                <img 
                                    style={itemPositionStyle}
                                    src={Answer.URL}
                                    alt="answer"
                                />
                            </span>
                        )
                    })}
                </div>
            </Space>
        )
    }

    const elementActionList = (index) => [
    {
        key: 'play_question',
        label: 'Re-play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            const element = playedElements[index]
            const {Question} = element

            setSelectedQuestion(Question)
            setShowPlayQuestionModal(true)
        }
    },
    {
        key: 'ref_question',
        label: 'Reference question',
        icon: <QrcodeOutlined style={{color:'green'}} /> ,
        onClick: () => {
            const element = playedElements[index]
            const {Question} = element

            referenceQuestion(Question)

            const {Code} = Question

            notificationApi.destroy()

            notificationApi.open({
                message: 'Reference',
                description:
                <div>

                    {loadingReferenceQuestion && <Skeleton />}

                    {(!loadingReferenceQuestion && referenceQuestionResult && 
                        <div>
                            <Space 
                            direction="vertical" align="center">
                                <p>{Code}</p>
                                <QRCode value={referenceQuestionResult || '-'} />
                                <Input
                                    placeholder="-"
                                    maxLength={60}
                                    value={referenceQuestionResult}
                                    disabled = {true}
                                />
                            </Space>

                        </div>)}
                </div>,
                duration: 0,
            })
        }
    },
    {
        key: 'send_feedback',
        label: 'Send feedback',
        icon: <NotificationOutlined 
        style={{color:'blueviolet'}}
        /> ,
        onClick: () => {
            const element = playedElements[index]
            const {Question} = element

            setShowSendFeedbackModal(true)
            setSelectedQuestion(Question)
        }
    },
    !isStudent  
    && 
    {
        key: 'edit_view',
        label: 'Edit/View question',
        icon: <EyeOutlined 
        style={{color:'blueviolet'}}
        /> ,
        onClick: () => {
            const element = playedElements[index]
            const {Question} = element
            goToQuestionViewEdit(Question)
        }
    }].filter(a => a)

    const renderFinalPage = () => {

        const answersDisplayIndexer = (type, index) => {

            return ({
                [MULTIPLE_CHOICE_QUESTION_PARAMETER]: (index) => renderMultipleChoiceQuestionFinalPage(index),
                [KEYBOARD_QUESTION_PARAMETER]: (index) =>  renderKeyboardQuestionFinalPage(index),
                [CLICKABLE_QUESTION_PARAMETER]: (index) =>  renderClickableQuestionFinalPage(index),
    
            })[type](index)
        }
        
        let StatsMap = {}
    
        if(SeriesStatistics && SeriesStatistics.ElementStats){
            for(let e of SeriesStatistics.ElementStats){
                StatsMap[e.Id] = e
            }
        }

        return(
            <Row>
                {seriesElements.map((e, ei) => {
                     const {Question} = e
                     const {Code, Type, PDFURL} = Question
 
                     const playStats = playedElements[ei]
                     const {Correct, Score, Time} = playStats
                     const time = Math.ceil(Time/1000)

                    const score = Math.trunc(parseFloat(Score) * 10).toFixed(0) + ' XP'

                    let eStats = StatsMap[e.Id]

                    let successPercentage = 0
                    let medianPlayTime = 0

                    if(eStats){
                        const {TotalPlay, TotalSuccessPlay, MedianPlayTime} = eStats
        
                        successPercentage = (100*TotalSuccessPlay/(TotalPlay+1)).toFixed(0) + "%"
                        medianPlayTime =  MedianPlayTime
                    }

                    return( 
                        <Col
                            key={e.Id}
                            xs={12}
                            className="series-play-final-page-item-container-base"
                        >
                            <div className="series-play-final-page-item-container">
                                <div className="series-play-final-page-item-container-inner">
                                   
                                    <Space 
                                    className="series-play-final-page-item-header"
                                    size={'middle'}>
                                    
                                    <Dropdown
                                        menu={{
                                            items:elementActionList(ei),
                                            title:'Actions'
                                        }}
                                    >
                                        <Space className="hoverable-plus">
                                            <MoreOutlined />
                                            <p >
                                                {Code}
                                            </p>
                                        </Space>
                                    </Dropdown>
                                    <span>
                                    {Correct ? 
                                        <CheckCircleFilled
                                        className="default-green"
                                        /> 
                                        : 
                                        <CloseCircleFilled
                                        className="default-red"
                                        />
                                    }
                                    </span>
                                    </Space>


                                    {answersDisplayIndexer(Type, ei)}
                                    <Divider />
                                    <Space size={'large'}>
                                        <Space
                                            size={'large'}
                                            className="series-play-final-page-item-statistics-section"
                                        >
                                            <div
                                            className="series-play-final-page-item-statistics-score-time"
                                            >
                                                <Space size={'small'}>
                                                    <StarFilled 
                                                        className="default-orange"
                                                    />
                                                    <p>{score}</p>
                                                    {PDFURL && 
                                                    <ViewSolutionComponent 
                                                        question={Question}
                                                        correct={Correct}
                                                    />}
                                                </Space>   
                                                <Space size={'small'}>
                                                    <span><ClockCircleOutlined /> </span>
                                                    <p>{time} {''} <i>
                                                        <small
                                                            className="default-gray"
                                                        >
                                                        seconds
                                                        </small>
                                                        </i></p>
                                                    
                                                </Space>                                           
                                            </div>
                                            <div
                                            
                                            >
                                                <small
                                                    className="default-gray"
                                                >
                                                    How others performed
                                                </small>
                                                {isLoadingSeriesStatistics && <Spin/>}

                                                {!isLoadingSeries && 
                                                <div>
                                                     <p
                                                         className="default-gray"
                                                    >
                                                            Success rate
                                                    </p>
                                                    <Space size={'small'}>
                                                        <AreaChartOutlined  
                                                            className="default-green"
                                                        />
                                                        <p>{successPercentage}</p>
                                                        
                                                    </Space>   
                                                    <br/>
                                                    <p
                                                         className="default-gray"
                                                    >
                                                            Median play time
                                                    </p>
                                                    <Space size={'small'}>
                                                        <span><ClockCircleOutlined /> </span>
                                                        <p>{medianPlayTime} {''} <i>
                                                            <small
                                                                className="default-gray"
                                                            >
                                                            seconds
                                                            </small>
                                                            </i></p>
                                                        
                                                    </Space> 
                                                </div>}
                                            </div>

                                        </Space>

                                    </Space>
                                </div>
                            </div>
                        </Col>
                    )
                })}
            </Row>
        )
    }

    const renderSeries = () => {
        const {Code} = Series
        const progress = Math.trunc(100 * (playedElements.length/seriesElements.length)) 
        return(
            <div
            >
                <Space 
                className="series-play-top-header"
                size={'large'}>
                    <p>{Code}</p>
                    <div>
                        <p>{convertSecondsToHHMMSS(playTime)}</p>
                    </div>
                    <Progress 
                    
                    percent={progress} 
                    
                    steps={seriesElements.length}

                    strokeColor={playedElements.map(e => e.Correct ? green[6]:red[5])} />
                </Space>
                <Divider />
                {!showFinalPage && renderQuestion()}
                {showFinalPage && renderFinalPage()}

                {renderActionButtons()}

            </div>
        )
    }

    return(
        <div
            ref={baseDiv}
        >
            {contextHolder}
            {notificationContextHolder}
            {isLoadingSeries && <Skeleton />}
            {!isLoadingSeries && Series && renderSeries()}

            {errorGetSeries && !isLoadingSeries && 
                <ErrorComponent 
                    error={errorGetSeries}
                    onReload={() => loadData()}
                />
            }

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />

            <SendFeedback 
                open={showSendFeedbackModal}
                onClose={() => setShowSendFeedbackModal(false)}
                question={selectedQuestion}
            />
        </div>
    )
}