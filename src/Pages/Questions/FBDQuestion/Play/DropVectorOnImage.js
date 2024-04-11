import React, { useEffect } from "react"
import { useState } from "react"
import { FixURL } from "../../../../services/Auxillary"
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent"
import Xarrow from "react-xarrows";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function DropVectorOnImage({question, addedVT, selectedVT, onDropVT}){

    const canvasRef = React.createRef()

    const [ctx, setCtx] = useState()
    const [topOffset, setTopOffset] = useState(0)
    const [leftOffset, setLeftOffset] = useState(0)

    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)

    const [angleX, setAngleX] = useState(0)
    const [angleY, setAngleY] = useState(0)

    const [showSelectAngle, setShowSelectAngle] = useState(false)

    const [snippedBox, setSnippedBox] = useState(null) 

    const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, ObjectBodies} = question

    const newImageWidth = window.innerWidth * 0.25
    const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

    useEffect(() => {
        if(canvasRef && canvasRef.current){
            const _ctx = canvasRef.current.getContext('2d')

            const styles = canvasRef.current.getBoundingClientRect()

            const {top, left} = styles

            if(_ctx){
                setCtx(_ctx)
            }

            setTopOffset(top)
            setLeftOffset(left)
        }
    }, [canvasRef])

    useEffect(() => {
        drawPlot()
    }, [mouseX, mouseY, selectedVT])

    useEffect(() => {
        
    }, [addedVT])

    const calculateCPdimensions = (imageWidth, imageHeight,specificedWidth, specificedHeight, element, Offset=0) => {
        return({            
            width: (element.Width)  * (specificedWidth/imageWidth),
            height: (element.Height)* (specificedHeight/imageHeight),
            left: (element.X + Offset) * (specificedWidth/imageWidth),
            top: (element.Y) * (specificedHeight/imageHeight),
        })
    }

    const handleSnipping = (e) => {
        let point = computePointInCanvas(e)

        let _snippedBox = null

        const boxes = ObjectBodies.map((b) => {
            const dimensions = calculateCPdimensions (Base_ImageURL_Width, Base_ImageURL_Height, newImageWidth, newImageHeight, b)
            return({
                ...b,
                ...dimensions
            })
        })

        const closest_boxes = boxes.map((b) => {
            const insideX = (point.x >= b.left && point.x <= (b.width+b.left))
            const insideY = (point.y >= b.top && point.y <= (b.height+b.top))

            if(insideX && insideY) return b
            
            return null
        }).filter(a => a)

        if(closest_boxes.length){
            const first_box = closest_boxes[0]
            const centerX = first_box.left + 0.5*first_box.width
            const centerY = first_box.top + 0.5*first_box.height

            point.x = centerX
            point.y = centerY

            _snippedBox = first_box
        }

        return ({point, _snippedBox})
    }

    const onMouseEnter = (e) => {
        setMouseX(0)
        setMouseY(0)
    }

    const onMouseLeave = (e) => {
        setMouseX(0)
        setMouseY(0)
    }

   
    const onMouseMove = (e) => {
        const {point, _snippedBox} = handleSnipping(e)

        setMouseX(point.x)
        setMouseY(point.y)

        setSnippedBox(_snippedBox)
    }

    const onMouseClick = (e) => {
        if(selectedVT){
            setShowSelectAngle(true)
            let point = computePointInCanvas(e)

            setAngleX(point.x)
            setAngleY(point.y)
        }
    }

    //Function to calculate point position inside canvas
    const computePointInCanvas = (e) => {
        const {clientX, clientY} = e

        const boundingRect = canvasRef.current.getBoundingClientRect();
            return {
                x: Math.floor(clientX - boundingRect.left),
                y: Math.floor(clientY - boundingRect.top)
            }
    }

    const drawDot = (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);

        ctx.strokeStyle = 'gray';
        ctx.fillStyle = 'green'

        ctx.fill();
        ctx.stroke();
    }

    const drawPlot = () => {
        if(!ctx) return;

        ctx.clearRect(0, 0, newImageWidth, newImageHeight)

        //Draw green point
        if(mouseX && mouseY && selectedVT){
            drawDot(mouseX, mouseY)
        }
    }


    const getOrientedVTs = () => {
        let boxes = {

        }

        const boxesIds = Object.keys(boxes)

        for(let vt of addedVT){
            const {ObjectBody} = vt

            if(boxesIds.includes(ObjectBody.Id)){
                boxes.list.push(vt)
            }
            else{
                boxes[ObjectBody.Id] = ({})
                
                boxes[ObjectBody.Id].body = ObjectBody
                boxes[ObjectBody.Id].list = [vt]
            }
        }

        return boxes
    }

    const orientedBoxes = getOrientedVTs()
    const orientedBoxesKeys = Object.keys(orientedBoxes)
    const widthHeight = window.innerWidth*0.035

      return(
        <div>
             <canvas
                    style = {{
                            cursor: selectedVT ? 'crosshair' : 'default',
                            height:newImageHeight,
                            width:newImageWidth,
                            backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                            backgroundPosition:'center',
                            backgroundRepeat:'no-repeat',
                            backgroundSize:'contain',
                            border:'1px solid gainsboro'
                        }}

                        width = {newImageWidth}
                        height = {newImageHeight}

                        ref = {canvasRef}

                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onMouseMove={onMouseMove}
                        onClick = {onMouseClick}
                    > 
                
                </canvas>
                {showSelectAngle && 
                <div
                    style={{position:'absolute', left:leftOffset + angleX - widthHeight/2, top:topOffset + angleY - widthHeight/2}}
                >
                    <VectorDirectionComponent 
                        onUpdateAngle={(angle) => {
                            onDropVT(selectedVT, angle, angleX, angleY, snippedBox)
                            setShowSelectAngle(false)
                        }}  

                        widthHeight={widthHeight}
                        angleStep={5}
                    />
                </div>}

                {orientedBoxesKeys.map((bk) => {
                    const b = orientedBoxes[bk]
                    const {body, list} = b
                    const {Id, X, Y, Width, Height} = body
                    console.log(b)

                    return(
                           <div>
                                <div
                                    key={Id}
                                    style={{position:'absolute', width: Width, height: Height, left: leftOffset + X + Width/2, top: topOffset + Y + Height/2, border:'1px solid red'}}
                                >
                                    <div
                                    id={"B_START_" + Id}
                                    style={{left:Width/2, top: Height/2, position:'relative', width: 1, height:1}}
                                    >

                                    </div>
                                </div>

                                {list.map((vt) => {
                                   const {Id: vId, X, Y, Angle, Latex} = vt

                                   const arrowRad = 50
               
                                   const radAngle = Math.PI * (Angle/180)
               
                                   const extraX = Math.cos(radAngle) * arrowRad
                                   const extraY = Math.sin(-radAngle) * arrowRad

                                   console.log(Angle, radAngle, extraX, extraY)
               
                                   return(
                                       <div
                                           key={vId}
                                           style={{position:'absolute', left: leftOffset + X + extraX, top: topOffset + Y + extraY}}
                                           id={"VT_END_" + vId}
                                       >
                                       </div>
                                   )
                                })}

                                {list.map((vt) => {
                                    const {Id:vId} = vt

                                    return(<Xarrow
                                            key={Id}
                                            start={"B_START_" + Id}
                                            end={"VT_END_" + vId}
                                            strokeWidth={2}
                                            headSize={4}
                                            startAnchor="auto"
                                            endAnchor="auto"
                                            color={"green"}
                                            path={"straight"}
                                        />)
                                })}

                                </div>)
                            })}
                
                {/*addedVT.map((vt) => {
                    const {Id, X, Y} = vt
                    return(
                        <div
                            key={Id}
                            style={{position:'absolute', left: leftOffset + X, top: topOffset + Y}}
                            id={"VT_START_" + Id}
                        >
                        </div>
                    )
                })}

                {addedVT.map((vt) => {
                    const {Id, X, Y, Angle, Latex} = vt

                    const arrowRad = 50

                    const radAngle = Math.PI * (Angle/180)

                    const extraX = Math.cos(radAngle) * arrowRad
                    const extraY = Math.sin(-radAngle) * arrowRad

                    return(
                        <div
                            key={Id}
                            style={{position:'absolute', left: leftOffset + X + extraX, top: topOffset + Y + extraY}}
                            id={"VT_END_" + Id}
                        >
                        </div>
                    )
                })}

                {addedVT.map((vt) => {
                    const {Id, X, Y, Angle, Latex} = vt

                    const arrowRad = 70

                    const radAngle = Math.PI * (Angle/180)

                    const extraX = Math.cos(radAngle) * arrowRad
                    const extraY = Math.sin(-radAngle) * arrowRad

                    return(
                        <div
                            key={Id}
                            style={{position:'absolute', left: leftOffset + X + extraX, top: topOffset + Y + extraY}}
                        >
                            <LatexRenderer latex={"$$" + Latex + "$$"} />
                        </div>
                    )
                })}

            {addedVT.map((vt) => {
                    const {Id} = vt

                    return(<Xarrow
                            key={Id}
                            start={"VT_START_" + Id}
                            end={"VT_END_" + Id}
                            strokeWidth={2}
                            headSize={4}
                            startAnchor="auto"
                            endAnchor="auto"
                            color={"green"}
                            path={"straight"}
                        />)
                })*/}

           
        </div>
    )
}