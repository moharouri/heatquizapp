import React, { useEffect, useState } from "react";
import { computePointInCanvas, drawCircle, drawCurveOneCP, drawLine, drawRectangle, drawText } from "../../DiagramQuestion/Shared/Functions";
import { POINT_RAD, POINT_RAD_MAGNIFICATION_VALUE, CP_POINT_RAD } from "./Constants";
import { calculateFinalSnippingCPPoint, calculateFinalSnippingPoint, getHoveredPoint, snippingCPPoint, snippingPoint } from "./Functions";

export function AddPVDiagramQuestionInteractivePlot({
    style, imageURL,
    isAdding, onAdd,
    points, selectedPointIndex,
    selectedPointMoveIndex, 
    onSelectedPointMove,
    onPointMove,

    selectedCPPointMoveIndex, 
    onSelectedCPPointMove,
    onCPPointMove
}){
    const {width, height} = style

    const plotRef = React.createRef()

    const [ctx, setCtx] = useState(null)

    const [hoveredPointIndex, setHoveredPointIndex] = useState(null)
    const [hoveredCPPointIndex, setHoveredCPPointIndex] = useState(null)

    const [snippedPoint, setSnippedPoint] = useState(null)
    const [snippedCPPoint, setSnippedCPPoint] = useState(null)

    useEffect(() => {
        if(plotRef){
            const _ctx = plotRef.current.getContext('2d')

            setCtx(_ctx)
        }
    }, [plotRef])

    useEffect(() => {
        //Initial draw
        drawPlot()
    }, [ctx])

    useEffect(() => {
        //Dynamic draw
        drawPlot()
    }, [ctx, points, selectedPointIndex, selectedPointMoveIndex, selectedCPPointMoveIndex])


    const renderPoint = (p, isSelected) => {
        const {x, y, color, borderColor, name, marginX, marginY} = p

        //draw margins 
        drawRectangle(ctx, x - marginX, y - marginY, marginX*2, marginY*2)

        //draw point
        drawCircle(ctx, x, y, POINT_RAD * (isSelected ? POINT_RAD_MAGNIFICATION_VALUE : 1), borderColor, color)

        //draw text
        drawText(ctx, x + POINT_RAD * (isSelected ? POINT_RAD_MAGNIFICATION_VALUE : 1) * 1.5, y + POINT_RAD * (isSelected ? POINT_RAD_MAGNIFICATION_VALUE : 1) * 0.4, name, 'gray')
    }


    const drawPointSnipping = () => {
        const currentPoint = points[selectedPointMoveIndex]

        const {x, y} = currentPoint

        const {sameXPoints, sameYPoints} = snippedPoint

        for(let pi of sameXPoints){
            const otherP = points[pi]
            const {x: ox, y: oy} = otherP 

            //draw line snipping line 
            drawLine(ctx, x, y, ox, oy, 'orange' )
        }

        for(let pi of sameYPoints){
            const otherP = points[pi]
            const {x: ox, y: oy} = otherP 

            //draw line snipping line 
            drawLine(ctx, x, y, ox, oy, 'orange' )
        }

    }

    const drawCPPointSnipping = () => {
        const currentPoint = points[selectedCPPointMoveIndex]
        const nextPoint = points[selectedCPPointMoveIndex + 1]

        if(!nextPoint) return;

        const {x, y} = currentPoint
        const {x: ox, y: oy} = nextPoint

        drawLine(ctx, x, y, ox, oy, 'red' )
    }

    const drawPlot = () => {
        if(!ctx) return;

        //clear drawing 
        ctx.clearRect(0, 0, width, height)

        //draw points 
        points.forEach((p, pi) => {
            const isSelected = (selectedPointIndex === pi)

            renderPoint(p, isSelected)
        })

        //draw curves and ccontrol points
        for(let [pi,p] of points.entries()){
            const nextP = points[pi + 1]
            if(!nextP) continue;

            const {x, y, cx, cy} = p
            const {x: nx, y: ny} = nextP

            //draw curve
            drawCurveOneCP(ctx, x, y, nx, ny, cx, cy, 'green', 1)

            //control point
            drawCircle(ctx, cx, cy, CP_POINT_RAD, 'blue', '#a6a6a6')
            drawLine(ctx, x, y, cx, cy, 'rgba(0,0,0, 0.1)', 1)
            drawLine(ctx, nx, ny, cx, cy, 'rgba(0,0,0, 0.1)', 1)
        }

        //Draw snipping
        if(!Object.is(selectedPointMoveIndex, null) && snippedPoint) drawPointSnipping();

        if(!Object.is(selectedCPPointMoveIndex, null) && snippedCPPoint) drawCPPointSnipping();
    }


    const onMouseEnter = (e) => {}

    const onMouseLeave = (e) => {
        setHoveredPointIndex(null)
        setHoveredCPPointIndex(null)
    }

    

    const onMouseMove = (e) => {
        const mpoint = computePointInCanvas(e, plotRef)

        if(Object.is(selectedPointMoveIndex, null) && Object.is(selectedCPPointMoveIndex, null)){
            const _hoveredPointIndex = getHoveredPoint(points, mpoint)
            if(_hoveredPointIndex){
                setHoveredPointIndex(_hoveredPointIndex)
                setHoveredCPPointIndex(null)

                return
            }

            const _hoveredCPPointIndex = getHoveredPoint(points.map((p) => ({...p, x:p.cx, y:p.cy})), mpoint)
           
            if(_hoveredCPPointIndex){
                setHoveredPointIndex(null)
                setHoveredCPPointIndex(_hoveredCPPointIndex)
                return
            }

            setHoveredPointIndex(null)
            setHoveredCPPointIndex(null)

        }
        else if (!Object.is(selectedPointMoveIndex, null)){ 
            const _snippedPoint = snippingPoint(selectedPointMoveIndex, points, mpoint)

            setSnippedPoint(_snippedPoint)

            const finalPoint = calculateFinalSnippingPoint(_snippedPoint, points, mpoint)

            onPointMove(finalPoint)
        }  
        else if (!Object.is(selectedCPPointMoveIndex, null)){ 
            const _snippedCPPoint = snippingCPPoint(selectedCPPointMoveIndex, points, mpoint)

            setSnippedCPPoint(_snippedCPPoint)

            const finalPoint = calculateFinalSnippingCPPoint(_snippedCPPoint, mpoint)

            onCPPointMove(finalPoint)
        }
    }

    const onMouseClick = (e) => {
        if(isAdding){
            const point = computePointInCanvas(e, plotRef)

            onAdd(point)

            return;
        }

        if(!Object.is(selectedPointMoveIndex, null)){
            onSelectedPointMove(null)
            return;
        }

        if(!Object.is(selectedCPPointMoveIndex, null)){
            onSelectedCPPointMove(null)
            return;
        }

        if(hoveredPointIndex){
            onSelectedPointMove(hoveredPointIndex[0])

            return;
        }

        if(hoveredCPPointIndex){
            onSelectedCPPointMove(hoveredCPPointIndex[0])

            return;
        }

     }

    const calculateCursor = () => {
        const changeCursor = (isAdding || selectedPointMoveIndex || selectedCPPointMoveIndex || hoveredPointIndex || hoveredCPPointIndex) 

        return (changeCursor ? 'crosshair' : 'default')
    }   

    const cursorType = calculateCursor()

    return(
        <div>
            <canvas
                ref = {plotRef}

                    style = {{
                        ...style,
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'contain',
                        backgroundImage: `url(${imageURL})`,
                        cursor: cursorType,
                    }}

                    width = {width}
                    height = {height}


                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onMouseMove={onMouseMove}
                    onClick = {onMouseClick}
            />
        </div>
    )
}