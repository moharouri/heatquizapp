import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import {Col, Divider, Row, Skeleton,} from "antd";
import { ErrorComponent } from "../../../../Components/ErrorComponent";

import { FixURL } from "../../../../services/Auxillary";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { InteractivePlot } from "../Shared/InteractivePlot";

export function DiagramQuestionPlay({Id}){
 
    const {  DiagramQuestionPlay, isLoadingDiagramQuestionPlay, errorGetDiagramQuestionPlay, getDiagramQuestionPlay,} = useQuestions()


    const [currentTab, setCurrentTab] = useState(0)


    useEffect(() => {
        getDiagramQuestionPlay(Id)
    }, [Id])


    const renderImage = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL} = DiagramQuestionPlay
     
        const newImageWidth = window.innerWidth * 0.4
        const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

        return(
            <div>
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

                 <InteractivePlot 
                    question={DiagramQuestionPlay}
                 />
            </div>
        )
    }


    const renderQuestion = () => {
        const {QuestionText} = DiagramQuestionPlay
        return(
            <div>
                <Row
                    gutter={12}
                >
                    <Col>
                        {renderImage()}
                    </Col>
                    <Col>
                            {QuestionText && <LatexRenderer latex={QuestionText || ""} />}                
                    </Col>
                </Row>
            </div>
        )
    }
   

    return(
        <div>
            {isLoadingDiagramQuestionPlay && <Skeleton />}

            {errorGetDiagramQuestionPlay && !isLoadingDiagramQuestionPlay && 
            <ErrorComponent 
                error={errorGetDiagramQuestionPlay}
                onReload={() => getDiagramQuestionPlay(Id)}
            />}

            {!(isLoadingDiagramQuestionPlay || errorGetDiagramQuestionPlay) && DiagramQuestionPlay && renderQuestion()}
        </div>
    )
}