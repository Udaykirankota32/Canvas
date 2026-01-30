import { FaPaintBrush,FaEraser } from "react-icons/fa";
import './ToolsBar.css'

const ToolsBar=(props)=>{
    const {activeTool,changeActiveTool,changeActiveColor,changeBrushSize}=props;

     return(
        <div className="ToolsBarContainer">
            <h1>Options</h1>
            <div className={activeTool==="brush"?"ToolsBarBox active":"ToolsBarBox"}>
                
                <FaPaintBrush size={24} />
                <button className={activeTool==="brush"?"toolButton active":"toolButton"} onClick={()=>{changeActiveTool("brush")}}>Brush</button>
            </div>
            <div className={activeTool==="eraser"?"ToolsBarBox active":"ToolsBarBox"}>
            
                <FaEraser size={24} />
                <button className={activeTool==="eraser"?"toolButton active":"toolButton"} onClick={()=>{changeActiveTool("eraser")}}>Eraser</button>
            </div>
            <input type="color" className="colorSelector" onChange={(e)=>{changeActiveColor(e.target.value)}}/> 
            <input type="range" min="1" max="50" className="brushWidthSelector"  onChange={(e)=>{changeBrushSize(e.target.value)}} />

        </div>
    )
   
}

export default ToolsBar;