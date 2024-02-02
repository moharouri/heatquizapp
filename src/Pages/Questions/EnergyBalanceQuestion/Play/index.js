import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import {Col, List, Row, Skeleton, Space, Steps, Tabs, Tooltip } from "antd";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { FixURL } from "../../../../services/Auxillary";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { CENTER_DIRECTION, EAST_DIRECTION, NORTH_DIRECTION, SOUTH_DIRECTION, WEST_DIRECTION } from "./Constants";
import Xarrow from "react-xarrows";

import './Play.css'
import { Keyboard } from "../../../../Components/Keyboard";

export function EnergyBalanceQuestionPlay({Id}){

    const { energyBalanceQuestionPlay, errorGetEnergyBalanceQuestionPlay, isLoadingEnergyBalanceQuestionPlay, getEnergyBalanceQuestionPlay} = useQuestions()


    const [currentTab, setCurrentTab] = useState(0)

    const [selectedCV, setSelectedCV] = useState(null)

    const [termsContainer, setTermsContainer] = useState({
        North: [],
        South: [],
        East: [],
        West: [],
        Center: []
    })
    
    const [selectedTerm, setSelectedTerm] = useState(null)

    const [selectedTermDefine, setSelectedTermDefine] = useState(null)

    useEffect(() => {
        getEnergyBalanceQuestionPlay(Id)
    }, [Id])


    const calculateCPdimensions = (imageWidth, imageHeight,specificedWidth, specificedHeight, element, Offset=0) => {
        return({            
            width: (element.Width)  * (specificedWidth/imageWidth),
            height: (element.Height)* (specificedHeight/imageHeight),
            left: (element.X) * (specificedWidth/imageWidth), // + Offset,
            top: (element.Y) * (specificedHeight/imageHeight),
        })
    }


    const renderSelectControlVolume = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, ControlVolumes} = energyBalanceQuestionPlay
     
        const newImageWidth = window.innerWidth * 0.40
        const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

        const smallImageWidth = window.innerWidth * 0.20
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

        let cvDimesions = null

        if(selectedCV){
            cvDimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,newImageWidth, newImageHeight, selectedCV)
        }

        return(
            <Space align="start">
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

                    {selectedCV && 
                        <div style={{...cvDimesions, position:'relative', border:'1px dashed #28a745' }}>
                            <div style={{width:'100%', height:'100%', backgroundColor:'#f1f4f8', opacity:'40%'}}></div>
                        </div>    
                    }

                    </div>
                </div>

                <List 
                    dataSource={ControlVolumes}

                    renderItem={(c) => {
                        const {Id, ImageURL} = c

                        const dimensions = calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, c)

                        return(
                            <div 
                                className="hoverable eb-question-control-volume"
                                key={Id}
                                style = {{
                                    height:smallImageHeight,
                                    width: smallImageWidth,
                                    backgroundImage: `url(${FixURL(ImageURL || Base_ImageURL)})`,
                                    backgroundPosition:'center',
                                    backgroundRepeat:'no-repeat',
                                    backgroundSize:'contain',
                                    cursor:'pointer'}}

                                    onClick = {() => setSelectedCV(c)}                    
                            >
                                <div style={{...dimensions, position:'relative', border:'1px dashed #007bff'}}>
                                    <div style={{width:'100%', height:'100%', backgroundColor:'#f1f4f8', opacity:'40%'}}></div>
                                </div>
                            </div>
                        )
                    }}
                />
            </Space>
        )
    }

    const addTermToDirection = (t, originalTerm, direction) => {
        //Clean the container from this term 
        let container = {}

        const directions = Object.keys(termsContainer)

        for(let d of directions){
            container[d] = termsContainer[d].filter(a => a.Id !== t.Id)
        }

        if(originalTerm){
            container[direction].push({...originalTerm, Questions: t.Questions.map((q) => ({...q, AddedAnswer:{List:[], echoNumber:0}}))})
        }
        else{
            container[direction].push({...t, Inflow: true, IsSource: true, Questions: t.Questions.map((q) => ({...q, AddedAnswer:{List:[], echoNumber:0}}))})

        }

        setTermsContainer(container)

        setSelectedTerm(null)
    }

    const removeTermFromBalance = (t) => {
        //Clean the container from this term 
        let container = {}

        const directions = Object.keys(termsContainer)

        for(let d of directions){
            container[d] = termsContainer[d].filter(a => a.Id !== t.Id)
        }   

        setTermsContainer(container)
    }

    const checkIfTermInDirection = (t, direction) => {
        const term = termsContainer[direction].filter(a=> a.Id === t.Id)[0]

        return (term ? [term, direction] : null)
    }

    const flipTermSign = (t, direction, currentSign) => {

        let container = {...termsContainer}

        let _containerD =  [...container[direction]]

        _containerD = _containerD.filter(a => a.Id != t.Id)

        let originalTerm = null

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            originalTerm = termsContainer[d].filter(a => a.Id === t.Id)[0]

            if(originalTerm) break;
        }

        if(originalTerm){
            _containerD.push({...t, Inflow: !currentSign, IsSource: !currentSign, Questions: originalTerm.Questions})

        }
        else{
            _containerD.push({...t, Inflow: !currentSign, IsSource: !currentSign})
        }

        container[direction] = _containerD

        setTermsContainer(container)
        
    }

    const renderItemInteractionLine = (t) => {
        const totalWidthHeight = 0.05*window.innerWidth
        const shapesGap = 0.1*totalWidthHeight
        const width1 = 0.125 * totalWidthHeight
        const width2 = totalWidthHeight - 2 * shapesGap - 2 * width1


        const isNorthSelected = checkIfTermInDirection(t, NORTH_DIRECTION)
        const isEastSelected = checkIfTermInDirection(t, EAST_DIRECTION)
        const isWestSelected = checkIfTermInDirection(t, WEST_DIRECTION)
        const isSouthSelected = checkIfTermInDirection(t, SOUTH_DIRECTION)
        const isCenterSelected = checkIfTermInDirection(t, CENTER_DIRECTION)

        const isSelected = (isNorthSelected || isEastSelected || isWestSelected || isSouthSelected || isCenterSelected)

        let includedTerm = isSelected && isSelected[0]
        let currentDirection = isSelected && isSelected[1]

        let selectedColor = '#28a745'

        if(includedTerm && currentDirection !== CENTER_DIRECTION && !includedTerm.Inflow){
            selectedColor = '#DC4C64'
        }

        const notSelectedStyle = {backgroundColor:'#f1f4f8', cursor:'pointer'} //border:'1px solid green', 
        const selectedStyle = {backgroundColor:selectedColor, cursor:'pointer'} //border:'1px solid green', 

        return(
            <Space direction="vertical">
                <div style={{flexDirection:'row', display:'flex', width: totalWidthHeight, height:totalWidthHeight, border:'1px solid #f1f4f8'}}>
                
                    <div 
                        onClick={() => addTermToDirection(t, includedTerm, EAST_DIRECTION)}
                        style={{width:width1, height: width2, marginRight:shapesGap, marginTop: (shapesGap + width1), ...(isEastSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* East */}
                    </div>

                    <div style={{width:width2, height: totalWidthHeight, marginRight:shapesGap}}>
                        <div 
                            onClick={() => addTermToDirection(t, includedTerm, NORTH_DIRECTION)}
                            style={{width:width2, height: width1, marginBottom:shapesGap, ...(isNorthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* North */}
                        </div>

                        <div
                            onClick={() => addTermToDirection(t, includedTerm, CENTER_DIRECTION)} 
                            style={{width:width2, height: width2, marginBottom:shapesGap, ...(isCenterSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* Center */}
                        </div>

                        <div 
                            onClick={() => addTermToDirection(t, includedTerm, SOUTH_DIRECTION)}
                            style={{width:width2, height: width1, ...(isSouthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* South */}
                        </div>
                    </div>

                    <div 
                        onClick={() => addTermToDirection(t, includedTerm, WEST_DIRECTION)}
                        style={{width:width1, height: width2, marginTop: (shapesGap + width1), ...(isWestSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* West */}
                    </div>
                </div>
                {isSelected && 
                <Space>
                    <small className="default-gray hq-clickable" onClick={() => removeTermFromBalance(t)}>Remove</small>
                </Space>}

                {isSelected && 
                <Space>
                    {isCenterSelected ? 
                     <div className="eb-question-erm-direction-container">
                        <div 
                        onClick={() => flipTermSign(t, currentDirection, includedTerm.IsSource)}
                        className={"hq-clickable " + (!includedTerm.IsSource ? "eb-question-term-direction-inactive" : "eb-question-term-direction-neutral")}>
                            <span className="eb-question-term-word">Source</span>
                        </div>

                        <div 
                        onClick={() => flipTermSign(t, currentDirection, includedTerm.IsSource)}
                        className={"hq-clickable " + (includedTerm.IsSource ? "eb-question-term-direction-inactive" : "eb-question-term-direction-neutral")}>
                            <span className="eb-question-term-word">Steady flow </span>
                        </div>
                    </div>
                    :
                    <div className="eb-question-erm-direction-container">
                        <div
                        onClick={() => flipTermSign(t, currentDirection, includedTerm.Inflow)}
                        className={"hq-clickable " + (!includedTerm.Inflow ? "eb-question-term-direction-inactive" : "eb-question-term-direction-green")}>
                            <span className="eb-question-term-word">Inflow</span>
                        </div>

                        <div 
                        onClick={() => flipTermSign(t, currentDirection, includedTerm.Inflow)}
                        className={"hq-clickable " + (includedTerm.Inflow ? "eb-question-term-direction-inactive" : "eb-question-term-direction-red")}>
                            <span className="eb-question-term-word">Outflow</span>
                        </div>
                    </div>}    
                </Space>}
            </Space>
        )

    }

    const getEnergyBalanceEquation = () => {    
        let text = ""
    
        const heatSources = termsContainer[CENTER_DIRECTION].filter((t) => t.IsSource)
    
        const unsteady_flow_terms = termsContainer[CENTER_DIRECTION].filter((t) => !t.IsSource)
    
        const steady_flow_terms = [...termsContainer[NORTH_DIRECTION], ...termsContainer[SOUTH_DIRECTION], ...termsContainer[EAST_DIRECTION], ...termsContainer[WEST_DIRECTION]]
    
        if(!unsteady_flow_terms.length){
            text = '0 = '
        }
        else{
            for(let term of unsteady_flow_terms){
                text += "{\\color{green}" + '+' + term.Latex + "}"
            }
    
            text += " = "
        }
    
        if(!steady_flow_terms.length && !heatSources.length){
            text += '0'
        }
        else{
            for(let term of steady_flow_terms){
                text += "{\\color{"+(term.Inflow ? 'green' : 'red')+"}" + (term.Inflow ? '+' : '-') + term.Latex + "}"
            }
    
            for(let term of heatSources){
                text += "{\\color{green}" + '+' + term.Latex + "}"
            }
        }
    
        return text
    }

    const renderEnergyBalanceEquation = () => {
        const equation = getEnergyBalanceEquation()

        return(
            <Space direction="vertical" align="start">
                <br/>
                <p className="default-medium"><u>Energy balance equation</u></p>

                <LatexRenderer className={"default-medium"} latex={"$$" + equation + "$$"}/>
            </Space>
        )
    }

    const addTermToDirectionMainBox = (direction) => {
        if(!selectedTerm) return;
        
        //Clean the container from this term 
        let container = {}

        const directions = Object.keys(termsContainer)

        for(let d of directions){
            container[d] = termsContainer[d].filter(a => a.Id !== selectedTerm.Id)
        }

        let originalTerm = null

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            originalTerm = termsContainer[d].filter(a => a.Id === selectedTerm.Id)[0]

            if(originalTerm) break;
        }

        if(originalTerm){
            container[direction].push({...originalTerm, Questions: selectedTerm.Questions.map((q) => ({...q, AddedAnswer:{List:[], echoNumber:0}}))})
        }
        else{
            container[direction].push({...selectedTerm, Inflow: true, IsSource: true, Questions: selectedTerm.Questions.map((q) => ({...q, AddedAnswer:{List:[], echoNumber:0}}))})

        }

        setTermsContainer(container)

        setSelectedTerm(null)
    }

    const getColorDirection = (direction) => {
        let terms = termsContainer[direction]

        if(!terms.length) return '#f1f4f8';

        if(direction === CENTER_DIRECTION) return '#28a745';

        const allInflow = !terms.map(a => !a.Inflow).filter(a => a).length
        const allOutflow = !terms.map(a => a.Inflow).filter(a => a).length

        if(allInflow) return '#28a745';

        if(allOutflow) return '#DC4C64';

        return '#f0ad4e';
    }

    const renderMainInteractionBox = (cvDimesions) => {

        const {width, height} = cvDimesions

        const totalWidth = width
        const totalHeight = height

        const shapesGapX = 0.1*totalWidth
        const shapesGapY = 0.1*totalHeight

        const width1 = 0.125 * totalWidth
        const width2 = totalWidth - 2 * shapesGapX - 2 * width1

        const height1 = 0.125 * totalHeight
        const height2 = totalHeight - 2 * shapesGapY - 2 * height1

        const northColorCalculation = getColorDirection(NORTH_DIRECTION)
        const southColorCalculation = getColorDirection(SOUTH_DIRECTION)
        const eastColorCalculation = getColorDirection(EAST_DIRECTION)
        const westColorCalculation = getColorDirection(WEST_DIRECTION)
        const centerColorCalculation = getColorDirection(CENTER_DIRECTION)
        
        const elementStyle = {backgroundColor:'#f1f4f8', opacity:'60%', cursor: selectedTerm ? 'pointer' : 'default'}

        return(
            <div>
                <div style={{flexDirection:'row', display:'flex'}}>
                
                <div 
                    onClick={() => addTermToDirectionMainBox(EAST_DIRECTION)}
                    style={{width:width1, height: height2, marginRight:shapesGapX, marginTop: (shapesGapY + height1), ...elementStyle, backgroundColor: eastColorCalculation}}
                >
                    {/* East */}
                </div>

                <div style={{marginRight:shapesGapX}}>
                    <div 
                        onClick={() => addTermToDirectionMainBox(NORTH_DIRECTION)}
                        style={{width:width2, height: height1, marginBottom:shapesGapY, ...elementStyle, backgroundColor: northColorCalculation}}
                    >
                        {/* North */}
                    </div>

                    <div
                        onClick={() => addTermToDirectionMainBox(CENTER_DIRECTION)}
                        style={{width:width2, height: height2, marginBottom:shapesGapY, ...elementStyle, backgroundColor: centerColorCalculation}}
                    >
                        {/* Center */}
                    </div>

                    <div 
                        onClick={() => addTermToDirectionMainBox(SOUTH_DIRECTION)}
                        style={{width:width2, height: height1, ...elementStyle, backgroundColor: southColorCalculation}}
                    >
                        {/* South */}
                    </div>
                </div>

                <div 
                        onClick={() => addTermToDirectionMainBox(WEST_DIRECTION)}
                        style={{width:width1, height: height2, marginTop: (shapesGapY + height1), ...elementStyle, backgroundColor: westColorCalculation}}
                >
                    {/* West */}
                </div>
            </div>
            </div>
        )
    }

    const renderImageWithControlVolume = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL} = energyBalanceQuestionPlay
     
        const newImageWidth = window.innerWidth * 0.4
        const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

        let cvDimesions = calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,newImageWidth, newImageHeight, selectedCV)

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

                    {selectedCV && 
                        <div style={{...cvDimesions, position:'relative', border:'2px solid gainsboro' }}>
                                {renderMainInteractionBox(cvDimesions)}
                        </div>    
                    }

                 </div>
                 {renderEnergyBalanceEquation()}
            </div>
        )
    }

    const renderEnergyBalanceTerms = () => {
        const {EnergyBalanceTerms} = energyBalanceQuestionPlay

        return(
            <div>
                <br/>
                <Space size={'large'} align="start">

                    {renderImageWithControlVolume()}

                    <Space direction="vertical" align="start" size={"large"}>
                        <p> Please add <strong>energy balance terms</strong> from the list. An energy balance can be established with a subset of terms or all of them. </p>
                        <List 
                        dataSource={EnergyBalanceTerms}

                        renderItem={(t, ti) => {
                            const {Id, Latex} = t
                            const isSelectedDrop = selectedTerm && selectedTerm.Id === t.Id
                            return(
                                <div key={Id}>
                                    <Space size={'large'} align="start" className={isSelectedDrop ? "highlighted" : ""}>
                                        <p className={!isSelectedDrop ? "default-gray" : "default-green"}>{ti+1}</p>

                                        {renderItemInteractionLine(t)}

                                        <Tooltip
                                            title={
                                                <div>
                                                    <p>To add the term to the balance:</p>
                                                    <br/>
                                                    <p>Click to select and drop in the control volume in the image</p>
                                                    
                                                    <p><u>Or</u></p>
                                                    
                                                    <p>Click on small control volume elements to the left to add the term to the balance</p>
                                                </div>

                                            }
                                            color="white"
                                            placement="right"
                                        >
                                            <div
                                                className={"hoverable-plus " + (isSelectedDrop ? "default-green" : "")}
                                                onClick={() => {
                                                    if(isSelectedDrop){
                                                        setSelectedTerm(null)
                                                        return
                                                    }

                                                    setSelectedTerm(t)
                                                }}
                                            >
                                                <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                            </div>
                                        </Tooltip>
                                        
                                    </Space>

                                    <br/>
                                    <br/>
                                    <br/>
                                </div>
                            )
                        }}
                    />
                    </Space>
                </Space>
               
            </div>
        )
    }

    const getAddedTerms = () => {
        let addedTerms = []

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            addedTerms = [...addedTerms, ...termsContainer[d]]
        }

        return addedTerms
    }

    const addAnswerToTermQuestion = (l) => {
        console.log(l)

        let originalTerm = null
        let originalDirection = null

        let originalIndex = null

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            originalTerm = termsContainer[d].map((a, ai) => ({...a, index: ai})).filter(a => a.Id === selectedTermDefine.Id)[0]

            if(originalTerm){
                originalDirection = d
                originalIndex = originalTerm.index
                break;
            }
        }
        
        if(!originalTerm) return;

        let _terms = ({...termsContainer})

        _terms[originalDirection][originalIndex].Questions = [{..._terms[originalDirection][originalIndex].Questions[0], AddedAnswer: l}]

        setTermsContainer(_terms)

    }

    const renderDefineSpecificTerm = () => {
        console.log(termsContainer)

        const {Latex, LatexText, Questions} = selectedTermDefine

        if(Questions.length > 1){
            return(<div>test</div>)
        }

        else{

            const question = Questions[0]

            const {Keyboard: keyboard, LatexCode} = question

            const list = question.AddedAnswer
            const reducedLatex = list.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

            return(
                <div>
                    <Space size={"large"} align="start">
                        <Space direction="vertical" align="start">
                            <p className="default-gray">Define</p>

                            <LatexRenderer latex={"$$" + Latex + "$$"}/>
                            <LatexRenderer latex={"$$" + LatexCode + "$$"}/>
                        </Space>

                        {LatexText &&
                        <Space direction="vertical" align="start">
                            <p className="default-gray">Help</p>
                            <p className="default-gray">{LatexText}</p>
                        </Space>}
                    </Space>

                    <br/>
                    <div className="h">
                        {reducedLatex && 
                        <LatexRenderer 
                            latex={"$$"+reducedLatex+"$$"}
                        />}
                    </div>
                    <Keyboard 
                        Id={keyboard.Id}

                        List={list}

                        onEnterKey={(l) => addAnswerToTermQuestion(l)}
                    />
                </div>
            )
        }
    }

    const renderDefineSelectedTerms = () => {
        const addedTerms = getAddedTerms()

        return(
            <Space size={'large'} align="start">
                {renderImageWithControlVolume()}

                <Space direction="vertical" align="start">
                    <Row className="hq-full-width">
                        {addedTerms.map((t) => {
                            const {Id, Latex} = t

                            const isSelectedDefine = selectedTermDefine && selectedTermDefine.Id === Id

                            return(
                                <Col
                                    key={Id}
                                    className={"keyboard-key-item " + (isSelectedDefine ? "eb-question-term-selected-define" : "")}

                                    onClick={() => {
                                        if(isSelectedDefine){
                                            setSelectedTermDefine(null)
                                            return
                                        }

                                        setSelectedTermDefine(t)
                                    }}
                                >
                                    <LatexRenderer latex={"$$" + Latex + "$$"} />
                                </Col>
                            )
                        })}
                    </Row>

                    {selectedTermDefine && renderDefineSpecificTerm()}
                </Space>
            </Space>
        )
    }

    const renderContent = () => {
        const map = {
            0: () => renderSelectControlVolume(),
            1: () => renderEnergyBalanceTerms(),
            2: () => renderDefineSelectedTerms()

        }

        return map[currentTab]()
    }

    

    const onChange = (t) => setCurrentTab(t)

    const renderQuestion = () => {

        const items = [{
            key:'CV',
            title: <p className={currentTab === 0 ? "default-title highlighted" : "default-gray"}>Control volume</p>
        },
        {
            key:'EBQ',
            title: <p className={currentTab === 1 ? "default-title highlighted" : "default-gray"}>Energy balance equation</p>
        },
        {
            key:'Definitions',
            title: <p className={currentTab === 2 ? "default-title highlighted" : "default-gray"}>Definitions</p>
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
            {isLoadingEnergyBalanceQuestionPlay && <Skeleton />}

            {errorGetEnergyBalanceQuestionPlay && !isLoadingEnergyBalanceQuestionPlay && 
            <ErrorComponent 
                error={errorGetEnergyBalanceQuestionPlay}
                onReload={() => getEnergyBalanceQuestionPlay(Id)}
            />}

            {!(isLoadingEnergyBalanceQuestionPlay || errorGetEnergyBalanceQuestionPlay) && energyBalanceQuestionPlay && renderQuestion()}
        </div>
    )
}