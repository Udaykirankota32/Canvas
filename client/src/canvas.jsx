import { useRef, useEffect } from "react";
import socket from './websocket'
import './canvas.css'

const Canvas = (props) => {
  const {activeTool, activeColor, brushSize}=props;
  const canvasRef = useRef(null);
  const isDrawing=useRef(false);
  const lastpos=useRef({x:0,y:0});
  
  

  useEffect(() => {
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    context.lineCap = "round";
    context.lineJoin = "round";


  
  const handleCanvasData=(data)=>{
    context.beginPath();  // start a new path for each received segment
    context.lineWidth=data.brushSize; 
     if(data.Tool==="eraser"){
        context.globalCompositeOperation = "destination-out";
    }else{
        context.globalCompositeOperation = "source-over";
        context.strokeStyle=data.color;
    }  
    context.moveTo(data.fromx,data.fromy);
    context.lineTo(data.toX,data.toY);
    context.stroke();
    context.closePath();     
  }
    


  socket.on("canvas-data",handleCanvasData);
  
  

   

    const beginDrawing=(e)=>{
      isDrawing.current=true;
      context.beginPath()
      context.moveTo(e.offsetX,e.offsetY);
      lastpos.current={x:e.offsetX,y:e.offsetY};
      
      context.lineWidth=brushSize.current;

      if(activeTool.current==="eraser"){
         context.globalCompositeOperation = "destination-out";
         
      }else{
        context.globalCompositeOperation = "source-over";
        context.strokeStyle=activeColor.current;
      }
      
    }

    const draw=(e)=>{
      if(!isDrawing.current) return ;

      const fromx = lastpos.current.x;
      const fromy = lastpos.current.y;
      const toX = e.offsetX;
      const toY = e.offsetY;

      lastpos.current={x:toX,y:toY};

      const userCanvasData={
        Tool : activeTool.current,
        color : activeColor.current,
        brushSize : brushSize.current,  
        fromx,
        fromy,
        toX,
        toY
      }

      context.lineTo(e.offsetX,e.offsetY);

      context.stroke()
      socket.emit("canvas-data",userCanvasData);


    }

    const stopDrawing=()=>{
      isDrawing.current=false;
      context.closePath();

    }

    canvas.addEventListener("mousedown",beginDrawing)
    canvas.addEventListener("mousemove",draw)
    canvas.addEventListener("mouseup",stopDrawing)
    canvas.addEventListener("mouseout",stopDrawing)


    return ()=> {
      socket.off("canvas-data",handleCanvasData)
      canvas.removeEventListener("mousedown",beginDrawing),
      canvas.removeEventListener("mousemove",draw),
      canvas.removeEventListener("mouseup",stopDrawing),
      canvas.removeEventListener("mouseout",stopDrawing)
    }
  },); // removed dependencies to ensure latest refs are used

  return (
    <canvas 
      ref={canvasRef}
      className="canvas"
      
    />
  );
};

export default Canvas;
