import {useRef,useEffect} from "react";
import socket from './websocket.jsx'
import Canvas from "./canvas.jsx";
import ToolsBar from "./ToolsBar.jsx"
import './App.css'

const App=()=>{

  useEffect(()=>{
      socket.on("connect",()=>{
        console.log("conected to server ",socket.id);

      })
      return ()=>{
        socket.disconnect();
        
      }
  },[])






const activeTool =useRef("brush");
const activeColor =useRef("#000000");
const brushSize =useRef(5);

const changeActiveTool=(tool)=>{
  activeTool.current=tool;
}

const changeActiveColor=(color)=>{ //applied to only access the color when brush is active
    if(activeTool.current==="brush"){
      activeColor.current=color;
    }
}

const changeBrushSize=(size)=>{
  brushSize.current=size;
} 
  
  
  return(
   <div className="Canvas-Editor-Container">
      <div className="Canvas-Editor-BoxContainer">
          <ToolsBar activeTool={activeTool} changeActiveTool={changeActiveTool} changeActiveColor={changeActiveColor} changeBrushSize={changeBrushSize} />
          <div className="Canvas-Container">
              <Canvas activeTool={activeTool} activeColor={activeColor} brushSize={brushSize} />
          </div>
      </div>
  </div>
  )

}

export default App;