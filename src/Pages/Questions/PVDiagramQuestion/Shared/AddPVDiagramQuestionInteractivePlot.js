import React, { useEffect, useState } from "react";

export function AddPVDiagramQuestionInteractivePlot({style, isAdding, onAdd}){

    const plotRef = React.createRef()

    const [ctx, setCtx] = useState(null)

    useEffect(() => {
        if(plotRef){
            const _ctx = plotRef.current.getContext('2d')

            setCtx(_ctx)
        }
    }, [plotRef])

    const {width, height} = style


    const drawPlot = () => {

    }


    const onMouseEnter = (e) => {}

    const onMouseLeave = (e) => {}

    const onMouseMove = (e) => {}

    const onMouseClick = (e) => {}

    return(
        <div>
            <canvas
                ref = {plotRef}

                    style = {{...style}}

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