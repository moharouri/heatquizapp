import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { Col, Row, Skeleton, Space, Steps } from "antd";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { FixURL } from "../../../../services/Auxillary";
import { Keyboard } from "../../../../Components/Keyboard";

import './index.css'

export function FBDQuestionPlay({Id}){

    const {FBDQuestionPlay, errorGetFBDQuestionPlay, isLoadingFBDQuestionPlay, getFBDQuestionPlay,} = useQuestions()

    const [currentTab, setCurrentTab] = useState(0)

    const [addedVT, setAddedVT] = useState([])
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
        const {QuestionText, Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, ObjectBodies} = FBDQuestionPlay


        const newImageWidth = window.innerWidth * 0.25
        const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

        const vectors = ObjectBodies.flatMap(a => a.VectorTerms)

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
                        {vectors.map((v, vi) => {
                            const {Id, Latex} = v
                            return(
                                <Col
                                    key ={Id}
                                    className="hoverable-plus"
                                    onClick={() => {
                                        let vts = [...addedVT]

                                        vts.push({
                                            ...v,
                                            Answer:{
                                                List:[],
                                                echoNumber:0
                                            }
                                        })

                                        setAddedVT(vts)
                                    }}
                                >
                                    <LatexRenderer latex={"$$" + Latex + "$$"} />
                                </Col>
                            )
                        })}
                        </Row>
                    </div>
                </Space>
            </div>
        )
    }

    const renderDefineVT = () => {
        const {Keyboard: keyboard, Latex, Answer} = selectedVT

        const reducedLatex = Answer.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

        return(
            <div>
                <p className="default-gray">Define</p>
                <LatexRenderer latex={"$$" + Latex + "$$"} />
                <br/>
                <div className="fbd-question-term-answer-zone">
                    {reducedLatex && 
                    <LatexRenderer 
                        latex={"$$"+reducedLatex+"$$"}
                    />}
                </div>
                <br/>
                <Keyboard 
                    Id={keyboard.Id}
                    List={Answer}
                    onEnterKey={(l) => {}}
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
                            const {Id, Latex} = v
                            return(
                                <Col
                                    key ={Id}
                                    onClick={() => setSelectedVT(v)}
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