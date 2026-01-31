import {useState } from "react";
import { FaPaintBrush,FaEraser } from "react-icons/fa";
import './ToolsBar.css'

const ToolsBar=(props)=>{

     const {changeActiveTool,changeActiveColor,changeBrushSize}=props;
     const [activeToolState,changeActiveToolState]=useState("brush");

    const changeToBrush=()=>{
        changeActiveTool("brush");
        changeActiveToolState("brush");
     }
    
    const changeToEraser=()=>{
        changeActiveTool("eraser");
        changeActiveToolState("eraser");
    }

     return(
        <div className="ToolsBarContainer">
            <h1>Options</h1>
            <div className={activeToolState==="brush"?"ToolsBarButtonBox active":"ToolsBarButtonBox"}>
            
                <FaPaintBrush size={24} />
                <button className={activeToolState==="brush"?"toolButton  active":"toolButton "} onClick={changeToBrush}>Brush</button>
            </div>
            <div className={activeToolState==="eraser"?"ToolsBarButtonBox active":"ToolsBarButtonBox"}>
            
                <FaEraser size={24} />
                <button className={activeToolState==="eraser"?"toolButton  active":"toolButton "} onClick={changeToEraser}>Eraser</button>
            </div>
            <input type="color" disabled={activeToolState !== "brush"} className="colorSelector" onChange={(e)=>{changeActiveColor(e.target.value)}}/> {/* disabled color picker when eraser is on */}
            <input type="range"  min="1" max="50" className="brushWidthSelector"  onChange={(e)=>{changeBrushSize(e.target.value)}} />
            
            <div className="BottomButtonsBox">
            <button className="ClearButton" onClick={()=>{ /* added Clear the canvas */
                const canvas =document.querySelector("canvas");
                const context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
            }}>
                Clear
            </button>
            </div>

        </div>
    )
   
}

export default ToolsBar;