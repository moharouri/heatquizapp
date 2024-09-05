import React from "react";
const SLIDER_POINT_RAD = 4

export function AddQuestionInteractivePlot({width, height,}){

    const plotRef = React.createRef()

    const [ctx, setCtx] = useState(null)


    return(
        <div 
            className="border border-danger"
           style = {{justifyContent:'center', width: width + SLIDER_POINT_RAD}}>
                <canvas

                    ref = {plotRef}

                        style = {{
                            ...style,
                            cursor: cursorType,
                            height:height + offset * 2,
                            width:width + SLIDER_POINT_RAD
                        }}

                        width = {width + SLIDER_POINT_RAD}
                        height = {height + offset * 2}


                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        onMouseMove={this.onMouseMove}
                        onClick = {this.onMouseClick}
                    />
                <p style = {{textAlign:'center', width:'100%'}}>{title}</p>
           </div> 
    )
}