import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Col, List, Row, Skeleton, Space, Steps, message } from "antd";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { Keyboard } from "../../../../Components/Keyboard";
import { CloseCircleFilled, CheckCircleFilled, SmileTwoTone, FrownTwoTone } from '@ant-design/icons';

import './index.css'
import { checkKeyboardAnswerIsCorrect, validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { DropVectorOnImage } from "./DropVectorOnImage";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";
import { FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT } from "./Constants";
import { MomentDirectionComponent } from "../Shared/MomentDirectionComponent";

export function FBDQuestionPlay({Id}){

    const {FBDQuestionPlay, errorGetFBDQuestionPlay, isLoadingFBDQuestionPlay, getFBDQuestionPlay,} = useQuestions()

    const [currentTab, setCurrentTab] = useState(0)

    const [addedVTs, setAddedVTs] = useState([])
    const [addedVTsValidation, setAddedVTsValidation] = useState([])

    const [allVectors, setAllVectores] = useState([])
    const [allAnswerableVectors, setAllAnswerableVectors] = useState([])
    const [allAddedAnswerableVectors, setAllAddedAnswerableVectores] = useState([])


    const [selectedVTDrop, setSelectedVTDrop] = useState(null)
    const [selectedVT, setSelectedVT] = useState(null)

    const [checkAnswer, setCheckAnswer] = useState(false)

    const [api, contextHolder] = message.useMessage()

    const loadData = () => {
        getFBDQuestionPlay(Id)

    }

    useEffect(() => {
        loadData()

        setAddedVTsValidation([])
    }, [Id])

    useEffect(() => {
        if(checkAnswer){

        }
    }, [checkAnswer])

    useEffect(() => {
        if(FBDQuestionPlay){
            const {ObjectBodies} = FBDQuestionPlay
            const vectors = ObjectBodies.flatMap(a => a.VectorTerms)

            setAllVectores(vectors)

            const answerableVTs = vectors.filter(a => a.Answers.length)

            setAllAnswerableVectors(answerableVTs)

        }
    }, [FBDQuestionPlay])

    useEffect(() => {
        const vectors = addedVTs.filter(a => a.Answers.length)

        setAllAddedAnswerableVectores(vectors)
    }, [addedVTs])


    const validateAddedVTsFinalScores = () => {
        const validations = addedVTs.map((t) => {
            console.log(t)
            const originalTerm = allVectors.filter(x => x.Id === t.Id)[0]

            const {Angle: originalAngle, Clockwise: originalAngleClockwise} = t

            const {BodyObjectId, ObjectBody, Angle, Linear, Clockwise, Answer, Answers} = t

            //Check association
             const correctAssociation = (BodyObjectId === ObjectBody.Id)

            //Check direction
            let correctDirection = false
            let flipAnswer = false
            if(Linear){
                let _angle = Angle

                if(_angle < 0) _angle = _angle + 360
    
    
                let oppositeAngle = _angle + 180
                oppositeAngle = (oppositeAngle % 360)

                correctDirection = (Angle === originalAngle) ||  (_angle === originalAngle) || (oppositeAngle === originalAngle)

                flipAnswer = (oppositeAngle === originalAngle)

            }
            else{
                correctDirection = true
                flipAnswer = (originalAngleClockwise && !Clockwise)
            }

            //Check correct answer 
            let correctAnswer = true
            if(Answers.length){
                let _answers = [...Answers]

                if(flipAnswer){
                    
                }

                const {answerStatus} = checkKeyboardAnswerIsCorrect(Answer, Answers)

                correctAnswer = answerStatus
            }


            return({
                correctAssociation,
                correctDirection,
                correctAnswer,
                flipAnswer
            })
        })
    }

    const validateFinalPage = () => {
        const hasAnswerableVTs = allAnswerableVectors.length

        if(addedVTs.length !== allVectors.length){
            return "Please add all vectors"
        }

        if(hasAnswerableVTs){
            const definitionsNotValid = addedVTs.filter(a => validateKeyboardAnswer(a.Answer)).length
            
            if(definitionsNotValid){
                return "Some term definitions are not correct"
            }   
        }

        return null

    }

    const onChange = (t) => {

        //if(checkAnswer) return;

        const summaryValidation = validateFinalPage()
        const finalIndex = getFinalPageIndex()


        if(t === 1 && (addedVTs.length !== allVectors.length)){
            api.destroy()
            api.warning("Please add all vectors")

            return;
        }

        if(t === 1){
            if(allAddedAnswerableVectors.length){
                setSelectedVT(allAddedAnswerableVectors[0])
            }
            else{
                 setSelectedVT(null)
            }
        }

        if(t === finalIndex){
            if(summaryValidation){
                api.destroy()
                api.warning(summaryValidation)
    
                return
            }
            

            const validations = validateAddedVTsFinalScores()
            setCheckAnswer(true)
        }

        

        setCurrentTab(t)
    }   

    const renderQuestionBody = () => {
        const {QuestionText} = FBDQuestionPlay

        return(
            <div>
                {QuestionText && 
                    <div
                        className="eb-question-question-body"
                    >
                        <div>
                            <LatexRenderer latex={QuestionText}/>
                        </div>
                    </div>}
            </div>
        )
    }

    const renderAddTerms = () => {

        return(
            <div 
                className="hq-full-width"
            >   
                {renderQuestionBody()}
                <br/>
                <Space size={"large"} align="start">
                    <DropVectorOnImage 
                    
                    question={FBDQuestionPlay} 
                    
                    selectedVT={selectedVTDrop}
                    
                    onDropVT = {(vt, a, x, y, sBox) => {
                        const isDropped = selectedVTDrop && allVectors.filter(a => a.Id === selectedVTDrop.Id)

                        let vts = [...addedVTs]

                        if(isDropped){
                            vts = vts.filter(a => a.Id !== selectedVTDrop.Id)
                        }

                        let box = sBox

                        if(!box){
                            
                            box = ({
                                Id: Date.now(),
                                X: x - FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT/2,
                                Y: y - FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT/2,
                                
                                Width: FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT,
                                Height: FBD_QUESTION_PLAY_FAKE_BOX_WIDTH_HEIGHT,

                                fake: true
                            })
                        }
                        
                        vts.push({
                            ...selectedVTDrop,
                            Answer:{
                                List:[],
                                echoNumber:0
                            },

                            X:x,
                            Y:y,

                            Angle:a,
                            ObjectBody:box
                        })

                        setAddedVTs(vts)
                        setSelectedVTDrop(null)
                    }}

                    addedVTs={addedVTs}
                    />

                    <div className="hq-full-width">
                        <List 
                            dataSource={allVectors}
                            renderItem={(v, vi) => {
                                const {Id, Latex, Linear} = v

                                const isSelected = selectedVTDrop && selectedVTDrop.Id === Id

                                const existingSelection = addedVTs.map((a, ai) => ({...a, index: ai})).filter(a => a.Id === Id)[0]
                                const Clockwise = existingSelection && existingSelection.Clockwise
                                return(
                                        <div key ={Id} >

                                            <Space>
                                                <div
                                                    className={(isSelected ? 'default-title' : '') + " hoverable-plus"}
                                                    onClick={() => {
                                                        if(isSelected) setSelectedVTDrop(null)
                                                        else setSelectedVTDrop(v)
                                                    }}>
                                                        <LatexRenderer
                                                            className="fbd-question-add-term-element"
                                                            latex={"$$" + Latex + "$$"} 
                                                        />
                                                </div>
                                                &nbsp;
                                                &nbsp;

                                                {existingSelection && 
                                                (Linear ? 
                                                <VectorDirectionComponent 
                                                    angleStep={5}
                                                    currentAngle={existingSelection.Angle}
                                                    widthHeight={0.03*window.innerWidth}
                                                    onUpdateAngle={(a) => {
                                                        let vts = [...addedVTs]
                                                        vts[existingSelection.index].Angle = a

                                                        setAddedVTs(vts)
                                                    }}


                                                    onUpdateAngleSafe = {(a) => {
                                                        let vts = [...addedVTs]
                                                        vts[existingSelection.index].Angle = a

                                                        setAddedVTs(vts)
                                                    }}

                                                    hasTextEditor = {true}
                                                />
                                                : 
                                                <MomentDirectionComponent
                                                    clockwise={Clockwise}
                                                    onFlip={() => {
                                                        let vts = [...addedVTs]
                                                        vts[existingSelection.index].Clockwise = !vts[existingSelection.index].Clockwise 

                                                        setAddedVTs(vts)
                                                    }}
                                                />
                                                )}
                                                &nbsp;
                                                &nbsp;
                                                {existingSelection && 
                                                <p 
                                                onClick={() => {
                                                    let vts = [...addedVTs]
                                                    vts = vts.filter(a => a.Id !== v.Id)
                                                    setAddedVTs(vts)
                                                }}
                                                className="default-gray default-small hq-clickable">Remove</p>}
                                            </Space>
                                            <br/>
                                            <br/>
                                        </div>
                                    )
                            }}
                        />
                    </div>
                </Space>
            </div>
        )
    }

    const renderDefineVT = () => {
        const {Keyboard: keyboard, Latex, Answer} = selectedVT

        const reducedLatex = Answer.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

        const answerValidity = validateKeyboardAnswer(Answer)

        return(
            <div className="fbd-question-term-answer-zone-base">
                <Space direction="vertical" align="start">
                    <p className="default-gray">Define</p>
                    <LatexRenderer latex={"$$" + Latex + "$$"} />
                </Space>
                <br/>
                <div className="fbd-question-term-answer-zone">
                    {reducedLatex && 
                    <LatexRenderer 
                        latex={"$$"+reducedLatex+"$$"}
                    />}
                </div>
                <small className="default-red">{answerValidity || ""}</small>
                <br/>
                <br/>
                <Keyboard 
                    Id={keyboard.Id}
                    List={Answer}
                    onEnterKey={(l) => {
                        const vtIndex = addedVTs.map((a, ai) => ({...a, index: ai})).filter(a => a.Id === selectedVT.Id)[0].index

                        let terms = [...addedVTs]

                        terms[vtIndex].Answer = l

                        setAddedVTs(terms)

                    }}
                />
            </div>
        )
    }

    const renderDefinitions = () => {        
        return(
            <div 
                className="hq-full-width"
            >   
                {renderQuestionBody()}
                <br/>
                <Space size={"large"} align="start">
                    <DropVectorOnImage 
                        question={FBDQuestionPlay} 
                                            
                        onDropVT = {(vt, a, x, y, sBox) => {}}

                        addedVTs={addedVTs}
                    />

                    <div>
                        <Row
                            gutter={[8, 8]}
                        >
                        {allAddedAnswerableVectors.map((v, vi) => {
                            const {Id, Latex, Answer} = v

                            const isSelected = selectedVT && selectedVT.Id === Id

                            let color = ""

                            const answerValidity = validateKeyboardAnswer(Answer)

                            if(!answerValidity){
                                color = "fbd-question-add-term-element-define-answered"
                            }

                            if(isSelected){
                                color = "fbd-question-add-term-element-define-selected"
                            }

                            return(
                                <Col
                                    key ={Id}
                                    onClick={() => setSelectedVT(v)}

                                    className={"fbd-question-add-term-element-define " + color}
                                >
                                    <LatexRenderer latex={"$$" + Latex + "$$"} />
                                </Col>
                            )
                        })}
                        </Row>

                        <br/>
                        {selectedVT && renderDefineVT()}
                    </div>
                </Space>
            </div>
        )
    }

    const renderFinalPage = () => {
        return(
            <div>
                Final page
            </div>
        )
    }

    const getFinalPageIndex = () => {
        let index =1 

        const hasAnswerableVTs = allAnswerableVectors

        if(hasAnswerableVTs) index = index + 1;

        return index
    }

    const renderContent = () => {
        const finalIndex = getFinalPageIndex()

        const map = {
            0: () => renderAddTerms(),
            [finalIndex]: () => renderFinalPage()
        }

        const hasAnswerableVTs = allAnswerableVectors.length

        if(hasAnswerableVTs){
            map[1] = () => renderDefinitions()
        }

        return map[currentTab]()
    }

    const renderQuestion = () => {
        const finalIndex = getFinalPageIndex()
        const summaryValidation = validateFinalPage()

        const items = [{
            key:'Draw FBD',
            title: <p className={currentTab === 0 ? "default-title highlighted" : "default-gray"}>Draw FBD</p>
        },
        ]

        const hasAnswerableVTs = allAnswerableVectors.length

        if(hasAnswerableVTs){
            items[1] = {
                key:'Definitions',
                title: <p className={currentTab === 1 ? "default-title highlighted" : "default-gray"}>Definitions</p>
            }
        }

        items.push({
            key:'Summary',
            title: <p className={currentTab === finalIndex ? "default-title highlighted" : "default-gray"}>Summary - Check answer</p>,
            icon: !summaryValidation ? <SmileTwoTone /> : <FrownTwoTone />
        })


        return(
            <div>
                <Steps 
                    
                    onChange={onChange}

                    current={currentTab}

                    items={items}
                />
                <br/>
                {renderContent()}
            </div>
        )
    }
    
    return(
        <div>
            {contextHolder}
            {isLoadingFBDQuestionPlay && <Skeleton />}

            {(!isLoadingFBDQuestionPlay && errorGetFBDQuestionPlay) && 
                <ErrorComponent 
                    error={errorGetFBDQuestionPlay}
                    onReload={() => loadData}
                />}

            {!(isLoadingFBDQuestionPlay || errorGetFBDQuestionPlay) && FBDQuestionPlay && renderQuestion()}

        </div>
    )
}