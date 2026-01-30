import { useRef, useEffect } from "react";
import './canvas.css'

const Canvas = (props) => {
  const {activeTool, activeColor, brushSize}=props;
  const canvasRef = useRef(null);
  const isDrawing=useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
  canvas.height = rect.height;
    context.lineCap = "round";
  context.lineJoin = "round";
   

    const beginDrawing=(e)=>{
      isDrawing.current=true;
      context.beginPath()
      context.moveTo(e.offsetX,e.offsetY);
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

      context.lineTo(e.offsetX,e.offsetY);
      context.stroke()
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
      canvas.removeEventListener("mousedown",beginDrawing),
      canvas.removeEventListener("mousemove",draw),
      canvas.removeEventListener("mouseup",stopDrawing),
      canvas.removeEventListener("mouseout",stopDrawing)
    }
  }, [activeColor, brushSize, activeTool]);

  return (
    <canvas 
      ref={canvasRef}
      className="canvas"
      
    />
  );
};

export default Canvas;
