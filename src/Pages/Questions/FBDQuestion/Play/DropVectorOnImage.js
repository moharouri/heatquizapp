import React, { useEffect } from "react"
import { useState } from "react"
import { FixURL } from "../../../../services/Auxillary"
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent"

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

        let snippedBox = null

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

            snippedBox = first_box
        }

        return ({point, snippedBox})
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
        const {point} = handleSnipping(e)

        setMouseX(point.x)
        setMouseY(point.y)
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
                            onDropVT(selectedVT, angle)
                            setShowSelectAngle(false)
                        }}  

                        widthHeight={widthHeight}
                        angleStep={5}
                    />
                </div>}

                {addedVT.map((vt) => {
                    const {Id} = vt

                    return(
                        <div>

                        </div>
                    )
                })}
        </div>
    )
}