import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Col, List, Row, Skeleton, Space, Steps } from "antd";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { FixURL } from "../../../../services/Auxillary";
import { Keyboard } from "../../../../Components/Keyboard";

import './index.css'
import { validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { DropVectorOnImage } from "./DropVectorOnImage";
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent";

export function FBDQuestionPlay({Id}){

    const {FBDQuestionPlay, errorGetFBDQuestionPlay, isLoadingFBDQuestionPlay, getFBDQuestionPlay,} = useQuestions()

    const [currentTab, setCurrentTab] = useState(0)

    const [addedVT, setAddedVT] = useState([])
    const [selectedVTDrop, setSelectedVTDrop] = useState(null)
    const [selectedVT, setSelectedVT] = useState(null)

    const loadData = () => {
        getFBDQuestionPlay(Id)

    }

    useEffect(() => {
        loadData()
    }, [Id])

    const onChange = (t) => {
        setCurrentTab(t)
    }   

    const renderAddTerms = () => {
        const {QuestionText, ObjectBodies} = FBDQuestionPlay

        const vectors = ObjectBodies.flatMap(a => a.VectorTerms)


        return(
            <div 
                className="hq-full-width"
            >   
                <LatexRenderer latex={QuestionText} />
                <br/>
                <Space size={"large"} align="start">
                    <DropVectorOnImage 
                    
                    question={FBDQuestionPlay} 
                    
                    selectedVT={selectedVTDrop}
                    
                    onDropVT = {(vt, a, x, y) => {
                        const isDropped = selectedVTDrop && vectors.filter(a => a.Id === selectedVTDrop.Id)

                        let vts = [...addedVT]

                        if(isDropped){
                            vts = vts.filter(a => a.Id !== selectedVTDrop.Id)
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
                            ObjectBody:null
                        })

                        setAddedVT(vts)
                        setSelectedVTDrop(null)
                    }}

                    addedVT={addedVT}
                    />

                    <div className="hq-full-width">
                        <List 
                            dataSource={vectors}
                            renderItem={(v, vi) => {
                                const {Id, Latex} = v

                                const isSelected = selectedVTDrop && selectedVTDrop.Id === Id

                                const existingSelection = addedVT.map((a, ai) => ({...a, index: ai})).filter(a => a.Id === Id)[0]

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
                                                <VectorDirectionComponent 
                                                    angleStep={5}
                                                    currentAngle={existingSelection.Angle}
                                                    widthHeight={0.03*window.innerWidth}
                                                    onUpdateAngle={(a) => {
                                                        let vts = [...addedVT]
                                                        vts[existingSelection.index].Angle = a

                                                        setAddedVT(vts)
                                                    }}
                                                />}
                                                &nbsp;
                                                &nbsp;
                                                {existingSelection && 
                                                <p 
                                                onClick={() => {
                                                    let vts = [...addedVT]
                                                    vts = vts.filter(a => a.Id !== v.Id)
                                                    setAddedVT(vts)
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
            <div className="hq-full-width">
                <p className="default-gray">Define</p>
                <LatexRenderer latex={"$$" + Latex + "$$"} />
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
                        const vtIndex = addedVT.map((a, ai) => ({...a, index: ai})).filter(a => a.Id === selectedVT.Id)[0].index

                        let terms = [...addedVT]

                        terms[vtIndex].Answer = l

                        setAddedVT(terms)

                    }}
                />
            </div>
        )
    }

    const renderDefinitions = () => {
        const {QuestionText, Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, ObjectBodies} = FBDQuestionPlay


        const newImageWidth = window.innerWidth * 0.25
        const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

     
        return(
            <div 
                className="hq-full-width"
            >   
                <LatexRenderer latex={QuestionText} />
                <br/>
                <Space size={"large"} align="start">
                    <div 
                        style = {{
                            height:newImageHeight,
                            width: newImageWidth,
                            backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                            backgroundPosition:'center',
                            backgroundRepeat:'no-repeat',
                            backgroundSize:'contain',
                            border:'1px solid gainsboro'
                        }}
                    >                
                    </div>

                    <div>
                        <Row
                            gutter={[8, 8]}
                        >
                        {addedVT.map((v, vi) => {
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

    const renderContent = () => {
        const map = {
            0: () => renderAddTerms(),
            1: () => renderDefinitions(),

        }

        return map[currentTab]()
    }

    const renderQuestion = () => {

        const items = [{
            key:'Draw FBD',
            title: <p className={currentTab === 0 ? "default-title highlighted" : "default-gray"}>Draw FBD</p>
        },
        {
            key:'Definitions',
            title: <p className={currentTab === 1 ? "default-title highlighted" : "default-gray"}>Definitions</p>
        }]

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