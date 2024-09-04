import { POINT_RAD, SNIPPING_MARGIN } from "./Constants"

export const getHoveredPoint = (allPoints, mouseCoordinates) => {
    const {x: mx, y: my} = mouseCoordinates

    //get first point that aligns with the mouse
    for (let [pi, p] of allPoints.entries()) {
        const {x, y} = p
        const marginX = Math.abs(x - mx) 
        const marginY = Math.abs(y - my)

        if((marginX <= POINT_RAD) && (marginY <= POINT_RAD)){
            return [pi];
        } 
    } 

    return null;
}

export const snippingPoint = (movedPointIndex, allPoints, mPoint) => {
    const {x, y} = mPoint

    //same x 
    const sameXPoints = allPoints.map((p, pi) => {
        if(pi === movedPointIndex) return null;

        const {x: ox} = p 

        if(Math.abs(ox - x) < SNIPPING_MARGIN) return pi;

        return null
    }).filter(a => !Object.is(a, null))

    //same y 
    const sameYPoints = allPoints.map((p, pi) => {
        if(pi === movedPointIndex) return null;

        const {y: oy} = p 

        if(Math.abs(oy - y) < SNIPPING_MARGIN) return pi;

        return null
    }).filter(a => !Object.is(a, null))

    //line

    return({
        sameXPoints,
        sameYPoints
    })
}

 //nearest y 
const f_nearest_y = (m, x_0, y_0, px) => m * (px - x_0) + y_0; // f = m*x + y_0 ; y_0 = y of current point

export const snippingCPPoint = (movedCPPointIndex, allPoints, mPoint) => {
    const {x: px, y: py} = mPoint
    const currentPoint = allPoints[movedCPPointIndex]
    const nextPoint = allPoints[movedCPPointIndex + 1]

    if(!nextPoint) return null;

    const {x, y} = currentPoint
    const {x: ox, y: oy} = nextPoint

    //line
    const m = (oy - y) / (ox - x)
    const nearestY = f_nearest_y(m, x, y, px)

    if(Math.abs(nearestY - py) < SNIPPING_MARGIN) return nearestY;

    return null
}

export const calculateFinalSnippingPoint = (snippedPoint, allPoints, mPoint) => {
    const {sameXPoints, sameYPoints} = snippedPoint
    
    let x = mPoint.x;
    let y = mPoint.y;
    
    //X
    if(sameXPoints.length){
        const firstIndex = sameXPoints[0]
        x = allPoints[firstIndex].x
    } 

    //Y
    if(sameYPoints.length){
        const firstIndex = sameYPoints[0]
        y = allPoints[firstIndex].y

    }

    return ({x,y})
}

export const calculateFinalSnippingCPPoint = (snippedPoint, mPoint) => {
    const {x} = mPoint

    if(snippedPoint) return ({x, y:snippedPoint})

    return mPoint
}

